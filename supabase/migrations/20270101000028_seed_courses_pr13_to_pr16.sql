-- Migration: Seed Courses PR13 to PR16
-- Domain 7: Production
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_pr_id UUID;
  v_subcat_fox_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 7
  SELECT id INTO v_cat_pr_id FROM public.course_categories WHERE slug = 'production' OR domain_no = 7 LIMIT 1;

  -- 2. Resolve Subcategory: The Field Operations Excellence (THE FOx)
  SELECT id INTO v_subcat_fox_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'the-field-operations-excellence-the-fox-production' LIMIT 1;
  IF v_subcat_fox_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox-production', 4)
    RETURNING id INTO v_subcat_fox_id;
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
  -- COURSE 1: PR13 (Well integrity management)
  -- =========================================================================
  v_course_id := 'cf130000-0000-0000-0000-000000000013';
  v_mod1_id := 'df130001-0000-0000-0000-000000000001';
  v_mod2_id := 'df130001-0000-0000-0000-000000000002';
  v_mod3_id := 'df130001-0000-0000-0000-000000000003';
  v_mod4_id := 'df130001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR13', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Well integrity management',
    'Well integrity failures can cause blowouts, leaks to the environment and long shut ins. This course covers barrier philosophy, annulus management, testing, risk ranking, remediation and abandonment across the well life.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 26 to 29, Oct 4 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain well barrier philosophy and barrier envelopes',
      'Interpret annulus pressure data and calculate MAASP',
      'Plan integrity tests and inspections',
      'Assess and rank integrity risks across a well stock',
      'Plan remediation and abandonment'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Calculate MAASP for a well',
      'Rank a well stock by integrity risk and propose actions'
    ],
    ARRAY['ISO 16530-1', 'ISO 16530-2', 'NORSOK D-010', 'API RP 90'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Well Barrier Philosophy & Annulus Management', 1),
    (v_mod2_id, v_course_id, 'Day 2: Barrier Testing, Casing Logs & Corrosion Monitoring', 2),
    (v_mod3_id, v_course_id, 'Day 3: Integrity Risk Assessment & Operating Limits', 3),
    (v_mod4_id, v_course_id, 'Day 4: Workover Remediation & Plug and Abandonment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef130001-0001-0000-0000-000000000001', v_mod1_id, '1. Barrier philosophy', 'Primary and secondary barriers; Barrier envelopes; Acceptance criteria', 'text', 270, 1, false),
    ('ef130001-0001-0000-0000-000000000002', v_mod1_id, '2. Annulus management', 'Sustained casing pressure; MAASP; Monitoring and bleed offs', 'text', 270, 2, false),
    ('ef130001-0002-0000-0000-000000000001', v_mod2_id, '3. Testing and inspection', 'Valve and barrier tests; Casing and tubing logs; Corrosion monitoring', 'text', 270, 1, false),
    ('ef130001-0003-0000-0000-000000000001', v_mod3_id, '4. Risk assessment', 'Risk ranking; Well integrity registers; Operating limits', 'text', 270, 1, false),
    ('ef130001-0004-0000-0000-000000000001', v_mod4_id, '5. Remediation', 'Workovers; Rigless intervention; Annulus repairs', 'text', 270, 1, false),
    ('ef130001-0004-0000-0000-000000000002', v_mod4_id, '6. Abandonment', 'Plug and abandonment design; Regulations; Cost planning', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: PR14 (Production optimisation and integrated asset modelling)
  -- =========================================================================
  v_course_id := 'cf140000-0000-0000-0000-000000000014';
  v_mod1_id := 'df140001-0000-0000-0000-000000000001';
  v_mod2_id := 'df140001-0000-0000-0000-000000000002';
  v_mod3_id := 'df140001-0000-0000-0000-000000000003';
  v_mod4_id := 'df140001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR14', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Production optimisation and integrated asset modelling',
    'Integrated asset models link reservoir, wells, pipelines and facilities so that engineers can test changes on a computer before making them in the field. This advanced course covers building, calibrating and using these models to raise production and plan development.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Sep 27 to 30. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build calibrated well models using nodal analysis',
      'Build gathering network and facility models with constraints',
      'Couple reservoir, well and network models into an integrated model',
      'Optimise production by allocating gas lift, setting chokes and routing flow',
      'Use integrated models for forecasts and development decisions'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build and calibrate a well and network model for a small field',
      'Optimise gas lift allocation under a compression limit',
      'Run a forecast for two development options'
    ],
    ARRAY['SPE production optimisation practice', 'API RP 11V6', 'SPE PRMS'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Optimisation Concepts & Nodal Well Modelling', 1),
    (v_mod2_id, v_course_id, 'Day 2: Gathering Network Modelling & Facility Constraints', 2),
    (v_mod3_id, v_course_id, 'Day 3: Integrated Asset Coupling & Production Forecasting', 3),
    (v_mod4_id, v_course_id, 'Day 4: Real-Time Optimisation Practice & Decision Support', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef140001-0001-0000-0000-000000000001', v_mod1_id, '1. Optimisation concepts', 'System constraints; Objective functions; Data needs', 'text', 270, 1, false),
    ('ef140001-0001-0000-0000-000000000002', v_mod1_id, '2. Well modelling', 'Inflow performance; Vertical lift; Calibration with well tests', 'text', 270, 2, false),
    ('ef140001-0002-0000-0000-000000000001', v_mod2_id, '3. Network modelling', 'Pipelines and manifolds; Pressure drop correlations; Facility constraints', 'text', 270, 1, false),
    ('ef140001-0003-0000-0000-000000000001', v_mod3_id, '4. Integrated modelling', 'Coupling reservoir and surface; Forecasting; Model maintenance', 'text', 270, 1, false),
    ('ef140001-0004-0000-0000-000000000001', v_mod4_id, '5. Optimisation in practice', 'Gas lift allocation; Choke and routing changes; Real time optimisation', 'text', 270, 1, false),
    ('ef140001-0004-0000-0000-000000000002', v_mod4_id, '6. Decision support', 'Scenario analysis; Communicating results; Case studies', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: PR15 (Sand management and control)
  -- =========================================================================
  v_course_id := 'cf150000-0000-0000-0000-000000000015';
  v_mod1_id := 'df150001-0000-0000-0000-000000000001';
  v_mod2_id := 'df150001-0000-0000-0000-000000000002';
  v_mod3_id := 'df150001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR15', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Sand management and control',
    'Sand production erodes equipment, fills separators and can kill wells, yet over restrictive sand control throttles output. This course covers prediction, control methods and sand management in operation.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 28 to 30, Dec 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Predict sanding risk from rock mechanics and well data',
      'Compare sand control methods such as screens and gravel packs',
      'Set maximum sand free rates and erosion limits',
      'Monitor sand with acoustic and intrusive detectors',
      'Handle and dispose of produced sand'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Calculate sanding risk and a sand free rate for a well',
      'Select a sand control method for a deltaic reservoir'
    ],
    ARRAY['API RP 14E', 'DNV RP O501', 'API RP 19C'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Sand Production Mechanisms & Control Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Sand Management in Operation & Choke Control', 2),
    (v_mod3_id, v_course_id, 'Day 3: Acoustic Monitoring, Sand Handling & Niger Delta Cases', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef150001-0001-0000-0000-000000000001', v_mod1_id, '1. Sand production mechanisms', 'Rock strength; Drawdown and depletion; Water breakthrough', 'text', 270, 1, false),
    ('ef150001-0001-0000-0000-000000000002', v_mod1_id, '2. Sand control methods', 'Standalone screens; Gravel packs and frac packs; Chemical consolidation', 'text', 270, 2, false),
    ('ef150001-0002-0000-0000-000000000001', v_mod2_id, '3. Sand management in operation', 'Sand free rates; Erosion limits; Choke management', 'text', 270, 1, false),
    ('ef150001-0003-0000-0000-000000000001', v_mod3_id, '4. Monitoring and handling', 'Sand detectors; Separator cleanout; Disposal', 'text', 270, 1, false),
    ('ef150001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Niger Delta experience; Lessons learned', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: PR16 (Marginal field development and operations)
  -- =========================================================================
  v_course_id := 'cf160000-0000-0000-0000-000000000016';
  v_mod1_id := 'df160001-0000-0000-0000-000000000001';
  v_mod2_id := 'df160001-0000-0000-0000-000000000002';
  v_mod3_id := 'df160001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR16', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Marginal field development and operations',
    'Marginal and divested fields are now a large part of indigenous production, and they must be developed with low capital and lean teams. This course covers fast, low cost development and operation of small fields.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 1 to 3, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Evaluate marginal field opportunities and data gaps',
      'Select low cost development concepts such as early production facilities',
      'Plan phased development and production sharing with hosts',
      'Manage regulatory, community and evacuation risks',
      'Run lean operations with outsourced services'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Screen a marginal field and propose a development concept',
      'Build a simple cash flow model for an early production scheme'
    ],
    ARRAY['Petroleum Industry Act 2021', 'NUPRC marginal field guidelines', 'SPE PRMS'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Opportunity Evaluation & Early Production Concepts', 1),
    (v_mod2_id, v_course_id, 'Day 2: Commercial Agreements, Evacuation & Host Facilities', 2),
    (v_mod3_id, v_course_id, 'Day 3: PIA Regulations, Community Trusts & Lean Operations', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef160001-0001-0000-0000-000000000001', v_mod1_id, '1. Opportunity evaluation', 'Data review; Reserves and risk; Fiscal terms', 'text', 240, 1, false),
    ('ef160001-0001-0000-0000-000000000002', v_mod1_id, '2. Development concepts', 'Early production facilities; Shared infrastructure; Modular plants', 'text', 240, 2, false),
    ('ef160001-0002-0000-0000-000000000001', v_mod2_id, '3. Commercial arrangements', 'Farm ins; Evacuation agreements; Crude handling', 'text', 240, 1, false),
    ('ef160001-0003-0000-0000-000000000001', v_mod3_id, '4. Regulation and community', 'Licences under the PIA; Host community trusts; Security', 'text', 240, 1, false),
    ('ef160001-0003-0000-0000-000000000002', v_mod3_id, '5. Lean operations', 'Outsourcing; Cost control; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
