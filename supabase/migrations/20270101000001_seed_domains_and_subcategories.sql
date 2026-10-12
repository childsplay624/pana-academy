-- ==============================================================================
-- Self-Contained Migration & Seed Script:
-- 10 Domains & 45 Course Areas (Sub-categories)
-- PANA Institute - Academic Catalog 2027
-- ==============================================================================

-- 1. Ensure columns exist on course_categories
ALTER TABLE public.course_categories
ADD COLUMN IF NOT EXISTS domain_no INTEGER,
ADD COLUMN IF NOT EXISTS code_prefix TEXT,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE;

-- 2. Ensure course_subcategories table exists
CREATE TABLE IF NOT EXISTS public.course_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.course_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_category_subcategory_slug UNIQUE (category_id, slug)
);

-- Enable RLS for course_subcategories
ALTER TABLE public.course_subcategories ENABLE ROW LEVEL SECURITY;

-- Public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'course_subcategories' AND policyname = 'Public can view course subcategories'
  ) THEN
    CREATE POLICY "Public can view course subcategories" ON public.course_subcategories
      FOR SELECT USING (true);
  END IF;
END $$;

-- Admin write access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'course_subcategories' AND policyname = 'Admins can manage course subcategories'
  ) THEN
    CREATE POLICY "Admins can manage course subcategories" ON public.course_subcategories
      FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 3. Ensure course columns exist
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS domain_no INTEGER,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.course_subcategories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS course_area TEXT;

-- 4. Seed the 10 Domains and 45 Course Areas (Sub-categories)
DO $$
DECLARE
  v_cat_pd UUID;
  v_cat_va UUID;
  v_cat_ad UUID;
  v_cat_mm UUID;
  v_cat_ex UUID;
  v_cat_ep UUID;
  v_cat_pr UUID;
  v_cat_ms UUID;
  v_cat_su UUID;
  v_cat_sc UUID;
BEGIN

  -- ---------------------------------------------------------------------------
  -- DOMAIN 1: Power and drives (PD)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Power and drives', 'power-and-drives', 'Compression, turbomachinery, electrical power systems, pumps and VSD systems.', 1, 'PD', 1)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 1, code_prefix = 'PD', display_order = 1, name = EXCLUDED.name
  RETURNING id INTO v_cat_pd;

  IF v_cat_pd IS NULL THEN
    SELECT id INTO v_cat_pd FROM public.course_categories WHERE slug = 'power-and-drives';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_pd, 'Compression and turbomachinery', 'compression-and-turbomachinery', 1),
    (v_cat_pd, 'Electrical power systems (LV and MV)', 'electrical-power-systems-lv-and-mv', 2),
    (v_cat_pd, 'Pumping systems', 'pumping-systems', 3),
    (v_cat_pd, 'Packaged and engineered systems', 'packaged-and-engineered-systems', 4)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 2: Valves and actuation (VA)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Valves and actuation', 'valves-and-actuation', 'Industrial valves, control valve diagnostics, axial flow, safety relief, and subsea valves.', 2, 'VA', 2)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 2, code_prefix = 'VA', display_order = 2, name = EXCLUDED.name
  RETURNING id INTO v_cat_va;

  IF v_cat_va IS NULL THEN
    SELECT id INTO v_cat_va FROM public.course_categories WHERE slug = 'valves-and-actuation';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_va, 'Standard and industrial valves', 'standard-and-industrial-valves', 1),
    (v_cat_va, 'High performance control', 'high-performance-control', 2),
    (v_cat_va, 'Axial flow and safety', 'axial-flow-and-safety', 3),
    (v_cat_va, 'Actuation and flow control', 'actuation-and-flow-control', 4),
    (v_cat_va, 'Severe and specialised service valves', 'severe-and-specialised-service-valves', 5)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 3: Integrated automation and digital operations (AD)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Integrated automation and digital operations', 'integrated-automation-and-digital-operations', 'ICSS, digital twins, plant intelligence, OT cybersecurity, and process instrumentation.', 3, 'AD', 3)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 3, code_prefix = 'AD', display_order = 3, name = EXCLUDED.name
  RETURNING id INTO v_cat_ad;

  IF v_cat_ad IS NULL THEN
    SELECT id INTO v_cat_ad FROM public.course_categories WHERE slug = 'integrated-automation-and-digital-operations';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_ad, 'Automation and ICSS', 'automation-and-icss', 1),
    (v_cat_ad, 'Digital operations and plant intelligence', 'digital-operations-and-plant-intelligence', 2),
    (v_cat_ad, 'Industrial networks, cybersecurity and control rooms', 'industrial-networks-cybersecurity-and-control-rooms', 3),
    (v_cat_ad, 'Electrical and instrumentation', 'electrical-and-instrumentation', 4)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 4: Measurement and management (MM)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Measurement and management', 'measurement-and-management', 'Custody transfer, flow metering, fiscal allocation, proving systems, and emissions accounting.', 4, 'MM', 4)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 4, code_prefix = 'MM', display_order = 4, name = EXCLUDED.name
  RETURNING id INTO v_cat_mm;

  IF v_cat_mm IS NULL THEN
    SELECT id INTO v_cat_mm FROM public.course_categories WHERE slug = 'measurement-and-management';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_mm, 'Custody transfer metering systems', 'custody-transfer-metering-systems', 1),
    (v_cat_mm, 'Flow metering', 'flow-metering', 2),
    (v_cat_mm, 'Electricity and energy metering', 'electricity-and-energy-metering', 3),
    (v_cat_mm, 'Level, pressure and temperature instrumentation', 'level-pressure-and-temperature-instrumentation', 4),
    (v_cat_mm, 'Meter proving and calibration systems', 'meter-proving-and-calibration-systems', 5),
    (v_cat_mm, 'Measurement data acquisition and reporting', 'measurement-data-acquisition-and-reporting', 6),
    (v_cat_mm, 'Measurement uncertainty and assurance', 'measurement-uncertainty-and-assurance', 7)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 5: EPiiMtce field operations and lifecycle services (EX)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('EPiiMtce field operations and lifecycle services', 'field-operations-and-lifecycle-services', 'Field operations excellence (THE FOx), long-term service agreements, multivendor systems, and asset management.', 5, 'EX', 5)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 5, code_prefix = 'EX', display_order = 5, name = EXCLUDED.name
  RETURNING id INTO v_cat_ex;

  IF v_cat_ex IS NULL THEN
    SELECT id INTO v_cat_ex FROM public.course_categories WHERE slug = 'field-operations-and-lifecycle-services';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_ex, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox', 1),
    (v_cat_ex, 'Long term service and technical agreements (LSTA)', 'long-term-service-and-technical-agreements-lsta', 2),
    (v_cat_ex, 'Multivendor systems integration', 'multivendor-systems-integration', 3),
    (v_cat_ex, 'Project delivery and installation', 'project-delivery-and-installation', 4),
    (v_cat_ex, 'Performance optimisation and upgrades', 'performance-optimisation-and-upgrades', 5),
    (v_cat_ex, 'Lifecycle services and performance assurance', 'lifecycle-services-and-performance-assurance', 6),
    (v_cat_ex, 'Gas projects delivery', 'gas-projects-delivery', 7)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 6: Exploration (oil, gas and mining) (EP)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Exploration (oil, gas and mining)', 'exploration-oil-gas-and-mining', 'Seismic data acquisition, OSDU data integration, subsurface interpretation, and geological visualization.', 6, 'EP', 6)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 6, code_prefix = 'EP', display_order = 6, name = EXCLUDED.name
  RETURNING id INTO v_cat_ep;

  IF v_cat_ep IS NULL THEN
    SELECT id INTO v_cat_ep FROM public.course_categories WHERE slug = 'exploration-oil-gas-and-mining';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_ep, 'Data acquisition', 'data-acquisition', 1),
    (v_cat_ep, 'Data integration', 'data-integration', 2),
    (v_cat_ep, 'Data interpretation', 'data-interpretation', 3),
    (v_cat_ep, 'Data display', 'data-display', 4)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 7: Production (PR)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Production', 'production', 'Enhanced oil recovery, process water chemistry, production chemicals, and artificial lift.', 7, 'PR', 7)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 7, code_prefix = 'PR', display_order = 7, name = EXCLUDED.name
  RETURNING id INTO v_cat_pr;

  IF v_cat_pr IS NULL THEN
    SELECT id INTO v_cat_pr FROM public.course_categories WHERE slug = 'production';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_pr, 'Enhanced oil recovery (EOR)', 'enhanced-oil-recovery-eor', 1),
    (v_cat_pr, 'Water and process chemicals', 'water-and-process-chemicals', 2),
    (v_cat_pr, 'Production chemicals', 'production-chemicals', 3),
    (v_cat_pr, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox-production', 4)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 8: Marine and subsea (MS)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Marine and subsea', 'marine-and-subsea', 'Offshore marine operations, FPSO integrity, subsea manifolds, pipelines, and the blue economy.', 8, 'MS', 8)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 8, code_prefix = 'MS', display_order = 8, name = EXCLUDED.name
  RETURNING id INTO v_cat_ms;

  IF v_cat_ms IS NULL THEN
    SELECT id INTO v_cat_ms FROM public.course_categories WHERE slug = 'marine-and-subsea';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_ms, 'Marine operations', 'marine-operations', 1),
    (v_cat_ms, 'Subsea', 'subsea', 2),
    (v_cat_ms, 'Blue economy', 'blue-economy', 3)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 9: Sustainability solutions and services (SU)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Sustainability solutions and services', 'sustainability-solutions-and-services', 'Decarbonisation roadmaps, CCUS, hydrogen, methane leak detection, and IFRS/GRI ESG reporting.', 9, 'SU', 9)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 9, code_prefix = 'SU', display_order = 9, name = EXCLUDED.name
  RETURNING id INTO v_cat_su;

  IF v_cat_su IS NULL THEN
    SELECT id INTO v_cat_su FROM public.course_categories WHERE slug = 'sustainability-solutions-and-services';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_su, 'Decarbonisation solutions', 'decarbonisation-solutions', 1),
    (v_cat_su, 'ESG services', 'esg-services', 2)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

  -- ---------------------------------------------------------------------------
  -- DOMAIN 10: Supply chain management (SC)
  -- ---------------------------------------------------------------------------
  INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
  VALUES ('Supply chain management', 'supply-chain-management', 'MRO inventory optimisation, critical spares, ISO 8000 master data, procurement, and dangerous goods logistics.', 10, 'SC', 10)
  ON CONFLICT (slug) DO UPDATE 
    SET domain_no = 10, code_prefix = 'SC', display_order = 10, name = EXCLUDED.name
  RETURNING id INTO v_cat_sc;

  IF v_cat_sc IS NULL THEN
    SELECT id INTO v_cat_sc FROM public.course_categories WHERE slug = 'supply-chain-management';
  END IF;

  INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
  VALUES
    (v_cat_sc, 'MROs, spares and critical equipment safety', 'mros-spares-and-critical-equipment-safety', 1),
    (v_cat_sc, 'Procurement and contracting', 'procurement-and-contracting', 2),
    (v_cat_sc, 'Logistics, warehousing and inventory optimisation', 'logistics-warehousing-and-inventory-optimisation', 3)
  ON CONFLICT (category_id, slug) DO UPDATE SET name = EXCLUDED.name, display_order = EXCLUDED.display_order;

END $$;
