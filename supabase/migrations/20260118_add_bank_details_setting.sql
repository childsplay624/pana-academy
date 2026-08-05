-- Add bank details to platform_settings
-- File: 20260118_add_bank_details_setting.sql

-- First, ensure a read policy exists for authenticated users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'platform_settings' 
        AND policyname = 'Anyone can view platform settings'
    ) THEN
        CREATE POLICY "Anyone can view platform settings"
        ON public.platform_settings FOR SELECT
        USING (true);
    END IF;
END $$;

-- Insert default bank details if they don't exist
INSERT INTO public.platform_settings (key, value, category)
VALUES (
    'bank_details',
    '{
        "bank_name": "PANA Bank PLC",
        "account_number": "1234567890",
        "account_name": "PANA INSTITUTE LIMITED"
    }'::jsonb,
    'payment'
)
ON CONFLICT (key) DO NOTHING;
