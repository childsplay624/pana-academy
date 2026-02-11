-- Migration: Add additional profile fields to profiles table
-- Description: Adds bio, location, phone, website, education, and work_experience columns

-- Add additional profile fields to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS work_experience TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.bio IS 'User biography or personal description';
COMMENT ON COLUMN profiles.location IS 'User location (city, country)';
COMMENT ON COLUMN profiles.phone IS 'User phone number';
COMMENT ON COLUMN profiles.website IS 'User personal website URL';
COMMENT ON COLUMN profiles.education IS 'User educational background';
COMMENT ON COLUMN profiles.work_experience IS 'User professional work experience';

-- Enable RLS for these new columns (if RLS is enabled)
-- The existing RLS policies should automatically apply to new columns
