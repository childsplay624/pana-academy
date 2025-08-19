-- Create storage bucket for course content
INSERT INTO storage.buckets (id, name, public) VALUES ('course-content', 'course-content', false);

-- Create RLS policies for course content bucket
CREATE POLICY "Instructors can upload content for their courses"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM courses 
    WHERE instructor_id = auth.uid()
  )
);

CREATE POLICY "Instructors can view content for their courses"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Instructors can update content for their courses"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Instructors can delete content for their courses"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view course content they're enrolled in"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'course-content' 
  AND EXISTS (
    SELECT 1 
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.student_id = auth.uid() 
    AND e.status = 'enrolled'
    AND c.instructor_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins can manage all course content"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'course-content' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add file_urls column to lessons table for additional file attachments
ALTER TABLE lessons ADD COLUMN file_urls TEXT[];

-- Add file_url column to assignments table for assignment files
ALTER TABLE assignments ADD COLUMN file_url TEXT;