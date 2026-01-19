-- Migration: Add Attendance Tracking for On-Site Courses
-- This migration creates tables to track student attendance at on-site course sessions

-- 1. Create session_attendance table
CREATE TABLE IF NOT EXISTS public.session_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_start_time TIME,
  session_end_time TIME,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON public.session_attendance(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON public.session_attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session_date ON public.session_attendance(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.session_attendance(status);

-- 3. Add unique constraint (one attendance record per enrollment per session)
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique 
ON public.session_attendance(enrollment_id, session_date, session_start_time);

-- 4. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_session_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_session_attendance_updated_at ON public.session_attendance;
CREATE TRIGGER trigger_update_session_attendance_updated_at
  BEFORE UPDATE ON public.session_attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_session_attendance_updated_at();

-- 5. Create function to calculate attendance rate
CREATE OR REPLACE FUNCTION calculate_attendance_rate(
  p_enrollment_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  total_sessions INTEGER;
  attended_sessions INTEGER;
  attendance_rate NUMERIC;
BEGIN
  -- Count total sessions for the course
  SELECT COUNT(*)
  INTO total_sessions
  FROM session_attendance
  WHERE enrollment_id = p_enrollment_id;
  
  -- Count sessions marked as 'present' or 'late'
  SELECT COUNT(*)
  INTO attended_sessions
  FROM session_attendance
  WHERE enrollment_id = p_enrollment_id
    AND status IN ('present', 'late');
  
  -- Calculate percentage
  IF total_sessions > 0 THEN
    attendance_rate := (attended_sessions::NUMERIC / total_sessions::NUMERIC) * 100;
  ELSE
    attendance_rate := 0;
  END IF;
  
  RETURN ROUND(attendance_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- 6. Enable RLS
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for session_attendance

-- Students can view their own attendance
DROP POLICY IF EXISTS "Students can view their own attendance" ON public.session_attendance;
CREATE POLICY "Students can view their own attendance"
  ON public.session_attendance
  FOR SELECT
  USING (
    enrollment_id IN (
      SELECT id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- Instructors can view attendance for their courses
DROP POLICY IF EXISTS "Instructors can view course attendance" ON public.session_attendance;
CREATE POLICY "Instructors can view course attendance"
  ON public.session_attendance
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Instructors can manage attendance for their courses
DROP POLICY IF EXISTS "Instructors can manage course attendance" ON public.session_attendance;
CREATE POLICY "Instructors can manage course attendance"
  ON public.session_attendance
  FOR ALL
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- 8. Add comments for documentation
COMMENT ON TABLE public.session_attendance IS 'Tracks student attendance at on-site course sessions';
COMMENT ON COLUMN public.session_attendance.enrollment_id IS 'Reference to the student enrollment';
COMMENT ON COLUMN public.session_attendance.course_id IS 'Reference to the course';
COMMENT ON COLUMN public.session_attendance.session_date IS 'Date of the session';
COMMENT ON COLUMN public.session_attendance.check_in_time IS 'Actual time student checked in';
COMMENT ON COLUMN public.session_attendance.check_out_time IS 'Actual time student checked out';
COMMENT ON COLUMN public.session_attendance.status IS 'Attendance status: present, absent, late, or excused';
COMMENT ON FUNCTION calculate_attendance_rate(UUID) IS 'Calculates attendance rate as percentage for given enrollment';
