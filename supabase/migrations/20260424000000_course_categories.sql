-- Create course categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

-- Public can view categories
CREATE POLICY "Public can view course categories" ON public.course_categories
  FOR SELECT USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage course categories" ON public.course_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for updated_at
CREATE TRIGGER update_course_categories_updated_at
  BEFORE UPDATE ON public.course_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial categories
INSERT INTO public.course_categories (name, slug, description, icon)
VALUES
  ('Soft Skills', 'soft-skills', 'Essential non-technical skills for professional success.', 'MessageSquare'),
  ('Safety', 'safety', 'Workplace safety and compliance training.', 'ShieldCheck'),
  ('Sustainability', 'sustainability', 'Environmental and sustainable business practices.', 'Leaf'),
  ('General Technical', 'general-technical', 'Broad technical training across sectors.', 'Settings'),
  ('Flow Drives', 'flow-drives', 'Training on fluid dynamics and drive systems.', 'Zap'),
  ('Flow Control', 'flow-control', 'Managing and controlling fluid systems.', 'Sliders'),
  ('Flow Measurement', 'flow-measurement', 'Precision measurement of fluid flow.', 'Activity'),
  ('Instrumentation & Automation', 'instrumentation-automation', 'Advanced industrial automation systems.', 'Cpu')
ON CONFLICT (slug) DO NOTHING;

-- Add category_id to courses table if it doesn't exist
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.course_categories(id);

-- Make the old category column nullable for transition
ALTER TABLE public.courses
ALTER COLUMN category DROP NOT NULL;
