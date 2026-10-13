-- Migration: Seed Courses EX08 to EX12
-- Domain 5: EPMICE Field Operations and Lifecycle Services
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ex_id UUID;
  v_subcat_delivery_id UUID;
  v_subcat_upgrades_id UUID;
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
  SELECT id INTO v_subcat_delivery_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'project-delivery-and-installation' LIMIT 1;
  IF v_subcat_delivery_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Project delivery and installation', 'project-delivery-and-installation', 4)
    RETURNING id INTO v_subcat_delivery_id;
  END IF;

  SELECT id INTO v_subcat_upgrades_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'performance-optimisation-and-upgrades' LIMIT 1;
  IF v_subcat_upgrades_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Performance optimisation and upgrades', 'performance-optimisation-and-upgrades', 5)
    RETURNING id INTO v_subcat_upgrades_id;
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
  -- COURSE 1: EX08 (Precommissioning, commissioning and startup management)
  -- =========================================================================
  v_course_id := 'cb080000-0000-0000-0000-000000000008';
  v_mod1_id := 'db080001-0000-0000-0000-000000000001';
  v_mod2_id := 'db080001-0000-0000-0000-000000000002';
  v_mod3_id := 'db080001-0000-0000-0000-000000000003';
  v_mod4_id := 'db080001-0000-0000-0000-000000000004';
  v_mod5_id := 'db080001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX08', 5, 'general_technical', v_cat_ex_id, v_subcat_delivery_id, 'Project delivery and installation',
    'Precommissioning, commissioning and startup management',
    'Commissioning turns a constructed plant into an operating one, and poor commissioning leads to long startups and early failures. This course covers the full sequence from mechanical completion through precommissioning, commissioning and startup, with the systems that keep it under control.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site.',
    ARRAY[
      'Break a plant into systems and subsystems for completion',
      'Plan precommissioning activities such as flushing, pressure testing and drying',
      'Plan commissioning and startup sequences with the operations team',
      'Manage completion records, punch lists and handover certificates',
      'Lead safe startup and performance testing'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Systemise a gas plant P&ID set',
      'Build a startup sequence and readiness checklist',
      'Review a completion dossier for gaps'
    ],
    ARRAY['IEC 62381', 'IEC 62382', 'ISO 21500', 'CCPS process safety guidelines'],
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
    (v_mod1_id, v_course_id, 'Day 1: Completion Management & Systemisation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Precommissioning & Commissioning Execution', 2),
    (v_mod3_id, v_course_id, 'Day 3: Plant Startup & Readiness Reviews', 3),
    (v_mod4_id, v_course_id, 'Day 4: Performance Testing & Handover Records', 4),
    (v_mod5_id, v_course_id, 'Day 5: Lessons Learned & Case Studies', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb080001-0001-0000-0000-000000000001', v_mod1_id, '1. Completion management', 'Systemisation; Completion phases; Certificates', 'text', 300, 1, false),
    ('eb080001-0002-0000-0000-000000000001', v_mod2_id, '2. Precommissioning', 'Flushing and cleaning; Pressure and leak testing; Drying and inerting', 'text', 300, 1, false),
    ('eb080001-0002-0000-0000-000000000002', v_mod2_id, '3. Commissioning', 'Utilities first; Functional testing; Operating procedures', 'text', 300, 2, false),
    ('eb080001-0003-0000-0000-000000000001', v_mod3_id, '4. Startup', 'Startup sequence; Hazards during startup; Readiness reviews', 'text', 360, 1, false),
    ('eb080001-0004-0000-0000-000000000001', v_mod4_id, '5. Performance testing', 'Test runs; Guarantee tests; Acceptance', 'text', 360, 1, false),
    ('eb080001-0004-0000-0000-000000000002', v_mod4_id, '6. Records and handover', 'Punch lists; Handover dossiers; Operations acceptance', 'text', 300, 2, false),
    ('eb080001-0005-0000-0000-000000000001', v_mod5_id, '7. Lessons learned', 'Difficult startup case studies; Building a lessons register', 'text', 210, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EX09 (Mechanical completion and handover systems)
  -- =========================================================================
  v_course_id := 'cb090000-0000-0000-0000-000000000009';
  v_mod1_id := 'db090001-0000-0000-0000-000000000001';
  v_mod2_id := 'db090001-0000-0000-0000-000000000002';
  v_mod3_id := 'db090001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX09', 5, 'general_technical', v_cat_ex_id, v_subcat_delivery_id, 'Project delivery and installation',
    'Mechanical completion and handover systems',
    'Mechanical completion and handover systems track thousands of checks and certificates on a project. This course shows engineers how to run them so that the owner receives a complete, safe and documented plant.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 19 to 21, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain completion stages and certificate types',
      'Set up a completion management database by system and tag',
      'Run punch list categorisation and clearance',
      'Prepare handover packages that operations will accept',
      'Audit completion records for gaps'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Set up a completion tracker for a subsystem',
      'Audit a handover package and list the gaps'
    ],
    ARRAY['IEC 62381', 'ISO 9001', 'ISO 15926'],
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
    (v_mod1_id, v_course_id, 'Day 1: Completion Stages & Management Systems', 1),
    (v_mod2_id, v_course_id, 'Day 2: Punch List Categorisation & Clearance', 2),
    (v_mod3_id, v_course_id, 'Day 3: Handover Packages & Completion Audits', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb090001-0001-0000-0000-000000000001', v_mod1_id, '1. Completion stages', 'Mechanical completion; Ready for commissioning; Handover and acceptance', 'text', 240, 1, false),
    ('eb090001-0001-0000-0000-000000000002', v_mod1_id, '2. Completion systems', 'Database structure; Check sheets by discipline; Tags and systems', 'text', 240, 2, false),
    ('eb090001-0002-0000-0000-000000000001', v_mod2_id, '3. Punch lists', 'Categories A, B and C; Clearance workflow; Tracking and reporting', 'text', 240, 1, false),
    ('eb090001-0003-0000-0000-000000000001', v_mod3_id, '4. Handover packages', 'Content and format; Acceptance criteria; Vendor documents', 'text', 240, 1, false),
    ('eb090001-0003-0000-0000-000000000002', v_mod3_id, '5. Audits', 'Completion audits; Common gaps; Corrective action', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EX10 (Installation supervision for rotating and static equipment)
  -- =========================================================================
  v_course_id := 'cb100000-0000-0000-0000-000000000010';
  v_mod1_id := 'db100001-0000-0000-0000-000000000001';
  v_mod2_id := 'db100001-0000-0000-0000-000000000002';
  v_mod3_id := 'db100001-0000-0000-0000-000000000003';
  v_mod4_id := 'db100001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX10', 5, 'general_technical', v_cat_ex_id, v_subcat_delivery_id, 'Project delivery and installation',
    'Installation supervision for rotating and static equipment',
    'Poor installation shortens equipment life and causes many startup failures. This competence course trains supervisors and senior technicians to oversee installation of pumps, compressors, vessels and exchangers to specification.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 8 to 11, Aug 16 to 19. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Check foundations, grouting and baseplates before setting equipment',
      'Supervise setting, levelling and shaft alignment of rotating equipment',
      'Supervise installation of vessels and heat exchangers',
      'Verify that piping connects without strain',
      'Record installation quality on check sheets and inspection test plans'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Carry out a laser shaft alignment on a training rig',
      'Check pipe strain on a pump connection',
      'Complete installation check sheets for a pump set'
    ],
    ARRAY['API 686', 'ASME PCC-1', 'ISO 1940-1'],
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
    (v_mod1_id, v_course_id, 'Day 1: Foundations, Grouting & Machinery Alignment', 1),
    (v_mod2_id, v_course_id, 'Day 2: Static Equipment Setting & Internals', 2),
    (v_mod3_id, v_course_id, 'Day 3: Piping Connections & Strain Prevention', 3),
    (v_mod4_id, v_course_id, 'Day 4: Quality Records & Practical Competence Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb100001-0001-0000-0000-000000000001', v_mod1_id, '1. Foundations and grouting', 'Concrete and grout systems; Anchor bolts; Baseplate preparation', 'text', 300, 1, false),
    ('eb100001-0001-0000-0000-000000000002', v_mod1_id, '2. Setting and alignment', 'Levelling; Laser and dial alignment; Soft foot', 'text', 300, 2, false),
    ('eb100001-0002-0000-0000-000000000001', v_mod2_id, '3. Static equipment', 'Vessel setting and verticality; Exchanger installation and bundle handling; Internals', 'text', 300, 1, false),
    ('eb100001-0003-0000-0000-000000000001', v_mod3_id, '4. Piping connections', 'Pipe strain checks; Flange alignment; Bolt tightening', 'text', 360, 1, false),
    ('eb100001-0004-0000-0000-000000000001', v_mod4_id, '5. Quality records', 'Check sheets; Inspection test plans; Hold points', 'text', 300, 1, false),
    ('eb100001-0004-0000-0000-000000000002', v_mod4_id, '6. Practical assessment', 'Alignment task; Written test', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EX11 (Plant performance optimisation and debottlenecking)
  -- =========================================================================
  v_course_id := 'cb110000-0000-0000-0000-000000000011';
  v_mod1_id := 'db110001-0000-0000-0000-000000000001';
  v_mod2_id := 'db110001-0000-0000-0000-000000000002';
  v_mod3_id := 'db110001-0000-0000-0000-000000000003';
  v_mod4_id := 'db110001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX11', 5, 'general_technical', v_cat_ex_id, v_subcat_upgrades_id, 'Performance optimisation and upgrades',
    'Plant performance optimisation and debottlenecking',
    'Many plants run below design capacity because of a handful of bottlenecks that nobody has measured properly. This advanced course shows engineers how to find the true limits of a plant, test them safely and remove them at the lowest cost.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 26 to 29. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build a capacity limit diagram for a unit from design and operating data',
      'Confirm limits with test runs and data reconciliation',
      'Use process simulation to test debottlenecking options',
      'Rank options by cost, benefit and risk',
      'Plan implementation through turnarounds and management of change'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Find the bottleneck in a gas processing plant case',
      'Evaluate two debottlenecking options with a simple model',
      'Present a ranked recommendation'
    ],
    ARRAY['ISO 55001', 'API 521', 'CCPS management of change guidance'],
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
    (v_mod1_id, v_course_id, 'Day 1: Capacity Limit Analysis & Test Runs', 1),
    (v_mod2_id, v_course_id, 'Day 2: Calibrated Process Simulation & Sensitivity Studies', 2),
    (v_mod3_id, v_course_id, 'Day 3: Debottlenecking Options Evaluation', 3),
    (v_mod4_id, v_course_id, 'Day 4: Economics, Risk Ranking & Turnaround Implementation', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb110001-0001-0000-0000-000000000001', v_mod1_id, '1. Capacity analysis', 'Nameplate versus demonstrated capacity; Limit diagrams; Hidden constraints', 'text', 300, 1, false),
    ('eb110001-0001-0000-0000-000000000002', v_mod1_id, '2. Data and test runs', 'Data reconciliation; Planning a test run; Safety limits', 'text', 300, 2, false),
    ('eb110001-0002-0000-0000-000000000001', v_mod2_id, '3. Process simulation', 'Building a calibrated model; Sensitivity studies', 'text', 210, 1, false),
    ('eb110001-0003-0000-0000-000000000001', v_mod3_id, '4. Debottlenecking options', 'Operating changes; Equipment changes; Control improvements', 'text', 360, 1, false),
    ('eb110001-0004-0000-0000-000000000001', v_mod4_id, '5. Economics and risk', 'Cost and benefit; Risk assessment; Ranking', 'text', 300, 1, false),
    ('eb110001-0004-0000-0000-000000000002', v_mod4_id, '6. Implementation', 'Turnaround planning; Management of change; Benefit tracking', 'text', 300, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: EX12 (Equipment rerating and upgrade engineering)
  -- =========================================================================
  v_course_id := 'cb120000-0000-0000-0000-000000000012';
  v_mod1_id := 'db120001-0000-0000-0000-000000000001';
  v_mod2_id := 'db120001-0000-0000-0000-000000000002';
  v_mod3_id := 'db120001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX12', 5, 'general_technical', v_cat_ex_id, v_subcat_upgrades_id, 'Performance optimisation and upgrades',
    'Equipment rerating and upgrade engineering',
    'Rerating and upgrading existing equipment can add capacity or efficiency without new units, but every rerate must be checked against the design code and the whole system. This advanced course covers technical assessment and delivery of rerate projects.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 15 to 17, Aug 23 to 25. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify drivers and limits for rerating rotating and static equipment',
      'Assess compressor and pump rerates using performance data',
      'Check vessels, exchangers and piping against code limits',
      'Apply fitness for service methods where needed',
      'Manage rerate projects through management of change'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Assess a compressor rerate for higher flow',
      'Check a vessel for a higher design pressure'
    ],
    ARRAY['API 617', 'API 610', 'ASME VIII', 'API 579'],
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
    (v_mod1_id, v_course_id, 'Day 1: Rerate Drivers, Limits & Rotating Equipment', 1),
    (v_mod2_id, v_course_id, 'Day 2: Static Equipment, Heat Exchangers & Piping Checks', 2),
    (v_mod3_id, v_course_id, 'Day 3: Code Verification, Fitness for Service & Delivery', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb120001-0001-0000-0000-000000000001', v_mod1_id, '1. Rerate drivers and limits', 'Process changes; Design margins; System effects', 'text', 240, 1, false),
    ('eb120001-0001-0000-0000-000000000002', v_mod1_id, '2. Rotating equipment rerates', 'Compressor restaging; Pump impeller changes; Driver limits', 'text', 240, 2, false),
    ('eb120001-0002-0000-0000-000000000001', v_mod2_id, '3. Static equipment and piping', 'Vessel pressure and temperature checks; Exchanger performance; Piping stress', 'text', 240, 1, false),
    ('eb120001-0003-0000-0000-000000000001', v_mod3_id, '4. Codes and fitness for service', 'ASME and API checks; API 579 assessments; Documentation', 'text', 240, 1, false),
    ('eb120001-0003-0000-0000-000000000002', v_mod3_id, '5. Project delivery', 'Management of change; Vendor engagement; Testing and records', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
