-- Add new columns to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS course_type TEXT NOT NULL DEFAULT 'self_paced' CHECK (course_type IN ('self_paced', 'live')),
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT false;

-- Update existing rows to have a default course_type
UPDATE public.courses
SET course_type = 'self_paced'
WHERE course_type IS NULL;

-- Create an index on the course_type for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_course_type ON public.courses(course_type);

-- Create an index on is_free for free courses filtering
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON public.courses(is_free);

-- Update RLS policies if needed
-- (Assuming RLS is enabled, you might need to adjust these based on your actual RLS policies)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;

CREATE POLICY "Enable read access for all users"
ON public.courses
FOR SELECT
USING (true);

-- Update insert/update policies to include new columns if needed
-- (Adjust these based on your actual requirements)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.courses;

CREATE POLICY "Enable insert for authenticated users only"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.courses;

CREATE POLICY "Enable update for users based on user_id"
ON public.courses
FOR UPDATE
USING (auth.uid() = instructor_id);

-- Add comments for the new columns
COMMENT ON COLUMN public.courses.course_type IS 'Type of the course: self_paced or live';
COMMENT ON COLUMN public.courses.start_date IS 'Start date for live courses, can be NULL for self-paced courses';
COMMENT ON COLUMN public.courses.is_free IS 'Whether the course is free of charge';
