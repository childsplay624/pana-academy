-- Migration: Seed Courses EX13 to EX17
-- Domain 5: EPMICE Field Operations and Lifecycle Services
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ex_id UUID;
  v_subcat_lifecycle_id UUID;
  v_subcat_gas_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 5
  SELECT id INTO v_cat_ex_id FROM public.course_categories WHERE slug = 'field-operations-and-lifecycle-services' OR domain_no = 5 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_lifecycle_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'lifecycle-services-and-performance-assurance' LIMIT 1;
  IF v_subcat_lifecycle_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Lifecycle services and performance assurance', 'lifecycle-services-and-performance-assurance', 6)
    RETURNING id INTO v_subcat_lifecycle_id;
  END IF;

  SELECT id INTO v_subcat_gas_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'gas-projects-delivery' LIMIT 1;
  IF v_subcat_gas_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Gas projects delivery', 'gas-projects-delivery', 7)
    RETURNING id INTO v_subcat_gas_id;
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
  -- COURSE 1: EX13 (Reliability centred maintenance and FMECA)
  -- =========================================================================
  v_course_id := 'cb130000-0000-0000-0000-000000000013';
  v_mod1_id := 'db130001-0000-0000-0000-000000000001';
  v_mod2_id := 'db130001-0000-0000-0000-000000000002';
  v_mod3_id := 'db130001-0000-0000-0000-000000000003';
  v_mod4_id := 'db130001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX13', 5, 'general_technical', v_cat_ex_id, v_subcat_lifecycle_id, 'Lifecycle services and performance assurance',
    'Reliability centred maintenance and FMECA',
    'Reliability centred maintenance sets the right maintenance task for each failure mode, so effort goes where it reduces risk and waste is cut elsewhere. This competence course trains engineers and planners to run RCM and FMECA studies and turn them into maintenance plans.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 8 to 11, Aug 23 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain RCM principles and the seven RCM questions',
      'Carry out FMECA for an equipment system',
      'Select condition based, time based, run to failure and redesign tasks',
      'Calculate task intervals using failure data',
      'Load results into a CMMS maintenance plan'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Run an FMECA workshop for a pump system',
      'Select tasks and intervals for ten failure modes',
      'Build the maintenance plan in a CMMS template'
    ],
    ARRAY['SAE JA1011', 'SAE JA1012', 'IEC 60812', 'ISO 14224'],
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
    (v_mod1_id, v_course_id, 'Day 1: RCM Principles & FMECA Analysis', 1),
    (v_mod2_id, v_course_id, 'Day 2: Maintenance Task Selection', 2),
    (v_mod3_id, v_course_id, 'Day 3: Failure Data & Task Intervals', 3),
    (v_mod4_id, v_course_id, 'Day 4: CMMS Implementation & Practical Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb130001-0001-0000-0000-000000000001', v_mod1_id, '1. RCM principles', 'History and standards; Functions and functional failures; Consequences', 'text', 270, 1, false),
    ('eb130001-0001-0000-0000-000000000002', v_mod1_id, '2. FMECA', 'Failure modes and effects; Criticality ranking; Worksheets', 'text', 270, 2, false),
    ('eb130001-0002-0000-0000-000000000001', v_mod2_id, '3. Task selection', 'Condition monitoring; Scheduled restoration and replacement; Failure finding', 'text', 270, 1, false),
    ('eb130001-0003-0000-0000-000000000001', v_mod3_id, '4. Data and intervals', 'Failure data sources; Weibull basics; Interval setting', 'text', 270, 1, false),
    ('eb130001-0004-0000-0000-000000000001', v_mod4_id, '5. Implementation', 'CMMS loading; Living programme; Review cycles', 'text', 270, 1, false),
    ('eb130001-0004-0000-0000-000000000002', v_mod4_id, '6. Facilitation and assessment', 'Running workshops; Practical test; Written test', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EX14 (Asset management to ISO 55001)
  -- =========================================================================
  v_course_id := 'cb140000-0000-0000-0000-000000000014';
  v_mod1_id := 'db140001-0000-0000-0000-000000000001';
  v_mod2_id := 'db140001-0000-0000-0000-000000000002';
  v_mod3_id := 'db140001-0000-0000-0000-000000000003';
  v_mod4_id := 'db140001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX14', 5, 'general_technical', v_cat_ex_id, v_subcat_lifecycle_id, 'Lifecycle services and performance assurance',
    'Asset management to ISO 55001',
    'ISO 55001 gives organisations a framework for managing physical assets to deliver value over their life. This course explains the standard, links it to daily maintenance and investment decisions, and prepares candidates for the IAM Certificate examination.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 15 to 18, Sep 27 to 30. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the ISO 55000 series and the asset management system',
      'Link organisational objectives to the strategic asset management plan',
      'Apply risk, lifecycle cost and value in asset decisions',
      'Set asset information and performance requirements',
      'Prepare for IAM Certificate questions'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Draft a SAMP outline for a gas utility',
      'Compare repair and replace options using lifecycle cost'
    ],
    ARRAY['ISO 55000', 'ISO 55001', 'ISO 55002', 'IAM Anatomy'],
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
    (v_mod1_id, v_course_id, 'Day 1: Asset Management Concepts & Policy Planning', 1),
    (v_mod2_id, v_course_id, 'Day 2: Risk-Based Decisions & Lifecycle Costing', 2),
    (v_mod3_id, v_course_id, 'Day 3: Lifecycle Delivery & Maintenance Strategy', 3),
    (v_mod4_id, v_course_id, 'Day 4: Asset Information & IAM Examination Preparation', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb140001-0001-0000-0000-000000000001', v_mod1_id, '1. Asset management concepts', 'Value and assets; ISO 55000 series; IAM anatomy', 'text', 300, 1, false),
    ('eb140001-0001-0000-0000-000000000002', v_mod1_id, '2. Policy and planning', 'Asset management policy; SAMP; Asset plans', 'text', 300, 2, false),
    ('eb140001-0002-0000-0000-000000000001', v_mod2_id, '3. Decision making', 'Risk based decisions; Lifecycle cost; Capital and operating trade offs', 'text', 300, 1, false),
    ('eb140001-0003-0000-0000-000000000001', v_mod3_id, '4. Lifecycle delivery', 'Maintenance strategy; Shutdowns; Disposal', 'text', 360, 1, false),
    ('eb140001-0004-0000-0000-000000000001', v_mod4_id, '5. Information and performance', 'Asset information; KPIs; Audits', 'text', 300, 1, false),
    ('eb140001-0004-0000-0000-000000000002', v_mod4_id, '6. Examination preparation', 'Mock examination; Review', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EX15 (Root cause analysis for equipment failures)
  -- =========================================================================
  v_course_id := 'cb150000-0000-0000-0000-000000000015';
  v_mod1_id := 'db150001-0000-0000-0000-000000000001';
  v_mod2_id := 'db150001-0000-0000-0000-000000000002';
  v_mod3_id := 'db150001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX15', 5, 'general_technical', v_cat_ex_id, v_subcat_lifecycle_id, 'Lifecycle services and performance assurance',
    'Root cause analysis for equipment failures',
    'Equipment failures repeat when the real cause is not found. This competence course trains engineers and supervisors to run structured root cause analysis and turn findings into lasting fixes.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Apr 12 to 14, Oct 25 to 27. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Preserve evidence and collect data after a failure',
      'Use five whys, fishbone, fault tree and cause mapping methods',
      'Interpret failure modes such as fatigue, wear and corrosion',
      'Write recommendations that address root causes',
      'Track actions to closure'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Run a full RCA on a bearing failure case',
      'Examine failed parts and identify the mechanism',
      'Present findings to a review panel'
    ],
    ARRAY['IEC 62740', 'ISO 14224', 'API RP 585'],
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
    (v_mod1_id, v_course_id, 'Day 1: RCA Principles & Evidence Preservation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Analysis Methods & Cause Mapping', 2),
    (v_mod3_id, v_course_id, 'Day 3: Failure Mechanisms & Corrective Actions', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb150001-0001-0000-0000-000000000001', v_mod1_id, '1. RCA principles', 'Physical, human and latent causes; When to use RCA', 'text', 150, 1, false),
    ('eb150001-0001-0000-0000-000000000002', v_mod1_id, '2. Evidence and data', 'Evidence preservation; Interviews; Timelines', 'text', 240, 2, false),
    ('eb150001-0002-0000-0000-000000000001', v_mod2_id, '3. Analysis methods', 'Five whys; Fishbone; Fault trees; Cause maps', 'text', 300, 1, false),
    ('eb150001-0003-0000-0000-000000000001', v_mod3_id, '4. Failure mechanisms', 'Fatigue; Wear; Corrosion; Overload', 'text', 300, 1, false),
    ('eb150001-0003-0000-0000-000000000002', v_mod3_id, '5. Recommendations and assessment', 'Corrective actions; Tracking; Practical test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EX16 (Condition monitoring programme design)
  -- =========================================================================
  v_course_id := 'cb160000-0000-0000-0000-000000000016';
  v_mod1_id := 'db160001-0000-0000-0000-000000000001';
  v_mod2_id := 'db160001-0000-0000-0000-000000000002';
  v_mod3_id := 'db160001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX16', 5, 'general_technical', v_cat_ex_id, v_subcat_lifecycle_id, 'Lifecycle services and performance assurance',
    'Condition monitoring programme design',
    'Condition monitoring pays only when the right techniques are applied to the right assets at the right frequency, and many programmes collect data that nobody acts on. This course shows how to design, run and prove the value of a condition monitoring programme across a plant.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 19 to 21. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Rank assets by criticality for condition monitoring',
      'Match techniques to failure modes',
      'Set routes, frequencies and alarm limits',
      'Integrate results with maintenance planning',
      'Measure programme value'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Design a condition monitoring programme for a utility area',
      'Set alarm limits from baseline data'
    ],
    ARRAY['ISO 17359', 'ISO 13379', 'ISO 18436'],
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
    (v_mod1_id, v_course_id, 'Day 1: Programme Design & Monitoring Techniques', 1),
    (v_mod2_id, v_course_id, 'Day 2: Routes, Baselines & Alarm Setting', 2),
    (v_mod3_id, v_course_id, 'Day 3: Maintenance Integration & Programme Value', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb160001-0001-0000-0000-000000000001', v_mod1_id, '1. Programme design', 'Criticality ranking; Failure mode coverage; Online versus route based', 'text', 240, 1, false),
    ('eb160001-0001-0000-0000-000000000002', v_mod1_id, '2. Techniques', 'Vibration and ultrasound; Oil analysis; Thermography and electrical tests', 'text', 240, 2, false),
    ('eb160001-0002-0000-0000-000000000001', v_mod2_id, '3. Routes and limits', 'Frequencies; Baselines; Alarm setting', 'text', 240, 1, false),
    ('eb160001-0003-0000-0000-000000000001', v_mod3_id, '4. Integration', 'Work orders; Reporting; Feedback loops', 'text', 240, 1, false),
    ('eb160001-0003-0000-0000-000000000002', v_mod3_id, '5. Programme value', 'KPIs; Cost and benefit; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: EX17 (Gas processing operations: dehydration, sweetening and NGL recovery)
  -- =========================================================================
  v_course_id := 'cb170000-0000-0000-0000-000000000017';
  v_mod1_id := 'db170001-0000-0000-0000-000000000001';
  v_mod2_id := 'db170001-0000-0000-0000-000000000002';
  v_mod3_id := 'db170001-0000-0000-0000-000000000003';
  v_mod4_id := 'db170001-0000-0000-0000-000000000004';
  v_mod5_id := 'db170001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX17', 5, 'general_technical', v_cat_ex_id, v_subcat_gas_id, 'Gas projects delivery',
    'Gas processing operations: dehydration, sweetening and NGL recovery',
    'Gas processing plants dry, sweeten and separate natural gas so it can be sold, burned in power plants or exported as LNG and LPG. This course covers the main processes, how they are operated and how to troubleshoot the problems that most often take product off specification.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site.',
    ARRAY[
      'Explain gas processing from inlet to sales gas',
      'Operate glycol dehydration and molecular sieve units',
      'Operate amine sweetening units and handle common problems',
      'Explain NGL recovery by refrigeration and expansion',
      'Troubleshoot foaming, hydrate and specification problems'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Calculate water dew point and glycol rate for a dehydration unit',
      'Troubleshoot an amine foaming event on a simulator',
      'Trace NGL recovery flows on a process flow diagram'
    ],
    ARRAY['GPSA Engineering Data Book', 'API 12J', 'ISO 13443'],
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
    (v_mod1_id, v_course_id, 'Day 1: Gas Processing Overview & Product Specifications', 1),
    (v_mod2_id, v_course_id, 'Day 2: Inlet Separation & Dehydration Units', 2),
    (v_mod3_id, v_course_id, 'Day 3: Gas Sweetening & Sulphur Handling', 3),
    (v_mod4_id, v_course_id, 'Day 4: NGL Recovery, Utilities & Plant Safety', 4),
    (v_mod5_id, v_course_id, 'Day 5: Troubleshooting Off-Spec Gas & Case Studies', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb170001-0001-0000-0000-000000000001', v_mod1_id, '1. Gas processing overview', 'Feed gas; Product specifications; Plant layouts', 'text', 300, 1, false),
    ('eb170001-0002-0000-0000-000000000001', v_mod2_id, '2. Inlet separation and stabilisation', 'Slug catchers; Condensate stabilisation; Inlet compression', 'text', 300, 1, false),
    ('eb170001-0002-0000-0000-000000000002', v_mod2_id, '3. Dehydration', 'Glycol units; Molecular sieves; Hydrate control', 'text', 300, 2, false),
    ('eb170001-0003-0000-0000-000000000001', v_mod3_id, '4. Gas sweetening', 'Amine chemistry; Unit operation; Sulphur handling', 'text', 300, 1, false),
    ('eb170001-0004-0000-0000-000000000001', v_mod4_id, '5. NGL recovery', 'Refrigeration; Turboexpanders; Fractionation', 'text', 300, 1, false),
    ('eb170001-0004-0000-0000-000000000002', v_mod4_id, '6. Utilities and safety', 'Flare and fuel systems; Hazards; Emergency response', 'text', 300, 2, false),
    ('eb170001-0005-0000-0000-000000000001', v_mod5_id, '7. Troubleshooting', 'Foaming; Off specification gas; Case studies', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
