-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_initials TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.testimonials IS 'Stores client testimonials for display on the website';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON public.testimonials(is_active);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable read access for all users') THEN
    DROP POLICY "Enable read access for all users" ON public.testimonials;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable insert for admins') THEN
    DROP POLICY "Enable insert for admins" ON public.testimonials;
  END IF;
  
  -- Create policies
  CREATE POLICY "Enable read access for all users" ON public.testimonials
    FOR SELECT USING (true);

  CREATE POLICY "Enable insert for admins" ON public.testimonials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));
END $$;

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION public.update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;

-- Create the trigger
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_testimonials_updated_at();

DO $$
BEGIN
  -- Drop update policy if it exists
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable update for admins') THEN
    DROP POLICY "Enable update for admins" ON public.testimonials;
  END IF;
  
  -- Drop delete policy if it exists
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Enable delete for admins') THEN
    DROP POLICY "Enable delete for admins" ON public.testimonials;
  END IF;
  
  -- Create update policy
  CREATE POLICY "Enable update for admins" ON public.testimonials
    FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));

  -- Create delete policy
  CREATE POLICY "Enable delete for admins" ON public.testimonials
    FOR DELETE USING (auth.role() = 'authenticated' AND auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));
END $$;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION update_testimonials_updated_at();
