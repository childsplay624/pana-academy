-- Add RLS policies for assignment management security
-- Only instructors of the course and admins should be able to manage assignments

-- Policy for creating assignments (INSERT)
CREATE POLICY "Instructors can create assignments for their courses" 
ON public.assignments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = assignments.lesson_id 
    AND c.instructor_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for updating assignments (UPDATE)
CREATE POLICY "Instructors can update assignments for their courses" 
ON public.assignments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = assignments.lesson_id 
    AND c.instructor_id = auth.uid()
  )
  OR
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
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = assignments.lesson_id 
    AND c.instructor_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for deleting assignments (DELETE)
CREATE POLICY "Instructors can delete assignments for their courses" 
ON public.assignments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = assignments.lesson_id 
    AND c.instructor_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);