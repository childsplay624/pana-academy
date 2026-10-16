-- Migration: Disable duplicate legacy sections on About page
-- Disables legacy page builder sections for Why Choose, Vision/Mission, and Learning Journey CTA

UPDATE public.page_sections
SET is_active = false
WHERE (
  (section_type = 'features' AND (content->>'title' ILIKE '%Why Choose%' OR content::text ILIKE '%Expert Faculty%'))
  OR (section_type = 'content' AND (content::text ILIKE '%Competency Hub for the Oil and Gas Industry%' OR (content::text ILIKE '%Our Vision%' AND content::text ILIKE '%Our Mission%')))
  OR (section_type = 'cta' AND (content->>'title' ILIKE '%Ready to Start%' OR content::text ILIKE '%advancing their careers with%'))
);
