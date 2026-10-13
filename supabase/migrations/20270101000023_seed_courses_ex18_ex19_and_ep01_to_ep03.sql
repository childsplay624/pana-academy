-- Migration: Seed Courses EX18 to EX19 and EP01 to EP03
-- Domains 5 (EPMICE Field Operations and Lifecycle Services) & 6 (Exploration - Oil, Gas and Mining)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ex_id UUID;
  v_cat_ep_id UUID;
  v_subcat_gas_id UUID;
  v_subcat_ep_acq_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Categories
  SELECT id INTO v_cat_ex_id FROM public.course_categories WHERE slug = 'field-operations-and-lifecycle-services' OR domain_no = 5 LIMIT 1;
  SELECT id INTO v_cat_ep_id FROM public.course_categories WHERE slug = 'exploration-oil-gas-and-mining' OR domain_no = 6 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_gas_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'gas-projects-delivery' LIMIT 1;
  IF v_subcat_gas_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Gas projects delivery', 'gas-projects-delivery', 7)
    RETURNING id INTO v_subcat_gas_id;
  END IF;

  SELECT id INTO v_subcat_ep_acq_id FROM public.course_subcategories WHERE category_id = v_cat_ep_id AND slug = 'data-acquisition' LIMIT 1;
  IF v_subcat_ep_acq_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ep_id, 'Data acquisition', 'data-acquisition', 1)
    RETURNING id INTO v_subcat_ep_acq_id;
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
  -- COURSE 1: EX18 (Gas to power and domestic gas project delivery)
  -- =========================================================================
  v_course_id := 'cb180000-0000-0000-0000-000000000018';
  v_mod1_id := 'db180001-0000-0000-0000-000000000001';
  v_mod2_id := 'db180001-0000-0000-0000-000000000002';
  v_mod3_id := 'db180001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX18', 5, 'general_technical', v_cat_ex_id, v_subcat_gas_id, 'Gas projects delivery',
    'Gas to power and domestic gas project delivery',
    'Domestic gas supply and gas to power projects are central to Nigeria''s gas expansion plans, yet many stall on commercial structure, gas supply or payment risk rather than engineering. This course explains how these projects are structured, contracted, financed and delivered, from wellhead to power plant.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 28 to 30, Dec 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the gas to power and domestic gas value chain and its interfaces',
      'Explain gas sales, transportation and power purchase agreements and how they connect',
      'Plan pipeline, processing and power plant delivery schedules',
      'Identify regulatory, payment and supply risks and their mitigations',
      'Apply lessons from recent African gas to power projects'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Map interfaces and risks for a gas to power project',
      'Build a simple supply and demand balance for a power plant'
    ],
    ARRAY['Petroleum Industry Act 2021', 'NERC regulations', 'ISO 21500', 'Domestic Gas Delivery Obligation regulations'],
    ARRAY['Baker Hughes', 'Siemens', 'GE Vernova', 'Thomassen Energy', 'Petronash', 'Rotork', 'Mokveld', 'Valmet'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Gas to Power Value Chain & Commercial Structures', 1),
    (v_mod2_id, v_course_id, 'Day 2: Infrastructure Delivery & Schedule Integration', 2),
    (v_mod3_id, v_course_id, 'Day 3: Regulation, Financing & African Case Studies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb180001-0001-0000-0000-000000000001', v_mod1_id, '1. Value chain and market', 'Gas supply and processing; Transport and distribution; Power generation and offtake', 'text', 270, 1, false),
    ('eb180001-0001-0000-0000-000000000002', v_mod1_id, '2. Commercial structures', 'Gas sales agreements; Transportation agreements; Power purchase agreements and guarantees', 'text', 270, 2, false),
    ('eb180001-0002-0000-0000-000000000001', v_mod2_id, '3. Project delivery', 'Pipelines and metering; Power plant options; Schedule integration', 'text', 270, 1, false),
    ('eb180001-0003-0000-0000-000000000001', v_mod3_id, '4. Regulation and finance', 'Licences under the Petroleum Industry Act; Tariffs; Financing and payment security', 'text', 270, 1, false),
    ('eb180001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Successful and stalled projects; Lessons learned', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EX19 (CNG and small scale LNG distribution systems)
  -- =========================================================================
  v_course_id := 'cb190000-0000-0000-0000-000000000019';
  v_mod1_id := 'db190001-0000-0000-0000-000000000001';
  v_mod2_id := 'db190001-0000-0000-0000-000000000002';
  v_mod3_id := 'db190001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX19', 5, 'general_technical', v_cat_ex_id, v_subcat_gas_id, 'Gas projects delivery',
    'CNG and small scale LNG distribution systems',
    'Compressed natural gas and small scale LNG bring gas to industries, fleets and towns far from pipelines, and national programmes are expanding CNG for transport. This course covers the technology, safety, logistics and economics of virtual pipeline systems.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 12 to 14, Oct 18 to 20. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain CNG and small scale LNG supply chains from source to user',
      'Describe mother, daughter and online station designs',
      'Plan trailer logistics and storage for a cluster of customers',
      'Apply safety codes for CNG and LNG stations',
      'Compare costs of CNG, LNG and pipeline supply'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Plan a CNG virtual pipeline for five industrial customers',
      'Compare CNG and small scale LNG costs for a remote town'
    ],
    ARRAY['ISO 15403', 'NFPA 52', 'NFPA 59A', 'ISO 11439'],
    ARRAY['Baker Hughes', 'Siemens', 'GE Vernova', 'Thomassen Energy', 'Petronash', 'Rotork', 'Mokveld', 'Valmet'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: CNG Technology & Small Scale LNG Systems', 1),
    (v_mod2_id, v_course_id, 'Day 2: Station Design, Safety Distances & Emergency Systems', 2),
    (v_mod3_id, v_course_id, 'Day 3: Logistics, Economics & Market Regulation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb190001-0001-0000-0000-000000000001', v_mod1_id, '1. CNG technology', 'Compression; Cylinder and cascade storage; Dispensing and vehicle conversion', 'text', 240, 1, false),
    ('eb190001-0001-0000-0000-000000000002', v_mod1_id, '2. Small scale LNG', 'Liquefaction options; ISO containers and trucks; Regasification', 'text', 240, 2, false),
    ('eb190001-0002-0000-0000-000000000001', v_mod2_id, '3. Station design and safety', 'Layouts and separation distances; Hazardous areas; Emergency systems', 'text', 240, 1, false),
    ('eb190001-0003-0000-0000-000000000001', v_mod3_id, '4. Logistics and economics', 'Trailer scheduling; Cost per unit delivered; Business models', 'text', 240, 1, false),
    ('eb190001-0003-0000-0000-000000000002', v_mod3_id, '5. Market and regulation', 'Customer segments; Licensing; National CNG programmes', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EP01 (Seismic data acquisition: land, transition zone and marine)
  -- =========================================================================
  v_course_id := 'cc010000-0000-0000-0000-000000000001';
  v_mod1_id := 'dc010001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc010001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc010001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc010001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP01', 6, 'general_technical', v_cat_ep_id, v_subcat_ep_acq_id, 'Data acquisition',
    'Seismic data acquisition: land, transition zone and marine',
    'Seismic data is the main tool for finding and appraising hydrocarbons, and its quality is set in the field. This course covers acquisition design, equipment and operations for land, transition zone and marine surveys, with attention to cost, safety and community issues common in the Niger Delta.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 5 to 8, Oct 4 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain seismic wave propagation and the link between acquisition design and image quality',
      'Design survey geometry for land, transition zone and marine settings',
      'Describe sources, receivers and recording systems',
      'Plan quality control in the field and identify common noise problems',
      'Manage HSE, permitting and community relations on seismic crews'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Design a 3D land survey geometry for a target depth',
      'Review field QC data and flag problem records',
      'Prepare a community engagement plan for a swamp survey'
    ],
    ARRAY['SEG standards for seismic data', 'IOGP 432', 'IAGC guidelines'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Seismic Fundamentals & Survey Design', 1),
    (v_mod2_id, v_course_id, 'Day 2: Land Seismic Acquisition & Operations', 2),
    (v_mod3_id, v_course_id, 'Day 3: Transition Zone & Marine Acquisition', 3),
    (v_mod4_id, v_course_id, 'Day 4: Field Quality Control, HSE & Community Relations', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec010001-0001-0000-0000-000000000001', v_mod1_id, '1. Seismic fundamentals', 'Wave propagation; Resolution and fold; Signal and noise', 'text', 270, 1, false),
    ('ec010001-0001-0000-0000-000000000002', v_mod1_id, '2. Survey design', 'Geometry and bin size; Offsets and azimuths; Modelling and illumination', 'text', 270, 2, false),
    ('ec010001-0002-0000-0000-000000000001', v_mod2_id, '3. Land acquisition', 'Vibroseis and dynamite; Nodes and cabled systems; Terrain challenges', 'text', 270, 1, false),
    ('ec010001-0003-0000-0000-000000000001', v_mod3_id, '4. Transition zone and marine', 'Ocean bottom nodes; Streamers; Shallow water operations', 'text', 270, 1, false),
    ('ec010001-0004-0000-0000-000000000001', v_mod4_id, '5. Field quality control', 'Instrument tests; Noise analysis; Daily QC reports', 'text', 270, 1, false),
    ('ec010001-0004-0000-0000-000000000002', v_mod4_id, '6. HSE and community', 'Permitting and land access; Community engagement; Crew safety', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EP02 (Well logging and formation evaluation data acquisition)
  -- =========================================================================
  v_course_id := 'cc020000-0000-0000-0000-000000000002';
  v_mod1_id := 'dc020001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc020001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc020001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc020001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP02', 6, 'general_technical', v_cat_ep_id, v_subcat_ep_acq_id, 'Data acquisition',
    'Well logging and formation evaluation data acquisition',
    'Well logs are the main source of rock and fluid properties in a well, and decisions on completion and reserves rest on them. This course covers logging tools, data acquisition planning, quality control and the basics of formation evaluation.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 21, Jul 26 to 29. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe wireline and logging while drilling tools and what each measures',
      'Plan a logging programme matched to well objectives',
      'Apply quality control checks to log data',
      'Explain formation pressure testing and fluid sampling',
      'Present a first pass formation evaluation'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Plan a logging programme for an appraisal well',
      'Quality check a log data set',
      'Carry out a quick look evaluation'
    ],
    ARRAY['API RP 33', 'SPWLA guidelines', 'LAS 3.0 format'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Logging Fundamentals & Measurement Tools', 1),
    (v_mod2_id, v_course_id, 'Day 2: Logging While Drilling & Geosteering', 2),
    (v_mod3_id, v_course_id, 'Day 3: Formation Pressure Testing & Fluid Sampling', 3),
    (v_mod4_id, v_course_id, 'Day 4: Log Quality Control & Quick Look Evaluation', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec020001-0001-0000-0000-000000000001', v_mod1_id, '1. Logging fundamentals', 'Borehole environment; Depth control; Log formats', 'text', 270, 1, false),
    ('ec020001-0001-0000-0000-000000000002', v_mod1_id, '2. Logging tools', 'Resistivity; Porosity tools; Gamma ray and spectral tools; Imaging', 'text', 300, 2, false),
    ('ec020001-0002-0000-0000-000000000001', v_mod2_id, '3. Logging while drilling', 'LWD tools; Geosteering basics', 'text', 180, 1, false),
    ('ec020001-0003-0000-0000-000000000001', v_mod3_id, '4. Pressure and sampling', 'Formation testers; Fluid sampling; Pressure gradients', 'text', 270, 1, false),
    ('ec020001-0004-0000-0000-000000000001', v_mod4_id, '5. Data quality control', 'Calibration checks; Repeat sections; Environmental corrections', 'text', 270, 1, false),
    ('ec020001-0004-0000-0000-000000000002', v_mod4_id, '6. Quick look evaluation', 'Lithology; Porosity and saturation; Net pay', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: EP03 (Drone and remote sensing surveys for exploration and mining)
  -- =========================================================================
  v_course_id := 'cc030000-0000-0000-0000-000000000003';
  v_mod1_id := 'dc030001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc030001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc030001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP03', 6, 'general_technical', v_cat_ep_id, v_subcat_ep_acq_id, 'Data acquisition',
    'Drone and remote sensing surveys for exploration and mining',
    'Drones, satellites and airborne sensors now collect survey data faster and more safely than ground crews. This course covers remote sensing methods for oil, gas and mining exploration and their use alongside ground data.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 17 to 19, Nov 8 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe optical, radar, magnetic and gravity remote sensing methods',
      'Plan drone survey missions and data processing',
      'Interpret satellite imagery for geology and access',
      'Integrate remote sensing with field and seismic data',
      'Apply aviation, safety and data rules for drone operations'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Plan a drone photogrammetry mission for a mining lease',
      'Map structures from satellite imagery'
    ],
    ARRAY['ICAO RPAS guidance', 'NCAA drone regulations', 'ASPRS accuracy standards'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Remote Sensing Principles & Drone Surveys', 1),
    (v_mod2_id, v_course_id, 'Day 2: Satellite & Airborne Remote Sensing', 2),
    (v_mod3_id, v_course_id, 'Day 3: GIS Integration, Aviation Regulations & Data Security', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec030001-0001-0000-0000-000000000001', v_mod1_id, '1. Remote sensing principles', 'Electromagnetic spectrum; Resolution; Platforms', 'text', 240, 1, false),
    ('ec030001-0001-0000-0000-000000000002', v_mod1_id, '2. Drone surveys', 'Photogrammetry; LiDAR; Magnetometry', 'text', 240, 2, false),
    ('ec030001-0002-0000-0000-000000000001', v_mod2_id, '3. Satellite and airborne data', 'Multispectral imagery; Radar and InSAR; Airborne gravity and magnetics', 'text', 240, 1, false),
    ('ec030001-0003-0000-0000-000000000001', v_mod3_id, '4. Data processing and integration', 'Orthomosaics and DEMs; GIS integration; Ground truthing', 'text', 240, 1, false),
    ('ec030001-0003-0000-0000-000000000002', v_mod3_id, '5. Regulation and safety', 'Aviation authority rules; Flight safety; Data security', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
