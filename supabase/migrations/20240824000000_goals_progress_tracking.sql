-- Create goals table
CREATE TABLE IF NOT EXISTS public.student_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_study_hours INTEGER NOT NULL DEFAULT 5,
  target_courses_completed INTEGER NOT NULL DEFAULT 2,
  target_weekly_streak INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create study sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress tracking table
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create streak tracking table
CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak_days INTEGER NOT NULL DEFAULT 0,
  last_studied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id)
);

-- Create RLS policies for goals
ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
  ON public.student_goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.student_goals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for study sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions"
  ON public.study_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions"
  ON public.study_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for progress tracking
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.student_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.student_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for streak tracking
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
  ON public.study_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.study_streaks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update progress when a course is completed
CREATE OR REPLACE FUNCTION public.handle_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed AND NOT OLD.is_completed THEN
    NEW.completed_at = NOW();
    
    -- Update progress for the course
    UPDATE public.student_progress
    SET 
      completion_percentage = 100,
      is_completed = TRUE,
      completed_at = NOW()
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    
    -- Update study streak
    INSERT INTO public.study_streaks (user_id, last_studied_date, current_streak_days, longest_streak_days)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET
      last_studied_date = CURRENT_DATE,
      current_streak_days = CASE 
        WHEN study_streaks.last_studied_date = CURRENT_DATE - INTERVAL '1 day' 
        THEN study_streaks.current_streak_days + 1 
        ELSE 1 
      END,
      longest_streak_days = GREATEST(
        study_streaks.longest_streak_days,
        CASE 
          WHEN study_streaks.last_studied_date = CURRENT_DATE - INTERVAL '1 day' 
          THEN study_streaks.current_streak_days + 1 
          ELSE 1 
        END
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for course completion
CREATE TRIGGER on_course_completed
BEFORE UPDATE ON public.student_progress
FOR EACH ROW
WHEN (NEW.is_completed AND NOT OLD.is_completed)
EXECUTE FUNCTION public.handle_course_completion();
