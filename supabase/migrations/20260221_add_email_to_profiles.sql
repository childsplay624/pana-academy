-- Migration: Add email column to profiles table
-- Description: Adds email to profiles so it can be queried alongside full_name
-- without requiring auth.admin access. Synced from auth.users on insert/update.

-- Step 1: Add the email column (nullable to avoid breaking existing rows)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Backfill email from auth.users for existing profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Step 3: Update the handle_new_user trigger function to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'student'
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
  RETURN new;
END;
$$;

-- Step 4: Keep email in sync when auth.users email changes
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET email = new.email
  WHERE id = new.id;
  RETURN new;
END;
$$;

-- Create the sync trigger if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_email_updated'
  ) THEN
    CREATE TRIGGER on_auth_user_email_updated
      AFTER UPDATE OF email ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.sync_user_email();
  END IF;
END $$;
