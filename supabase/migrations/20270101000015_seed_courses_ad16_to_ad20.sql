-- Migration: Seed Courses AD16, AD17, AD18, AD19, AD20
-- Domain 3: Integrated Automation and Digital Operations
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ad_id UUID;
  v_subcat_ad_digital_id UUID;
  v_subcat_ad_networks_id UUID;
  v_subcat_ad_electrical_id UUID;
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

  SELECT id INTO v_subcat_ad_electrical_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'electrical-and-instrumentation' LIMIT 1;
  IF v_subcat_ad_electrical_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Electrical and instrumentation', 'electrical-and-instrumentation', 4)
    RETURNING id INTO v_subcat_ad_electrical_id;
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
  -- COURSE 1: AD16 (Remote and integrated operations centres)
  -- =========================================================================
  v_course_id := 'c3160000-0000-0000-0000-000000000016';
  v_mod1_id := 'd3160001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3160001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD16', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_digital_id, 'Digital operations and plant intelligence',
    'Remote and integrated operations centres',
    'Remote and integrated operations centres let small expert teams support many assets from one place, cutting travel, risk and response time. This short executive course explains the operating model, technology needs, people changes and business case.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 19. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain integrated and remote operations models',
      'Identify technology and connectivity requirements',
      'Plan the organisational and role changes',
      'Build a business case and phased roadmap',
      'Manage risks including cyber security and resilience'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Outline a remote operations centre and roadmap for a group of onshore assets',
      'Build a risk register for remote operations'
    ],
    ARRAY['ISO 11064', 'IEC 62443', 'ISO 55001'],
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
    (v_mod1_id, v_course_id, 'Day 1: Operating Models & Technology', 1),
    (v_mod2_id, v_course_id, 'Day 2: People and Change & Business Case and Roadmap', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3160001-0001-0000-0000-000000000001', v_mod1_id, '1. Operating models', 'Remote support and remote control; Collaboration centres; Global examples.', 'text', 210, 1, false),
    ('c3160001-0001-0000-0000-000000000002', v_mod1_id, '2. Technology', 'Connectivity and resilience; Data platforms; Cyber security.', 'text', 210, 2, false),
    ('c3160001-0002-0000-0000-000000000001', v_mod2_id, '3. People and change', 'New roles; Staff engagement; Training.', 'text', 210, 1, false),
    ('c3160001-0002-0000-0000-000000000002', v_mod2_id, '4. Business case and roadmap', 'Value drivers; Phasing; Risks.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: AD17 (Process instrumentation calibration and maintenance)
  -- =========================================================================
  v_course_id := 'c3170000-0000-0000-0000-000000000017';
  v_mod1_id := 'd3170001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3170001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3170001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3170001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3170001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD17', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_electrical_id, 'Electrical and instrumentation',
    'Process instrumentation calibration and maintenance',
    'Accurate instruments are the basis of safe and efficient control, and calibration errors can hide real problems for months. This competence course trains technicians to calibrate and maintain pressure, temperature, level and flow instruments and to keep traceable records.',
    v_instructor_id, 'beginner', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain measurement principles, accuracy and uncertainty',
      'Calibrate pressure, temperature, level and flow transmitters',
      'Use calibrators and HART communicators correctly',
      'Diagnose common instrument faults',
      'Keep calibration records that meet audit requirements'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Calibrate pressure, temperature and level transmitters with documenting calibrators',
      'Diagnose three instrument faults on a rig'
    ],
    ARRAY['ISO/IEC 17025', 'ISA 51.1', 'IEC 61298'],
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
    (v_mod1_id, v_course_id, 'Day 1: Measurement Basics', 1),
    (v_mod2_id, v_course_id, 'Day 2: Pressure & Temperature Instruments', 2),
    (v_mod3_id, v_course_id, 'Day 3: Level Instruments', 3),
    (v_mod4_id, v_course_id, 'Day 4: Flow Instruments & Fault Finding and Records', 4),
    (v_mod5_id, v_course_id, 'Day 5: Practical Assessment', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3170001-0001-0000-0000-000000000001', v_mod1_id, '1. Measurement basics', 'Signals and ranges; Accuracy and uncertainty; Traceability.', 'text', 300, 1, false),
    ('c3170001-0002-0000-0000-000000000001', v_mod2_id, '2. Pressure instruments', 'Gauges and transmitters; Calibration procedure; Impulse lines.', 'text', 300, 1, false),
    ('c3170001-0002-0000-0000-000000000002', v_mod2_id, '3. Temperature instruments', 'RTDs and thermocouples; Dry block calibration; Thermowells.', 'text', 300, 2, false),
    ('c3170001-0003-0000-0000-000000000001', v_mod3_id, '4. Level instruments', 'DP, radar and displacer; Calibration methods; Interface level.', 'text', 300, 1, false),
    ('c3170001-0004-0000-0000-000000000001', v_mod4_id, '5. Flow instruments', 'DP, magnetic and vortex; Verification; Common errors.', 'text', 300, 1, false),
    ('c3170001-0004-0000-0000-000000000002', v_mod4_id, '6. Fault finding and records', 'Common faults; Calibration records; Intervals.', 'text', 300, 2, false),
    ('c3170001-0005-0000-0000-000000000001', v_mod5_id, '7. Practical assessment', 'Calibration tasks; Fault tasks; Written test.', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: AD18 (Hazardous area equipment: IECEx unit Ex 001 to Ex 004 preparation)
  -- =========================================================================
  v_course_id := 'c3180000-0000-0000-0000-000000000018';
  v_mod1_id := 'd3180001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3180001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3180001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3180001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3180001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD18', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_electrical_id, 'Electrical and instrumentation',
    'Hazardous area equipment: IECEx unit Ex 001 to Ex 004 preparation',
    'Anyone who installs, inspects or maintains equipment in hazardous areas must be competent in explosion protection. This course prepares candidates for IECEx personnel competence units Ex 001 to Ex 004 through theory, practical work and mock assessment.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 24 to 28, Nov 22 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain area classification, gas groups and temperature classes',
      'Describe protection concepts such as Ex d, Ex e, Ex i and Ex p',
      'Install Ex equipment and cable glands correctly',
      'Carry out visual, close and detailed inspections',
      'Prepare for the IECEx unit assessments'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Inspect a set of Ex equipment and record defects',
      'Install a flameproof gland and test it',
      'Complete a mock unit assessment'
    ],
    ARRAY['IEC 60079 10 1', 'IEC 60079 14', 'IEC 60079 17', 'IECEx OD 504'],
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
    (v_mod1_id, v_course_id, 'Day 1: Explosion Basics', 1),
    (v_mod2_id, v_course_id, 'Day 2: Area Classification & Protection Concepts', 2),
    (v_mod3_id, v_course_id, 'Day 3: Equipment Marking & Certification', 3),
    (v_mod4_id, v_course_id, 'Day 4: Installation & Inspection and Maintenance', 4),
    (v_mod5_id, v_course_id, 'Day 5: Assessment Preparation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3180001-0001-0000-0000-000000000001', v_mod1_id, '1. Explosion basics', 'Fire triangle; Gas and dust properties; Ignition sources.', 'text', 300, 1, false),
    ('c3180001-0002-0000-0000-000000000001', v_mod2_id, '2. Area classification', 'Zones; Gas groups and temperature classes; Classification drawings.', 'text', 300, 1, false),
    ('c3180001-0002-0000-0000-000000000002', v_mod2_id, '3. Protection concepts', 'Flameproof and increased safety; Intrinsic safety; Pressurisation and encapsulation.', 'text', 300, 2, false),
    ('c3180001-0003-0000-0000-000000000001', v_mod3_id, '4. Equipment marking and certification', 'Marking; Certificates and schemes; Conditions of use.', 'text', 300, 1, false),
    ('c3180001-0004-0000-0000-000000000001', v_mod4_id, '5. Installation', 'Cable glands and entries; Earthing and bonding; Intrinsically safe loops.', 'text', 300, 1, false),
    ('c3180001-0004-0000-0000-000000000002', v_mod4_id, '6. Inspection and maintenance', 'Inspection grades; Common defects; Records.', 'text', 300, 2, false),
    ('c3180001-0005-0000-0000-000000000001', v_mod5_id, '7. Assessment preparation', 'Unit requirements; Practical tasks; Mock assessment.', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: AD19 (HART, Foundation Fieldbus and wireless instrumentation)
  -- =========================================================================
  v_course_id := 'c3190000-0000-0000-0000-000000000019';
  v_mod1_id := 'd3190001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3190001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3190001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD19', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_electrical_id, 'Electrical and instrumentation',
    'HART, Foundation Fieldbus and wireless instrumentation',
    'Smart instruments carry diagnostic information that can cut maintenance costs, but only if technicians can configure them and read the data. This course covers HART, Foundation Fieldbus and WirelessHART devices and asset management software.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 19 to 21, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Configure HART devices with communicators and software',
      'Design and troubleshoot Foundation Fieldbus segments',
      'Commission WirelessHART networks',
      'Use asset management software to track device health',
      'Plan the move to intelligent device maintenance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Configure HART and fieldbus devices on a training segment',
      'Commission a small WirelessHART network'
    ],
    ARRAY['IEC 61158', 'IEC 62591', 'NAMUR NE 107'],
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
    (v_mod1_id, v_course_id, 'Day 1: HART & Foundation Fieldbus', 1),
    (v_mod2_id, v_course_id, 'Day 2: WirelessHART', 2),
    (v_mod3_id, v_course_id, 'Day 3: Asset Management Systems & Maintenance Practice', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3190001-0001-0000-0000-000000000001', v_mod1_id, '1. HART', 'Protocol basics; Device configuration; Multiplexers.', 'text', 240, 1, false),
    ('c3190001-0001-0000-0000-000000000002', v_mod1_id, '2. Foundation Fieldbus', 'Segment design; Function blocks; Diagnostics.', 'text', 240, 2, false),
    ('c3190001-0002-0000-0000-000000000001', v_mod2_id, '3. WirelessHART', 'Network design; Gateways; Battery life.', 'text', 240, 1, false),
    ('c3190001-0003-0000-0000-000000000001', v_mod3_id, '4. Asset management systems', 'Device diagnostics; NAMUR NE 107 status; Alerts.', 'text', 240, 1, false),
    ('c3190001-0003-0000-0000-000000000002', v_mod3_id, '5. Maintenance practice', 'Predictive maintenance using device data; Workflows; KPIs.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: AD20 (E and I commissioning and loop checking)
  -- =========================================================================
  v_course_id := 'c3200000-0000-0000-0000-000000000020';
  v_mod1_id := 'd3200001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3200001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3200001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3200001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD20', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_electrical_id, 'Electrical and instrumentation',
    'E and I commissioning and loop checking',
    'E and I commissioning is where design errors and construction faults surface, and good loop checking saves weeks at startup. This competence course trains technicians and engineers to plan and carry out E and I commissioning.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Apr 19 to 22, Oct 4 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Plan precommissioning and commissioning of E and I systems',
      'Carry out loop checks from field device to DCS',
      'Test cause and effect and interlocks',
      'Manage punch lists and handover records',
      'Work safely under commissioning permits'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Carry out loop checks on a training rig with loop folders',
      'Test a cause and effect matrix'
    ],
    ARRAY['IEC 62381', 'IEC 62382', 'IEC 60364 6'],
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
    (v_mod1_id, v_course_id, 'Day 1: Commissioning Planning & Electrical Checks', 1),
    (v_mod2_id, v_course_id, 'Day 2: Instrument Checks', 2),
    (v_mod3_id, v_course_id, 'Day 3: Loop Checks', 3),
    (v_mod4_id, v_course_id, 'Day 4: Functional Tests & Handover and Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3200001-0001-0000-0000-000000000001', v_mod1_id, '1. Commissioning planning', 'Systems and subsystems; Completion stages; Permits.', 'text', 270, 1, false),
    ('c3200001-0001-0000-0000-000000000002', v_mod1_id, '2. Electrical checks', 'Insulation and continuity; Motor and panel checks; Earthing.', 'text', 270, 2, false),
    ('c3200001-0002-0000-0000-000000000001', v_mod2_id, '3. Instrument checks', 'Device checks; Calibration verification; Hook up checks.', 'text', 270, 1, false),
    ('c3200001-0003-0000-0000-000000000001', v_mod3_id, '4. Loop checks', 'Analogue and digital loops; Valve stroking; Documentation.', 'text', 270, 1, false),
    ('c3200001-0004-0000-0000-000000000001', v_mod4_id, '5. Functional tests', 'Cause and effect testing; Interlocks; Sequences.', 'text', 270, 1, false),
    ('c3200001-0004-0000-0000-000000000002', v_mod4_id, '6. Handover and assessment', 'Punch lists; Records; Practical test.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
