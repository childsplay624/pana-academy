-- Allow students to update their own enrollment progress
CREATE POLICY "Students can update their own enrollments"
ON public.enrollments
FOR UPDATE
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());