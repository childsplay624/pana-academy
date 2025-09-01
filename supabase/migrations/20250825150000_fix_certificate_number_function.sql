-- Drop the existing trigger first
DROP TRIGGER IF EXISTS set_certificate_number ON public.certificates;

-- Drop the existing function
DROP FUNCTION IF EXISTS generate_certificate_number();

-- Recreate the function with the correct return type
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.certificate_number := 'CERT-' || 
                             TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                             SUBSTRING(REPLACE(CAST(NEW.id AS TEXT), '-', ''), 1, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER set_certificate_number
BEFORE INSERT ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION generate_certificate_number();
