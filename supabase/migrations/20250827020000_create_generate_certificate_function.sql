-- Create or replace the generate_certificate function
CREATE OR REPLACE FUNCTION public.generate_certificate(
  _user_id UUID,
  _course_id UUID,
  _enrollment_id UUID,
  _title TEXT,
  _course_title TEXT,
  _instructor_name TEXT,
  _course_duration_hours INTEGER,
  _completion_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  _score INTEGER DEFAULT 100,
  _grade TEXT DEFAULT 'A'
)
RETURNS JSONB AS $$
DECLARE
  _certificate_id UUID;
  _result JSONB;
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
    -- Generate unique certificate number and verification code
    LOOP
      _cert_number := 'CERT-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE certificate_number = _cert_number);
    END LOOP;

    LOOP
      _verification_code := encode(gen_random_bytes(8), 'hex');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE verification_code = _verification_code);
    END LOOP;

    -- Insert the new certificate
    INSERT INTO public.certificates (
      user_id,
      course_id,
      enrollment_id,
      certificate_number,
      title,
      course_title,
      instructor_name,
      course_duration_hours,
      completion_date,
      score,
      grade,
      verification_code,
      issued_at,
      is_valid,
      created_at,
      updated_at
    ) VALUES (
      _user_id,
      _course_id,
      _enrollment_id,
      _cert_number,
      _title,
      _course_title,
      _instructor_name,
      _course_duration_hours,
      _completion_date,
      _score,
      _grade,
      _verification_code,
      now(),
      true,
      now(),
      now()
    )
    RETURNING to_jsonb(certificates.*) INTO _result;

    -- Update the enrollment to mark as completed
    UPDATE public.enrollments
    SET 
      status = 'completed',
      completed_at = _completion_date,
      updated_at = now()
    WHERE id = _enrollment_id;

    RETURN jsonb_build_object(
      'success', true,
      'message', 'Certificate generated successfully',
      'data', _result
    );
  ELSE
    -- Certificate already exists, return it
    SELECT to_jsonb(c) INTO _result
    FROM public.certificates c
    WHERE id = _certificate_id;

    RETURN jsonb_build_object(
      'success', true,
      'message', 'Certificate already exists',
      'data', _result
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_code', SQLSTATE,
    'context', 'Error in generate_certificate function'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.generate_certificate(
  UUID, UUID, UUID, TEXT, TEXT, TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, INTEGER, TEXT
) TO authenticated;
