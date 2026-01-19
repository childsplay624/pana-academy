-- Drop tables if they exist to ensure clean migration
DROP TABLE IF EXISTS user_deadlines CASCADE;
DROP TABLE IF EXISTS deadlines CASCADE;

-- Create deadlines table for assignments, quizzes, and live sessions
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('assignment', 'quiz', 'project', 'live_session', 'exam')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_deadlines table to track individual student submissions/completions
CREATE TABLE user_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deadline_id UUID NOT NULL REFERENCES deadlines(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  submission_url TEXT,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, deadline_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_deadlines_course ON deadlines(course_id);
CREATE INDEX idx_deadlines_module ON deadlines(module_id);
CREATE INDEX idx_deadlines_due_date ON deadlines(due_date);
CREATE INDEX idx_deadlines_type ON deadlines(type);
CREATE INDEX idx_user_deadlines_student ON user_deadlines(student_id);
CREATE INDEX idx_user_deadlines_deadline ON user_deadlines(deadline_id);
CREATE INDEX idx_user_deadlines_completed ON user_deadlines(completed);

-- Add triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deadlines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deadlines_updated_at
  BEFORE UPDATE ON deadlines
  FOR EACH ROW
  EXECUTE FUNCTION update_deadlines_updated_at();

CREATE TRIGGER trigger_update_user_deadlines_updated_at
  BEFORE UPDATE ON user_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION update_deadlines_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deadlines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deadlines table

-- Policy: Students can view deadlines for courses they're enrolled in
CREATE POLICY "Students can view course deadlines"
  ON deadlines
  FOR SELECT
  USING (
    is_published = TRUE 
    AND course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- Policy: Instructors can view all deadlines for their courses
CREATE POLICY "Instructors can view their course deadlines"
  ON deadlines
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Policy: Instructors can insert deadlines for their courses
CREATE POLICY "Instructors can create course deadlines"
  ON deadlines
  FOR INSERT
  WITH CHECK (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Policy: Instructors can update deadlines for their courses
CREATE POLICY "Instructors can update their course deadlines"
  ON deadlines
  FOR UPDATE
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Policy: Instructors can delete deadlines for their courses
CREATE POLICY "Instructors can delete their course deadlines"
  ON deadlines
  FOR DELETE
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- RLS Policies for user_deadlines table

-- Policy: Users can view their own deadline submissions
CREATE POLICY "Users can view their own deadline submissions"
  ON user_deadlines
  FOR SELECT
  USING (student_id = auth.uid());

-- Policy: Instructors can view submissions for their course deadlines
CREATE POLICY "Instructors can view course deadline submissions"
  ON user_deadlines
  FOR SELECT
  USING (
    deadline_id IN (
      SELECT d.id FROM deadlines d
      JOIN courses c ON d.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    )
  );

-- Policy: Users can insert their own deadline submissions
CREATE POLICY "Users can submit to deadlines"
  ON user_deadlines
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Policy: Users can update their own deadline submissions (before completion)
CREATE POLICY "Users can update their own deadline submissions"
  ON user_deadlines
  FOR UPDATE
  USING (student_id = auth.uid());

-- Policy: Instructors can update submissions for their course deadlines (for grading)
CREATE POLICY "Instructors can grade deadline submissions"
  ON user_deadlines
  FOR UPDATE
  USING (
    deadline_id IN (
      SELECT d.id FROM deadlines d
      JOIN courses c ON d.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE deadlines IS 'Stores deadlines for assignments, quizzes, projects, and live sessions';
COMMENT ON COLUMN deadlines.type IS 'Type of deadline: assignment, quiz, project, live_session, or exam';
COMMENT ON COLUMN deadlines.points IS 'Maximum points available for this deadline item';
COMMENT ON TABLE user_deadlines IS 'Tracks individual student submissions and completion status for deadlines';
COMMENT ON COLUMN user_deadlines.score IS 'Score received out of maximum points';
