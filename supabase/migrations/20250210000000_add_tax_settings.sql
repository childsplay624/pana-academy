-- Add tax settings to platform_settings and update courses table with tax support
-- This migration adds tax configuration and applies tax to all course pricing

-- Add tax settings to platform_settings enum and table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tax_setting') THEN
    CREATE TYPE public.tax_setting AS ENUM (
      'tax_enabled',
      'tax_rate',
      'tax_type',
      'tax_name',
      'tax_number'
    );
  END IF;
END $$;

-- Add tax_type enum for different tax types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tax_type') THEN
    CREATE TYPE public.tax_type AS ENUM (
      'percentage',
      'fixed',
      'vat'
    );
  END IF;
END $$;

-- Update platform_settings table to include tax settings
DO $$
BEGIN
  -- Check if platform_settings table exists, create if not
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'platform_settings'
  ) THEN
    CREATE TABLE IF NOT EXISTS public.platform_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key TEXT NOT NULL,
      value JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;

  -- Add tax settings to the case statement in handleSave function
  -- This will be handled in the application code
END $$;

-- Add tax columns to courses table for tax calculation
DO $$
BEGIN
  -- Check if courses table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'courses'
  ) THEN
    -- Add tax-related columns if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'tax_enabled'
    ) THEN
      ALTER TABLE public.courses ADD COLUMN tax_enabled BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'tax_rate'
    ) THEN
      ALTER TABLE public.courses ADD COLUMN tax_rate DECIMAL(5,4) DEFAULT 0.0000;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'tax_type'
    ) THEN
      ALTER TABLE public.courses ADD COLUMN tax_type tax_type DEFAULT 'percentage';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'tax_name'
    ) THEN
      ALTER TABLE public.courses ADD COLUMN tax_name TEXT DEFAULT 'VAT';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'tax_number'
    ) THEN
      ALTER TABLE public.courses ADD COLUMN tax_number TEXT DEFAULT '';
    END IF;
  END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'courses'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_courses_tax_enabled ON public.courses(tax_enabled);
    CREATE INDEX IF NOT EXISTS idx_courses_tax_rate ON public.courses(tax_rate);
  END IF;
END $$;

-- Insert default tax settings using individual statements
DO $$
BEGIN
  INSERT INTO public.platform_settings (key, value) VALUES ('tax_enabled', 'true')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  
  INSERT INTO public.platform_settings (key, value) VALUES ('tax_rate', '7.5')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  
  INSERT INTO public.platform_settings (key, value) VALUES ('tax_type', '"percentage"')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  
  INSERT INTO public.platform_settings (key, value) VALUES ('tax_name', '"VAT"')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  
  INSERT INTO public.platform_settings (key, value) VALUES ('tax_number', '"VAT123456"')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
END $$;

-- Add RLS policies for tax settings
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'platform_settings'
  ) THEN
    ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admins can manage tax settings" ON public.platform_settings
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );

    CREATE POLICY "Anyone can view tax settings" ON public.platform_settings
    FOR SELECT USING (
      key IN ('tax_enabled', 'tax_rate', 'tax_type', 'tax_name', 'tax_number')
    );
  END IF;
END $$;
