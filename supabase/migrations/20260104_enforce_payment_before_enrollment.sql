-- Migration: Enforce payment before enrollment for paid courses
-- This trigger prevents students from enrolling in paid courses without completed payment

-- Create function to check if payment exists for paid courses
CREATE OR REPLACE FUNCTION check_payment_before_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  v_course_price DECIMAL(10,2);
  v_course_is_free BOOLEAN;
  v_payment_exists BOOLEAN;
BEGIN
  -- Get course details
  SELECT price, is_free
  INTO v_course_price, v_course_is_free
  FROM courses
  WHERE id = NEW.course_id;
  
  -- If course price not found, prevent enrollment
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found with ID: %', NEW.course_id;
  END IF;
  
  -- If course is not free and has a price > 0
  IF NOT v_course_is_free AND v_course_price > 0 THEN
    -- Check if there's a completed payment for this user and course
    SELECT EXISTS (
      SELECT 1
      FROM payments
      WHERE user_id = NEW.student_id
        AND course_id = NEW.course_id
        AND status = 'completed'
    ) INTO v_payment_exists;
    
    IF NOT v_payment_exists THEN
      RAISE EXCEPTION 'Payment required before enrollment. Please complete payment for this course first.'
        USING HINT = 'This is a paid course. Visit the payment page to complete your purchase.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires before enrollment insert
DROP TRIGGER IF EXISTS enforce_payment_before_enrollment ON enrollments;

CREATE TRIGGER enforce_payment_before_enrollment
  BEFORE INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION check_payment_before_enrollment();

-- Add helpful comments
COMMENT ON FUNCTION check_payment_before_enrollment() IS 
  'Prevents enrollment in paid courses without completed payment. Free courses allow direct enrollment.';

COMMENT ON TRIGGER enforce_payment_before_enrollment ON enrollments IS 
  'Enforces payment requirement before enrollment in paid courses';
