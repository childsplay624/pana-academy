# Database Migration Issue - 406 Error Fix

## Problem
Getting `406 (Not Acceptable)` error when fetching from `site_images` table:
```
GET .../rest/v1/site_images?select=*&key=eq.training_main&is_active=eq.true 406
```

## Root Cause
The migration likely wasn't run successfully, so the `site_images` table either:
1. Doesn't exist
2. Has incorrect RLS policies
3. Has wrong schema structure

---

## Solution Steps

### Step 1: Verify Migration Status

Run the diagnostic query in Supabase Dashboard → SQL Editor:
```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_images'
) AS table_exists;
```

**Expected:** Should return `true`  
**If false:** Migration wasn't run - proceed to Step 2

---

### Step 2: Run the Safe Migration

Open file: `supabase/migrations/20260117_safe_site_images.sql`

1. **Copy ALL content** from the file
2. Go to **Supabase Dashboard** → **SQL Editor**
3. **Paste** the entire SQL
4. Click **Run** or press `Ctrl+Enter`

**Expected output:** Queries executed successfully

---

### Step 3: Verify Table Creation

Run in SQL Editor:
```sql
-- Check table and count records
SELECT COUNT(*) as total_images 
FROM site_images;
```

**Expected:** Should return a number (24 if seed data was inserted)  
**If error:** Check the migration output for errors

---

### Step 4: Test RLS Policies

Run in SQL Editor:
```sql
-- Test public read access
SELECT key, category, url, is_active 
FROM site_images 
WHERE is_active = true 
LIMIT 5;
```

**Expected:** Should return 5 active images  
**If empty or error:** RLS policies may need adjustment

---

### Step 5: Verify Storage Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'site-images';
```

**Expected:** Should return one row with `public = true`

---

## Quick Fix: Minimal Migration

If the safe migration fails, try this minimal version:

```sql
-- Drop and recreate (CAUTION: Deletes existing data)
DROP TABLE IF EXISTS public.site_images CASCADE;

-- Create minimal table
CREATE TABLE public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  alt_text text,
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  width integer,
  height integer,
  file_size integer,
  mime_type text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Public read for active images
CREATE POLICY "Public read active images"
ON public.site_images FOR SELECT
USING (is_active = true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on storage
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');
```

---

## After Migration: Verify App Works

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R)
2. **Check browser console** - 406 error should be gone
3. **Navigate to About page** - images should load (or fallback)
4. **Go to `/dashboard/images`** as admin - should see empty categories

---

## Common Issues

### Issue: "relation site_images does not exist"
**Fix:** Run the migration SQL in Supabase Dashboard

### Issue: "permission denied for table site_images"  
**Fix:** Check RLS policies are created with public SELECT access

### Issue: Still getting 406 error
**Fix:** 
1. Clear browser cache
2. Restart dev server: Stop and run `npm run dev` again
3. Check Supabase URL and Anon Key in `.env` file

---

## Next Steps After Fix

1. ✅ Verify images load with fallbacks
2. 📤 Upload actual images via `/dashboard/images`
3. 🎨 Replace images to see them update live
4. 🗂️ Move images from `public/` to Supabase Storage (optional)

---

## Need Help?

Check the full diagnostic with:
```bash
# Run diagnostic SQL
cat supabase/migrations/diagnostic_check.sql | supabase db execute
```

Or manually in Supabase Dashboard SQL Editor.
