-- Migration: Seed Courses VA12, VA13, VA14, VA15, VA16
-- Domain 2 / Valves and Actuation (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_act_id UUID;
  v_subcat_sev_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategories
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'valves-and-actuation' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 2 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_act_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'actuation-and-flow-control' LIMIT 1;
  IF v_subcat_act_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Actuation and flow control', 'actuation-and-flow-control', 4)
    RETURNING id INTO v_subcat_act_id;
  END IF;

  SELECT id INTO v_subcat_sev_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'severe-and-specialised-service-valves' LIMIT 1;
  IF v_subcat_sev_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Severe and specialised service valves', 'severe-and-specialised-service-valves', 5)
    RETURNING id INTO v_subcat_sev_id;
  END IF;

  -- 2. Resolve Instructor Profile
  SELECT id INTO v_instructor_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM public.profiles LIMIT 1;
  END IF;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;


  -- =========================================================================
  -- COURSE 1: VA12 (Smart electric actuators and fieldbus integration)
  -- =========================================================================
  v_course_id := 'c4120000-0000-0000-0000-000000000012';
  v_mod1_id := 'd2120001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2120001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2120001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA12', 2, 'flow_control', v_cat_id, v_subcat_act_id, 'Actuation and flow control',
    'Smart electric actuators and fieldbus integration',
    'Smart electric actuators now carry torque logs, event records and remote diagnostics, and they sit on the same networks as the control system. This course shows engineers and technicians how to configure them, integrate them with Modbus, Profibus and HART networks, and use their data to plan maintenance.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 1 to 3, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the functions and internal data of smart electric actuators',
      'Configure limits, torque settings and control modes with setup tools',
      'Integrate actuators on Modbus, Profibus and HART networks',
      'Use torque profiles and event logs to spot valve and gearbox problems',
      'Plan secure remote access and firmware management'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Configure and network four actuators on a training rig',
      'Read torque profiles to find a sticking valve',
      'Set up a maintenance alert from actuator data'
    ],
    ARRAY['ISO 22153', 'IEC 61158', 'IEC 61784', 'IEC 60079 0'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-02-01 08:30:00+00', '2027-02-03 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Smart Actuator Architecture & Setup Configuration', 1),
    (v_mod2_id, v_course_id, 'Day 2: Industrial Bus Networking & Redundant Control (Modbus/Profibus/HART)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Torque Diagnostics, Alert Rules & Cybersecurity Management', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4120001-0001-0000-0000-000000000001', v_mod1_id, '1. Smart actuator design', 'Motor, gearbox and control module; Local and remote control modes; Hazardous area versions.', 'text', 210, 1, false),
    ('c4120001-0001-0000-0000-000000000002', v_mod1_id, '2. Configuration', 'Limit and torque setting; Setup tools and Bluetooth access; Configuration backup.', 'text', 210, 2, false),
    ('c4120001-0002-0000-0000-000000000001', v_mod2_id, '3. Network integration', 'Modbus RTU and TCP; Profibus DP and redundancy; HART and analogue control.', 'text', 420, 1, false),
    ('c4120001-0003-0000-0000-000000000001', v_mod3_id, '4. Using actuator data', 'Torque profiles; Event and alarm logs; Maintenance triggers.', 'text', 210, 1, false),
    ('c4120001-0003-0000-0000-000000000002', v_mod3_id, '5. Security and lifecycle', 'Secure access; Firmware management; Records.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: VA13 (Fugitive emissions: low emission packing and ISO 15848)
  -- =========================================================================
  v_course_id := 'c4130000-0000-0000-0000-000000000013';
  v_mod1_id := 'd2130001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2130001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA13', 2, 'flow_control', v_cat_id, v_subcat_sev_id, 'Severe and specialised service valves',
    'Fugitive emissions: low emission packing and ISO 15848',
    'Valve stems and packing are among the largest sources of fugitive methane and VOC emissions on oil, gas and chemical sites, and new methane rules set leak limits that older valves cannot meet. This course explains low emission valve technology, type testing and how to plan valve leak detection and repair.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 8 to 9, Jul 26 to 27, Nov 15 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain where and why valves leak to atmosphere',
      'Specify low emission packing, bellows seals and test classes for new valves',
      'Interpret ISO 15848 and API 622 and 624 test results',
      'Plan a leak detection and repair programme for valves',
      'Estimate emission reductions from valve upgrades'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Specify low emission valves for a methane reduction project',
      'Calculate the emission saving from repacking a valve population'
    ],
    ARRAY['ISO 15848 1', 'API 622', 'API 624', 'API 641', 'OGMP 2.0'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-03-08 08:30:00+00', '2027-03-09 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Fugitive Emission Mechanisms & Low-Leakage Sealing Technology', 1),
    (v_mod2_id, v_course_id, 'Day 2: Type Testing Standards (ISO 15848/API 624) & LDAR Surveys', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4130001-0001-0000-0000-000000000001', v_mod1_id, '1. Fugitive emission sources and rules', 'Stem, body and bonnet leaks; Methane and VOC regulations; Leak thresholds and reporting.', 'text', 210, 1, false),
    ('c4130001-0001-0000-0000-000000000002', v_mod1_id, '2. Low emission technology', 'Packing materials and live loading; Bellows seals; Stem finish and guiding.', 'text', 210, 2, false),
    ('c4130001-0002-0000-0000-000000000001', v_mod2_id, '3. Type testing and specification', 'ISO 15848 tightness and endurance classes; API 622, 624 and 641; Writing purchase specifications.', 'text', 210, 1, false),
    ('c4130001-0002-0000-0000-000000000002', v_mod2_id, '4. Leak detection, repair and reporting', 'Survey methods and optical gas imaging; Repair priorities; Quantifying reductions.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: VA14 (Severe service valves for erosive, high pressure and cryogenic duty)
  -- =========================================================================
  v_course_id := 'c4140000-0000-0000-0000-000000000014';
  v_mod1_id := 'd2140001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2140001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2140001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA14', 2, 'flow_control', v_cat_id, v_subcat_sev_id, 'Severe and specialised service valves',
    'Severe service valves for erosive, high pressure and cryogenic duty',
    'Severe service valves face erosion from sand, very high pressure drops, flashing and extreme temperatures, and they are among the most expensive and critical valves on a plant. This advanced course covers how to recognise severe service, choose materials and trims, and manage these valves through their life.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 26 to 28. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Recognise severe service conditions from process data',
      'Select trims, materials and coatings for erosive and high pressure drop duties',
      'Compare choke, metal seated ball and multi stage control valves',
      'Plan inspection, refurbishment and spares for critical valves',
      'Learn from failure cases to improve specifications'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Select a choke valve for a sand laden well',
      'Review a failed trim and write a revised specification'
    ],
    ARRAY['API 6A', 'ASME B16.34', 'MSS SP 61', 'IEC 60534'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-01-11 08:30:00+00', '2027-01-13 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Severe Service Degradation Modes & Advanced Wear Coatings', 1),
    (v_mod2_id, v_course_id, 'Day 2: Engineered Valve Solutions: Choke, Metal-Seated & Multi-Stage Trims', 2),
    (v_mod3_id, v_course_id, 'Day 3: Procurement Specification, Factory QA & Lifecycle Asset Integrity', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4140001-0001-0000-0000-000000000001', v_mod1_id, '1. Defining severe service', 'Erosion and solids; High pressure drop and flashing; Thermal cycling and extremes.', 'text', 210, 1, false),
    ('c4140001-0001-0000-0000-000000000002', v_mod1_id, '2. Materials and coatings', 'Tungsten carbide and stellite; Ceramics; Coating processes and limits.', 'text', 210, 2, false),
    ('c4140001-0002-0000-0000-000000000001', v_mod2_id, '3. Valve solutions', 'Choke valves; Metal seated ball valves; Multi stage trims.', 'text', 420, 1, false),
    ('c4140001-0003-0000-0000-000000000001', v_mod3_id, '4. Specification and testing', 'Data sheets; Factory testing; Vendor surveillance.', 'text', 210, 1, false),
    ('c4140001-0003-0000-0000-000000000002', v_mod3_id, '5. Lifecycle management', 'Inspection intervals; Refurbishment versus replacement; Critical spares; Failure case studies.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: VA15 (LNG and cryogenic valve technology)
  -- =========================================================================
  v_course_id := 'c4150000-0000-0000-0000-000000000015';
  v_mod1_id := 'd2150001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2150001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2150001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA15', 2, 'flow_control', v_cat_id, v_subcat_sev_id, 'Severe and specialised service valves',
    'LNG and cryogenic valve technology',
    'LNG and other cryogenic services run valves at temperatures down to minus 196 degrees Celsius, where normal materials and seals fail. This course covers cryogenic valve design, testing, installation and maintenance for liquefaction, storage and loading facilities.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 22 to 24, Aug 2 to 4. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain how cryogenic temperatures affect valve materials and seals',
      'Identify design features such as extended bonnets and cavity relief',
      'Specify cryogenic type and production testing',
      'Plan installation, cool down and maintenance of cryogenic valves',
      'Apply lessons from LNG plant experience'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Specify valves for an LNG loading line',
      'Review a cryogenic test report and decide acceptance'
    ],
    ARRAY['BS 6364', 'ISO 28921', 'API 6D', 'EN 1473'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-02-22 08:30:00+00', '2027-02-24 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Cryogenic Fluid Dynamics, Metallurgy & Bonnet Extensions', 1),
    (v_mod2_id, v_course_id, 'Day 2: Cryogenic Production & Type Testing (BS 6364/ISO 28921)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation Cool-Down, Plant Operations & Maintenance Case Studies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4150001-0001-0000-0000-000000000001', v_mod1_id, '1. Cryogenic service conditions', 'LNG properties; Thermal contraction; Material toughness.', 'text', 210, 1, false),
    ('c4150001-0001-0000-0000-000000000002', v_mod1_id, '2. Cryogenic valve design', 'Extended bonnets and gas columns; Seat and seal materials; Cavity pressure relief.', 'text', 210, 2, false),
    ('c4150001-0002-0000-0000-000000000001', v_mod2_id, '3. Testing', 'BS 6364 and ISO 28921 tests; Helium leak testing; Witness points.', 'text', 420, 1, false),
    ('c4150001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation and operation', 'Orientation; Cool down; Insulation and icing.', 'text', 210, 1, false),
    ('c4150001-0003-0000-0000-000000000002', v_mod3_id, '5. Maintenance and case studies', 'Inspection and repair; LNG plant lessons.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: VA16 (Wellhead and subsea valves: API 6A and API 17D)
  -- =========================================================================
  v_course_id := 'c4160000-0000-0000-0000-000000000016';
  v_mod1_id := 'd2160001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2160001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2160001-0000-0000-0000-000000000003';
  v_mod4_id := 'd2160001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA16', 2, 'flow_control', v_cat_id, v_subcat_sev_id, 'Severe and specialised service valves',
    'Wellhead and subsea valves: API 6A and API 17D',
    'Wellhead and subsea valves control well flow and protect people and the environment, and they must work for decades with little access. This course explains wellhead and tree equipment, API 6A and API 17D requirements, testing and integrity management.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Dec 13 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify wellhead and christmas tree components and their functions',
      'Interpret API 6A pressure ratings, temperature classes and PSL and PR levels',
      'Describe API 17D subsea valve and actuator requirements',
      'Plan factory acceptance, site and periodic testing',
      'Manage wellhead valve integrity and records'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Interpret an API 6A data sheet and its test certificates',
      'Build a periodic test plan for a wellhead population'
    ],
    ARRAY['API 6A', 'API 17D', 'ISO 10423', 'NACE MR0175'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-12-13 08:30:00+00', '2027-12-16 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Wellhead & Surface Trees Architecture (API 6A PSL/PR Levels)', 1),
    (v_mod2_id, v_course_id, 'Day 2: Subsea Valve Design & ROV Actuator Interfaces (API 17D)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Factory Acceptance, Hydrostatic & Subsea Qualification Testing', 3),
    (v_mod4_id, v_course_id, 'Day 4: Sour Service Metallurgy, Integrity Management & Failure Case Studies', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4160001-0001-0000-0000-000000000001', v_mod1_id, '1. Wellhead systems', 'Casing and tubing heads; Surface trees; Hangers and seals.', 'text', 210, 1, false),
    ('c4160001-0001-0000-0000-000000000002', v_mod1_id, '2. API 6A requirements', 'Pressure and temperature ratings; Material classes; PSL and PR levels.', 'text', 210, 2, false),
    ('c4160001-0002-0000-0000-000000000001', v_mod2_id, '3. Subsea valves', 'API 17D gate valves; Subsea actuators; ROV interfaces.', 'text', 420, 1, false),
    ('c4160001-0003-0000-0000-000000000001', v_mod3_id, '4. Testing', 'Factory acceptance tests; Site and leak off tests; Periodic testing.', 'text', 420, 1, false),
    ('c4160001-0004-0000-0000-000000000001', v_mod4_id, '5. Integrity management', 'Inspection and greasing; Sour service; Records and audits.', 'text', 210, 1, false),
    ('c4160001-0004-0000-0000-000000000002', v_mod4_id, '6. Case studies', 'Wellhead valve failures; Lessons for specifications.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
