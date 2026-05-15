-- Create analytics settings table
CREATE TABLE public.analytics_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_enabled boolean DEFAULT false,
  ga_measurement_id text,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

-- Public can view analytics settings
CREATE POLICY "Public can view analytics settings" 
ON public.analytics_settings 
FOR SELECT 
USING (true);

-- Admins can update analytics settings
CREATE POLICY "Admins can update analytics settings" 
ON public.analytics_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert default single row
INSERT INTO public.analytics_settings (analytics_enabled, ga_measurement_id) 
VALUES (false, '');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_analytics_settings_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analytics_settings_updated_at
  BEFORE UPDATE ON public.analytics_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_analytics_settings_update();
