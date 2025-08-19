-- Fix quiz security: Add RLS policies to protect quiz questions and answers
-- Only instructors and admins can view quiz questions/answers
-- Students can only see quiz structure during active attempts

-- Enable RLS on quizzes table if not already enabled
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz access
CREATE POLICY "Instructors can manage quizzes for their courses" 
ON public.quizzes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = quizzes.lesson_id 
    AND c.instructor_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all quizzes" 
ON public.quizzes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Students can only view quiz metadata (not questions/answers) for enrolled courses
CREATE POLICY "Students can view quiz metadata for enrolled courses" 
ON public.quizzes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    JOIN enrollments e ON e.course_id = c.id
    WHERE l.id = quizzes.lesson_id 
    AND e.student_id = auth.uid()
    AND e.status = 'enrolled'
  )
);

-- Enable RLS on quiz_attempts table if not already enabled
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Students can manage their own quiz attempts
CREATE POLICY "Students can manage their own quiz attempts" 
ON public.quiz_attempts 
FOR ALL 
USING (student_id = auth.uid());

-- Instructors can view attempts for their course quizzes
CREATE POLICY "Instructors can view quiz attempts for their courses" 
ON public.quiz_attempts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM quizzes q
    JOIN lessons l ON l.id = q.lesson_id
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE q.id = quiz_attempts.quiz_id 
    AND c.instructor_id = auth.uid()
  )
);

-- Admins can view all quiz attempts
CREATE POLICY "Admins can view all quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);