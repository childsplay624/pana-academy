-- Add page_type to distinguish static vs dynamic pages
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'dynamic' CHECK (page_type IN ('static', 'dynamic'));

-- Create a key-value content store per page
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_slug, content_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view page content" ON public.page_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage page content" ON public.page_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed all existing static pages into the pages registry
INSERT INTO public.pages (title, slug, status, page_type, show_in_navbar, show_in_footer)
VALUES
  ('Home',               'home',                 'published', 'static', false, false),
  ('About Us',           'about',                'published', 'static', true,  true),
  ('Our Team',           'team',                 'published', 'static', true,  false),
  ('Our Journey',        'our-journey',          'published', 'static', true,  false),
  ('Testimonials',       'testimonials',         'published', 'static', false, true),
  ('Consulting Services','consulting-services',  'published', 'static', true,  false),
  ('Research & Development','research-development','published','static', true,  false),
  ('Training Delivery',  'training-delivery',    'published', 'static', true,  false),
  ('Training Calendar',  'training-calendar',    'published', 'static', false, true),
  ('Courses',            'courses',              'published', 'static', true,  false),
  ('Careers',            'careers',              'published', 'static', false, true),
  ('Contact Us',         'contact',              'published', 'static', true,  false),
  ('Verify Certificate', 'verify-certificate',   'published', 'static', false, true)
ON CONFLICT (slug) DO NOTHING;
