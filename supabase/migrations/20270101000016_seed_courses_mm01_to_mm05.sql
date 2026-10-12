-- Migration: Seed Courses MM01 to MM05
-- Domain 4: Measurement and Management
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_mm_id UUID;
  v_subcat_custody_id UUID;
  v_subcat_flow_id UUID;
  v_subcat_assurance_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category
  SELECT id INTO v_cat_mm_id FROM public.course_categories WHERE slug = 'measurement-and-management' OR domain_no = 4 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_custody_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'custody-transfer-metering-systems' LIMIT 1;
  IF v_subcat_custody_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Custody transfer metering systems', 'custody-transfer-metering-systems', 1)
    RETURNING id INTO v_subcat_custody_id;
  END IF;

  SELECT id INTO v_subcat_flow_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'flow-metering' LIMIT 1;
  IF v_subcat_flow_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Flow metering', 'flow-metering', 2)
    RETURNING id INTO v_subcat_flow_id;
  END IF;

  SELECT id INTO v_subcat_assurance_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'measurement-uncertainty-and-assurance' LIMIT 1;
  IF v_subcat_assurance_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Measurement uncertainty and assurance', 'measurement-uncertainty-and-assurance', 7)
    RETURNING id INTO v_subcat_assurance_id;
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
  -- COURSE 1: MM01 (Custody transfer metering systems for oil and gas)
  -- =========================================================================
  v_course_id := 'ca010000-0000-0000-0000-000000000001';
  v_mod1_id := 'da010001-0000-0000-0000-000000000001';
  v_mod2_id := 'da010001-0000-0000-0000-000000000002';
  v_mod3_id := 'da010001-0000-0000-0000-000000000003';
  v_mod4_id := 'da010001-0000-0000-0000-000000000004';
  v_mod5_id := 'da010001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM01', 4, 'flow_measurement', v_cat_mm_id, v_subcat_custody_id, 'Custody transfer metering systems',
    'Custody transfer metering systems for oil and gas',
    'Custody transfer meters decide how much money changes hands between producers, transporters, buyers and government, so small errors cost a great deal. This course explains how fiscal metering systems are designed, operated, verified and audited for oil and gas.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 3 to 7, Nov 15 to 19. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the components of liquid and gas custody transfer metering systems',
      'Explain the contractual and regulatory basis of fiscal measurement',
      'Select meters, provers, analysers and flow computers for a duty',
      'Operate a metering station and handle alarms and exceptions',
      'Prepare for metering audits and dispute resolution'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Walk through a metering skid P&ID and identify every measurement element',
      'Recalculate a day''s custody volume from raw data',
      'Handle a mismeasurement event and prepare the correction report'
    ],
    ARRAY['API MPMS', 'ISO 5167', 'AGA 9', 'AGA 3', 'OIML R 117', 'NUPRC measurement regulations'],
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
    (v_mod1_id, v_course_id, 'Day 1: Fiscal Measurement Framework', 1),
    (v_mod2_id, v_course_id, 'Day 2: Metering System Design & Meter Technologies', 2),
    (v_mod3_id, v_course_id, 'Day 3: Flow Computers and Calculations', 3),
    (v_mod4_id, v_course_id, 'Day 4: Station Operation & Verification and Maintenance', 4),
    (v_mod5_id, v_course_id, 'Day 5: Audits and Disputes', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea010001-0001-0000-0000-000000000001', v_mod1_id, '1. Fiscal measurement framework', 'Contracts and allocation; Regulatory requirements in Nigeria; International standards.', 'text', 300, 1, false),
    ('ea010001-0002-0000-0000-000000000001', v_mod2_id, '2. Metering system design', 'Meter runs and redundancy; Provers and master meters; Sampling and analysers.', 'text', 300, 1, false),
    ('ea010001-0002-0000-0000-000000000002', v_mod2_id, '3. Meter technologies', 'Turbine and ultrasonic meters; Coriolis and orifice meters; Strengths and limits.', 'text', 300, 2, false),
    ('ea010001-0003-0000-0000-000000000001', v_mod3_id, '4. Flow computers and calculations', 'Volume and mass calculations; Correction factors; Audit trails.', 'text', 300, 1, false),
    ('ea010001-0004-0000-0000-000000000001', v_mod4_id, '5. Station operation', 'Daily checks; Alarms and exceptions; Mismeasurement procedures.', 'text', 300, 1, false),
    ('ea010001-0004-0000-0000-000000000002', v_mod4_id, '6. Verification and maintenance', 'Proving and verification; Calibration intervals; Maintenance records.', 'text', 300, 2, false),
    ('ea010001-0005-0000-0000-000000000001', v_mod5_id, '7. Audits and disputes', 'Audit preparation; Dispute case studies; Co mingled pipelines.', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: MM02 (Gas measurement with ultrasonic, Coriolis and orifice meters to AGA and ISO 5167)
  -- =========================================================================
  v_course_id := 'ca020000-0000-0000-0000-000000000002';
  v_mod1_id := 'da020001-0000-0000-0000-000000000001';
  v_mod2_id := 'da020001-0000-0000-0000-000000000002';
  v_mod3_id := 'da020001-0000-0000-0000-000000000003';
  v_mod4_id := 'da020001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM02', 4, 'flow_measurement', v_cat_mm_id, v_subcat_flow_id, 'Flow metering',
    'Gas measurement with ultrasonic, Coriolis and orifice meters to AGA and ISO 5167',
    'Gas is sold by energy and volume measured by ultrasonic, Coriolis and orifice meters, each with its own error sources. This advanced course covers the theory, installation, diagnostics and calculation standards for fiscal gas measurement.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 22 to 25. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain operating principles and uncertainty of ultrasonic, Coriolis and orifice gas meters',
      'Apply AGA 3, AGA 7, AGA 8, AGA 9, AGA 11 and ISO 5167 calculations',
      'Specify installation, flow conditioning and straight length',
      'Use meter diagnostics to detect fouling and drift',
      'Calculate energy from gas composition'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Calculate flow through an orifice meter to ISO 5167',
      'Interpret ultrasonic meter diagnostics for fouling',
      'Build an uncertainty budget for a gas station'
    ],
    ARRAY['ISO 5167', 'AGA 3', 'AGA 8', 'AGA 9', 'AGA 11', 'ISO 6976'],
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
    (v_mod1_id, v_course_id, 'Day 1: Gas Properties & Orifice Metering', 1),
    (v_mod2_id, v_course_id, 'Day 2: Ultrasonic Metering', 2),
    (v_mod3_id, v_course_id, 'Day 3: Coriolis Metering for Gas', 3),
    (v_mod4_id, v_course_id, 'Day 4: Installation, Conditioning & Energy and Uncertainty', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea020001-0001-0000-0000-000000000001', v_mod1_id, '1. Gas properties', 'Compressibility and AGA 8; Density and heating value; Gas chromatographs.', 'text', 300, 1, false),
    ('ea020001-0001-0000-0000-000000000002', v_mod1_id, '2. Orifice metering', 'ISO 5167 and AGA 3; Plate inspection; Flow conditioning.', 'text', 300, 2, false),
    ('ea020001-0002-0000-0000-000000000001', v_mod2_id, '3. Ultrasonic metering', 'AGA 9 principles; Path configurations; Diagnostics.', 'text', 300, 1, false),
    ('ea020001-0003-0000-0000-000000000001', v_mod3_id, '4. Coriolis metering for gas', 'AGA 11; Pressure effects; Zero verification.', 'text', 300, 1, false),
    ('ea020001-0004-0000-0000-000000000001', v_mod4_id, '5. Installation and conditioning', 'Straight lengths; Conditioners; Temperature and pressure measurement.', 'text', 300, 1, false),
    ('ea020001-0004-0000-0000-000000000002', v_mod4_id, '6. Energy and uncertainty', 'Energy calculation; Uncertainty budgets.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: MM03 (Liquid hydrocarbon measurement to API MPMS)
  -- =========================================================================
  v_course_id := 'ca030000-0000-0000-0000-000000000003';
  v_mod1_id := 'da030001-0000-0000-0000-000000000001';
  v_mod2_id := 'da030001-0000-0000-0000-000000000002';
  v_mod3_id := 'da030001-0000-0000-0000-000000000003';
  v_mod4_id := 'da030001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM03', 4, 'flow_measurement', v_cat_mm_id, v_subcat_custody_id, 'Custody transfer metering systems',
    'Liquid hydrocarbon measurement to API MPMS',
    'Crude oil and products are measured by volume at changing temperatures and pressures, with water and sediment present. This course covers liquid measurement to API MPMS, from meters and tanks to sampling, net volume and reconciliation.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 3 to 6, Nov 22 to 25. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Apply temperature and pressure correction factors to liquid volumes',
      'Operate turbine, positive displacement and Coriolis liquid meters',
      'Take and analyse representative samples for density and water',
      'Calculate gross and net standard volumes',
      'Reconcile meter and tank figures'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Calculate net standard volume for a cargo using API tables',
      'Investigate a meter and tank imbalance'
    ],
    ARRAY['API MPMS Chapters 4, 5, 8, 11 and 12', 'ISO 91', 'ASTM D4006'],
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
    (v_mod1_id, v_course_id, 'Day 1: Liquid Measurement Basics & Meters', 1),
    (v_mod2_id, v_course_id, 'Day 2: Correction Factors', 2),
    (v_mod3_id, v_course_id, 'Day 3: Sampling and Quality', 3),
    (v_mod4_id, v_course_id, 'Day 4: Calculations & Reconciliation', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea030001-0001-0000-0000-000000000001', v_mod1_id, '1. Liquid measurement basics', 'Volume terms; API gravity and density; Reference conditions.', 'text', 270, 1, false),
    ('ea030001-0001-0000-0000-000000000002', v_mod1_id, '2. Meters', 'Turbine; Positive displacement; Coriolis.', 'text', 270, 2, false),
    ('ea030001-0002-0000-0000-000000000001', v_mod2_id, '3. Correction factors', 'CTL and CPL; Meter factors; API tables.', 'text', 270, 1, false),
    ('ea030001-0003-0000-0000-000000000001', v_mod3_id, '4. Sampling and quality', 'Automatic samplers; Water and sediment; Density measurement.', 'text', 270, 1, false),
    ('ea030001-0004-0000-0000-000000000001', v_mod4_id, '5. Calculations', 'Gross and net standard volume; Measurement tickets; Rounding rules.', 'text', 270, 1, false),
    ('ea030001-0004-0000-0000-000000000002', v_mod4_id, '6. Reconciliation', 'Meter versus tank; Loss analysis; Reporting.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: MM04 (Fiscal metering oversight: witnessing, audit and allocation for regulators)
  -- =========================================================================
  v_course_id := 'ca040000-0000-0000-0000-000000000004';
  v_mod1_id := 'da040001-0000-0000-0000-000000000001';
  v_mod2_id := 'da040001-0000-0000-0000-000000000002';
  v_mod3_id := 'da040001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM04', 4, 'flow_measurement', v_cat_mm_id, v_subcat_assurance_id, 'Measurement uncertainty and assurance',
    'Fiscal metering oversight: witnessing, audit and allocation for regulators',
    'Regulators and ministries witness metering, audit allocation and settle disputes, often with operator experts on the other side of the table. This course gives regulatory staff the technical grounding to oversee fiscal measurement with confidence.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 3 to 5, Nov 15 to 17. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain fiscal metering and allocation in plain terms',
      'Plan and carry out a witness test or audit',
      'Review calibration and proving records for compliance',
      'Identify common sources of mismeasurement and manipulation',
      'Assess allocation methods for fairness'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Audit a metering station record set against regulations',
      'Review an allocation report and raise findings'
    ],
    ARRAY['API MPMS Chapter 20', 'ISO 5167', 'NUPRC measurement regulations', 'OIML R 117'],
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
    (v_mod1_id, v_course_id, 'Day 1: Regulatory Role & Metering Basics for Regulators', 1),
    (v_mod2_id, v_course_id, 'Day 2: Witnessing and Audits', 2),
    (v_mod3_id, v_course_id, 'Day 3: Allocation & Case Studies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea040001-0001-0000-0000-000000000001', v_mod1_id, '1. Regulatory role', 'Legal basis; Responsibilities; Revenue impact.', 'text', 240, 1, false),
    ('ea040001-0001-0000-0000-000000000002', v_mod1_id, '2. Metering basics for regulators', 'Meter types; Key uncertainties; Red flags.', 'text', 240, 2, false),
    ('ea040001-0002-0000-0000-000000000001', v_mod2_id, '3. Witnessing and audits', 'Audit checklists; Witness tests; Records review.', 'text', 240, 1, false),
    ('ea040001-0003-0000-0000-000000000001', v_mod3_id, '4. Allocation', 'Allocation methods; Common disputes; Data checks.', 'text', 240, 1, false),
    ('ea040001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Mismeasurement cases; Loss cases; Enforcement.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: MM05 (Flow measurement fundamentals for technicians)
  -- =========================================================================
  v_course_id := 'ca050000-0000-0000-0000-000000000005';
  v_mod1_id := 'da050001-0000-0000-0000-000000000001';
  v_mod2_id := 'da050001-0000-0000-0000-000000000002';
  v_mod3_id := 'da050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM05', 4, 'flow_measurement', v_cat_mm_id, v_subcat_flow_id, 'Flow metering',
    'Flow measurement fundamentals for technicians',
    'Flow measurement is part of daily work for instrument and operations technicians, and many flow errors come from installation and basic setup. This foundation competence course covers the main flow meter types, how they are installed and checked, and the common faults.',
    v_instructor_id, 'beginner', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain basic flow measurement principles',
      'Identify DP, magnetic, vortex, turbine and Coriolis meters',
      'Check installation requirements',
      'Carry out basic verification and zero checks',
      'Diagnose common faults'
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
      'Check and zero meters on a flow rig',
      'Diagnose installation faults'
    ],
    ARRAY['ISO 5167', 'ISO 9104', 'ISA RP31.1'],
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
    (v_mod1_id, v_course_id, 'Day 1: Flow Principles & DP Meters', 1),
    (v_mod2_id, v_course_id, 'Day 2: Electronic Meters', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation, Checks & Fault Finding', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea050001-0001-0000-0000-000000000001', v_mod1_id, '1. Flow principles', 'Velocity and volume; Reynolds number; Mass and volume flow.', 'text', 240, 1, false),
    ('ea050001-0001-0000-0000-000000000002', v_mod1_id, '2. DP meters', 'Orifice and venturi; Transmitter setup; Square root extraction.', 'text', 240, 2, false),
    ('ea050001-0002-0000-0000-000000000001', v_mod2_id, '3. Electronic meters', 'Magnetic; Vortex; Coriolis.', 'text', 240, 1, false),
    ('ea050001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation and checks', 'Straight lengths; Zero checks; Grounding.', 'text', 240, 1, false),
    ('ea050001-0003-0000-0000-000000000002', v_mod3_id, '5. Fault finding and assessment', 'Common faults; Practical test; Written test.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
