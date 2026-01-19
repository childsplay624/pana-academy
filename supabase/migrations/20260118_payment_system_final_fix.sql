-- FINAL FIX for manual payment system
-- This script ensures all constraints, columns, and policies are correct.
-- File: 20260118_payment_system_final_fix.sql

-- 1. Ensure 'manual' is an allowed provider
-- First, drop the old constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
    ALTER TABLE public.payments ADD CONSTRAINT payments_provider_check 
    CHECK (provider IN ('paystack', 'flutterwave', 'manual'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 2. Ensure email column exists in profiles and is synced
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='profiles' AND COLUMN_NAME='email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND (public.profiles.email IS NULL OR public.profiles.email = '');

-- 3. Reset handle_new_user to be robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'student',
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN new;
END;
$$;

-- 4. Establish explicit foreign key for PostgREST joins
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_user_id_profiles_fkey'
    ) THEN
        ALTER TABLE public.payments
        ADD CONSTRAINT payments_user_id_profiles_fkey
        FOREIGN KEY (user_id) REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Finalize RLS Policies (Admins only)
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Ensure students can view their own
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Storage Bucket Permissions (Robust)
INSERT INTO storage.buckets (id, name, public)
SELECT 'payment-receipts', 'payment-receipts', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'payment-receipts'
);

DROP POLICY IF EXISTS "Anyone can view receipts" ON storage.objects;
CREATE POLICY "Anyone can view receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-receipts');

DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-receipts');
