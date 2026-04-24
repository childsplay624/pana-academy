-- Add navigation flags to pages table
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS show_in_navbar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_in_footer BOOLEAN DEFAULT false;
