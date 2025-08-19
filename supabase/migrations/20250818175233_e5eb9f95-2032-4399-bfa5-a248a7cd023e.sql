-- Fix security warnings by setting search_path for functions

-- Update calculate_user_level function
CREATE OR REPLACE FUNCTION public.calculate_user_level(exp_points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Level calculation: Level = floor(sqrt(experience_points / 100)) + 1
  -- Level 1: 0-99 points, Level 2: 100-399 points, Level 3: 400-899 points, etc.
  RETURN floor(sqrt(exp_points / 100.0)) + 1;
END;
$$;

-- Update award_points function  
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
SET search_path = public
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

-- Update update_user_streak function
CREATE OR REPLACE FUNCTION public.update_user_streak(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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