-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  full_bio text,
  experience jsonb DEFAULT '[]',
  image_key text REFERENCES public.site_images(key),
  category text NOT NULL CHECK (category IN ('board', 'advisory')),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_members_category ON public.team_members(category);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public can view active team members
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view active team members') THEN
        CREATE POLICY "Public can view active team members" ON public.team_members FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Admins can manage all team members
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage team members') THEN
        CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (
          EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
    END IF;
END $$;

-- Create trigger for updated_at (assuming function exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_team_members_updated_at') THEN
        CREATE TRIGGER update_team_members_updated_at
          BEFORE UPDATE ON public.team_members
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Seed with initial data from TeamPage.tsx
-- Note: image_key updated to match site_images migration keys
INSERT INTO public.team_members (slug, name, title, subtitle, description, full_bio, experience, image_key, category, display_order, is_active)
VALUES 
  ('daere-akobo', 'Dr. Daere Afonya-a Akobo, FCIoD (London)', 'Chairman and Group CEO', 'PANA Holdings', 'Visionary entrepreneur and business leader with over 25 years of experience across multiple industries including oil & gas, power, and technology.', 'Dr. Daere Akobo, FCIoD (London) is a visionary entrepreneur, business mentor, and philanthropist celebrated for his unwavering commitment to excellence and innovation. As the Chairman and Group CEO of PANA Holdings, he oversees a dynamic portfolio of companies, including PE Energy Ltd, Synergy E&P Ltd, AKD Digital Solutions, PE Goldland, PANA Institute, PANA Infrastructure, Afriksnus, Ataraxia, Diplomatic Village Limited (DVL), and the Daere Afonya-a Akobo Foundation (DAAF). Through DAAF, Dr. Akobo is deeply dedicated to giving back to the community, empowering the less privileged, and driving meaningful social impact. In business, his bold, creative, and innovative mindset enables him to tackle complex challenges, deliver transformative solutions, and inspire growth across industries.', '["Over 25 years of experience in electrical engineering and flow measurement", "Former Electrical and Instrumentation Superintendent at International Petroleum of Nigeria", "Recognized as African Continental Top Talent at General Electric (GE)", "Extensive business portfolio across multiple industries including power, water technology, and IT"]', 'team_daere_akobo', 'board', 1, true),
  ('iyenemi-akobo', 'Mrs. Iyenemi Akobo', 'Executive Director', 'Global Business Services', 'Seasoned business administrator with international training and expertise in corporate governance and business administration.', 'Mrs. Iyenemi Akobo has been the backbone of the entire organization since its inception. With a background in Business Administration and CLE training in various international institutions in London, Dubai, Switzerland and Harvard, she is an alumna of the prestigious IMD Business School. She is a central figure in the administration of the group and a valued contributor to the growth of the business structure. She has held and efficiently managed key positions enabling and spurring the growth vision of the Chairman. She is the Executive Director (ED) for the Global Business Services unit, additionally supervising HR, Commercial Services and part of the Accounting functions. She became a director of the company in 2015 and rose to the position of Deputy Managing Director from 2018 to August 2022 (Retirement date). In addition, she held the position of General Manager Human Resources & Organization of the Company from 2015 to 2022. She is the first female to hold the position in the over 60 years of existence of the Company. She won the award of the first Nigerian Content Operator of the year for the Company and received the PETAN Chairman''s Outstanding Achievement Recognition Award for Nigerian content in 2015. She was also a director of the Nigerian Agip Closed Pension Fund Ltd from 2015 to August 2022.', '["Former Deputy Managing Director, Nigerian Agip Oil Company Limited (NAOC)", "Over 25 years of experience in the oil and gas industry", "Fellow of the Institute of Chartered Accountants of Nigeria", "Recipient of PETAN Chairman''s Outstanding Achievement Recognition Award"]', 'team_iyenemi_akobo', 'board', 2, true),
  ('callista-azogu', 'Mrs. Callista C. Azogu', 'Board Member', 'Former Deputy Managing Director, NAOC', 'Accomplished executive with extensive experience in the oil and gas industry, specializing in finance, HR, and corporate governance.', 'Mrs. Callista C. Azogu attended FGGC Gboko and University of Ilorin, bagging MSc. in Managerial Accounting, BSc. Accounting & Finance. She joined Nigerian Agip Oil Company Limited (NAOC) in August 1996 as a Budget Analyst and rose through the ranks working through various professional areas in the Oil and Gas sector within the Eni (''AGIP'') group locally and abroad. Her experiences span topmost level industry advocacy, Accounting, Finance, Nigerian content, Human Resources, Administration, and Commercial. She became a director of the company in 2015 and rose to the position of Deputy Managing Director from 2018 to August 2022 (Retirement date). In addition, she held the position of General Manager Human Resources & Organization of the Company from 2015 to 2022. She is the first female to hold the position in the over 60 years of existence of the Company. She won the award of the first Nigerian Content Operator of the year for the Company and received the PETAN Chairman''s Outstanding Achievement Recognition Award for Nigerian content in 2015. She was also a director of the Nigerian Agip Closed Pension Fund Ltd from 2015 to August 2022.', '["Former Deputy Managing Director, Nigerian Agip Oil Company Limited (NAOC)", "Over 25 years of experience in the oil and gas industry", "Fellow of the Institute of Chartered Accountants of Nigeria", "Recipient of PETAN Chairman''s Outstanding Achievement Recognition Award"]', 'team_callista_azogu', 'board', 3, true),
  ('kennedy-dike', 'Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI', 'Advisory Board Member', 'PANA Institute', 'Seasoned HR practitioner with vast experience in Oil & Gas, Manufacturing, and Corporate Governance.', 'Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI is a seasoned Human Resources practitioner with vast experience spanning Oil & Gas, Manufacturing, Shipping, International Freight Logistics, Business Sustainability and Corporate governance. As certified HR Manager, he is licensed to practice Human Resources in Nigeria by the Chartered Institute of Personnel Management (CIPMN) the apex regulatory body for human resources practice Nigeria. He is also a member of the Society for Corporate Governance in Nigeria and currently the GM, Global Business Services PANA Holdings. Before joining PANA Holdings, he worked for Belemaoil Producing Ltd, Notore Chemical Industries Plc, The Oiltest Group and Ideke Shipping Ltd working in partnership with Hellmann Worldwide Logistics. Mr. Dike had served as a member of the Governing Council of the University of Calabar and Governing Council of the Chartered Institute of Personnel Management Nigeria (CIPMN). He is presently a member of the Board of Trustees of a number of organizations. He is the Rivers State Branch Chairman of Learning & Development Network International LDNI; Fellow Mentoring and Career Development Institute of Nigeria; Fellow, Institute of Strategic Management Nigeria (Chartered) and Fellow Chartered Business Institute London.', '["GM, Global Business Services PANA Holdings", "Former member of Governing Council, University of Calabar", "Fellow, Institute of Strategic Management Nigeria", "Extensive experience in HR, corporate governance, and business sustainability"]', 'team_kennedy_dike', 'advisory', 4, true),
  ('ifeyinwa-achumba', 'Dr. Ifeyinwa Eucharia Achumba', 'Advisory Board Member', 'MNCS, MNSE, COREN Reg, CPN Reg, MIEEE, FFTF Fellow', 'Experienced academic and industry professional with expertise in STEM education and industry-academia partnerships.', 'Dr. Ifeyinwa Eucharia Achumba is an accomplished academic and industry professional with over twenty-five years of university service in various capacities including Head of Department (Electrical and Electronic Engineering), Head of Department (Computer Engineering), University Senate member, and Director of Information and Communication Technology (DICT). Her teaching efforts are geared towards producing graduate entrepreneurs and industry-ready graduates. She is a passionate advocate for Academia-Industry Partnerships (AIP) and a strong proponent of increasing female participation in STEM fields.', '["Over 25 years of university service in various academic and administrative roles", "PhD from the University of Portsmouth, United Kingdom with Postdoctoral research experience", "Current Chair of the Institute of Electrical and Electronic Engineers (IEEE) Nigeria Section", "Intellectual Property Commissioner for Oil and Gas Trainers Association of Nigeria (OGTAN)", "Active participant in Oil & Gas National Occupational Standards (NOS) development", "Member of the Sector Working Group (SWG) on Education for NCDMB"]', 'team_ifeyinwa_eucharia', 'advisory', 5, true)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  full_bio = EXCLUDED.full_bio,
  experience = EXCLUDED.experience,
  image_key = EXCLUDED.image_key,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();
