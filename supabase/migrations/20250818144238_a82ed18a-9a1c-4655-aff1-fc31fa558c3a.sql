-- Create platform settings table to store configuration
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage platform settings
CREATE POLICY "Admins can manage platform settings" 
ON public.platform_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.platform_settings (key, value, category) VALUES
  ('platform_name', '"EduPlatform"', 'general'),
  ('platform_url', '"https://eduplatform.com"', 'general'),
  ('support_email', '"support@eduplatform.com"', 'general'),
  ('default_language', '"en"', 'general'),
  ('platform_description', '"A comprehensive learning management platform"', 'general'),
  ('require_email_verification', 'true', 'security'),
  ('two_factor_auth', 'false', 'security'),
  ('password_requirements', 'true', 'security'),
  ('session_timeout', '60', 'security'),
  ('max_login_attempts', '5', 'security'),
  ('email_notifications', 'true', 'notifications'),
  ('course_completion_alerts', 'true', 'notifications'),
  ('payment_notifications', 'true', 'notifications'),
  ('system_maintenance_alerts', 'false', 'notifications'),
  ('admin_email', '"admin@eduplatform.com"', 'notifications'),
  ('paystack_enabled', 'false', 'payment'),
  ('flutterwave_enabled', 'false', 'payment'),
  ('default_currency', '"NGN"', 'payment'),
  ('platform_fee', '10', 'payment'),
  ('course_auto_approval', 'false', 'courses'),
  ('enable_course_reviews', 'true', 'courses'),
  ('certificate_generation', 'true', 'courses'),
  ('max_enrollment', '1000', 'courses'),
  ('certificate_validity', '5', 'courses'),
  ('primary_color', '"#ef4444"', 'appearance'),
  ('secondary_color', '"#64748b"', 'appearance'),
  ('dark_mode_support', 'true', 'appearance'),
  ('logo_url', '""', 'appearance'),
  ('favicon_url', '""', 'appearance');