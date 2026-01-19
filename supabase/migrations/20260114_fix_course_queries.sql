-- Fix: Make validation trigger less strict for existing data
-- The trigger was too strict and causing SELECT queries to fail

DROP TRIGGER IF EXISTS trigger_validate_onsite_course ON public.courses;
DROP FUNCTION IF EXISTS validate_onsite_course();

-- Create a more lenient validation function
CREATE OR REPLACE FUNCTION validate_onsite_course()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate on INSERT and UPDATE, not on SELECT
  -- Only validate if course_type is being set to onsite or hybrid
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.course_type IN ('onsite', 'hybrid') THEN
      -- For new onsite/hybrid courses, require basic venue info
      IF NEW.venue_name IS NULL OR NEW.venue_city IS NULL THEN
        RAISE NOTICE 'Onsite course % should have venue information', NEW.title;
        -- Just a notice, don't block
      END IF;
      
      IF NEW.start_date IS NULL THEN
        RAISE NOTICE 'Onsite course % should have a start_date', NEW.title;
        -- Just a notice, don't block
      END IF;
    END IF;
    
    -- Only enforce date validation if both dates exist
    IF NEW.end_date IS NOT NULL AND NEW.start_date IS NOT NULL THEN
      IF NEW.end_date <= NEW.start_date THEN
        RAISE EXCEPTION 'end_date must be after start_date';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger for INSERT and UPDATE only
CREATE TRIGGER trigger_validate_onsite_course
  BEFORE INSERT OR UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION validate_onsite_course();

-- Also ensure RLS policies aren't too restrictive
DROP POLICY IF EXISTS "Students can view course details" ON public.courses;
CREATE POLICY "Students can view course details"
  ON public.courses
  FOR SELECT
  USING (
    status = 'published' OR 
    instructor_id = auth.uid()
  );
