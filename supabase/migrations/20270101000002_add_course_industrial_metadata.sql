-- Migration: Add Industrial & Enterprise Metadata to Courses
-- Supports PANA Institute 2027 Technical Course Catalog (Standards, OEM Partners, Target Audience, Awards)

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS standards TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS oem_partners TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS award TEXT DEFAULT 'Certificate of Attendance',
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS practical_work TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS class_size TEXT,
ADD COLUMN IF NOT EXISTS delivery_options TEXT;

COMMENT ON COLUMN public.courses.standards IS 'Industry and regulatory compliance standards aligned with the course (e.g., ISO 18436-2, API 670)';
COMMENT ON COLUMN public.courses.oem_partners IS 'OEM technology references and equipment partners (e.g., Baker Hughes, Siemens, ITT Goulds Pumps)';
COMMENT ON COLUMN public.courses.award IS 'Certification or award type (e.g., Exam prep, Certificate of Attendance, Professional Diploma)';
COMMENT ON COLUMN public.courses.target_audience IS 'List of target engineering and operational sectors/roles';
COMMENT ON COLUMN public.courses.practical_work IS 'Hands-on laboratory, case studies, or diagnostic exercises';
COMMENT ON COLUMN public.courses.class_size IS 'Recommended cohort class size (e.g., Up to 16 participants)';
COMMENT ON COLUMN public.courses.delivery_options IS 'Delivery formats (e.g., Public session, in-house at client site, online)';
