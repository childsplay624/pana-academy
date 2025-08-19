-- Fix assignment_submissions RLS policies to prevent students from manipulating grades
-- Remove the overly permissive policy that allows students to update grading fields

-- Drop the existing broad policy for students
DROP POLICY IF EXISTS "Students can manage their own submissions" ON public.assignment_submissions;

-- Create specific policies for students with restricted field access
-- Students can view their own submissions
CREATE POLICY "Students can view their own submissions" 
ON public.assignment_submissions 
FOR SELECT 
USING (student_id = auth.uid());

-- Students can create their own submissions
CREATE POLICY "Students can create their own submissions" 
ON public.assignment_submissions 
FOR INSERT 
WITH CHECK (
  student_id = auth.uid() 
  AND graded_by IS NULL 
  AND feedback IS NULL 
  AND score IS NULL 
  AND graded_at IS NULL
  AND status = 'pending'
);

-- Students can only update content and file_urls of their own ungraded submissions
CREATE POLICY "Students can update submission content only" 
ON public.assignment_submissions 
FOR UPDATE 
USING (
  student_id = auth.uid() 
  AND status = 'pending'
  AND graded_by IS NULL
)
WITH CHECK (
  student_id = auth.uid()
  AND status = 'pending'
  AND graded_by IS NULL
  -- Ensure grading fields cannot be modified by students
  AND (OLD.graded_by IS NULL AND NEW.graded_by IS NULL)
  AND (OLD.feedback IS NULL AND NEW.feedback IS NULL) 
  AND (OLD.score IS NULL AND NEW.score IS NULL)
  AND (OLD.graded_at IS NULL AND NEW.graded_at IS NULL)
  AND (OLD.status = NEW.status AND NEW.status = 'pending')
);

-- Students can delete their own unsubmitted submissions
CREATE POLICY "Students can delete their own ungraded submissions" 
ON public.assignment_submissions 
FOR DELETE 
USING (
  student_id = auth.uid() 
  AND status = 'pending'
  AND graded_by IS NULL
);

-- Instructors can grade submissions for their courses
CREATE POLICY "Instructors can grade submissions for their courses" 
ON public.assignment_submissions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM assignments a
    JOIN lessons l ON l.id = a.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE a.id = assignment_submissions.assignment_id 
    AND c.instructor_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM assignments a
    JOIN lessons l ON l.id = a.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE a.id = assignment_submissions.assignment_id 
    AND c.instructor_id = auth.uid()
  )
  -- Instructors can only grade, not change the core submission
  AND student_id = OLD.student_id
  AND assignment_id = OLD.assignment_id
  AND submitted_at = OLD.submitted_at
  -- When grading, graded_by must be set to the instructor
  AND (NEW.graded_by IS NULL OR NEW.graded_by = auth.uid())
);

-- Admins can manage all submissions
CREATE POLICY "Admins can manage all assignment submissions" 
ON public.assignment_submissions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);