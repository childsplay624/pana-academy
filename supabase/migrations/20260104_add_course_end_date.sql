-- Add end_date column to courses table
-- This allows tracking when courses finish, essential for live courses

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Add check constraint to ensure end_date is after start_date when both are present
ALTER TABLE public.courses
ADD CONSTRAINT courses_date_range_check 
CHECK (
  end_date IS NULL 
  OR start_date IS NULL 
  OR end_date >= start_date
);

-- Create index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_courses_date_range 
ON public.courses(start_date, end_date) 
WHERE start_date IS NOT NULL;

-- Create index for upcoming courses queries
CREATE INDEX IF NOT EXISTS idx_courses_upcoming 
ON public.courses(start_date) 
WHERE start_date IS NOT NULL AND status = 'published';

-- Add comments for documentation
COMMENT ON COLUMN public.courses.start_date IS 
'Course start date - required for live courses, optional for self-paced courses';

COMMENT ON COLUMN public.courses.end_date IS 
'Course end date - when the course finishes. Required for live courses, optional for self-paced courses';
