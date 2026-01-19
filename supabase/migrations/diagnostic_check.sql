-- Quick Diagnostic Query
-- Run this in Supabase SQL Editor to check migration status

-- 1. Check if site_images table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_images'
) AS table_exists;

-- 2. If table exists, check structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'site_images'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'site_images';

-- 4. Check existing policies
SELECT policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'site_images';

-- 5. Check if there's any data
SELECT COUNT(*) as total_records, 
       COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM site_images;

-- 6. Check storage bucket
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'site-images';
