-- FIX for "Failed to register payment in database"
-- This script adds the missing INSERT and UPDATE permissions for students.
-- File: 20260118_fix_payment_permissions.sql

-- 1. Ensure 'manual' is an allowed provider
DO $$ 
BEGIN
    ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
    ALTER TABLE public.payments ADD CONSTRAINT payments_provider_check 
    CHECK (provider IN ('paystack', 'flutterwave', 'manual'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 2. Add INSERT policy for students (Allow them to create the record)
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Add UPDATE policy for students (Allow them to upload receipt later)
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
CREATE POLICY "Users can update their own payments"
  ON public.payments FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Re-verify basic SELECT policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- 5. Finalize email column synchronization (just in case)
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
