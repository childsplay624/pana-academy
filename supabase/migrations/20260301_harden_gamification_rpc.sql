-- Hardening award_points RPC to prevent point forgery
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
  is_admin_user BOOLEAN;
  daily_points_count INTEGER;
  MAX_DAILY_POINTS CONSTANT INTEGER := 1000; -- Daily cap to prevent exploit bursts
  MAX_SINGLE_AWARD CONSTANT INTEGER := 500;  -- Max points for a single action
BEGIN
  -- 1. Security Check: Only allow if caller is owner or admin
  SELECT (role = 'admin') INTO is_admin_user
  FROM public.profiles
  WHERE id = auth.uid();

  IF (auth.uid() <> _user_id AND NOT is_admin_user) THEN
    RAISE EXCEPTION 'Unauthorized: You cannot award points to other users.';
  END IF;

  -- 2. Validate Point Amount (Frontend can be manipulated, DB is the final judge)
  IF (_points > MAX_SINGLE_AWARD AND NOT is_admin_user) THEN
    _points := MAX_SINGLE_AWARD; -- Cap the points instead of failing
  END IF;

  IF (_points <= 0) THEN
    RETURN false; -- Don't allow negative points via this RPC
  END IF;

  -- 3. Rate Limiting: Check daily accumulated points for this user
  SELECT COALESCE(SUM(points), 0) INTO daily_points_count
  FROM public.points_history
  WHERE user_id = _user_id 
    AND created_at > (now() - INTERVAL '24 hours');

  IF (daily_points_count + _points > MAX_DAILY_POINTS AND NOT is_admin_user) THEN
    RAISE EXCEPTION 'Daily point limit reached. Pace your learning!';
  END IF;

  -- 4. Proceed with awarding points
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
  
  -- Get current experience points and update level
  SELECT experience_points INTO current_exp
  FROM public.user_gamification
  WHERE user_id = _user_id;
  
  new_level := public.calculate_user_level(current_exp);
  
  UPDATE public.user_gamification
  SET level = new_level,
      updated_at = now()
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;
