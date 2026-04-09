-- Enable the Database Webhook for Contact Messages
-- This SQL should be run in the Supabase SQL Editor

-- 1. Create the hook trigger
CREATE OR REPLACE TRIGGER on_contact_message_created
AFTER INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://emodwlslhgmwsadlhuyq.supabase.co/functions/v1/send-contact-email',
  'POST',
  '{"Content-Type":"application/json", "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2R3bHNsaGdtd3NhZGxodXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzg0MDYsImV4cCI6MjA3MDkxNDQwNn0.98kX4o5Yl6-mdMFUd7-7RntjeaheQJR0urziwuKdPdA"}',
  '{}'
);
