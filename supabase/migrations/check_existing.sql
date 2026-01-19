-- Check what already exists in the database
-- Run this in Supabase SQL Editor to see current state

-- Check if site_images table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_images'
) AS table_exists;

-- Check existing indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'site_images' 
AND schemaname = 'public';

-- Check existing policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'site_images' 
AND schemaname = 'public';

-- Count existing records
SELECT COUNT(*) as record_count FROM site_images;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'site-images';
