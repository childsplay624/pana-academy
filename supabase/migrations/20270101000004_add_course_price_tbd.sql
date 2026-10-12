-- Migration: Add is_price_tbd to courses table
-- Supports courses where pricing is upon request or to be determined (TBD)

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS is_price_tbd BOOLEAN DEFAULT false;

-- Automatically flag existing courses that are not marked free and have 0 or null price as TBD
UPDATE public.courses
SET is_price_tbd = true
WHERE (is_free IS NULL OR is_free = false)
  AND (price IS NULL OR price = 0);
