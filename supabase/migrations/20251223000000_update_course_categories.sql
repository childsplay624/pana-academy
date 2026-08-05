-- Update course_category enum to use PANA Institute categories
-- This migration updates the course_category enum type to match the new category system

-- First, add the new enum values
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'soft_skills';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'safety';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'sustainability';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'general_technical';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'flow_drives';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'flow_control';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'flow_measurement';
ALTER TYPE public.course_category ADD VALUE IF NOT EXISTS 'instrumentation_automation';

-- Note: PostgreSQL doesn't allow removing enum values directly.
-- The old values (technology, business, design, etc.) will remain in the enum
-- but won't be used in the application. If you need to remove them completely,
-- you would need to:
-- 1. Create a new enum type
-- 2. Alter the column to use the new type
-- 3. Drop the old enum type
-- This is more complex and risky, so we're keeping the old values for now.
