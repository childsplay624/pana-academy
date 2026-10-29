-- Migration: Disable "Our Offices" features section
-- This migration updates any existing page builder section with title 'Our Offices' to inactive

UPDATE public.page_sections
SET is_active = false
WHERE section_type = 'features'
  AND (
    content->>'title' ILIKE '%Our Offices%'
    OR content::text ILIKE '%Emekuku%'
    OR content::text ILIKE '%D-Line Office%'
  );
