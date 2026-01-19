-- Migration: Add On-Site Course Support
-- This migration extends the courses table to support on-site and hybrid courses

-- 1. Drop the old constraints first (both variations)
ALTER TABLE public.courses
DROP CONSTRAINT IF EXISTS courses_course_type_check;

ALTER TABLE public.courses
DROP CONSTRAINT IF EXISTS course_type_check;

-- 2. Update existing courses BEFORE adding new constraint
UPDATE public.courses
SET course_type = 'online'
WHERE course_type = 'self_paced';

UPDATE public.courses
SET course_type = 'online'
WHERE course_type = 'live';

-- 3. NOW add the new constraint (after data is updated)
ALTER TABLE public.courses
ADD CONSTRAINT courses_course_type_check 
CHECK (course_type IN ('online', 'onsite', 'hybrid'));

-- 4. Add end_date for multi-day courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- 3. Add venue information fields
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS venue_address TEXT,
ADD COLUMN IF NOT EXISTS venue_city TEXT,
ADD COLUMN IF NOT EXISTS venue_country TEXT,
ADD COLUMN IF NOT EXISTS venue_capacity INTEGER CHECK (venue_capacity > 0),
ADD COLUMN IF NOT EXISTS venue_map_url TEXT;

-- 4. Add session scheduling (JSONB for flexibility)
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS onsite_schedule JSONB DEFAULT '[]'::jsonb;

-- 5. Add logistics and materials information
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS requires_materials BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS materials_list TEXT[],
ADD COLUMN IF NOT EXISTS parking_info TEXT,
ADD COLUMN IF NOT EXISTS accommodation_info TEXT;

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_course_type_v2 ON public.courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_venue_city ON public.courses(venue_city) WHERE venue_city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_start_end_dates ON public.courses(start_date, end_date) WHERE start_date IS NOT NULL;

-- 8. Add comments for documentation
COMMENT ON COLUMN public.courses.course_type IS 'Type of course delivery: online (self-paced or live), onsite (physical venue), or hybrid (combination)';
COMMENT ON COLUMN public.courses.start_date IS 'Start date/time of the course. For online: enrollment opens. For onsite: event starts. Required for onsite/hybrid.';
COMMENT ON COLUMN public.courses.end_date IS 'End date/time of the course. For multi-day onsite courses or courses with fixed duration.';
COMMENT ON COLUMN public.courses.venue_name IS 'Name of the physical venue for onsite courses';
COMMENT ON COLUMN public.courses.venue_address IS 'Full street address of the venue';
COMMENT ON COLUMN public.courses.venue_city IS 'City where the course is held';
COMMENT ON COLUMN public.courses.venue_country IS 'Country where the course is held';
COMMENT ON COLUMN public.courses.venue_capacity IS 'Maximum number of students for onsite courses. Enrollment is capped at this number.';
COMMENT ON COLUMN public.courses.venue_map_url IS 'Google Maps URL or similar for venue location';
COMMENT ON COLUMN public.courses.onsite_schedule IS 'JSON array of session objects with date, start_time, end_time, and session_title for multi-day courses';
COMMENT ON COLUMN public.courses.requires_materials IS 'Whether students need to bring materials to the onsite course';
COMMENT ON COLUMN public.courses.materials_list IS 'Array of materials students should bring (e.g., laptop, notebook)';
COMMENT ON COLUMN public.courses.parking_info IS 'Parking information and directions for onsite venues';
COMMENT ON COLUMN public.courses.accommodation_info IS 'Nearby accommodation suggestions for multi-day courses';

-- 9. Create a helper function to validate onsite course data
CREATE OR REPLACE FUNCTION validate_onsite_course()
RETURNS TRIGGER AS $$
BEGIN
  -- If course is onsite or hybrid, venue information is required
  IF NEW.course_type IN ('onsite', 'hybrid') THEN
    IF NEW.venue_name IS NULL OR NEW.venue_address IS NULL OR 
       NEW.venue_city IS NULL OR NEW.venue_country IS NULL THEN
      RAISE EXCEPTION 'Onsite and hybrid courses require venue information (name, address, city, country)';
    END IF;
    
    IF NEW.start_date IS NULL THEN
      RAISE EXCEPTION 'Onsite and hybrid courses require a start_date';
    END IF;
    
    IF NEW.venue_capacity IS NULL THEN
      RAISE WARNING 'Onsite course % has no capacity limit set', NEW.title;
    END IF;
  END IF;
  
  -- If end_date is set, ensure it's after start_date
  IF NEW.end_date IS NOT NULL AND NEW.start_date IS NOT NULL THEN
    IF NEW.end_date <= NEW.start_date THEN
      RAISE EXCEPTION 'end_date must be after start_date';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger to validate onsite courses before insert/update
DROP TRIGGER IF EXISTS trigger_validate_onsite_course ON public.courses;
CREATE TRIGGER trigger_validate_onsite_course
  BEFORE INSERT OR UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION validate_onsite_course();

-- 11. Add RLS policy updates (if needed)
-- Allow students to see onsite course venue information
DROP POLICY IF EXISTS "Students can view course details" ON public.courses;
CREATE POLICY "Students can view course details"
  ON public.courses
  FOR SELECT
  USING (
    status = 'published' OR 
    instructor_id = auth.uid() OR
    auth.uid() IN (
      SELECT student_id FROM enrollments WHERE course_id = courses.id
    )
  );
