-- Migration: Seed Courses MM16 to MM18 and EX01 to EX02
-- Domains 4 (Measurement and Management) & 5 (EPMICE Field Operations and Lifecycle Services)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_mm_id UUID;
  v_cat_ex_id UUID;
  v_subcat_assurance_id UUID;
  v_subcat_fox_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Categories
  SELECT id INTO v_cat_mm_id FROM public.course_categories WHERE slug = 'measurement-and-management' OR domain_no = 4 LIMIT 1;
  SELECT id INTO v_cat_ex_id FROM public.course_categories WHERE slug = 'field-operations-and-lifecycle-services' OR domain_no = 5 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_assurance_id FROM public.course_subcategories WHERE category_id = v_cat_mm_id AND slug = 'measurement-uncertainty-and-assurance' LIMIT 1;
  IF v_subcat_assurance_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_mm_id, 'Measurement uncertainty and assurance', 'measurement-uncertainty-and-assurance', 7)
    RETURNING id INTO v_subcat_assurance_id;
  END IF;

  SELECT id INTO v_subcat_fox_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'the-field-operations-excellence-the-fox' LIMIT 1;
  IF v_subcat_fox_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox', 1)
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
  -- COURSE 16: MM16 (Methane emissions measurement, reporting and verification under OGMP 2.0)
  -- =========================================================================
  v_course_id := 'ca160000-0000-0000-0000-000000000016';
  v_mod1_id := 'da160001-0000-0000-0000-000000000001';
  v_mod2_id := 'da160001-0000-0000-0000-000000000002';
  v_mod3_id := 'da160001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM16', 4, 'flow_measurement', v_cat_mm_id, v_subcat_assurance_id, 'Measurement uncertainty and assurance',
    'Methane emissions measurement, reporting and verification under OGMP 2.0',
    'Methane reporting is moving from emission factors to measured data, and OGMP 2.0 level 5 is now the reference for oil and gas companies. This course covers methane measurement technologies, quantification, reconciliation and reporting.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 25 to 27, May 3 to 5, Sep 27 to 29. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain methane sources across oil and gas operations',
      'Compare source and site level measurement technologies',
      'Quantify emissions and reconcile data sets',
      'Report to OGMP 2.0 levels and regulators',
      'Plan a measurement campaign'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Plan a measurement campaign for a gas plant',
      'Reconcile source and site level data'
    ],
    ARRAY['OGMP 2.0', 'ISO 14064 1', 'EPA OOOOb', 'NUPRC methane guidelines'],
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
    (v_mod1_id, v_course_id, 'Day 1: Methane Sources & Source Level Measurement', 1),
    (v_mod2_id, v_course_id, 'Day 2: Site Level Measurement Technologies', 2),
    (v_mod3_id, v_course_id, 'Day 3: Quantification, Reconciliation & Reporting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea160001-0001-0000-0000-000000000001', v_mod1_id, '1. Methane sources', 'Venting; Flaring and incomplete combustion; Fugitives.', 'text', 240, 1, false),
    ('ea160001-0001-0000-0000-000000000002', v_mod1_id, '2. Source level measurement', 'OGI cameras; Hi flow samplers; Flow meters on vents.', 'text', 240, 2, false),
    ('ea160001-0002-0000-0000-000000000001', v_mod2_id, '3. Site level measurement', 'Drones; Aircraft; Satellites.', 'text', 240, 1, false),
    ('ea160001-0003-0000-0000-000000000001', v_mod3_id, '4. Quantification and reconciliation', 'Calculation methods; Reconciliation; Uncertainty.', 'text', 240, 1, false),
    ('ea160001-0003-0000-0000-000000000002', v_mod3_id, '5. Reporting', 'OGMP 2.0 levels; Regulatory reporting; Verification.', 'text', 300, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 17: MM17 (Measurement uncertainty analysis to GUM)
  -- =========================================================================
  v_course_id := 'ca170000-0000-0000-0000-000000000017';
  v_mod1_id := 'da170001-0000-0000-0000-000000000001';
  v_mod2_id := 'da170001-0000-0000-0000-000000000002';
  v_mod3_id := 'da170001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM17', 4, 'flow_measurement', v_cat_mm_id, v_subcat_assurance_id, 'Measurement uncertainty and assurance',
    'Measurement uncertainty analysis to GUM',
    'Uncertainty analysis shows how far a measured figure can be trusted, which matters greatly when money and royalties depend on it. This advanced course applies the GUM method to flow and fiscal measurement.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain uncertainty concepts and the GUM method',
      'Build uncertainty budgets for flow systems',
      'Combine and expand uncertainties correctly',
      'Use Monte Carlo methods where GUM falls short',
      'Use results in contracts, audits and design decisions'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Regulators and standards agencies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Build an uncertainty budget for a fiscal gas station',
      'Compare GUM and Monte Carlo results'
    ],
    ARRAY['JCGM 100 GUM', 'JCGM 101', 'ISO 5168'],
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
    (v_mod1_id, v_course_id, 'Day 1: Uncertainty Concepts & GUM Method', 1),
    (v_mod2_id, v_course_id, 'Day 2: Flow System Uncertainty Budgets', 2),
    (v_mod3_id, v_course_id, 'Day 3: Monte Carlo Methods & Applications', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea170001-0001-0000-0000-000000000001', v_mod1_id, '1. Concepts', 'Type A and B; Distributions; Coverage.', 'text', 240, 1, false),
    ('ea170001-0001-0000-0000-000000000002', v_mod1_id, '2. GUM method', 'Sensitivity coefficients; Combined uncertainty; Expanded uncertainty.', 'text', 240, 2, false),
    ('ea170001-0002-0000-0000-000000000001', v_mod2_id, '3. Flow system budgets', 'Orifice stations; Ultrasonic stations; Liquid metering.', 'text', 300, 1, false),
    ('ea170001-0003-0000-0000-000000000001', v_mod3_id, '4. Monte Carlo methods', 'When to use; Tools; Comparison.', 'text', 240, 1, false),
    ('ea170001-0003-0000-0000-000000000002', v_mod3_id, '5. Applications', 'Contracts; Audits; Design decisions.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 18: MM18 (Measurement assurance and audit for operators and regulators)
  -- =========================================================================
  v_course_id := 'ca180000-0000-0000-0000-000000000018';
  v_mod1_id := 'da180001-0000-0000-0000-000000000001';
  v_mod2_id := 'da180001-0000-0000-0000-000000000002';
  v_mod3_id := 'da180001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MM18', 4, 'flow_measurement', v_cat_mm_id, v_subcat_assurance_id, 'Measurement uncertainty and assurance',
    'Measurement assurance and audit for operators and regulators',
    'Measurement assurance gives operators and regulators confidence that reported volumes are right. This course covers risk based assurance, audit planning and execution, and corrective action tracking.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 26 to 28. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Plan risk based measurement assurance programmes',
      'Carry out measurement audits in the field and in records',
      'Report findings and track corrective actions',
      'Build joint operator and regulator assurance processes',
      'Use KPIs to show assurance performance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Regulators and standards agencies',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Audit a metering station data pack',
      'Write a findings report with actions'
    ],
    ARRAY['ISO 19011', 'API MPMS Chapter 21', 'NUPRC measurement regulations'],
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
    (v_mod1_id, v_course_id, 'Day 1: Assurance Principles & Audit Planning', 1),
    (v_mod2_id, v_course_id, 'Day 2: Audit Execution', 2),
    (v_mod3_id, v_course_id, 'Day 3: Findings, Actions & Collaboration', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea180001-0001-0000-0000-000000000001', v_mod1_id, '1. Assurance principles', 'Risk ranking; Assurance levels; Roles.', 'text', 240, 1, false),
    ('ea180001-0001-0000-0000-000000000002', v_mod1_id, '2. Audit planning', 'Scope; Checklists; Sampling.', 'text', 240, 2, false),
    ('ea180001-0002-0000-0000-000000000001', v_mod2_id, '3. Audit execution', 'Field checks; Records review; Interviews.', 'text', 300, 1, false),
    ('ea180001-0003-0000-0000-000000000001', v_mod3_id, '4. Findings and actions', 'Reporting; Tracking; Verification of closure.', 'text', 240, 1, false),
    ('ea180001-0003-0000-0000-000000000002', v_mod3_id, '5. Collaboration and KPIs', 'Operator and regulator roles; KPIs; Continuous improvement.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 19: EX01 (Field operations excellence: operator rounds, shift handover and standards)
  -- =========================================================================
  v_course_id := 'cb010000-0000-0000-0000-000000000001';
  v_mod1_id := 'db010001-0000-0000-0000-000000000001';
  v_mod2_id := 'db010001-0000-0000-0000-000000000002';
  v_mod3_id := 'db010001-0000-0000-0000-000000000003';
  v_mod4_id := 'db010001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX01', 5, 'general_technical', v_cat_ex_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Field operations excellence: operator rounds, shift handover and standards',
    'Most plant incidents and production losses are first visible to the field operator, if the operator knows what to look for. This competence course builds the field habits behind The Field Operations Excellence programme: structured rounds, clear shift handovers, operating standards and early reporting of abnormal conditions.',
    v_instructor_id, 'beginner', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Mar 15 to 18, Sep 27 to 30. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Carry out structured operator rounds using checklists and the senses',
      'Recognise abnormal sounds, smells, temperatures, leaks and vibration',
      'Conduct a clear and complete shift handover',
      'Follow and improve operating procedures and standing instructions',
      'Report defects and near misses in a way that leads to action'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Complete a timed operator round on a training plant and log findings',
      'Run and observe a shift handover and score it against a checklist',
      'Write defect reports for five planted faults'
    ],
    ARRAY['Energy Institute guidance on shift handover', 'CCPS Conduct of Operations guidelines', 'ISO 45001'],
    ARRAY['Baker Hughes', 'Siemens', 'GE Vernova', 'Thomassen Energy', 'Petronash', 'Rotork', 'Mokveld', 'Valmet'],
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
    (v_mod1_id, v_course_id, 'Day 1: Role of the Field Operator & Operator Rounds', 1),
    (v_mod2_id, v_course_id, 'Day 2: Recognising Abnormal Conditions', 2),
    (v_mod3_id, v_course_id, 'Day 3: Shift Handover Excellence', 3),
    (v_mod4_id, v_course_id, 'Day 4: Procedures, Standards & Reporting Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb010001-0001-0000-0000-000000000001', v_mod1_id, '1. Role of the field operator', 'Operator as first line of defence; Ownership of equipment; Communication with the control room.', 'text', 300, 1, false),
    ('eb010001-0001-0000-0000-000000000002', v_mod1_id, '2. Operator rounds', 'Round design and frequency; Using checklists and handheld devices; Look, listen, feel and smell.', 'text', 300, 2, false),
    ('eb010001-0002-0000-0000-000000000001', v_mod2_id, '3. Recognising abnormal conditions', 'Leaks, noise and vibration; Temperature and pressure checks; Housekeeping as a signal.', 'text', 300, 1, false),
    ('eb010001-0003-0000-0000-000000000001', v_mod3_id, '4. Shift handover', 'Handover content and format; Written logs; Face to face practice.', 'text', 300, 1, false),
    ('eb010001-0004-0000-0000-000000000001', v_mod4_id, '5. Procedures and standards', 'Using procedures correctly; Standing instructions; Proposing improvements.', 'text', 300, 1, false),
    ('eb010001-0004-0000-0000-000000000002', v_mod4_id, '6. Reporting and assessment', 'Defect and near miss reporting; Practical competence test.', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 20: EX02 (Operator driven reliability and frontline problem solving)
  -- =========================================================================
  v_course_id := 'cb020000-0000-0000-0000-000000000002';
  v_mod1_id := 'db020001-0000-0000-0000-000000000001';
  v_mod2_id := 'db020001-0000-0000-0000-000000000002';
  v_mod3_id := 'db020001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX02', 5, 'general_technical', v_cat_ex_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Operator driven reliability and frontline problem solving',
    'Operator driven reliability makes operators partners in keeping equipment healthy, and frontline problem solving gives them simple tools to fix recurring problems. This course shows supervisors and senior operators how to set up and sustain both.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain operator driven reliability and its link to maintenance strategy',
      'Set up basic care tasks such as cleaning, inspection and lubrication',
      'Use simple problem solving tools such as five whys and fishbone diagrams',
      'Run short daily problem solving meetings',
      'Track results with visible frontline KPIs'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Solve a recurring pump seal leak with five whys and a fishbone',
      'Design a visual board for a unit'
    ],
    ARRAY['ISO 55001', 'SMRP Best Practices', 'Lean daily management practice'],
    ARRAY['Baker Hughes', 'Siemens', 'GE Vernova', 'Thomassen Energy', 'Petronash', 'Rotork', 'Mokveld', 'Valmet'],
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
    (v_mod1_id, v_course_id, 'Day 1: Operator Driven Reliability & Problem Solving', 1),
    (v_mod2_id, v_course_id, 'Day 2: Daily Management & Visual Controls', 2),
    (v_mod3_id, v_course_id, 'Day 3: Sustaining Change & Practical Case Studies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb020001-0001-0000-0000-000000000001', v_mod1_id, '1. Operator driven reliability', 'Principles; Roles of operations and maintenance; Basic care tasks.', 'text', 300, 1, false),
    ('eb020001-0001-0000-0000-000000000002', v_mod1_id, '2. Frontline problem solving', 'Five whys; Fishbone diagrams; A3 thinking.', 'text', 300, 2, false),
    ('eb020001-0002-0000-0000-000000000001', v_mod2_id, '3. Daily management', 'Short interval meetings; Visual boards; Escalation.', 'text', 300, 1, false),
    ('eb020001-0003-0000-0000-000000000001', v_mod3_id, '4. Sustaining the change', 'KPIs; Coaching; Recognition.', 'text', 300, 1, false),
    ('eb020001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Plant examples; Lessons learned; Review.', 'text', 60, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
