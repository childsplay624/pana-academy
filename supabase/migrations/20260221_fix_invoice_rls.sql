-- Fix RLS policies for invoices table to match the platform's role system
DROP POLICY IF EXISTS "Admins can view all invoices" ON invoices;
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;

-- Policy: Admins can view all invoices
CREATE POLICY "Admins can view all invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Users can view their own invoices (using profile email)
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND email = student_email
    )
  );
