-- Create gamification tables

-- User gamification profile
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own gamification data" 
ON public.user_gamification 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data" 
ON public.user_gamification 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gamification data" 
ON public.user_gamification 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Badges system
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#FFD700',
  requirement_type TEXT NOT NULL, -- 'lessons_completed', 'courses_completed', 'streak_days', 'points_earned'
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for badges (public read)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" 
ON public.badges 
FOR SELECT 
USING (true);

-- User badges (earned badges)
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Points history
CREATE TABLE public.points_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'lesson_completed', 'quiz_passed', 'assignment_submitted', 'badge_earned'
  description TEXT,
  reference_id UUID, -- ID of lesson, quiz, assignment, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points history" 
ON public.points_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert points history" 
ON public.points_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add triggers for timestamp updates
CREATE TRIGGER update_user_gamification_updated_at
BEFORE UPDATE ON public.user_gamification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, points_reward) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'lessons_completed', 1, 100),
('Getting Started', 'Complete 5 lessons', '⭐', 'lessons_completed', 5, 200),
('Dedicated Learner', 'Complete 25 lessons', '🏆', 'lessons_completed', 25, 500),
('Course Champion', 'Complete your first course', '🎓', 'courses_completed', 1, 1000),
('Multi-Talented', 'Complete 3 courses', '🌟', 'courses_completed', 3, 2000),
('Streak Starter', 'Maintain a 3-day learning streak', '🔥', 'streak_days', 3, 300),
('Consistent Learner', 'Maintain a 7-day learning streak', '💪', 'streak_days', 7, 750),
('Study Master', 'Maintain a 30-day learning streak', '⚡', 'streak_days', 30, 2500),
('Point Collector', 'Earn 1000 points', '💎', 'points_earned', 1000, 500),
('Elite Scholar', 'Earn 5000 points', '👑', 'points_earned', 5000, 1000);

-- Function to calculate user level based on experience points
CREATE OR REPLACE FUNCTION public.calculate_user_level(exp_points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level calculation: Level = floor(sqrt(experience_points / 100)) + 1
  -- Level 1: 0-99 points, Level 2: 100-399 points, Level 3: 400-899 points, etc.
  RETURN floor(sqrt(exp_points / 100.0)) + 1;
END;
$$;

-- Function to award points and update gamification data
CREATE OR REPLACE FUNCTION public.award_points(
  _user_id UUID,
  _points INTEGER,
  _action_type TEXT,
  _description TEXT DEFAULT NULL,
  _reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_exp INTEGER;
  new_level INTEGER;
  current_points INTEGER;
BEGIN
  -- Insert points history
  INSERT INTO public.points_history (user_id, points, action_type, description, reference_id)
  VALUES (_user_id, _points, _action_type, _description, _reference_id);
  
  -- Update or insert user gamification data
  INSERT INTO public.user_gamification (user_id, total_points, experience_points)
  VALUES (_user_id, _points, _points)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_gamification.total_points + _points,
    experience_points = user_gamification.experience_points + _points,
    updated_at = now();
  
  -- Get current experience points
  SELECT experience_points, total_points INTO current_exp, current_points
  FROM public.user_gamification
  WHERE user_id = _user_id;
  
  -- Calculate new level
  new_level := public.calculate_user_level(current_exp);
  
  -- Update level
  UPDATE public.user_gamification
  SET level = new_level
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_activity DATE;
  current_streak INTEGER;
BEGIN
  -- Get current streak and last activity
  SELECT streak_days, last_activity_date INTO current_streak, last_activity
  FROM public.user_gamification
  WHERE user_id = _user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_gamification (user_id, streak_days, last_activity_date)
    VALUES (_user_id, 1, CURRENT_DATE);
    RETURN true;
  END IF;
  
  -- If last activity was yesterday, increment streak
  IF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE public.user_gamification
    SET streak_days = current_streak + 1,
        last_activity_date = CURRENT_DATE,
        updated_at = now()
    WHERE user_id = _user_id;
  -- If last activity was today, don't change streak
  ELSIF last_activity = CURRENT_DATE THEN
    -- Do nothing, streak continues
    RETURN true;
  -- If last activity was more than 1 day ago, reset streak
  ELSE
    UPDATE public.user_gamification
    SET streak_days = 1,
        last_activity_date = CURRENT_DATE,
        updated_at = now()
    WHERE user_id = _user_id;
  END IF;
  
  RETURN true;
END;
$$;