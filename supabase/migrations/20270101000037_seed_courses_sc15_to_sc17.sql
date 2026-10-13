-- =============================================================================
-- Migration: 20270101000037_seed_courses_sc15_to_sc17.sql
-- Description: Seed Domain 10 (Supply chain management) courses SC15 to SC17
--              SC15: Customs and import procedures for project cargo
--              SC16: Dangerous goods handling and transport: IMDG, IATA and ADR
--              SC17: Sustainable procurement and supplier emissions data
-- =============================================================================

DO $$
DECLARE
  v_instructor_id UUID;
  v_cat_sc_id UUID;
  v_subcat_proc_id UUID;
  v_subcat_logistics_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
BEGIN
  -- Category: Supply chain management
  SELECT id INTO v_cat_sc_id
  FROM public.course_categories
  WHERE slug = 'supply-chain-management'
  LIMIT 1;

  -- Subcategory: Procurement and contracting
  SELECT id INTO v_subcat_proc_id
  FROM public.course_subcategories
  WHERE slug = 'procurement-and-contracting'
  LIMIT 1;

  -- Subcategory: Logistics, warehousing and inventory optimisation
  SELECT id INTO v_subcat_logistics_id
  FROM public.course_subcategories
  WHERE slug = 'logistics-warehousing-and-inventory-optimisation'
  LIMIT 1;

  -- Default instructor (Admin/PANA)
  SELECT id INTO v_instructor_id
  FROM auth.users
  WHERE email LIKE '%pana%' OR email LIKE '%admin%'
  LIMIT 1;

  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE 1: SC15 (Customs and import procedures for project cargo)
  -- =========================================================================
  v_course_id := 'c1015000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1015001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1015001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC15', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'Customs and import procedures for project cargo',
    'Project cargo for energy projects often waits weeks at Nigerian ports because of documentation, classification or permit problems. This short course covers customs and import procedures that keep project cargo moving and costs under control.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 12, Jul 26 to 27. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain Nigeria Customs Service procedures for project cargo',
      'Classify goods under the harmonised system and apply correct duties',
      'Prepare import documentation and permits',
      'Use duty exemptions and temporary import regimes correctly',
      'Plan clearance to avoid demurrage'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Classify and prepare documents for a compressor package import',
      'Build a clearance plan for a heavy lift shipment'
    ],
    ARRAY['Nigeria Customs Service Act 2023', 'WCO Harmonized System', 'Incoterms 2020', 'WCO SAFE Framework'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-01-11 08:30:00+00', '2027-01-12 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    subcategory_id = EXCLUDED.subcategory_id,
    course_area = EXCLUDED.course_area,
    level = EXCLUDED.level,
    duration_hours = EXCLUDED.duration_hours,
    award = EXCLUDED.award,
    delivery_options = EXCLUDED.delivery_options,
    learning_outcomes = EXCLUDED.learning_outcomes,
    requirements = EXCLUDED.requirements,
    target_audience = EXCLUDED.target_audience,
    practical_work = EXCLUDED.practical_work,
    standards = EXCLUDED.standards,
    oem_partners = EXCLUDED.oem_partners,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Customs Framework, Classification & Valuation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Documentation, Permits, Exemptions & Clearance Planning', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1015001-0001-0000-0000-000000000001', v_mod1_id, '1. Customs framework', 'Nigeria Customs Service Act 2023; Agencies at the port; Single window', 'text', 210, 1, false),
    ('e1015001-0001-0000-0000-000000000002', v_mod1_id, '2. Classification and valuation', 'HS codes; Valuation rules; Duties and levies', 'text', 210, 2, false),
    ('e1015001-0002-0000-0000-000000000001', v_mod2_id, '3. Documentation and permits', 'Form M; Permits and certificates; Pre arrival processing', 'text', 210, 1, false),
    ('e1015001-0002-0000-0000-000000000002', v_mod2_id, '4. Exemptions and clearance planning', 'Duty waivers; Temporary import; Demurrage avoidance', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: SC16 (Dangerous goods handling and transport: IMDG, IATA and ADR)
  -- =========================================================================
  v_course_id := 'c1016000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1016001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1016001-0000-0000-0000-000000000002';
  v_mod3_id := 'd1016001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC16', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'Dangerous goods handling and transport: IMDG, IATA and ADR',
    'Dangerous goods such as chemicals, gas cylinders, batteries and radioactive sources must be packed, labelled and documented correctly for every mode of transport. This foundation course covers IMDG, IATA and ADR rules and prepares candidates for dangerous goods certification.',
    v_instructor_id, 'beginner', 'onsite', 21,
    'Exam prep', 'Up to 16 participants',
    'Public sessions: Mar 8 to 10, Sep 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Classify dangerous goods into the nine UN classes',
      'Select packaging, marking and labelling for each mode',
      'Complete dangerous goods declarations',
      'Apply segregation and stowage rules',
      'Respond to dangerous goods incidents'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Classify and prepare documentation for five consignments by sea, air and road',
      'Sit a mock certification examination'
    ],
    ARRAY['IMDG Code', 'IATA Dangerous Goods Regulations', 'ADR', 'UN Model Regulations'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-03-08 08:30:00+00', '2027-03-10 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    subcategory_id = EXCLUDED.subcategory_id,
    course_area = EXCLUDED.course_area,
    level = EXCLUDED.level,
    duration_hours = EXCLUDED.duration_hours,
    award = EXCLUDED.award,
    delivery_options = EXCLUDED.delivery_options,
    learning_outcomes = EXCLUDED.learning_outcomes,
    requirements = EXCLUDED.requirements,
    target_audience = EXCLUDED.target_audience,
    practical_work = EXCLUDED.practical_work,
    standards = EXCLUDED.standards,
    oem_partners = EXCLUDED.oem_partners,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Dangerous Goods Basics, Packaging, Marking & Labelling', 1),
    (v_mod2_id, v_course_id, 'Day 2: Documentation & Declarations Across Modes', 2),
    (v_mod3_id, v_course_id, 'Day 3: Segregation, Stowage & Examination Preparation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1016001-0001-0000-0000-000000000001', v_mod1_id, '1. Dangerous goods basics', 'UN classes; UN numbers; Regulations by mode', 'text', 240, 1, false),
    ('e1016001-0001-0000-0000-000000000002', v_mod1_id, '2. Packaging, marking and labelling', 'Packaging groups; Marks and labels; Limited quantities', 'text', 240, 2, false),
    ('e1016001-0002-0000-0000-000000000001', v_mod2_id, '3. Documentation', 'Declarations; Emergency information; Records', 'text', 240, 1, false),
    ('e1016001-0003-0000-0000-000000000001', v_mod3_id, '4. Segregation and handling', 'Segregation tables; Stowage; Incident response', 'text', 240, 1, false),
    ('e1016001-0003-0000-0000-000000000002', v_mod3_id, '5. Examination preparation', 'Mode specific rules; Mock examination; Review', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: SC17 (Sustainable procurement and supplier emissions data)
  -- =========================================================================
  v_course_id := 'c1017000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1017001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1017001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC17', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Sustainable procurement and supplier emissions data',
    'Most of an energy company’s emissions sit in its supply chain, and buyers now ask suppliers for emissions data. This short course covers sustainable procurement and supplier engagement on emissions.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site.',
    ARRAY[
      'Apply ISO 20400 sustainable procurement principles',
      'Build supplier emissions data requests',
      'Assess supplier sustainability performance',
      'Include sustainability criteria in tenders',
      'Track Scope 3 progress with suppliers'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Sustainability, ESG and energy transition teams',
      'Manufacturing, cement, food, beverage and mining',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build supplier emissions criteria for a tender',
      'Assess three supplier responses'
    ],
    ARRAY['ISO 20400', 'GHG Protocol Scope 3 Standard', 'CDP supply chain guidance'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    NULL, NULL,
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    subcategory_id = EXCLUDED.subcategory_id,
    course_area = EXCLUDED.course_area,
    level = EXCLUDED.level,
    duration_hours = EXCLUDED.duration_hours,
    award = EXCLUDED.award,
    delivery_options = EXCLUDED.delivery_options,
    learning_outcomes = EXCLUDED.learning_outcomes,
    requirements = EXCLUDED.requirements,
    target_audience = EXCLUDED.target_audience,
    practical_work = EXCLUDED.practical_work,
    standards = EXCLUDED.standards,
    oem_partners = EXCLUDED.oem_partners,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Sustainable Procurement & Supplier Emissions Data', 1),
    (v_mod2_id, v_course_id, 'Day 2: Supplier Assessment, Tenders & Scope 3 Tracking', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1017001-0001-0000-0000-000000000001', v_mod1_id, '1. Sustainable procurement', 'ISO 20400; Policy; Risks', 'text', 210, 1, false),
    ('e1017001-0001-0000-0000-000000000002', v_mod1_id, '2. Supplier emissions data', 'Data requests; Quality; Platforms', 'text', 210, 2, false),
    ('e1017001-0002-0000-0000-000000000001', v_mod2_id, '3. Supplier assessment', 'Questionnaires; Scoring; Audits', 'text', 210, 1, false),
    ('e1017001-0002-0000-0000-000000000002', v_mod2_id, '4. Tenders and tracking', 'Criteria and weighting; Contract clauses; Scope 3 tracking', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
