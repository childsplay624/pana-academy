-- Migration: Seed Courses SU01 to SU05
-- Domain 9: Sustainability solutions and services
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_su_id UUID;
  v_subcat_decarb_id UUID;
  v_subcat_esg_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 9
  SELECT id INTO v_cat_su_id FROM public.course_categories WHERE slug = 'sustainability-solutions-and-services' OR domain_no = 9 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_decarb_id FROM public.course_subcategories WHERE category_id = v_cat_su_id AND slug = 'decarbonisation-solutions' LIMIT 1;
  IF v_subcat_decarb_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_su_id, 'Decarbonisation solutions', 'decarbonisation-solutions', 1)
    RETURNING id INTO v_subcat_decarb_id;
  END IF;

  SELECT id INTO v_subcat_esg_id FROM public.course_subcategories WHERE category_id = v_cat_su_id AND slug = 'esg-services' LIMIT 1;
  IF v_subcat_esg_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_su_id, 'ESG services', 'esg-services', 2)
    RETURNING id INTO v_subcat_esg_id;
  END IF;

  -- 3. Resolve Instructor Profile
  SELECT id INTO v_instructor_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM public.profiles LIMIT 1;
  END IF;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE 1: SU01 (Greenhouse gas accounting: Scope 1, 2 and 3)
  -- =========================================================================
  v_course_id := 'c9010000-0000-0000-0000-000000000001';
  v_mod1_id := 'd9010001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9010001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9010001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU01', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Greenhouse gas accounting: Scope 1, 2 and 3',
    'A credible greenhouse gas inventory is the starting point for every target, disclosure and carbon finance deal, and auditors now test the numbers closely. This competence course trains practitioners to build Scope 1, 2 and 3 inventories that survive verification.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 1 to 3, Aug 2 to 4. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Set organisational and operational boundaries for a GHG inventory',
      'Calculate Scope 1 emissions from combustion, flaring, venting and fugitives',
      'Calculate location based and market based Scope 2 emissions',
      'Screen and calculate the material Scope 3 categories',
      'Document methods, data quality and uncertainty for verification'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build a Scope 1 and 2 inventory for an oil and gas asset from raw data',
      'Screen Scope 3 categories for a manufacturer',
      'Prepare a verification evidence pack'
    ],
    ARRAY['GHG Protocol Corporate Standard', 'GHG Protocol Scope 3 Standard', 'ISO 14064-1', 'API Compendium', 'IPCC 2006 Guidelines'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-02-01 08:30:00+00', '2027-02-03 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: GHG Accounting Principles & Scope 1 Emissions', 1),
    (v_mod2_id, v_course_id, 'Day 2: Scope 2 Electricity & Renewable Accounting', 2),
    (v_mod3_id, v_course_id, 'Day 3: Scope 3 Value Chain & Data Verification', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9010001-0001-0000-0000-000000000001', v_mod1_id, '1. GHG accounting principles', 'GHG Protocol and ISO 14064-1; Boundaries; Base years', 'text', 240, 1, false),
    ('e9010001-0001-0000-0000-000000000002', v_mod1_id, '2. Scope 1', 'Stationary and mobile combustion; Flaring and venting; Fugitive methane', 'text', 240, 2, false),
    ('e9010001-0002-0000-0000-000000000001', v_mod2_id, '3. Scope 2', 'Location and market based methods; Captive power; Renewable certificates', 'text', 360, 1, false),
    ('e9010001-0003-0000-0000-000000000001', v_mod3_id, '4. Scope 3', 'Category screening; Purchased goods and use of sold products; Supplier data', 'text', 240, 1, false),
    ('e9010001-0003-0000-0000-000000000002', v_mod3_id, '5. Data quality and verification', 'Data management; Uncertainty; Verification readiness and practical test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: SU02 (Methane leak detection and repair with optical gas imaging)
  -- =========================================================================
  v_course_id := 'c9020000-0000-0000-0000-000000000002';
  v_mod1_id := 'd9020001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9020001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9020001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU02', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Methane leak detection and repair with optical gas imaging',
    'Methane leaks are a fast and low cost target for emission cuts, and optical gas imaging cameras let crews see leaks invisible to the eye. This competence course trains LDAR technicians and supervisors to find, quantify, repair and report leaks.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 15 to 17, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain methane sources and leak behaviour in oil and gas facilities',
      'Operate optical gas imaging cameras correctly in field conditions',
      'Carry out LDAR surveys to a written procedure',
      'Estimate leak rates and prioritise repairs',
      'Record and report survey results for regulators and OGMP 2.0'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Carry out an OGI survey on a training rig with controlled leaks',
      'Prioritise and plan repairs for a survey results list',
      'Complete a survey report'
    ],
    ARRAY['EPA OOOOb', 'OGMP 2.0', 'NUPRC methane guidelines', 'ASTM E3240'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-02-15 08:30:00+00', '2027-02-17 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Methane Basics & Optical Gas Imaging', 1),
    (v_mod2_id, v_course_id, 'Day 2: LDAR Survey Routes & Safety Practice', 2),
    (v_mod3_id, v_course_id, 'Day 3: Leak Quantification, Repair & Reporting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9020001-0001-0000-0000-000000000001', v_mod1_id, '1. Methane and LDAR basics', 'Sources; Regulations; LDAR programme design', 'text', 240, 1, false),
    ('e9020001-0001-0000-0000-000000000002', v_mod1_id, '2. Optical gas imaging', 'Camera principles; Settings and limits; Weather effects', 'text', 240, 2, false),
    ('e9020001-0002-0000-0000-000000000001', v_mod2_id, '3. Survey practice', 'Survey routes; Component types; Safety', 'text', 240, 1, false),
    ('e9020001-0003-0000-0000-000000000001', v_mod3_id, '4. Quantification and repair', 'Leak rate estimation; Repair priorities; Repair verification', 'text', 240, 1, false),
    ('e9020001-0003-0000-0000-000000000002', v_mod3_id, '5. Reporting and assessment', 'Records; OGMP reporting; Practical camera test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: SU03 (Flare reduction and flare gas commercialisation)
  -- =========================================================================
  v_course_id := 'c9030000-0000-0000-0000-000000000003';
  v_mod1_id := 'd9030001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9030001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9030001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU03', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Flare reduction and flare gas commercialisation',
    'Flaring wastes gas that could generate power or revenue, and Nigeria''s Flare Gas Commercialisation Programme and global commitments push for routine flaring to end. This course covers flare reduction technology and the commercial routes for flare gas.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 22 to 24, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Measure and characterise flare volumes and composition',
      'Identify routine and non routine flaring causes',
      'Compare flare gas recovery and utilisation technologies',
      'Structure commercial projects for flare gas',
      'Meet regulatory and reporting requirements'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Estimate flare volumes and value for a field',
      'Compare three utilisation options for a flare site'
    ],
    ARRAY['Flare Gas (Prevention of Waste and Pollution) Regulations 2018', 'World Bank Zero Routine Flaring', 'API 521', 'OGMP 2.0'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-02-22 08:30:00+00', '2027-02-24 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Flaring Basics & Operational Reduction', 1),
    (v_mod2_id, v_course_id, 'Day 2: Utilisation Options (Power, CNG, mini LNG & LPG)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Commercial Structures & NGFCP Regulation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9030001-0001-0000-0000-000000000001', v_mod1_id, '1. Flaring basics', 'Flare systems; Routine and safety flaring; Measurement', 'text', 240, 1, false),
    ('e9030001-0001-0000-0000-000000000002', v_mod1_id, '2. Flare reduction', 'Operational fixes; Flare gas recovery units; Compressor reliability', 'text', 240, 2, false),
    ('e9030001-0002-0000-0000-000000000001', v_mod2_id, '3. Utilisation options', 'Power generation; CNG and mini LNG; LPG recovery', 'text', 240, 1, false),
    ('e9030001-0003-0000-0000-000000000001', v_mod3_id, '4. Commercial structures', 'NGFCP model; Offtake and pricing; Financing', 'text', 240, 1, false),
    ('e9030001-0003-0000-0000-000000000002', v_mod3_id, '5. Regulation and reporting', 'Flare penalties; Reporting; Zero Routine Flaring initiative', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: SU04 (Carbon capture, utilisation and storage (CCUS))
  -- =========================================================================
  v_course_id := 'c9040000-0000-0000-0000-000000000004';
  v_mod1_id := 'd9040001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9040001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9040001-0000-0000-0000-000000000003';
  v_mod4_id := 'd9040001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU04', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Carbon capture, utilisation and storage (CCUS)',
    'Carbon capture, utilisation and storage is needed for emissions that cannot be avoided in gas processing, cement, fertiliser and power. This course covers capture technologies, transport, storage, utilisation and project economics.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 24 to 27, Nov 1 to 4. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Compare post combustion, pre combustion and oxyfuel capture',
      'Explain CO2 conditioning, compression and pipeline transport',
      'Describe geological storage and monitoring',
      'Evaluate CO2 utilisation options',
      'Build a CCUS project business case'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'International oil companies and joint ventures',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Size a capture unit for a gas processing plant',
      'Build a CCUS cost per tonne model'
    ],
    ARRAY['ISO 27919-1', 'ISO 27913', 'ISO 27914', 'ISO 27916'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-05-24 08:30:00+00', '2027-05-27 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: CCUS Overview & Capture Technologies', 1),
    (v_mod2_id, v_course_id, 'Day 2: CO2 Conditioning, Compression & Pipeline Transport', 2),
    (v_mod3_id, v_course_id, 'Day 3: Geological Storage, Injection Monitoring & Utilisation', 3),
    (v_mod4_id, v_course_id, 'Day 4: Economics, Carbon Pricing, Credits & Business Models', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9040001-0001-0000-0000-000000000001', v_mod1_id, '1. CCUS overview', 'Role in net zero; Global projects; Policy drivers', 'text', 270, 1, false),
    ('e9040001-0001-0000-0000-000000000002', v_mod1_id, '2. Capture technologies', 'Amine systems; Pre combustion; Oxyfuel and new methods', 'text', 270, 2, false),
    ('e9040001-0002-0000-0000-000000000001', v_mod2_id, '3. Conditioning and transport', 'Compression; Dehydration; Pipelines and ships', 'text', 270, 1, false),
    ('e9040001-0003-0000-0000-000000000001', v_mod3_id, '4. Storage', 'Site types; Injection; Monitoring', 'text', 270, 1, false),
    ('e9040001-0004-0000-0000-000000000001', v_mod4_id, '5. Utilisation', 'EOR; Products; Mineralisation', 'text', 270, 1, false),
    ('e9040001-0004-0000-0000-000000000002', v_mod4_id, '6. Economics and policy', 'Costs; Carbon prices and credits; Business models', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: SU05 (Hydrogen and ammonia value chains)
  -- =========================================================================
  v_course_id := 'c9050000-0000-0000-0000-000000000005';
  v_mod1_id := 'd9050001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9050001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU05', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Hydrogen and ammonia value chains',
    'Hydrogen and ammonia may carry clean energy for industry, shipping and export, and several African countries are planning projects. This course covers production routes, storage, transport, uses, safety and economics.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 10 to 12, Nov 22 to 24. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Compare grey, blue and green hydrogen routes',
      'Explain electrolysis technologies and renewable supply',
      'Describe ammonia synthesis, storage and cracking',
      'Assess hydrogen safety and standards',
      'Evaluate project costs and markets'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Calculate levelised cost of green hydrogen for a solar site',
      'Compare blue and green hydrogen carbon intensity'
    ],
    ARRAY['ISO 22734', 'ISO 19880-1', 'ISO 14687', 'IEA Global Hydrogen Review methods'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-05-10 08:30:00+00', '2027-05-12 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Hydrogen Basics, Production & Electrolysis', 1),
    (v_mod2_id, v_course_id, 'Day 2: Ammonia Synthesis, Storage & Shipping', 2),
    (v_mod3_id, v_course_id, 'Day 3: Safety, Standards, Economics & African Markets', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9050001-0001-0000-0000-000000000001', v_mod1_id, '1. Hydrogen basics', 'Properties; Colours and carbon intensity; Demand sectors', 'text', 240, 1, false),
    ('e9050001-0001-0000-0000-000000000002', v_mod1_id, '2. Production', 'Steam methane reforming with capture; Electrolysers; Renewable integration', 'text', 240, 2, false),
    ('e9050001-0002-0000-0000-000000000001', v_mod2_id, '3. Ammonia', 'Synthesis; Storage and shipping; Ammonia as fuel', 'text', 240, 1, false),
    ('e9050001-0003-0000-0000-000000000001', v_mod3_id, '4. Safety and standards', 'Hazards; Codes; Certification of low carbon hydrogen', 'text', 240, 1, false),
    ('e9050001-0003-0000-0000-000000000002', v_mod3_id, '5. Economics and markets', 'Cost drivers; Export projects; African opportunities', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
