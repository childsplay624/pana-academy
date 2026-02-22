-- Migration: Add Venue Management
-- This migration creates a venues table and links it to courses

-- 1. Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    capacity INTEGER CHECK (capacity > 0),
    map_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add venue_id to courses
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL;

-- 3. Enable RLS on venues
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for venues
-- Admins and Instructors can manage venues
-- Everyone can view venues (to see location details)
CREATE POLICY "Anyone can view venues" 
ON public.venues FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage venues" 
ON public.venues FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Instructors can manage venues" 
ON public.venues FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'instructor'
  )
);

-- 5. Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Migrate existing unique venues from courses table
-- We use a CTE to get distinct venue data
WITH distinct_venues AS (
    SELECT DISTINCT 
        venue_name as name, 
        venue_address as address, 
        venue_city as city, 
        COALESCE(venue_country, 'Nigeria') as country, 
        venue_capacity as capacity, 
        venue_map_url as map_url
    FROM public.courses
    WHERE venue_name IS NOT NULL
)
INSERT INTO public.venues (name, address, city, country, capacity, map_url)
SELECT name, address, city, country, capacity, map_url FROM distinct_venues;

-- 7. Link existing courses to the newly created venues
-- This is a bit complex as we matching by name/address
UPDATE public.courses c
SET venue_id = v.id
FROM public.venues v
WHERE c.venue_name = v.name 
AND c.venue_address = v.address
AND c.venue_id IS NULL;

-- 8. Add comments
COMMENT ON TABLE public.venues IS 'Managed physical locations for onsite and hybrid courses';
COMMENT ON COLUMN public.venues.name IS 'Display name of the venue (e.g., PANA Lagos Center)';
COMMENT ON COLUMN public.venues.capacity IS 'Maximum student capacity for this location';
