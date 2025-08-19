-- Create certificates table for detailed certificate management
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  enrollment_id UUID NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  grade TEXT,
  score INTEGER,
  instructor_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_duration_hours INTEGER,
  certificate_url TEXT,
  verification_code TEXT NOT NULL UNIQUE,
  metadata JSONB DEFAULT '{}',
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all certificates" 
ON public.certificates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Instructors can view certificates for their courses" 
ON public.certificates 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.courses c 
  WHERE c.id = certificates.course_id AND c.instructor_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX idx_certificates_verification_code ON public.certificates(verification_code);
CREATE INDEX idx_certificates_certificate_number ON public.certificates(certificate_number);

-- Create function to generate certificate number
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || EXTRACT(YEAR FROM now()) || '-' || 
         LPAD(EXTRACT(DOY FROM now())::TEXT, 3, '0') || '-' || 
         LPAD((RANDOM() * 999999)::INTEGER::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8) || '-' ||
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 4) || '-' ||
    SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 4)
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to award certificate when course is completed
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
  _instructor_profile RECORD;
  _certificate_id UUID;
  _cert_number TEXT;
  _verification_code TEXT;
BEGIN
  -- Get course and instructor data
  SELECT c.title, c.duration_hours, p.full_name as instructor_name
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

  -- Create certificate
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
    verification_code
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
    _verification_code
  ) RETURNING id INTO _certificate_id;

  -- Update enrollment with certificate info
  UPDATE public.enrollments 
  SET 
    status = 'completed',
    completed_at = _completion_date,
    progress_percentage = 100
  WHERE id = _enrollment_id;

  -- Award points for completion
  PERFORM public.award_points(
    _user_id, 
    100, 
    'course_completion', 
    'Completed course: ' || _course_data.title,
    _course_id
  );

  RETURN _certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;