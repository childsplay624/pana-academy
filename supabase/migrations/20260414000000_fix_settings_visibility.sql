-- Fix RLS policies for platform_settings to ensure public settings are visible to all users
-- and admin settings are correctly managed by admins.

-- Drop existing restricted policy if it exists
DROP POLICY IF EXISTS "Anyone can view tax settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can manage tax settings" ON public.platform_settings;

-- Create a more comprehensive public view policy
-- This includes all settings that the frontend needs for public pages
CREATE POLICY "Public can view non-sensitive settings" ON public.platform_settings
FOR SELECT USING (
  key IN (
    'tax_enabled', 
    'tax_rate', 
    'tax_type', 
    'tax_name', 
    'tax_number',
    'hide_course_prices',
    'maintenance_mode',
    'platform_name',
    'logo_url',
    'favicon_url',
    'primary_color',
    'secondary_color',
    'support_email'
  )
);

-- Ensure admins can manage EVERYTHING
CREATE POLICY "Admins can manage all settings" ON public.platform_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
