-- Add maintenance_mode to platform_settings if it doesn't exist
INSERT INTO public.platform_settings (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Also add a custom message for maintenance
INSERT INTO public.platform_settings (key, value)
VALUES ('maintenance_message', '"The site is currently undergoing scheduled maintenance. Please check back later."')
ON CONFLICT (key) DO NOTHING;
