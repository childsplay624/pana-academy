-- Migration: Seed Courses MS01, MS03, MS04, MS05, MS06
-- Domain 8: Marine and subsea
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ms_id UUID;
  v_subcat_marine_id UUID;
  v_subcat_subsea_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 8
  SELECT id INTO v_cat_ms_id FROM public.course_categories WHERE slug = 'marine-and-subsea' OR domain_no = 8 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_marine_id FROM public.course_subcategories WHERE category_id = v_cat_ms_id AND slug = 'marine-operations' LIMIT 1;
  IF v_subcat_marine_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ms_id, 'Marine operations', 'marine-operations', 1)
    RETURNING id INTO v_subcat_marine_id;
  END IF;

  SELECT id INTO v_subcat_subsea_id FROM public.course_subcategories WHERE category_id = v_cat_ms_id AND slug = 'subsea' LIMIT 1;
  IF v_subcat_subsea_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ms_id, 'Subsea', 'subsea', 2)
    RETURNING id INTO v_subcat_subsea_id;
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
  -- COURSE 1: MS01 (Marine operations for offshore installations)
  -- =========================================================================
  v_course_id := 'c8010000-0000-0000-0000-000000000001';
  v_mod1_id := 'd8010001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8010001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8010001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS01', 8, 'general_technical', v_cat_ms_id, v_subcat_marine_id, 'Marine operations',
    'Marine operations for offshore installations',
    'Offshore installations depend on vessels, cranes, helicopters and weather windows, and marine operations carry some of the highest risks in the industry. This course gives non marine and marine staff a shared understanding of how marine operations are planned, controlled and carried out safely.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 24 to 26, Nov 8 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the main vessel types serving offshore installations and their roles',
      'Plan marine operations around weather, sea state and limiting criteria',
      'Apply simultaneous operations controls between vessels and installations',
      'Manage lifting, personnel transfer and cargo operations safely',
      'Respond to marine emergencies and loss of position events'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Plan a supply vessel operation within a 500 metre zone',
      'Review a marine incident and identify control failures'
    ],
    ARRAY['IMCA M 254', 'IMO SOLAS', 'IOGP 590', 'GOMO guidelines'],
    ARRAY['Solartron ISA', 'Mokveld'],
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
    (v_mod1_id, v_course_id, 'Day 1: Offshore Marine Environment & Planning Operations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Vessel & Installation Interfaces (SIMOPS)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Cargo, Lifting, Personnel Transfer & Marine Emergencies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8010001-0001-0000-0000-000000000001', v_mod1_id, '1. Offshore marine environment', 'Vessel types; Metocean conditions; Roles and responsibilities', 'text', 240, 1, false),
    ('e8010001-0001-0000-0000-000000000002', v_mod1_id, '2. Planning marine operations', 'Weather windows; Limiting criteria; Marine procedures', 'text', 240, 2, false),
    ('e8010001-0002-0000-0000-000000000001', v_mod2_id, '3. Vessel and installation interfaces', 'Safety zones; SIMOPS; Communications', 'text', 240, 1, false),
    ('e8010001-0003-0000-0000-000000000001', v_mod3_id, '4. Cargo, lifting and personnel transfer', 'Deck operations; Crane lifts; Basket and gangway transfer', 'text', 240, 1, false),
    ('e8010001-0003-0000-0000-000000000002', v_mod3_id, '5. Emergencies', 'Loss of position; Man overboard; Collision risk', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: MS03 (Dynamic positioning awareness for non mariners)
  -- =========================================================================
  v_course_id := 'c8030000-0000-0000-0000-000000000003';
  v_mod1_id := 'd8030001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8030001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS03', 8, 'general_technical', v_cat_ms_id, v_subcat_marine_id, 'Marine operations',
    'Dynamic positioning awareness for non mariners',
    'Many offshore workers spend time on dynamically positioned vessels without knowing how DP works or what can go wrong. This short foundation course explains DP systems, their limits and the role of non marine staff during DP operations.',
    v_instructor_id, 'beginner', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 1 to 2, Jul 5 to 6, Nov 1 to 2. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain how a DP system keeps a vessel on station',
      'Describe DP classes, redundancy and the worst case failure',
      'Recognise DP status alerts and the actions they require',
      'Understand how their own activity affects DP operations',
      'Learn from DP incidents in the offshore industry'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Respond to a simulated DP status change during a lifting operation',
      'Review a DP incident and identify lessons'
    ],
    ARRAY['IMO MSC.1/Circ.1580', 'IMCA M 103', 'MTS DP guidance'],
    ARRAY['Solartron ISA', 'Mokveld'],
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
    (v_mod1_id, v_course_id, 'Day 1: DP Principles, Sensors & System Redundancy', 1),
    (v_mod2_id, v_course_id, 'Day 2: DP Operations, Status Alerts & Offshore Incidents', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8030001-0001-0000-0000-000000000001', v_mod1_id, '1. DP principles', 'Position references; Sensors; Thrusters', 'text', 210, 1, false),
    ('e8030001-0001-0000-0000-000000000002', v_mod1_id, '2. DP classes and redundancy', 'Class 1, 2 and 3; Worst case failure design; FMEA', 'text', 210, 2, false),
    ('e8030001-0002-0000-0000-000000000001', v_mod2_id, '3. DP operations', 'Activity specific operating guidelines; Status alerts; Communications', 'text', 210, 1, false),
    ('e8030001-0002-0000-0000-000000000002', v_mod2_id, '4. Incidents and lessons', 'Drive off and drift off events; Human factors; Case studies', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: MS04 (Mooring and offloading operations at SPM and CALM buoys)
  -- =========================================================================
  v_course_id := 'c8040000-0000-0000-0000-000000000004';
  v_mod1_id := 'd8040001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8040001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8040001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS04', 8, 'general_technical', v_cat_ms_id, v_subcat_marine_id, 'Marine operations',
    'Mooring and offloading operations at SPM and CALM buoys',
    'Single point and CALM buoy moorings handle crude export and import at many West African terminals, and offloading incidents lead to spills and costly downtime. This course covers buoy systems, mooring and offloading operations and maintenance.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 12 to 14, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe SPM and CALM buoy components',
      'Plan and run tanker mooring and hose connection',
      'Monitor loads, weather and hose condition during offloading',
      'Respond to emergencies such as hose failure or breakaway',
      'Plan inspection and maintenance of buoys and hoses'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Plan a mooring and offloading sequence for a terminal',
      'Run a tabletop exercise on a hose rupture'
    ],
    ARRAY['OCIMF Guidelines for Offshore Tanker Operations', 'OCIMF Guide to Manufacturing and Purchasing Hoses', 'ISGOTT'],
    ARRAY['Solartron ISA', 'Mokveld'],
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
    (v_mod1_id, v_course_id, 'Day 1: Buoy Systems & Tanker Mooring Operations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Crude Offloading & Metering Interface', 2),
    (v_mod3_id, v_course_id, 'Day 3: Emergency Responses & Buoy Inspection/Maintenance', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8040001-0001-0000-0000-000000000001', v_mod1_id, '1. Buoy systems', 'CALM and SPM designs; Swivels and hoses; Anchoring', 'text', 240, 1, false),
    ('e8040001-0001-0000-0000-000000000002', v_mod1_id, '2. Mooring operations', 'Approach and mooring; Hawser and hose connection; Communications with tanker', 'text', 240, 2, false),
    ('e8040001-0002-0000-0000-000000000001', v_mod2_id, '3. Offloading', 'Loading rates; Monitoring; Metering interface', 'text', 240, 1, false),
    ('e8040001-0003-0000-0000-000000000001', v_mod3_id, '4. Emergencies', 'Hose failure; Breakaway; Spill response', 'text', 240, 1, false),
    ('e8040001-0003-0000-0000-000000000002', v_mod3_id, '5. Inspection and maintenance', 'Hose change out; Buoy inspection; Records', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: MS05 (Port and terminal operations management)
  -- =========================================================================
  v_course_id := 'c8050000-0000-0000-0000-000000000005';
  v_mod1_id := 'd8050001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8050001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS05', 8, 'general_technical', v_cat_ms_id, v_subcat_marine_id, 'Marine operations',
    'Port and terminal operations management',
    'Ports and terminals are where energy, cargo and trade meet, and their efficiency affects whole economies. This course covers port and terminal operations, safety and performance management.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 26 to 28. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe port and terminal organisation and operating models',
      'Plan berth, yard and cargo operations',
      'Manage safety, security and environmental compliance',
      'Measure performance with port KPIs',
      'Identify improvement options including digital tools'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Analyse berth and yard performance data',
      'Build a KPI dashboard for a terminal'
    ],
    ARRAY['ISPS Code', 'IMO FAL Convention', 'ISO 28000', 'ISGOTT'],
    ARRAY['Solartron ISA', 'Mokveld'],
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
    (v_mod1_id, v_course_id, 'Day 1: Port Organisation Models & Terminal Berth Planning', 1),
    (v_mod2_id, v_course_id, 'Day 2: Safety, Security (ISPS) & Environmental Compliance', 2),
    (v_mod3_id, v_course_id, 'Day 3: Terminal Performance KPIs & Digital Port Solutions', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8050001-0001-0000-0000-000000000001', v_mod1_id, '1. Port organisation', 'Landlord and operator models; Stakeholders; Concessions', 'text', 240, 1, false),
    ('e8050001-0001-0000-0000-000000000002', v_mod1_id, '2. Terminal operations', 'Berth planning; Yard management; Cargo handling', 'text', 240, 2, false),
    ('e8050001-0002-0000-0000-000000000001', v_mod2_id, '3. Safety, security and environment', 'ISPS Code; Hazardous cargo; Pollution control', 'text', 240, 1, false),
    ('e8050001-0003-0000-0000-000000000001', v_mod3_id, '4. Performance management', 'KPIs; Benchmarking; Congestion', 'text', 240, 1, false),
    ('e8050001-0003-0000-0000-000000000002', v_mod3_id, '5. Digital ports', 'Port community systems; Automation; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: MS06 (Subsea production systems: trees, manifolds and controls)
  -- =========================================================================
  v_course_id := 'c8060000-0000-0000-0000-000000000006';
  v_mod1_id := 'd8060001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8060001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8060001-0000-0000-0000-000000000003';
  v_mod4_id := 'd8060001-0000-0000-0000-000000000004';
  v_mod5_id := 'd8060001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS06', 8, 'general_technical', v_cat_ms_id, v_subcat_subsea_id, 'Subsea',
    'Subsea production systems: trees, manifolds and controls',
    'Subsea production systems put wellheads, trees, manifolds and control systems on the seabed, where repairs need vessels and ROVs. This course covers subsea system architecture, equipment, controls and operations for engineers and technicians.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 25 to 29, Jul 12 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe subsea field architectures and equipment',
      'Explain subsea tree types and their operation',
      'Describe manifolds, jumpers and connection systems',
      'Explain subsea control systems and umbilicals',
      'Plan intervention and maintenance for subsea equipment'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Trace control and production paths on a subsea field layout',
      'Diagnose a subsea valve control fault from data',
      'Plan an intervention campaign'
    ],
    ARRAY['API RP 17A', 'API 17D', 'API 17F', 'ISO 13628'],
    ARRAY['Solartron ISA', 'Mokveld'],
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
    (v_mod1_id, v_course_id, 'Day 1: Subsea Field Architecture & Tieback Layouts', 1),
    (v_mod2_id, v_course_id, 'Day 2: Subsea Trees, Wellheads, Manifolds & Connections', 2),
    (v_mod3_id, v_course_id, 'Day 3: Subsea Controls, Umbilicals & Topside Interfaces', 3),
    (v_mod4_id, v_course_id, 'Day 4: Subsea Processing, Boosting & Installation/Intervention', 4),
    (v_mod5_id, v_course_id, 'Day 5: Integrity Monitoring, Failure Modes & Intervention Planning', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8060001-0001-0000-0000-000000000001', v_mod1_id, '1. Subsea field architecture', 'Satellite and cluster layouts; Tiebacks; Deepwater challenges', 'text', 300, 1, false),
    ('e8060001-0002-0000-0000-000000000001', v_mod2_id, '2. Subsea trees and wellheads', 'Vertical and horizontal trees; Valves; Tree installation', 'text', 300, 1, false),
    ('e8060001-0002-0000-0000-000000000002', v_mod2_id, '3. Manifolds and connections', 'Manifolds and PLEMs; Jumpers; Connectors', 'text', 300, 2, false),
    ('e8060001-0003-0000-0000-000000000001', v_mod3_id, '4. Controls and umbilicals', 'Electro hydraulic controls; Umbilicals; Topsides control units', 'text', 300, 1, false),
    ('e8060001-0004-0000-0000-000000000001', v_mod4_id, '5. Subsea processing', 'Boosting; Separation; Power', 'text', 300, 1, false),
    ('e8060001-0004-0000-0000-000000000002', v_mod4_id, '6. Installation and intervention', 'Installation vessels; ROV and light well intervention', 'text', 210, 2, false),
    ('e8060001-0005-0000-0000-000000000001', v_mod5_id, '7. Integrity and operations', 'Monitoring; Failure modes; Case studies', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
