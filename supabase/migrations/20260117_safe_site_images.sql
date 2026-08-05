-- Safe migration that handles existing objects
-- This version uses IF NOT EXISTS and DROP IF EXISTS to avoid conflicts

-- Drop existing indexes if they exist (they'll be recreated)
DROP INDEX IF EXISTS public.idx_site_images_category;
DROP INDEX IF EXISTS public.idx_site_images_key;
DROP INDEX IF EXISTS public.idx_site_images_active;

-- Create site_images table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('hero', 'team', 'logo', 'values', 'other')),
  url text NOT NULL,
  alt_text text,
  description text,
  width integer,
  height integer,
  file_size integer,
  mime_type text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Recreate indexes
CREATE INDEX idx_site_images_category ON public.site_images(category);
CREATE INDEX idx_site_images_key ON public.site_images(key);
CREATE INDEX idx_site_images_active ON public.site_images(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active site images" ON public.site_images;
DROP POLICY IF EXISTS "Admins can manage site images" ON public.site_images;

-- Recreate policies
CREATE POLICY "Public can view active site images"
ON public.site_images
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage site images"
ON public.site_images
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create or replace trigger function (safe to run multiple times)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_site_images_updated_at ON public.site_images;
CREATE TRIGGER update_site_images_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing images (using ON CONFLICT to avoid duplicates)
INSERT INTO public.site_images (key, category, url, alt_text, description, display_order) VALUES
  -- Hero slides
  ('hero_slide_1', 'hero', '/img/hero-slide-1.jpg', 'Transform Your Oil & Gas Career', 'Hero slide showing professional training environment', 1),
  ('hero_slide_2', 'hero', '/img/hero-slide-2.jpg', 'Next-Generation Professional Training', 'Hero slide highlighting modern training facilities', 2),
  ('hero_slide_3', 'hero', '/img/hero-slide-3.jpg', 'Excellence in Corporate Learning', 'Hero slide showcasing corporate training solutions', 3),
  
  -- Team members
  ('team_daere_akobo', 'team', '/team/daere-akobo.png', 'Daere Akobo', 'Profile photo of Daere Akobo', 1),
  ('team_iyenemi_akobo', 'team', '/team/iyenemi-akobo.png', 'Iyenemi Akobo', 'Profile photo of Iyenemi Akobo', 2),
  ('team_callista_azogu', 'team', '/team/callista-azogu.png', 'Callista Azogu', 'Profile photo of Callista Azogu', 3),
  ('team_kennedy_dike', 'team', '/team/kennedy-dike.jpg', 'Kennedy Dike', 'Profile photo of Kennedy Dike', 4),
  ('team_ifeyinwa_eucharia', 'team', '/team/Ifeyinwa-Eucharia.jpg', 'Ifeyinwa Eucharia', 'Profile photo of Ifeyinwa Eucharia', 5),
  
  -- Main logos
  ('logo_main', 'logo', '/logo.png', 'PANA Institute Logo', 'Main company logo', 1),
  ('logo_pana_why', 'logo', '/panawhy.png', 'PANA Institute Why', 'PANA Institute why logo', 2),
  
  -- Partner/Client logos
  ('logo_shell', 'logo', '/shell.png', 'Shell', 'Shell company logo', 10),
  ('logo_total', 'logo', '/total.png', 'Total', 'Total company logo', 11),
  ('logo_chevron', 'logo', '/chevron.png', 'Chevron', 'Chevron company logo', 12),
  ('logo_nnpc', 'logo', '/nnpc.png', 'NNPC', 'NNPC company logo', 13),
  ('logo_access_bank', 'logo', '/access-bank.png', 'Access Bank', 'Access Bank logo', 14),
  ('logo_mtn', 'logo', '/mtn.png', 'MTN', 'MTN company logo', 15),
  
  -- Values images
  ('values_sands', 'values', '/values/sands.PNG', 'SANDS Values', 'PANA Institute SANDS values image', 1),
  ('values_maxims', 'values', '/values/maxims.jpg', 'Company Maxims', 'PANA Institute maxims image', 2),
  ('values_log', 'values', '/values/log.jpg', 'Values Background', 'Values section background image', 3),
  
  -- Header/Banner images
  ('header_team', 'other', '/img/team-header.jpg', 'Team Header', 'Team page header image', 1),
  ('header_consultancy', 'other', '/img/consultancy.jpg', 'Consultancy Services', 'Consultancy services header image', 2),
  ('header_rnd', 'other', '/img/rnd.jpg', 'R&D Services', 'Research and development services header', 3),
  ('header_about', 'other', '/img/about-header.jpg', 'About Us Header', 'About page header image', 4)
ON CONFLICT (key) DO NOTHING;  -- Skip if already exists

-- Create storage bucket for site images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public can view site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' AND
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-images' AND
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-images' AND
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
