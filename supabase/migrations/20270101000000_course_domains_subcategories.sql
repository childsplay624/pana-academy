-- Migration: Add course domains, subcategories (course areas), and course codes
-- Aligns schema with the PANA Institute 2027 Academic Catalog (10 Domains, 40+ Sub-categories, 174 Courses)

-- 1. Add domain attributes to course_categories
ALTER TABLE public.course_categories
ADD COLUMN IF NOT EXISTS domain_no INTEGER,
ADD COLUMN IF NOT EXISTS code_prefix TEXT,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE;

-- 2. Create dedicated course_subcategories table (Course Areas)
CREATE TABLE IF NOT EXISTS public.course_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.course_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_category_subcategory_slug UNIQUE (category_id, slug)
);

-- Enable RLS for course_subcategories
ALTER TABLE public.course_subcategories ENABLE ROW LEVEL SECURITY;

-- Public can view course subcategories
CREATE POLICY "Public can view course subcategories" ON public.course_subcategories
  FOR SELECT USING (true);

-- Admins can manage course subcategories
CREATE POLICY "Admins can manage course subcategories" ON public.course_subcategories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for subcategories updated_at
DROP TRIGGER IF EXISTS update_course_subcategories_updated_at ON public.course_subcategories;
CREATE TRIGGER update_course_subcategories_updated_at
  BEFORE UPDATE ON public.course_subcategories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Add catalog code, domain_no, subcategory_id and course_area to courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS domain_no INTEGER,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.course_subcategories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS course_area TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_domain_no ON public.courses(domain_no);
CREATE INDEX IF NOT EXISTS idx_courses_subcategory_id ON public.courses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_course_subcategories_category_id ON public.course_subcategories(category_id);
