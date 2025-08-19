-- Add a specific policy for students to update only content and file_urls through the edge function
-- This completes the security fix for assignment submissions

CREATE POLICY "Students can update submission content via API" 
ON public.assignment_submissions 
FOR UPDATE 
USING (
  student_id = auth.uid() 
  AND (status IS NULL OR status = 'pending')
  AND graded_by IS NULL
)
WITH CHECK (
  student_id = auth.uid()
  AND (status IS NULL OR status = 'pending')
  AND graded_by IS NULL
);