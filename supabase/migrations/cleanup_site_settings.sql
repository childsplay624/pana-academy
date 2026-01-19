-- Clean up redundant site_settings table and policies
-- Run this if you accidentally created the site_settings table
-- File: cleanup_site_settings.sql

DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can modify site settings" ON public.site_settings;
DROP TABLE IF EXISTS public.site_settings;
