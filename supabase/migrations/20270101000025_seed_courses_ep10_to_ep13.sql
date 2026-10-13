-- Migration: Seed Courses EP10 to EP13
-- Domain 6: Exploration (Oil, Gas and Mining)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ep_id UUID;
  v_subcat_interpretation_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 6
  SELECT id INTO v_cat_ep_id FROM public.course_categories WHERE slug = 'exploration-oil-gas-and-mining' OR domain_no = 6 LIMIT 1;

  -- 2. Resolve Subcategory
  SELECT id INTO v_subcat_interpretation_id FROM public.course_subcategories WHERE category_id = v_cat_ep_id AND slug = 'data-interpretation' LIMIT 1;
  IF v_subcat_interpretation_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ep_id, 'Data interpretation', 'data-interpretation', 3)
    RETURNING id INTO v_subcat_interpretation_id;
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
  -- COURSE 1: EP10 (Machine learning for subsurface interpretation)
  -- =========================================================================
  v_course_id := 'cc100000-0000-0000-0000-000000000010';
  v_mod1_id := 'dc100001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc100001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc100001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP10', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Machine learning for subsurface interpretation',
    'Machine learning now speeds up fault picking, facies classification and log prediction, and it can surface patterns that manual interpretation misses. This advanced course gives geoscientists hands on experience applying machine learning to seismic and well data, with a strong focus on validation so results can be trusted in drilling decisions.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 26 to 28, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Prepare seismic and well data for machine learning, including labelling and splitting',
      'Apply supervised models to fault detection and seismic facies classification',
      'Predict missing or poor quality logs from offset wells',
      'Validate models with blind wells and uncertainty measures',
      'Fit machine learning steps into existing interpretation workflows and governance'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Train and test a facies classifier on a set of well logs',
      'Run a machine learning fault detection on a seismic volume and compare it with manual picks'
    ],
    ARRAY['ISO/IEC 23053', 'ISO/IEC 42001', 'SEG machine learning resources'],
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
    (v_mod1_id, v_course_id, 'Day 1: Machine Learning Foundations & Seismic Applications', 1),
    (v_mod2_id, v_course_id, 'Day 2: Well Log Applications & Prediction', 2),
    (v_mod3_id, v_course_id, 'Day 3: Model Validation, Governance & Workflow Integration', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec100001-0001-0000-0000-000000000001', v_mod1_id, '1. Machine learning for geoscience', 'Supervised and unsupervised learning; Neural networks in plain terms; Python and cloud tools', 'text', 240, 1, false),
    ('ec100001-0001-0000-0000-000000000002', v_mod1_id, '2. Seismic applications', 'Fault detection; Seismic facies classification; Horizon tracking assistance', 'text', 240, 2, false),
    ('ec100001-0002-0000-0000-000000000001', v_mod2_id, '3. Well log applications', 'Log prediction; Lithology and facies from logs; Data cleaning', 'text', 240, 1, false),
    ('ec100001-0003-0000-0000-000000000001', v_mod3_id, '4. Validation and governance', 'Blind well tests; Uncertainty and bias; Documenting models for audit', 'text', 240, 1, false),
    ('ec100001-0003-0000-0000-000000000002', v_mod3_id, '5. Workflow integration', 'Combining ML with interpreter judgement; Software options; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EP11 (Petrophysics for geoscientists)
  -- =========================================================================
  v_course_id := 'cc110000-0000-0000-0000-000000000011';
  v_mod1_id := 'dc110001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc110001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc110001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc110001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP11', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Petrophysics for geoscientists',
    'Geoscientists need enough petrophysics to judge reservoir quality and fluid content without waiting for a specialist. This course gives a working grasp of log interpretation for lithology, porosity, saturation and net pay, including the low resistivity and thinly bedded reservoirs common in deltaic settings.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 14, Jul 5 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify lithology and fluid contacts from standard log suites',
      'Calculate porosity from density, neutron and sonic logs',
      'Calculate water saturation with Archie and shaly sand methods',
      'Set net reservoir and net pay cut offs and test their sensitivity',
      'Calibrate log results with core and pressure data'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Interpret a deltaic well for net pay and compare results with core data',
      'Run cut off sensitivity on net pay'
    ],
    ARRAY['SPWLA guidelines', 'API RP 40', 'SPE PRMS'],
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
    (v_mod1_id, v_course_id, 'Day 1: Logs for Geoscientists & Lithology Analysis', 1),
    (v_mod2_id, v_course_id, 'Day 2: Porosity Determination & Core Calibration', 2),
    (v_mod3_id, v_course_id, 'Day 3: Water Saturation in Shaly Sands & Low Resistivity Pay', 3),
    (v_mod4_id, v_course_id, 'Day 4: Net Pay Summation & Core Integration', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec110001-0001-0000-0000-000000000001', v_mod1_id, '1. Logs for geoscientists', 'Tool responses; Log quality checks; Depth matching', 'text', 270, 1, false),
    ('ec110001-0001-0000-0000-000000000002', v_mod1_id, '2. Lithology and contacts', 'Crossplots; Shale volume; Fluid contacts from logs and pressures', 'text', 270, 2, false),
    ('ec110001-0002-0000-0000-000000000001', v_mod2_id, '3. Porosity', 'Density and neutron methods; Sonic porosity; Gas effects', 'text', 270, 1, false),
    ('ec110001-0003-0000-0000-000000000001', v_mod3_id, '4. Saturation', 'Archie equation and parameters; Shaly sand models; Low resistivity pay', 'text', 270, 1, false),
    ('ec110001-0004-0000-0000-000000000001', v_mod4_id, '5. Net pay and summation', 'Cut off selection; Sensitivity; Reporting', 'text', 270, 1, false),
    ('ec110001-0004-0000-0000-000000000002', v_mod4_id, '6. Core integration', 'Core porosity and permeability; Capillary pressure; Calibration', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EP12 (Mineral resource estimation and JORC reporting)
  -- =========================================================================
  v_course_id := 'cc120000-0000-0000-0000-000000000012';
  v_mod1_id := 'dc120001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc120001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc120001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc120001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP12', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Mineral resource estimation and JORC reporting',
    'Investors and stock exchanges rely on mineral resource estimates prepared to recognised codes, and errors there have ended many projects. This advanced course covers geological modelling, estimation methods and public reporting under the JORC Code.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Sep 27 to 30. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build geological and domain models from drilling data',
      'Analyse data with statistics and variography',
      'Estimate resources using inverse distance and kriging methods',
      'Classify resources as measured, indicated and inferred',
      'Prepare reporting that meets JORC Code requirements'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Manufacturing, cement, food, beverage and mining',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Build a variogram and estimate a block model for a gold deposit',
      'Classify the resource and draft JORC Table 1 entries'
    ],
    ARRAY['JORC Code 2012', 'CIM Estimation Best Practice', 'NI 43-101'],
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
    (v_mod1_id, v_course_id, 'Day 1: Drilling Data Validation & Variography', 1),
    (v_mod2_id, v_course_id, 'Day 2: Resource Estimation Methods & Kriging', 2),
    (v_mod3_id, v_course_id, 'Day 3: Block Model Validation & Swath Plots', 3),
    (v_mod4_id, v_course_id, 'Day 4: Resource Classification & JORC Public Reporting', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec120001-0001-0000-0000-000000000001', v_mod1_id, '1. Data and geology', 'Database validation; Geological interpretation; Domaining', 'text', 300, 1, false),
    ('ec120001-0001-0000-0000-000000000002', v_mod1_id, '2. Statistics and variography', 'Compositing; Top cuts; Variogram modelling', 'text', 300, 2, false),
    ('ec120001-0002-0000-0000-000000000001', v_mod2_id, '3. Estimation methods', 'Block models; Inverse distance; Ordinary kriging', 'text', 300, 1, false),
    ('ec120001-0003-0000-0000-000000000001', v_mod3_id, '4. Validation', 'Swath plots; Visual checks; Reconciliation', 'text', 300, 1, false),
    ('ec120001-0004-0000-0000-000000000001', v_mod4_id, '5. Classification', 'Confidence criteria; Measured, indicated and inferred', 'text', 210, 1, false),
    ('ec120001-0004-0000-0000-000000000002', v_mod4_id, '6. Reporting', 'JORC Table 1; Competent Person duties; Common reporting failures', 'text', 300, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EP13 (CO2 storage site characterisation)
  -- =========================================================================
  v_course_id := 'cc130000-0000-0000-0000-000000000013';
  v_mod1_id := 'dc130001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc130001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc130001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP13', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'CO2 storage site characterisation',
    'Carbon storage needs the same subsurface skills as hydrocarbon exploration, but the questions change from finding oil to keeping CO2 in place for centuries. This advanced course covers site screening, characterisation, capacity, containment and monitoring for CO2 storage.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 3 to 5, Nov 22 to 24. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Screen saline aquifers and depleted fields for CO2 storage',
      'Estimate storage capacity and injectivity',
      'Assess caprock, fault and well integrity risks to containment',
      'Design a monitoring, measurement and verification plan',
      'Prepare characterisation work for storage permitting'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Screen three candidate sites and rank them',
      'Estimate storage capacity for a saline aquifer'
    ],
    ARRAY['ISO 27914', 'ISO/TR 27915', 'EU CCS Directive guidance', 'US EPA Class VI rules'],
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
    (v_mod1_id, v_course_id, 'Day 1: CO2 Storage Basics & Site Screening', 1),
    (v_mod2_id, v_course_id, 'Day 2: Containment, Caprocks & Fault Seals', 2),
    (v_mod3_id, v_course_id, 'Day 3: Plume Migration & MMV Permitting Plans', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec130001-0001-0000-0000-000000000001', v_mod1_id, '1. CO2 storage basics', 'Trapping mechanisms; Storage options; Global projects', 'text', 270, 1, false),
    ('ec130001-0001-0000-0000-000000000002', v_mod1_id, '2. Site screening and capacity', 'Screening criteria; Capacity methods; Injectivity', 'text', 270, 2, false),
    ('ec130001-0002-0000-0000-000000000001', v_mod2_id, '3. Containment', 'Caprock; Faults; Legacy wells', 'text', 270, 1, false),
    ('ec130001-0003-0000-0000-000000000001', v_mod3_id, '4. Modelling', 'Static and dynamic models; Plume migration', 'text', 180, 1, false),
    ('ec130001-0003-0000-0000-000000000002', v_mod3_id, '5. Monitoring and permitting', 'MMV technologies; Regulations; Risk assessment', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
