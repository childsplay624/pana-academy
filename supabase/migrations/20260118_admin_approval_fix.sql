-- FINAL PERMISSION FIX for Admin Approval
-- This allows admins to update payment status and enroll students.
-- File: 20260118_admin_approval_fix.sql

-- 1. Allow Admins to UPDATE any payment record
DROP POLICY IF EXISTS "Admins can update any payment" ON public.payments;
CREATE POLICY "Admins can update any payment"
  ON public.payments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. Allow Admins to INSERT any enrollment record
DROP POLICY IF EXISTS "Admins can enroll any student" ON public.enrollments;
CREATE POLICY "Admins can enroll any student"
  ON public.enrollments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. Also allow Admins to SELECT all enrollments (for management)
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 4. Re-verify the provider check constraint allows 'manual'
DO $$ 
BEGIN
    ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
    ALTER TABLE public.payments ADD CONSTRAINT payments_provider_check 
    CHECK (provider IN ('paystack', 'flutterwave', 'manual'));
EXCEPTION
    WHEN others THEN NULL;
END $$;
