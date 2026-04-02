-- Create contact_messages table to store inquiries
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (PostgreSQL doesn't support IF NOT EXISTS for policies)
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to view contact_messages" ON public.contact_messages;

-- Allow public to insert messages
CREATE POLICY "Allow public insert contact_messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- Allow admins to view messages
CREATE POLICY "Allow admins to view contact_messages" 
ON public.contact_messages FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Index for performance
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at);
