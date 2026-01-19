-- Migration to support manual payments
-- File: 20260118_add_manual_payments.sql

-- 1. Update the provider constraint to include 'manual'
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_provider_check;

ALTER TABLE public.payments 
ADD CONSTRAINT payments_provider_check 
CHECK (provider IN ('paystack', 'flutterwave', 'manual'));

-- 2. Add receipt_url column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='payments' AND COLUMN_NAME='receipt_url') THEN
        ALTER TABLE public.payments ADD COLUMN receipt_url TEXT;
    END IF;
END $$;

-- 3. Ensure policies are idempotent (fixing the error user encountered)
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- 4. Create storage bucket for receipts if not exists
-- Note: This requires the storage schema to be available
INSERT INTO storage.buckets (id, name, public)
SELECT 'payment-receipts', 'payment-receipts', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'payment-receipts'
);

-- 5. Storage Policies for payment-receipts
-- Allow users to upload their own receipts
DROP POLICY IF EXISTS "Users can upload their own receipts" ON storage.objects;
CREATE POLICY "Users can upload their own receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-receipts');

-- Allow users to view their own receipts
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
CREATE POLICY "Users can view their own receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-receipts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow admins to view all receipts
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;
CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-receipts' AND 
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
