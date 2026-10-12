-- Migration: Seed Courses MM06 to MM10
-- Domain 4: Measurement and Management
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_mm_id UUID;
  v_subcat_flow_id UUID;
  v_subcat_elec_id UUID;
  v_subcat_inst_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category
  SELECT id INTO v_cat_mm_id FROM public.course_categories WHERE slug = 'measurement-and-management' OR domain_no = 4 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_flow_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'flow-metering' LIMIT 1;
  IF v_subcat_flow_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Flow metering', 'flow-metering', 2)
    RETURNING id INTO v_subcat_flow_id;
  END IF;

  SELECT id INTO v_subcat_elec_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'electricity-and-energy-metering' LIMIT 1;
  IF v_subcat_elec_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Electricity and energy metering', 'electricity-and-energy-metering', 3)
    RETURNING id INTO v_subcat_elec_id;
  END IF;

  SELECT id INTO v_subcat_inst_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'level-pressure-and-temperature-instrumentation' LIMIT 1;
  IF v_subcat_inst_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Level, pressure and temperature instrumentation', 'level-pressure-and-temperature-instrumentation', 4)
    RETURNING id INTO v_subcat_inst_id;
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
  -- COURSE 6: MM06 (Multiphase and wet gas flow metering)
  -- =========================================================================
  v_course_id := 'ca060000-0000-0000-0000-000000000006';
  v_mod1_id := 'da060001-0000-0000-0000-000000000001';
  v_mod2_id := 'da060001-0000-0000-0000-000000000002';
  v_mod3_id := 'da060001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM06', 4, 'flow_measurement', v_cat_mm_id, v_subcat_flow_id, 'Flow metering',
    'Multiphase and wet gas flow metering',
    'Multiphase and wet gas meters measure oil, water and gas without separation and are now used for allocation and well testing. This advanced course covers their principles, uncertainty, validation and the conditions in which they can be trusted.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 24 to 26, Nov 8 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain multiphase flow regimes and their effects on measurement',
      'Compare multiphase and wet gas meter technologies',
      'Plan meter validation against test separators',
      'Assess uncertainty and allocation suitability',
      'Specify meters for wells and fields'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Validate a multiphase meter against test separator data',
      'Select a meter for a wet gas field'
    ],
    ARRAY['API MPMS Chapter 20.3', 'ISO/TR 11583', 'NFOGM handbook'],
    ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: Multiphase Flow & Meter Technologies', 1),
    (v_mod2_id, v_course_id, 'Day 2: Wet Gas Metering', 2),
    (v_mod3_id, v_course_id, 'Day 3: Validation & Applications', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea060001-0001-0000-0000-000000000001', v_mod1_id, '1. Multiphase flow', 'Flow regimes; GVF and water cut; Slip.', 'text', 240, 1, false),
    ('ea060001-0001-0000-0000-000000000002', v_mod1_id, '2. Meter technologies', 'Gamma based meters; Microwave and impedance meters; Venturi based meters.', 'text', 240, 2, false),
    ('ea060001-0002-0000-0000-000000000001', v_mod2_id, '3. Wet gas metering', 'Over reading corrections; Liquid detection; Uncertainty.', 'text', 240, 1, false),
    ('ea060001-0003-0000-0000-000000000001', v_mod3_id, '4. Validation', 'Test separator comparison; PVT data; Calibration.', 'text', 240, 1, false),
    ('ea060001-0003-0000-0000-000000000002', v_mod3_id, '5. Applications', 'Allocation; Well testing; Specification.', 'text', 300, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 7: MM07 (Smart metering and AMI for electricity utilities)
  -- =========================================================================
  v_course_id := 'ca070000-0000-0000-0000-000000000007';
  v_mod1_id := 'da070001-0000-0000-0000-000000000001';
  v_mod2_id := 'da070001-0000-0000-0000-000000000002';
  v_mod3_id := 'da070001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM07', 4, 'flow_measurement', v_cat_mm_id, v_subcat_elec_id, 'Electricity and energy metering',
    'Smart metering and AMI for electricity utilities',
    'Smart meters and advanced metering infrastructure are central to cutting losses and improving billing for electricity distribution companies. This course covers meter technology, AMI architecture, communications, data management and the practical issues of large meter rollouts.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 17 to 19, Nov 8 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain smart and prepaid meter technology and accuracy classes',
      'Describe AMI architecture from meter to head end and meter data management',
      'Compare PLC, RF mesh and cellular communications for a service area',
      'Plan a meter rollout covering procurement, installation and customer issues',
      'Use meter data for billing, loss reduction and network planning'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Power generation, transmission and distribution',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Design an AMI rollout plan for a distribution zone',
      'Compare communication options for urban and rural areas'
    ],
    ARRAY['IEC 62052', 'IEC 62053', 'IEC 62056 DLMS/COSEM', 'NERC metering code'],
    ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: Meter Technology & AMI Architecture', 1),
    (v_mod2_id, v_course_id, 'Day 2: Communications Infrastructure', 2),
    (v_mod3_id, v_course_id, 'Day 3: Meter Data Management & Rollout Delivery', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea070001-0001-0000-0000-000000000001', v_mod1_id, '1. Meter technology', 'Smart and prepaid meters; Accuracy classes; Tamper detection.', 'text', 270, 1, false),
    ('ea070001-0001-0000-0000-000000000002', v_mod1_id, '2. AMI architecture', 'Head end systems; Data concentrators; Standards and interoperability.', 'text', 270, 2, false),
    ('ea070001-0002-0000-0000-000000000001', v_mod2_id, '3. Communications', 'Power line carrier; RF mesh; Cellular.', 'text', 270, 1, false),
    ('ea070001-0003-0000-0000-000000000001', v_mod3_id, '4. Meter data management', 'Validation, estimation and editing; Billing integration.', 'text', 180, 1, false),
    ('ea070001-0003-0000-0000-000000000002', v_mod3_id, '5. Rollout delivery', 'Procurement and testing; Installation logistics; Customer engagement.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 8: MM08 (Energy management systems and ISO 50001 implementation)
  -- =========================================================================
  v_course_id := 'ca080000-0000-0000-0000-000000000008';
  v_mod1_id := 'da080001-0000-0000-0000-000000000001';
  v_mod2_id := 'da080001-0000-0000-0000-000000000002';
  v_mod3_id := 'da080001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM08', 4, 'flow_measurement', v_cat_mm_id, v_subcat_elec_id, 'Electricity and energy metering',
    'Energy management systems and ISO 50001 implementation',
    'ISO 50001 gives organisations a structured way to cut energy use and cost and to prove the savings. This course covers energy management system requirements, energy reviews, baselines and measurement and verification, and prepares participants for implementation and certification work.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Exam prep', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain the requirements of ISO 50001 and how they fit other management systems',
      'Carry out an energy review and identify significant energy uses',
      'Set energy baselines and energy performance indicators',
      'Plan and prioritise energy saving actions',
      'Verify savings using recognised measurement and verification methods'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Run an energy review on a plant data set',
      'Build a regression baseline and EnPI',
      'Draft an internal audit checklist'
    ],
    ARRAY['ISO 50001', 'ISO 50006', 'ISO 50015', 'IPMVP'],
    ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: ISO 50001 Requirements & Energy Review', 1),
    (v_mod2_id, v_course_id, 'Day 2: Baselines and Indicators', 2),
    (v_mod3_id, v_course_id, 'Day 3: Action Planning, Verification and Audit', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea080001-0001-0000-0000-000000000001', v_mod1_id, '1. ISO 50001 requirements', 'Structure and clauses; Leadership and policy; Integration with ISO 9001 and ISO 14001.', 'text', 240, 1, false),
    ('ea080001-0001-0000-0000-000000000002', v_mod1_id, '2. Energy review', 'Data collection and metering; Significant energy uses; Opportunities register.', 'text', 240, 2, false),
    ('ea080001-0002-0000-0000-000000000001', v_mod2_id, '3. Baselines and indicators', 'Regression baselines; EnPIs; Normalisation.', 'text', 300, 1, false),
    ('ea080001-0003-0000-0000-000000000001', v_mod3_id, '4. Action planning', 'Prioritising measures; Operational control; Procurement and design.', 'text', 240, 1, false),
    ('ea080001-0003-0000-0000-000000000002', v_mod3_id, '5. Measurement, verification and audit', 'IPMVP options; Internal audit; Certification readiness.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 9: MM09 (Revenue protection and loss reduction in electricity distribution)
  -- =========================================================================
  v_course_id := 'ca090000-0000-0000-0000-000000000009';
  v_mod1_id := 'da090001-0000-0000-0000-000000000001';
  v_mod2_id := 'da090001-0000-0000-0000-000000000002';
  v_mod3_id := 'da090001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM09', 4, 'flow_measurement', v_cat_mm_id, v_subcat_elec_id, 'Electricity and energy metering',
    'Revenue protection and loss reduction in electricity distribution',
    'Technical and commercial losses drain the revenue of electricity distribution companies, and regulators now tie tariffs to loss reduction. This course explains how to measure losses, detect theft and meter tampering, and run revenue protection programmes that last.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 14 to 16, Dec 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Separate technical and commercial losses using energy balances',
      'Use meter and billing data analytics to find theft and tampering',
      'Plan field inspection and enforcement campaigns',
      'Design revenue protection programmes with clear KPIs',
      'Engage communities and regulators on loss reduction'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Power generation, transmission and distribution',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Build a feeder energy balance and estimate losses',
      'Rank customers for inspection using meter data'
    ],
    ARRAY['IEC 62053', 'NERC regulations', 'IEC 62056'],
    ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: Understanding Losses & Detection Analytics', 1),
    (v_mod2_id, v_course_id, 'Day 2: Field Operations', 2),
    (v_mod3_id, v_course_id, 'Day 3: Programme Design & Engagement', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea090001-0001-0000-0000-000000000001', v_mod1_id, '1. Understanding losses', 'Energy balance by feeder; Technical losses; Commercial losses.', 'text', 240, 1, false),
    ('ea090001-0001-0000-0000-000000000002', v_mod1_id, '2. Detection and analytics', 'Consumption analytics; Tamper alarms; Data driven targeting.', 'text', 240, 2, false),
    ('ea090001-0002-0000-0000-000000000001', v_mod2_id, '3. Field operations', 'Inspection methods; Evidence and enforcement; Safety.', 'text', 300, 1, false),
    ('ea090001-0003-0000-0000-000000000001', v_mod3_id, '4. Programme design', 'KPIs; Incentives; Regulatory reporting.', 'text', 240, 1, false),
    ('ea090001-0003-0000-0000-000000000002', v_mod3_id, '5. Engagement and case studies', 'Community engagement; Utility case studies; Lessons learned.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 10: MM10 (Pressure, temperature and level instrumentation in practice)
  -- =========================================================================
  v_course_id := 'ca100000-0000-0000-0000-000000000010';
  v_mod1_id := 'da100001-0000-0000-0000-000000000001';
  v_mod2_id := 'da100001-0000-0000-0000-000000000002';
  v_mod3_id := 'da100001-0000-0000-0000-000000000003';
  v_mod4_id := 'da100001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM10', 4, 'flow_measurement', v_cat_mm_id, v_subcat_inst_id, 'Level, pressure and temperature instrumentation',
    'Pressure, temperature and level instrumentation in practice',
    'Pressure, temperature and level instruments are the most common measurements in any plant. This foundation competence course teaches technicians how these instruments work, how to install and calibrate them, and how to recognise faults.',
    v_instructor_id, 'beginner', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 8 to 11, Aug 23 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain pressure, temperature and level measurement principles',
      'Install and connect transmitters, thermowells and level devices correctly',
      'Calibrate common instruments and record results',
      'Recognise and correct common installation and measurement faults',
      'Work safely on instruments in live plants'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Calibrate pressure and temperature transmitters on the bench',
      'Commission a radar level transmitter on a tank rig',
      'Find faults in impulse line installations'
    ],
    ARRAY['ISA 51.1', 'IEC 61298', 'IEC 60751', 'IEC 60584'],
    ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: Pressure & Temperature Measurement', 1),
    (v_mod2_id, v_course_id, 'Day 2: Level Measurement', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation Practice', 3),
    (v_mod4_id, v_course_id, 'Day 4: Fault Finding & Practical Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea100001-0001-0000-0000-000000000001', v_mod1_id, '1. Pressure measurement', 'Gauges, switches and transmitters; Impulse lines and manifolds; Calibration.', 'text', 270, 1, false),
    ('ea100001-0001-0000-0000-000000000002', v_mod1_id, '2. Temperature measurement', 'Thermocouples and RTDs; Thermowells; Calibration.', 'text', 270, 2, false),
    ('ea100001-0002-0000-0000-000000000001', v_mod2_id, '3. Level measurement', 'DP and displacer; Radar and guided wave; Interface level.', 'text', 270, 1, false),
    ('ea100001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation practice', 'Mounting and tubing; Hazardous area points; Isolation for work.', 'text', 330, 1, false),
    ('ea100001-0004-0000-0000-000000000001', v_mod4_id, '5. Fault finding', 'Plugged lines; Drift; Wiring faults.', 'text', 270, 1, false),
    ('ea100001-0004-0000-0000-000000000002', v_mod4_id, '6. Practical assessment', 'Calibration task; Fault task; Written test.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
