-- Migration: Seed Courses MM11 to MM15
-- Domain 4: Measurement and Management
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_mm_id UUID;
  v_subcat_custody_id UUID;
  v_subcat_proving_id UUID;
  v_subcat_reporting_id UUID;
  v_subcat_assurance_id UUID;
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
  SELECT id INTO v_subcat_custody_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'custody-transfer-metering-systems' LIMIT 1;
  IF v_subcat_custody_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Custody transfer metering systems', 'custody-transfer-metering-systems', 1)
    RETURNING id INTO v_subcat_custody_id;
  END IF;

  SELECT id INTO v_subcat_proving_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'meter-proving-and-calibration-systems' LIMIT 1;
  IF v_subcat_proving_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Meter proving and calibration systems', 'meter-proving-and-calibration-systems', 5)
    RETURNING id INTO v_subcat_proving_id;
  END IF;

  SELECT id INTO v_subcat_reporting_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'measurement-data-acquisition-and-reporting' LIMIT 1;
  IF v_subcat_reporting_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Measurement data acquisition and reporting', 'measurement-data-acquisition-and-reporting', 6)
    RETURNING id INTO v_subcat_reporting_id;
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
  -- COURSE 11: MM11 (Tank gauging and inventory management)
  -- =========================================================================
  v_course_id := 'ca110000-0000-0000-0000-000000000011';
  v_mod1_id := 'da110001-0000-0000-0000-000000000001';
  v_mod2_id := 'da110001-0000-0000-0000-000000000002';
  v_mod3_id := 'da110001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM11', 4, 'flow_measurement', v_cat_mm_id, v_subcat_custody_id, 'Custody transfer metering systems',
    'Tank gauging and inventory management',
    'Tank gauging gives inventory and custody figures for crude, products and LPG storage, and gauging errors show up as unexplained losses. This course covers automatic tank gauging, manual dipping, tank calibration and inventory reconciliation.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 28 to 30, Dec 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain servo, radar and hydrostatic tank gauging methods',
      'Carry out manual gauging and sampling correctly',
      'Use tank calibration tables and corrections',
      'Calculate inventory and reconcile with meter figures',
      'Recognise sources of tank gauging error'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Calculate tank inventory from gauge and sample data',
      'Reconcile a month of tank and meter figures'
    ],
    ARRAY['API MPMS Chapter 3', 'API MPMS Chapter 2', 'ISO 4266', 'OIML R 85'],
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
    (v_mod1_id, v_course_id, 'Day 1: Gauging Methods & Tank Calibration', 1),
    (v_mod2_id, v_course_id, 'Day 2: Inventory Calculation', 2),
    (v_mod3_id, v_course_id, 'Day 3: Reconciliation, Losses & Accuracy', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea110001-0001-0000-0000-000000000001', v_mod1_id, '1. Gauging methods', 'Manual dipping; Radar and servo gauges; Hybrid systems.', 'text', 240, 1, false),
    ('ea110001-0001-0000-0000-000000000002', v_mod1_id, '2. Tank calibration', 'Strapping tables; Floating roof corrections; Recalibration triggers.', 'text', 240, 2, false),
    ('ea110001-0002-0000-0000-000000000001', v_mod2_id, '3. Inventory calculation', 'Temperature and density; Free water; Net volumes.', 'text', 300, 1, false),
    ('ea110001-0003-0000-0000-000000000001', v_mod3_id, '4. Reconciliation and losses', 'Meter versus tank; Loss control; Reporting.', 'text', 240, 1, false),
    ('ea110001-0003-0000-0000-000000000002', v_mod3_id, '5. Accuracy and maintenance', 'Error sources; Gauge verification; Maintenance.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 12: MM12 (Meter proving: pipe provers, compact provers and master meters)
  -- =========================================================================
  v_course_id := 'ca120000-0000-0000-0000-000000000012';
  v_mod1_id := 'da120001-0000-0000-0000-000000000001';
  v_mod2_id := 'da120001-0000-0000-0000-000000000002';
  v_mod3_id := 'da120001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM12', 4, 'flow_measurement', v_cat_mm_id, v_subcat_proving_id, 'Meter proving and calibration systems',
    'Meter proving: pipe provers, compact provers and master meters',
    'Proving is how fiscal liquid meters are shown to be accurate, and proving results are often at the centre of measurement disputes. This competence course covers pipe provers, compact provers and master meters, proving procedures and the statistics behind meter factors.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: May 3 to 5, Nov 1 to 3. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain prover types and their principles',
      'Carry out a proving run to procedure',
      'Calculate meter factors and repeatability',
      'Judge acceptance and track meter factor control charts',
      'Maintain and calibrate provers'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Regulators and standards agencies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Perform proving runs and calculate a meter factor',
      'Build a meter factor control chart from historical data'
    ],
    ARRAY['API MPMS Chapter 4', 'API MPMS Chapter 12.2', 'ISO 7278'],
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
    (v_mod1_id, v_course_id, 'Day 1: Proving Principles & Prover Types', 1),
    (v_mod2_id, v_course_id, 'Day 2: Proving Procedures', 2),
    (v_mod3_id, v_course_id, 'Day 3: Calculations, Control & Assessment', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea120001-0001-0000-0000-000000000001', v_mod1_id, '1. Proving principles', 'Meter factors; Base volume; Repeatability.', 'text', 240, 1, false),
    ('ea120001-0001-0000-0000-000000000002', v_mod1_id, '2. Prover types', 'Pipe provers; Compact provers; Master meters.', 'text', 240, 2, false),
    ('ea120001-0002-0000-0000-000000000001', v_mod2_id, '3. Proving procedures', 'Run sequence; Pulse interpolation; Stability.', 'text', 300, 1, false),
    ('ea120001-0003-0000-0000-000000000001', v_mod3_id, '4. Calculations and control', 'Meter factor calculation; Control charts; Acceptance.', 'text', 240, 1, false),
    ('ea120001-0003-0000-0000-000000000002', v_mod3_id, '5. Prover calibration and assessment', 'Water draw; Practical test; Records.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 13: MM13 (Calibration management and ISO/IEC 17025 for laboratories)
  -- =========================================================================
  v_course_id := 'ca130000-0000-0000-0000-000000000013';
  v_mod1_id := 'da130001-0000-0000-0000-000000000001';
  v_mod2_id := 'da130001-0000-0000-0000-000000000002';
  v_mod3_id := 'da130001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM13', 4, 'flow_measurement', v_cat_mm_id, v_subcat_proving_id, 'Meter proving and calibration systems',
    'Calibration management and ISO/IEC 17025 for laboratories',
    'Calibration laboratories and in house calibration teams must show that results are traceable and competent. This course covers calibration management and the ISO/IEC 17025 requirements for laboratories.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 14 to 16, Dec 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain traceability and calibration hierarchy',
      'Set calibration intervals using risk and history',
      'Estimate measurement uncertainty for common calibrations',
      'Apply ISO/IEC 17025 management and technical requirements',
      'Prepare for laboratory accreditation audits'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Manufacturing, cement, food, beverage and mining',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Build an uncertainty budget for a pressure calibration',
      'Review a calibration procedure against ISO/IEC 17025'
    ],
    ARRAY['ISO/IEC 17025', 'JCGM 100 GUM', 'ILAC P14'],
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
    (v_mod1_id, v_course_id, 'Day 1: Traceability & Calibration Management', 1),
    (v_mod2_id, v_course_id, 'Day 2: Measurement Uncertainty', 2),
    (v_mod3_id, v_course_id, 'Day 3: ISO/IEC 17025 & Accreditation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea130001-0001-0000-0000-000000000001', v_mod1_id, '1. Traceability', 'Standards hierarchy; Certificates; National metrology institutes.', 'text', 240, 1, false),
    ('ea130001-0001-0000-0000-000000000002', v_mod1_id, '2. Calibration management', 'Intervals; Software; Records.', 'text', 240, 2, false),
    ('ea130001-0002-0000-0000-000000000001', v_mod2_id, '3. Uncertainty', 'Budgets for common calibrations; Statements of conformity; Decision rules.', 'text', 300, 1, false),
    ('ea130001-0003-0000-0000-000000000001', v_mod3_id, '4. ISO/IEC 17025', 'Requirements; Impartiality; Method validation.', 'text', 240, 1, false),
    ('ea130001-0003-0000-0000-000000000002', v_mod3_id, '5. Accreditation', 'Audit preparation; Proficiency testing; Corrective action.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 14: MM14 (Flow computers, SCADA and measurement data management)
  -- =========================================================================
  v_course_id := 'ca140000-0000-0000-0000-000000000014';
  v_mod1_id := 'da140001-0000-0000-0000-000000000001';
  v_mod2_id := 'da140001-0000-0000-0000-000000000002';
  v_mod3_id := 'da140001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM14', 4, 'flow_measurement', v_cat_mm_id, v_subcat_reporting_id, 'Measurement data acquisition and reporting',
    'Flow computers, SCADA and measurement data management',
    'Flow computers, SCADA and measurement data systems turn raw signals into reported volumes and energy, and errors there can go unseen for months. This course covers configuration, data integrity and reporting for measurement systems.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 22 to 24, Aug 16 to 18. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Configure flow computers and check calculations',
      'Design SCADA data flows for measurement',
      'Protect audit trails and data integrity',
      'Produce daily and monthly measurement reports',
      'Troubleshoot data and communication faults'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Verify a flow computer calculation by hand',
      'Build a daily measurement report from raw data'
    ],
    ARRAY['API MPMS Chapter 21', 'ISO 5167', 'IEC 62443'],
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
    (v_mod1_id, v_course_id, 'Day 1: Flow Computers & SCADA Architecture', 1),
    (v_mod2_id, v_course_id, 'Day 2: Measurement Data Integrity', 2),
    (v_mod3_id, v_course_id, 'Day 3: Reporting & Troubleshooting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea140001-0001-0000-0000-000000000001', v_mod1_id, '1. Flow computers', 'Configuration; Calculation checks; Audit trails.', 'text', 240, 1, false),
    ('ea140001-0001-0000-0000-000000000002', v_mod1_id, '2. SCADA for measurement', 'Data flows; Polling and communications; Time stamps.', 'text', 240, 2, false),
    ('ea140001-0002-0000-0000-000000000001', v_mod2_id, '3. Data integrity', 'Security; Change control; Backups.', 'text', 300, 1, false),
    ('ea140001-0003-0000-0000-000000000001', v_mod3_id, '4. Reporting', 'Daily and monthly reports; Exceptions; Corrections.', 'text', 240, 1, false),
    ('ea140001-0003-0000-0000-000000000002', v_mod3_id, '5. Troubleshooting', 'Communication faults; Data gaps; Case studies.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 15: MM15 (Hydrocarbon accounting and production allocation)
  -- =========================================================================
  v_course_id := 'ca150000-0000-0000-0000-000000000015';
  v_mod1_id := 'da150001-0000-0000-0000-000000000001';
  v_mod2_id := 'da150001-0000-0000-0000-000000000002';
  v_mod3_id := 'da150001-0000-0000-0000-000000000003';
  v_mod4_id := 'da150001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM15', 4, 'flow_measurement', v_cat_mm_id, v_subcat_assurance_id, 'Measurement uncertainty and assurance',
    'Hydrocarbon accounting and production allocation',
    'Hydrocarbon accounting and allocation decide how production, revenue and royalties are split between fields, partners and government. This course covers allocation principles, methods, inputs and systems, with attention to the shared pipelines common in Nigeria.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 10 to 13, Nov 15 to 18. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain hydrocarbon accounting from well to sales',
      'Apply pro rata and by difference allocation methods',
      'Use well tests and multiphase meters in allocation',
      'Handle losses, shrinkage and gas use',
      'Prepare allocation reports and respond to audits'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Allocate production among five fields sharing a pipeline',
      'Review an allocation report for errors'
    ],
    ARRAY['API MPMS Chapter 20.1', 'Energy Institute HM 96', 'NUPRC regulations'],
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
    (v_mod1_id, v_course_id, 'Day 1: Accounting Framework & Allocation Principles', 1),
    (v_mod2_id, v_course_id, 'Day 2: Measurement & Allocation Inputs', 2),
    (v_mod3_id, v_course_id, 'Day 3: Losses, Shrinkage & Fuel Gas', 3),
    (v_mod4_id, v_course_id, 'Day 4: Systems, Reporting & Dispute Audits', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea150001-0001-0000-0000-000000000001', v_mod1_id, '1. Hydrocarbon accounting', 'Value chain; Data flows; Roles.', 'text', 270, 1, false),
    ('ea150001-0001-0000-0000-000000000002', v_mod1_id, '2. Allocation principles', 'Methods; Fairness and uncertainty; Agreements.', 'text', 270, 2, false),
    ('ea150001-0002-0000-0000-000000000001', v_mod2_id, '3. Inputs', 'Well tests; Meters; PVT data.', 'text', 270, 1, false),
    ('ea150001-0003-0000-0000-000000000001', v_mod3_id, '4. Losses and shrinkage', 'Flare and fuel gas; Shrinkage; Theft and losses.', 'text', 330, 1, false),
    ('ea150001-0004-0000-0000-000000000001', v_mod4_id, '5. Systems and reporting', 'Software; Reports; Controls.', 'text', 270, 1, false),
    ('ea150001-0004-0000-0000-000000000002', v_mod4_id, '6. Audits and disputes', 'Audit trails; Dispute cases; Lessons learned.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
