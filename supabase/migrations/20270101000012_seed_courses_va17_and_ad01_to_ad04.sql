-- Migration: Seed Courses VA17, AD01, AD02, AD03, AD04
-- Domains:
--   Domain 2: Valves and Actuation (VA17)
--   Domain 3: Integrated Automation and Digital Operations (AD01, AD02, AD03, AD04)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_va_id UUID;
  v_cat_ad_id UUID;
  v_subcat_va_sev_id UUID;
  v_subcat_ad_icss_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Categories
  SELECT id INTO v_cat_va_id FROM public.course_categories WHERE slug = 'valves-and-actuation' OR domain_no = 2 LIMIT 1;
  SELECT id INTO v_cat_ad_id FROM public.course_categories WHERE slug = 'integrated-automation-and-digital-operations' OR domain_no = 3 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_va_sev_id FROM public.course_subcategories WHERE category_id = v_cat_va_id AND slug = 'severe-and-specialised-service-valves' LIMIT 1;
  IF v_subcat_va_sev_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_va_id, 'Severe and specialised service valves', 'severe-and-specialised-service-valves', 5)
    RETURNING id INTO v_subcat_va_sev_id;
  END IF;

  SELECT id INTO v_subcat_ad_icss_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'automation-and-icss' LIMIT 1;
  IF v_subcat_ad_icss_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Automation and ICSS', 'automation-and-icss', 1)
    RETURNING id INTO v_subcat_ad_icss_id;
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
  -- COURSE 1: VA17 (Valves for hydrogen and CO2 service: materials and sealing)
  -- =========================================================================
  v_course_id := 'c4170000-0000-0000-0000-000000000017';
  v_mod1_id := 'd2170001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2170001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA17', 2, 'flow_control', v_cat_va_id, v_subcat_va_sev_id, 'Severe and specialised service valves',
    'Valves for hydrogen and CO2 service: materials and sealing',
    'Hydrogen and CO2 pipelines and plants are being built for the energy transition, and both gases are hard on valves. This short course explains how hydrogen and dense phase CO2 affect metals, seals and leakage, and how to specify valves for these services.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain hydrogen embrittlement and permeation in valve materials',
      'Describe CO2 decompression damage and corrosion risks',
      'Select metals, elastomers and seals for each service',
      'Write test requirements for hydrogen and CO2 valves',
      'Specify fugitive emission limits for hydrogen service'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Sustainability, ESG and energy transition teams',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Specify valves for a hydrogen blending line and a CO2 export line',
      'Review an elastomer qualification report'
    ],
    ARRAY['ASME B31.12', 'ISO 15848', 'NORSOK M 710', 'DNV RP F104'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
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
    (v_mod1_id, v_course_id, 'Day 1: Hydrogen Embrittlement & Dense Phase CO2 Decompression Risks', 1),
    (v_mod2_id, v_course_id, 'Day 2: Elastomer/Polymer Qualification & Purchase Specifications', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4170001-0001-0000-0000-000000000001', v_mod1_id, '1. Hydrogen service', 'Embrittlement and permeation; Leakage and small molecules; Material limits.', 'text', 210, 1, false),
    ('c4170001-0001-0000-0000-000000000002', v_mod1_id, '2. CO2 service', 'Dense phase behaviour; Rapid gas decompression; Corrosion with water.', 'text', 210, 2, false),
    ('c4170001-0002-0000-0000-000000000001', v_mod2_id, '3. Material and seal selection', 'Metals; Elastomers and thermoplastics; Coatings.', 'text', 210, 1, false),
    ('c4170001-0002-0000-0000-000000000002', v_mod2_id, '4. Specification and testing', 'Test media; Qualification tests; Purchase specifications.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: AD01 (PLC programming and troubleshooting on Siemens TIA Portal & Rockwell Studio 5000)
  -- =========================================================================
  v_course_id := 'c3010000-0000-0000-0000-000000000001';
  v_mod1_id := 'd3010001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3010001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3010001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3010001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3010001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD01', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_icss_id, 'Automation and ICSS',
    'PLC programming and troubleshooting on Siemens TIA Portal and Rockwell Studio 5000',
    'PLCs run most machines, packages and utilities, and many plants depend on a few people who can read and change the code. This competence course trains technicians and engineers to program, test and troubleshoot PLCs on Siemens TIA Portal and Rockwell Studio 5000, the two platforms most often found on Nigerian and Middle East sites.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: May 24 to 28, Nov 8 to 12. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain PLC hardware, scan cycle and input and output addressing',
      'Write and test ladder logic, function block and structured text programs',
      'Configure hardware, networks and HMI tags on both platforms',
      'Use online monitoring, forcing and trace tools to find faults safely',
      'Apply version control and change management to PLC programs'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Program a pump station sequence on both platforms',
      'Find and fix five faults planted in a working program',
      'Build a simple HMI screen linked to the program'
    ],
    ARRAY['IEC 61131 3', 'IEC 61131 2', 'ISA 88', 'IEC 62443 2 4'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-05-24 08:30:00+00', '2027-05-28 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: PLC Hardware Architectures, Scan Cycles & Safe Online Practices', 1),
    (v_mod2_id, v_course_id, 'Day 2: Siemens TIA Portal & Rockwell Studio 5000 Project Architecture', 2),
    (v_mod3_id, v_course_id, 'Day 3: Structured Text, Modular Routine Design & Reusable Blocks', 3),
    (v_mod4_id, v_course_id, 'Day 4: Industrial Networking (Profinet/EtherNet/IP) & Online Diagnostics', 4),
    (v_mod5_id, v_course_id, 'Day 5: Version Control, Management of Change & Practical Fault Exam', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3010001-0001-0000-0000-000000000001', v_mod1_id, '1. PLC fundamentals', 'Hardware, racks and modules; Scan cycle; Addressing and data types; Safety when working online.', 'text', 420, 1, false),
    ('c3010001-0002-0000-0000-000000000001', v_mod2_id, '2. Siemens TIA Portal', 'Project and hardware setup; Ladder and function block programming; Data blocks and tags.', 'text', 210, 1, false),
    ('c3010001-0002-0000-0000-000000000002', v_mod2_id, '3. Rockwell Studio 5000', 'Controller organisation; Tasks, programs and routines; Add on instructions.', 'text', 210, 2, false),
    ('c3010001-0003-0000-0000-000000000001', v_mod3_id, '4. Structured text and good practice', 'Structured text basics; Program structure and comments; Reusable code.', 'text', 420, 1, false),
    ('c3010001-0004-0000-0000-000000000001', v_mod4_id, '5. HMI and networks', 'HMI tags and screens; Profinet and EtherNet/IP setup.', 'text', 210, 1, false),
    ('c3010001-0004-0000-0000-000000000002', v_mod4_id, '6. Troubleshooting', 'Online monitoring and cross reference; Forcing rules; Diagnostic buffers and fault codes.', 'text', 210, 2, false),
    ('c3010001-0005-0000-0000-000000000001', v_mod5_id, '7. Change management and assessment', 'Version control and backups; Management of change; Practical competence test.', 'text', 420, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: AD02 (DCS engineering, configuration and operation)
  -- =========================================================================
  v_course_id := 'c3020000-0000-0000-0000-000000000002';
  v_mod1_id := 'd3020001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3020001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3020001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3020001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3020001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD02', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_icss_id, 'Automation and ICSS',
    'DCS engineering, configuration and operation',
    'The distributed control system is where operators run the plant and where engineers keep control strategies working. This competence course covers DCS architecture, configuration of control modules, graphics and alarms, and day to day operation and system management.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Jun 14 to 18, Dec 13 to 17. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe DCS architecture, controllers, input and output and redundancy',
      'Configure control modules for regulatory and sequential control',
      'Build operator graphics and alarm settings to good practice',
      'Operate the plant from the DCS in normal and upset conditions',
      'Back up, restore and manage changes to the configuration'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Configure a level and flow cascade loop and test it on a simulator',
      'Build a graphic page to high performance HMI principles',
      'Restore a controller from backup'
    ],
    ARRAY['IEC 61131 3', 'ISA 101', 'ISA 18.2', 'IEC 62443'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-06-14 08:30:00+00', '2027-06-18 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: DCS Distributed Architecture, Controllers & Network Redundancy', 1),
    (v_mod2_id, v_course_id, 'Day 2: Regulatory Control Loops, Cascade & Sequential Logic Schemes', 2),
    (v_mod3_id, v_course_id, 'Day 3: High-Performance Operator Interface & Alarm Rationalization (ISA 18.2)', 3),
    (v_mod4_id, v_course_id, 'Day 4: Plant Control Operations, Shift Handover & System Lifecycle Patching', 4),
    (v_mod5_id, v_course_id, 'Day 5: Practical Simulation Tasks, Recovery Drills & Competence Sign-Off', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3020001-0001-0000-0000-000000000001', v_mod1_id, '1. DCS architecture', 'Controllers and redundancy; Input and output subsystems; Networks and servers.', 'text', 420, 1, false),
    ('c3020001-0002-0000-0000-000000000001', v_mod2_id, '2. Control configuration', 'Function blocks; PID loops and cascade; Interlocks.', 'text', 210, 1, false),
    ('c3020001-0002-0000-0000-000000000002', v_mod2_id, '3. Sequential control', 'Phases and sequences; Batch concepts; Permissives.', 'text', 210, 2, false),
    ('c3020001-0003-0000-0000-000000000001', v_mod3_id, '4. Operator interface', 'Graphics standards; Trends; Alarm configuration.', 'text', 420, 1, false),
    ('c3020001-0004-0000-0000-000000000001', v_mod4_id, '5. Operations', 'Startup and shutdown from the DCS; Handling upsets; Shift handover.', 'text', 210, 1, false),
    ('c3020001-0004-0000-0000-000000000002', v_mod4_id, '6. System management', 'Backups and restore; Patching; Management of change.', 'text', 210, 2, false),
    ('c3020001-0005-0000-0000-000000000001', v_mod5_id, '7. Practical assessment', 'Configuration task; Operation task; Written test.', 'text', 420, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: AD03 (Safety instrumented systems: IEC 61511 lifecycle and SIL verification)
  -- =========================================================================
  v_course_id := 'c3030000-0000-0000-0000-000000000003';
  v_mod1_id := 'd3030001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3030001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3030001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3030001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3030001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD03', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_icss_id, 'Automation and ICSS',
    'Safety instrumented systems: IEC 61511 lifecycle and SIL verification',
    'Safety instrumented systems stand between a process hazard and a major accident. This course covers the full IEC 61511 lifecycle, from hazard and risk assessment through SIL determination, design, verification and proof testing, and prepares candidates for functional safety engineer certification.',
    v_instructor_id, 'advanced', 'onsite', 35,
    'Certificate of Attendance & Exam Preparation', 'Up to 16 participants',
    'Public sessions: Aug 2 to 6. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the IEC 61511 safety lifecycle and functional safety management',
      'Determine required SIL using risk graphs and LOPA',
      'Write a safety requirements specification',
      'Verify SIL achieved using failure data, architecture and proof test intervals',
      'Plan operation, maintenance, bypass control and proof testing'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Run a LOPA for three scenarios and set SIL targets',
      'Calculate PFD for a SIL 2 function with two architectures',
      'Write an SRS entry for a high pressure trip'
    ],
    ARRAY['IEC 61511', 'IEC 61508', 'ISA TR84.00.02', 'CCPS LOPA guidelines'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-08-02 08:30:00+00', '2027-08-06 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Functional Safety Concepts & LOPA Risk Assessment (IEC 61508/61511)', 1),
    (v_mod2_id, v_course_id, 'Day 2: Safety Requirements Specification (SRS) & Architecture Engineering', 2),
    (v_mod3_id, v_course_id, 'Day 3: SIS Hardware Voting Architectures & Mathematical SIL Verification', 3),
    (v_mod4_id, v_course_id, 'Day 4: Operational Safety, Bypass Protocols & Proof Testing Coverage', 4),
    (v_mod5_id, v_course_id, 'Day 5: Functional Safety Management & Comprehensive Mock Examination', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3030001-0001-0000-0000-000000000001', v_mod1_id, '1. Functional safety concepts', 'Risk and tolerability; Safety functions; IEC 61508 and IEC 61511.', 'text', 210, 1, false),
    ('c3030001-0001-0000-0000-000000000002', v_mod1_id, '2. Hazard and risk assessment', 'HAZOP link; Risk graphs; LOPA.', 'text', 210, 2, false),
    ('c3030001-0002-0000-0000-000000000001', v_mod2_id, '3. Safety requirements specification', 'SRS content; Process safety time; Trip settings.', 'text', 420, 1, false),
    ('c3030001-0003-0000-0000-000000000001', v_mod3_id, '4. SIS design', 'Sensors, logic solvers and final elements; Architectures and voting; Diagnostics.', 'text', 210, 1, false),
    ('c3030001-0003-0000-0000-000000000002', v_mod3_id, '5. SIL verification', 'PFD calculations; Common cause; Proof test coverage.', 'text', 210, 2, false),
    ('c3030001-0004-0000-0000-000000000001', v_mod4_id, '6. Operation and maintenance', 'Bypass management; Proof testing; Demand tracking.', 'text', 420, 1, false),
    ('c3030001-0005-0000-0000-000000000001', v_mod5_id, '7. Functional safety management', 'Competence; Audits and assessments; Management of change.', 'text', 210, 1, false),
    ('c3030001-0005-0000-0000-000000000002', v_mod5_id, '8. Examination preparation', 'Mock examination; Review of weak areas; Exam technique.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: AD04 (Fire and gas detection system design and detector mapping)
  -- =========================================================================
  v_course_id := 'c3040000-0000-0000-0000-000000000004';
  v_mod1_id := 'd3040001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3040001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3040001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD04', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_icss_id, 'Automation and ICSS',
    'Fire and gas detection system design and detector mapping',
    'Fire and gas systems detect hazards and start protective actions, but poor detector placement leaves gaps that only show up in an incident. This course covers detector technologies, performance based mapping, system design and testing.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 28 to 30, Dec 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Select flame, gas and smoke detection technologies for a hazard',
      'Carry out performance based detector mapping',
      'Define voting, alarm and executive actions',
      'Plan testing and maintenance of fire and gas systems',
      'Link fire and gas design to the safety case'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Map gas detection for a compressor module',
      'Define cause and effect for a fire zone'
    ],
    ARRAY['ISA TR84.00.07', 'IEC 60079 29', 'EN 54', 'NFPA 72'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-06-28 08:30:00+00', '2027-06-30 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Fire & Gas Detection Technologies & Performance-Based Mapping', 1),
    (v_mod2_id, v_course_id, 'Day 2: Voting Logics, Cause & Effect Matrices & ESD Integration', 2),
    (v_mod3_id, v_course_id, 'Day 3: Proof Testing, Sensor Calibration & Lessons from Industry Incidents', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3040001-0001-0000-0000-000000000001', v_mod1_id, '1. Hazards and detection', 'Fire and gas hazards; Detector types; Detector limits.', 'text', 210, 1, false),
    ('c3040001-0001-0000-0000-000000000002', v_mod1_id, '2. Detector mapping', 'Prescriptive and performance based methods; Coverage targets; Mapping tools.', 'text', 210, 2, false),
    ('c3040001-0002-0000-0000-000000000001', v_mod2_id, '3. System design', 'Voting and logic; Executive actions; Integration with ESD.', 'text', 420, 1, false),
    ('c3040001-0003-0000-0000-000000000001', v_mod3_id, '4. Testing and maintenance', 'Gas testing; Detector calibration; Records.', 'text', 210, 1, false),
    ('c3040001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Detection failures; Lessons learned; Design checklists.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
