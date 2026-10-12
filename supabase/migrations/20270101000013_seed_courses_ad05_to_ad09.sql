-- Migration: Seed Courses AD05 to AD09
-- Domain 3: Integrated Automation and Digital Operations
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ad_id UUID;
  v_subcat_ad_icss_id UUID;
  v_subcat_ad_digital_id UUID;
  v_subcat_ad_networks_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category
  SELECT id INTO v_cat_ad_id FROM public.course_categories WHERE slug = 'integrated-automation-and-digital-operations' OR domain_no = 3 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_ad_icss_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'automation-and-icss' LIMIT 1;
  IF v_subcat_ad_icss_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Automation and ICSS', 'automation-and-icss', 1)
    RETURNING id INTO v_subcat_ad_icss_id;
  END IF;

  SELECT id INTO v_subcat_ad_digital_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'digital-operations-and-plant-intelligence' LIMIT 1;
  IF v_subcat_ad_digital_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Digital operations and plant intelligence', 'digital-operations-and-plant-intelligence', 2)
    RETURNING id INTO v_subcat_ad_digital_id;
  END IF;

  SELECT id INTO v_subcat_ad_networks_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'industrial-networks-cybersecurity-and-control-rooms' LIMIT 1;
  IF v_subcat_ad_networks_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Industrial networks, cybersecurity and control rooms', 'industrial-networks-cybersecurity-and-control-rooms', 3)
    RETURNING id INTO v_subcat_ad_networks_id;
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
  -- COURSE 1: AD05 (Alarm management to ISA 18.2 and IEC 62682)
  -- =========================================================================
  v_course_id := 'c3050000-0000-0000-0000-000000000005';
  v_mod1_id := 'd3050001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3050001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD05', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'Alarm management to ISA 18.2 and IEC 62682',
    'Too many alarms hide the ones that matter, and alarm floods have contributed to major accidents. This course teaches the alarm management lifecycle to ISA 18.2 and shows how to rationalise and monitor alarm systems.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, May 24 to 26, Sep 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the ISA 18.2 alarm management lifecycle',
      'Write an alarm philosophy',
      'Rationalise alarms with operators and engineers',
      'Measure alarm system performance with standard KPIs',
      'Manage alarm floods, shelving and suppression'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Rationalise twenty alarms from a real unit',
      'Analyse a month of alarm data and list bad actors'
    ],
    ARRAY['ISA 18.2', 'IEC 62682', 'EEMUA 191'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Why Alarm Management & Philosophy', 1),
    (v_mod2_id, v_course_id, 'Day 2: Alarm Rationalisation', 2),
    (v_mod3_id, v_course_id, 'Day 3: Performance Monitoring & Advanced Methods', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3050001-0001-0000-0000-000000000001', v_mod1_id, '1. Why alarm management', 'Incident history; Operator load; Lifecycle overview.', 'text', 240, 1, false),
    ('c3050001-0001-0000-0000-000000000002', v_mod1_id, '2. Alarm philosophy', 'Priorities; Classes; Roles and responsibilities.', 'text', 240, 2, false),
    ('c3050001-0002-0000-0000-000000000001', v_mod2_id, '3. Rationalisation', 'Documentation and justification; Set points and dead bands; Master alarm database.', 'text', 240, 1, false),
    ('c3050001-0003-0000-0000-000000000001', v_mod3_id, '4. Performance monitoring', 'KPIs; Bad actors; Flood analysis.', 'text', 240, 1, false),
    ('c3050001-0003-0000-0000-000000000002', v_mod3_id, '5. Advanced methods', 'State based alarming; Shelving and suppression; Alarm audits.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: AD06 (Advanced process control and model predictive control)
  -- =========================================================================
  v_course_id := 'c3060000-0000-0000-0000-000000000006';
  v_mod1_id := 'd3060001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3060001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3060001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3060001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD06', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_icss_id, 'Automation and ICSS',
    'Advanced process control and model predictive control',
    'Advanced process control and model predictive control raise throughput and cut energy by running units closer to their limits. This advanced course covers opportunity assessment, dynamic modelling, controller design, commissioning and sustaining benefits.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Nov 22 to 25. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify units where APC will pay back',
      'Build step test plans and identify process models',
      'Configure an MPC controller with constraints and targets',
      'Commission APC and monitor performance',
      'Sustain benefits after handover'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Identify models from step test data',
      'Tune an MPC on a distillation simulator'
    ],
    ARRAY['ISA 95', 'IEC 61131 3', 'Vendor APC practice guides'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: APC Opportunities & Process Modelling', 1),
    (v_mod2_id, v_course_id, 'Day 2: MPC Design', 2),
    (v_mod3_id, v_course_id, 'Day 3: Commissioning', 3),
    (v_mod4_id, v_course_id, 'Day 4: Performance Monitoring & Sustaining APC', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3060001-0001-0000-0000-000000000001', v_mod1_id, '1. APC opportunities', 'Benefit estimation; Base layer health; Project scoping.', 'text', 270, 1, false),
    ('c3060001-0001-0000-0000-000000000002', v_mod1_id, '2. Process modelling', 'Step tests; Model identification; Model quality.', 'text', 270, 2, false),
    ('c3060001-0002-0000-0000-000000000001', v_mod2_id, '3. MPC design', 'Variables and constraints; Tuning; Optimisation layer.', 'text', 270, 1, false),
    ('c3060001-0003-0000-0000-000000000001', v_mod3_id, '4. Commissioning', 'Simulation testing; Online commissioning; Operator training.', 'text', 270, 1, false),
    ('c3060001-0004-0000-0000-000000000001', v_mod4_id, '5. Performance monitoring', 'Service factor; Benefit tracking; Model drift.', 'text', 270, 1, false),
    ('c3060001-0004-0000-0000-000000000002', v_mod4_id, '6. Sustaining APC', 'Ownership; Model updates; Case studies.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: AD07 (Industrial IoT and edge analytics for operations)
  -- =========================================================================
  v_course_id := 'c3070000-0000-0000-0000-000000000007';
  v_mod1_id := 'd3070001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3070001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3070001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD07', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'Industrial IoT and edge analytics for operations',
    'Industrial IoT puts sensors and edge computers on equipment that was never connected before. This course shows how to design IIoT solutions that give useful operating data at low cost and with sound security.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 5 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe IIoT architectures from sensor to cloud',
      'Select wireless sensors, gateways and edge devices',
      'Build simple edge analytics for equipment health',
      'Secure IIoT devices and data flows',
      'Build a business case for an IIoT pilot'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Build an edge analytics pipeline for pump vibration data',
      'Design a secure architecture for a remote site'
    ],
    ARRAY['IEC 62443', 'ISA 95', 'OPC UA IEC 62541'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: IIoT Architecture & Wireless Sensors', 1),
    (v_mod2_id, v_course_id, 'Day 2: Edge Analytics', 2),
    (v_mod3_id, v_course_id, 'Day 3: Security & Business Case', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3070001-0001-0000-0000-000000000001', v_mod1_id, '1. IIoT architecture', 'Sensors, gateways and platforms; MQTT and OPC UA; Cloud and on premises options.', 'text', 240, 1, false),
    ('c3070001-0001-0000-0000-000000000002', v_mod1_id, '2. Wireless and sensors', 'WirelessHART, LoRaWAN and cellular; Battery life; Installation.', 'text', 240, 2, false),
    ('c3070001-0002-0000-0000-000000000001', v_mod2_id, '3. Edge analytics', 'Data cleaning; Simple models; Alerts.', 'text', 240, 1, false),
    ('c3070001-0003-0000-0000-000000000001', v_mod3_id, '4. Security', 'Device hardening; Network segmentation; Identity and certificates.', 'text', 240, 1, false),
    ('c3070001-0003-0000-0000-000000000002', v_mod3_id, '5. Business case', 'Pilot design; Scaling; Value tracking.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: AD08 (Digital twins for asset performance management)
  -- =========================================================================
  v_course_id := 'c3080000-0000-0000-0000-000000000008';
  v_mod1_id := 'd3080001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3080001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3080001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD08', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_digital_id, 'Digital operations and plant intelligence',
    'Digital twins for asset performance management',
    'Digital twins link plant models with live data so teams can predict performance and test decisions before they are made. This advanced course explains twin types, data foundations and how to deliver value rather than expensive visualisations.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Distinguish engineering, process and asset performance twins',
      'Define data and model needs for a twin use case',
      'Use twins for performance, maintenance and training decisions',
      'Plan and govern a twin programme',
      'Evaluate vendor proposals critically'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Define a twin use case and data plan for a gas plant',
      'Review a vendor twin proposal and list questions'
    ],
    ARRAY['ISO 23247', 'ISO 55001', 'ISA 95'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Twin Concepts & Data Foundations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Process and Asset Models', 2),
    (v_mod3_id, v_course_id, 'Day 3: Use Cases & Programme Delivery', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3080001-0001-0000-0000-000000000001', v_mod1_id, '1. Twin concepts', 'Types and maturity; Hype and reality; Value chains.', 'text', 240, 1, false),
    ('c3080001-0001-0000-0000-000000000002', v_mod1_id, '2. Data foundations', 'Data quality; Integration; Engineering data.', 'text', 240, 2, false),
    ('c3080001-0002-0000-0000-000000000001', v_mod2_id, '3. Process and asset models', 'First principles models; Data driven models; Hybrid models.', 'text', 240, 1, false),
    ('c3080001-0003-0000-0000-000000000001', v_mod3_id, '4. Use cases', 'Performance; Maintenance; Training.', 'text', 240, 1, false),
    ('c3080001-0003-0000-0000-000000000002', v_mod3_id, '5. Programme delivery', 'Governance; Value tracking; Vendor selection.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: AD09 (Applied AI and machine learning for process and maintenance engineers)
  -- =========================================================================
  v_course_id := 'c3090000-0000-0000-0000-000000000009';
  v_mod1_id := 'd3090001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3090001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3090001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3090001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3090001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD09', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_digital_id, 'Digital operations and plant intelligence',
    'Applied AI and machine learning for process and maintenance engineers',
    'Machine learning can predict failures, detect anomalies and improve process control, but projects fail without good data and engineering judgement. This competence course teaches engineers to build and test practical machine learning models on plant data using Python.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Apr 5 to 9, Oct 11 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Prepare plant time series data for analysis',
      'Build regression, classification and anomaly detection models',
      'Evaluate models with engineering judgement and correct metrics',
      'Deploy simple models and monitor them',
      'Explain results to operations and maintenance teams'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Build a soft sensor for a column product quality',
      'Build an anomaly detector for compressor data',
      'Present a capstone result to a panel'
    ],
    ARRAY['ISO/IEC 23053', 'ISO/IEC 42001', 'ISA 95'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Data and Python Basics', 1),
    (v_mod2_id, v_course_id, 'Day 2: Data Preparation & Regression', 2),
    (v_mod3_id, v_course_id, 'Day 3: Classification', 3),
    (v_mod4_id, v_course_id, 'Day 4: Anomaly Detection & Deployment', 4),
    (v_mod5_id, v_course_id, 'Day 5: Project and Assessment', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3090001-0001-0000-0000-000000000001', v_mod1_id, '1. Data and Python basics', 'Python tools; Historian exports; Notebooks.', 'text', 300, 1, false),
    ('c3090001-0002-0000-0000-000000000001', v_mod2_id, '2. Data preparation', 'Cleaning; Feature engineering; Train and test splits.', 'text', 300, 1, false),
    ('c3090001-0002-0000-0000-000000000002', v_mod2_id, '3. Regression', 'Soft sensors; Performance models; Metrics.', 'text', 300, 2, false),
    ('c3090001-0003-0000-0000-000000000001', v_mod3_id, '4. Classification', 'Failure prediction; Imbalanced data; Confusion matrices.', 'text', 300, 1, false),
    ('c3090001-0004-0000-0000-000000000001', v_mod4_id, '5. Anomaly detection', 'Unsupervised methods; Thresholds; False alarms.', 'text', 300, 1, false),
    ('c3090001-0004-0000-0000-000000000002', v_mod4_id, '6. Deployment', 'Model monitoring; MLOps basics; Governance.', 'text', 300, 2, false),
    ('c3090001-0005-0000-0000-000000000001', v_mod5_id, '7. Project and assessment', 'Capstone project; Presentation; Assessment.', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
