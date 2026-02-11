-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_price DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  currency TEXT DEFAULT 'NGN',
  invoice_html TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_student_email ON invoices(student_email);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_reference ON invoices(payment_reference);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Add RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own invoices
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE email = student_email
    )
  );

-- Policy: Admins can view all invoices
CREATE POLICY "Admins can view all invoices" ON invoices
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Policy: System can insert invoices
CREATE POLICY "System can insert invoices" ON invoices
  FOR INSERT WITH CHECK (true);

-- Policy: System can update invoices
CREATE POLICY "System can update invoices" ON invoices
  FOR UPDATE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON invoices 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
