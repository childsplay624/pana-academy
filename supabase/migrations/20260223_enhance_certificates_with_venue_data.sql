-- Migration: Enhance Certificates with Venue and Date Data
-- This migration adds fields to the certificates table to better support onsite and hybrid courses

-- 1. Add new columns to public.certificates
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS venue_address TEXT,
ADD COLUMN IF NOT EXISTS venue_city TEXT,
ADD COLUMN IF NOT EXISTS venue_country TEXT,
ADD COLUMN IF NOT EXISTS venue_map_url TEXT,
ADD COLUMN IF NOT EXISTS course_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS course_end_date TIMESTAMPTZ;

-- 2. Add comments for documentation
COMMENT ON COLUMN public.certificates.venue_name IS 'Name of the physical venue where the course was held';
COMMENT ON COLUMN public.certificates.venue_address IS 'Full street address of the venue';
COMMENT ON COLUMN public.certificates.venue_city IS 'City where the course was held';
COMMENT ON COLUMN public.certificates.venue_country IS 'Country where the course was held';
COMMENT ON COLUMN public.certificates.venue_map_url IS 'External link to the venue location';
COMMENT ON COLUMN public.certificates.course_start_date IS 'Actual start date of the course session';
COMMENT ON COLUMN public.certificates.course_end_date IS 'Actual end date of the course session';

-- 3. Update the generate_certificate function to populate these fields
CREATE OR REPLACE FUNCTION public.generate_certificate(
  _user_id UUID,
  _course_id UUID,
  _enrollment_id UUID,
  _completion_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  _score INTEGER DEFAULT NULL,
  _grade TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  _certificate_id UUID;
  _result JSONB;
  _course_data RECORD;
  _cert_number TEXT;
  _verification_code TEXT;
BEGIN
  -- First, check if certificate already exists
  SELECT id INTO _certificate_id 
  FROM public.certificates 
  WHERE user_id = _user_id 
    AND course_id = _course_id
    AND enrollment_id = _enrollment_id
  LIMIT 1;

  IF _certificate_id IS NULL THEN
    -- Get course and instructor data, including venue info
    SELECT 
      c.title as course_title, 
      c.duration_hours as course_duration_hours,
      c.start_date as course_start_date,
      c.end_date as course_end_date,
      c.venue_name,
      c.venue_address,
      c.venue_city,
      c.venue_country,
      c.venue_map_url,
      p.full_name as instructor_name
    INTO _course_data
    FROM public.courses c
    LEFT JOIN public.profiles p ON p.id = c.instructor_id
    WHERE c.id = _course_id;

    IF NOT FOUND THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Course not found',
        'error_code', 'COURSE_NOT_FOUND'
      );
    END IF;

    -- Generate unique certificate number and verification code
    LOOP
      _cert_number := 'CERT-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE certificate_number = _cert_number);
    END LOOP;

    LOOP
      _verification_code := encode(gen_random_bytes(8), 'hex');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = _verification_code);
    END LOOP;

    -- Insert the new certificate with all fields including venue data
    INSERT INTO public.certificates (
      user_id,
      course_id,
      enrollment_id,
      certificate_number,
      title,
      issued_date,
      completion_date,
      grade,
      score,
      instructor_name,
      course_title,
      course_duration_hours,
      verification_code,
      venue_name,
      venue_address,
      venue_city,
      venue_country,
      venue_map_url,
      course_start_date,
      course_end_date
    ) VALUES (
      _user_id,
      _course_id,
      _enrollment_id,
      _cert_number,
      'Certificate of Completion',
      now(),
      _completion_date,
      _grade,
      _score,
      _course_data.instructor_name,
      _course_data.course_title,
      _course_data.course_duration_hours,
      _verification_code,
      _course_data.venue_name,
      _course_data.venue_address,
      _course_data.venue_city,
      _course_data.venue_country,
      _course_data.venue_map_url,
      _course_data.course_start_date,
      _course_data.course_end_date
    )
    RETURNING id INTO _certificate_id;
  END IF;

  -- Update the enrollment to mark as completed if not already
  UPDATE public.enrollments
  SET 
    completed_at = COALESCE(completed_at, _completion_date),
    status = 'completed',
    progress_percentage = 100,
    updated_at = now()
  WHERE id = _enrollment_id;

  -- Fetch the final certificate data to return
  SELECT to_jsonb(c) INTO _result
  FROM public.certificates c
  WHERE id = _certificate_id;

  RETURN jsonb_build_object(
    'success', true,
    'certificate_id', _certificate_id,
    'data', _result
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE,
    'context', 'Error in generate_certificate function'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update the award_certificate function to populate these fields
CREATE OR REPLACE FUNCTION public.award_certificate(
  _user_id UUID,
  _course_id UUID,
  _enrollment_id UUID,
  _completion_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  _score INTEGER DEFAULT NULL,
  _grade TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  _course_data RECORD;
  _certificate_id UUID;
  _cert_number TEXT;
  _verification_code TEXT;
BEGIN
  -- Get course and instructor data, including venue info
  SELECT 
    c.title, 
    c.duration_hours, 
    c.start_date,
    c.end_date,
    c.venue_name,
    c.venue_address,
    c.venue_city,
    c.venue_country,
    c.venue_map_url,
    p.full_name as instructor_name
  INTO _course_data
  FROM public.courses c
  JOIN public.profiles p ON p.id = c.instructor_id
  WHERE c.id = _course_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Generate unique certificate number and verification code
  LOOP
    _cert_number := public.generate_certificate_number();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE certificate_number = _cert_number);
  END LOOP;

  LOOP
    _verification_code := public.generate_verification_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = _verification_code);
  END LOOP;

  -- Create certificate with venue data
  INSERT INTO public.certificates (
    user_id,
    course_id,
    enrollment_id,
    certificate_number,
    title,
    description,
    completion_date,
    grade,
    score,
    instructor_name,
    course_title,
    course_duration_hours,
    verification_code,
    venue_name,
    venue_address,
    venue_city,
    venue_country,
    venue_map_url,
    course_start_date,
    course_end_date
  ) VALUES (
    _user_id,
    _course_id,
    _enrollment_id,
    _cert_number,
    _course_data.title || ' Completion Certificate',
    'This certificate is awarded in recognition of successful completion of the course: ' || _course_data.title,
    _completion_date,
    _grade,
    _score,
    _course_data.instructor_name,
    _course_data.title,
    _course_data.duration_hours,
    _verification_code,
    _course_data.venue_name,
    _course_data.venue_address,
    _course_data.venue_city,
    _course_data.venue_country,
    _course_data.venue_map_url,
    _course_data.start_date,
    _course_data.end_date
  ) RETURNING id INTO _certificate_id;

  -- Update enrollment with certificate info
  UPDATE public.enrollments 
  SET 
    status = 'completed',
    completed_at = _completion_date,
    progress_percentage = 100
  WHERE id = _enrollment_id;

  -- Award points for completion (if function exists)
  -- PERFORM public.award_points(_user_id, 100, 'course_completion', 'Completed course: ' || _course_data.title, _course_id);

  RETURN _certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
