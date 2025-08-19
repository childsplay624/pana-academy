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

-- Students can create their own submissions (only with pending status and no grading fields)
CREATE POLICY "Students can create their own submissions" 
ON public.assignment_submissions 
FOR INSERT 
WITH CHECK (
  student_id = auth.uid() 
  AND graded_by IS NULL 
  AND feedback IS NULL 
  AND score IS NULL 
  AND graded_at IS NULL
  AND (status IS NULL OR status = 'pending')
);

-- Students can delete their own ungraded submissions
CREATE POLICY "Students can delete their own ungraded submissions" 
ON public.assignment_submissions 
FOR DELETE 
USING (
  student_id = auth.uid() 
  AND (status IS NULL OR status = 'pending')
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
);

-- Create a separate policy for students to update only content and file_urls
-- This will be handled by application logic to ensure only specific fields can be updated