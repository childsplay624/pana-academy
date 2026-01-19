-- Drop table if exists to ensure clean migration
DROP TABLE IF EXISTS lesson_progress CASCADE;

-- Create lesson_progress table for tracking individual lesson completion
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in minutes
  last_position INTEGER DEFAULT 0, -- for video/content position
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_module ON lesson_progress(module_id);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(completed);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lesson_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_progress_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own lesson progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress
  FOR SELECT
  USING (student_id = auth.uid());

-- RLS Policy: Users can insert their own lesson progress
CREATE POLICY "Users can insert their own lesson progress"
  ON lesson_progress
  FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- RLS Policy: Users can update their own lesson progress
CREATE POLICY "Users can update their own lesson progress"
  ON lesson_progress
  FOR UPDATE
  USING (student_id = auth.uid());

-- Add comment for documentation
COMMENT ON TABLE lesson_progress IS 'Tracks student progress through individual lessons within courses';
COMMENT ON COLUMN lesson_progress.time_spent IS 'Total time spent on this lesson in minutes';
COMMENT ON COLUMN lesson_progress.last_position IS 'Last viewing position for video/content resumption';
