-- Create a new function for direct certificate generation
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
  _instructor_name TEXT;
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
      -- Get course and instructor data
      SELECT 
        c.title as course_title, 
        c.duration_hours as course_duration_hours,
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
        _cert_number := public.generate_certificate_number();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE certificate_number = _cert_number);
      END LOOP;

      LOOP
        _verification_code := encode(gen_random_bytes(8), 'hex');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = _verification_code);
      END LOOP;

      -- Insert the new certificate with all required fields
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
        verification_code
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
        _verification_code
      )
      RETURNING 
        to_jsonb(certificates.*) INTO _result;
    ELSE
      -- Certificate already exists, return the existing one
      SELECT to_jsonb(c) INTO _result
      FROM public.certificates c
      WHERE id = _certificate_id;
    END IF;

    -- Update the enrollment to mark as completed if not already
    UPDATE public.enrollments
    SET 
      completed_at = COALESCE(completed_at, _completion_date),
      status = 'completed',
      updated_at = now()
    WHERE id = _enrollment_id
    RETURNING id IS NOT NULL INTO _result;

    RETURN jsonb_build_object(
      'success', true,
      'certificate_id', _result->>'id',
      'certificate_number', _result->>'certificate_number',
      'verification_code', _result->>'verification_code',
      'issued_date', _result->>'issued_date',
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
