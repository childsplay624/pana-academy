-- =============================================================================
-- Migration: 20270101000042_seed_courses_ms02_ms12_to_ms14.sql
-- Description: Seed Domain 8 (Marine and subsea) courses:
--              MS02: FPSO operations and integrity management
--              MS12: Marine pollution prevention and MARPOL compliance
--              MS13: Maritime security risk management in the Gulf of Guinea
--              MS14: Coastal and marine spatial planning
-- =============================================================================

DO $$
DECLARE
  v_cat_ms_id UUID;
  v_subcat_ops_id UUID;
  v_subcat_blue_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 8 (Marine and subsea)
  SELECT id INTO v_cat_ms_id
  FROM public.course_categories
  WHERE slug = 'marine-and-subsea' OR domain_no = 8
  LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_ops_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_ms_id AND slug = 'marine-operations'
  LIMIT 1;

  SELECT id INTO v_subcat_blue_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_ms_id AND slug = 'blue-economy'
  LIMIT 1;

  -- 3. Resolve Instructor Profile
  SELECT id INTO v_instructor_id
  FROM auth.users
  WHERE email LIKE '%pana%' OR email LIKE '%admin%'
  LIMIT 1;

  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE 1: MS02 (FPSO operations and integrity management)
  -- =========================================================================
  v_course_id := 'c8020000-0000-0000-0000-000000000002';
  v_mod1_id := 'd8020001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8020001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8020001-0000-0000-0000-000000000003';
  v_mod4_id := 'd8020001-0000-0000-0000-000000000004';
  v_mod5_id := 'd8020001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS02', 8, 'general_technical', v_cat_ms_id, v_subcat_ops_id, 'Marine operations',
    'FPSO operations and integrity management',
    'FPSOs combine a ship, a process plant and a storage terminal, and many in West Africa are now in life extension. This course covers FPSO systems, operations and integrity management for operations and engineering staff.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 22 to 26, Aug 16 to 20. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe FPSO topsides, hull, mooring and offloading systems',
      'Explain the interaction between marine and process operations',
      'Manage hull, mooring and topsides integrity',
      'Plan inspection and maintenance in a confined, live environment',
      'Assess life extension options and regulatory requirements'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Trace process and cargo flows on an FPSO layout',
      'Build an integrity inspection plan for hull and moorings',
      'Assess a life extension case'
    ],
    ARRAY['DNV OS C102', 'API RP 2SK', 'IMO MARPOL Annex I', 'ABS FPI rules'],
    ARRAY['Solartron ISA (subsea and wet gas measurement)', 'Mokveld (subsea valves)'],
    '2027-02-22 08:30:00+00', '2027-02-26 16:30:00+00',
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
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: FPSO Concepts & Fleet Layouts', 1),
    (v_mod2_id, v_course_id, 'Day 2: Topsides Systems, Hull & Storage', 2),
    (v_mod3_id, v_course_id, 'Day 3: Mooring & Risers', 3),
    (v_mod4_id, v_course_id, 'Day 4: Offloading Operations & Integrity Management', 4),
    (v_mod5_id, v_course_id, 'Day 5: Life Extension Assessment & Regulation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8020001-0001-0000-0000-000000000001', v_mod1_id, '1. FPSO concepts', 'Conversion and new build; Field layouts; West African FPSO fleet', 'text', 300, 1, false),
    ('e8020001-0002-0000-0000-000000000001', v_mod2_id, '2. Topsides systems', 'Separation and treatment; Gas handling; Utilities', 'text', 300, 1, false),
    ('e8020001-0002-0000-0000-000000000002', v_mod2_id, '3. Hull and storage', 'Cargo tanks; Ballast systems; Inert gas', 'text', 300, 2, false),
    ('e8020001-0003-0000-0000-000000000001', v_mod3_id, '4. Mooring and risers', 'Turret and spread moorings; Riser systems; Monitoring', 'text', 300, 1, false),
    ('e8020001-0004-0000-0000-000000000001', v_mod4_id, '5. Offloading', 'Tandem and buoy offloading; Shuttle tanker operations; Metering', 'text', 300, 1, false),
    ('e8020001-0004-0000-0000-000000000002', v_mod4_id, '6. Integrity management', 'Hull inspection; Mooring integrity; Topsides corrosion', 'text', 300, 2, false),
    ('e8020001-0005-0000-0000-000000000001', v_mod5_id, '7. Life extension', 'Assessment; Class and regulator requirements; Case studies', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: MS12 (Marine pollution prevention and MARPOL compliance)
  -- =========================================================================
  v_course_id := 'c8120000-0000-0000-0000-000000000012';
  v_mod1_id := 'd8120001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8120001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8120001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS12', 8, 'general_technical', v_cat_ms_id, v_subcat_blue_id, 'Blue economy',
    'Marine pollution prevention and MARPOL compliance',
    'Ships, terminals and offshore facilities must prevent oil, chemical, sewage, garbage and air pollution under MARPOL and national rules. This course covers MARPOL requirements, compliance records, inspections and pollution response.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 1 to 3, Sep 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain MARPOL annexes and their requirements',
      'Manage oil record books and garbage records',
      'Prepare for port state and flag inspections',
      'Respond to pollution incidents and report them',
      'Apply Nigerian pollution rules alongside MARPOL'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Audit a set of MARPOL records',
      'Respond to a simulated spill report'
    ],
    ARRAY['MARPOL 73/78', 'NOSDRA regulations', 'IMO MEPC guidelines', 'OPRC Convention'],
    ARRAY['Solartron ISA (subsea and wet gas measurement)', 'Mokveld (subsea valves)'],
    '2027-03-01 08:30:00+00', '2027-03-03 16:30:00+00',
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
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: MARPOL Overview, Oil & Chemical Pollution', 1),
    (v_mod2_id, v_course_id, 'Day 2: Garbage, Sewage & Air Emissions', 2),
    (v_mod3_id, v_course_id, 'Day 3: Inspections, Records & Incident Response', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8120001-0001-0000-0000-000000000001', v_mod1_id, '1. MARPOL overview', 'Annexes I to VI; Ship and platform application; Certificates', 'text', 240, 1, false),
    ('e8120001-0001-0000-0000-000000000002', v_mod1_id, '2. Oil and chemical pollution', 'Oily water separators; Records; Discharge limits', 'text', 240, 2, false),
    ('e8120001-0002-0000-0000-000000000001', v_mod2_id, '3. Garbage, sewage and air', 'Garbage management; Sewage; Sulphur and NOx limits', 'text', 240, 1, false),
    ('e8120001-0003-0000-0000-000000000001', v_mod3_id, '4. Inspections and records', 'Port state control; Common deficiencies; Record keeping', 'text', 240, 1, false),
    ('e8120001-0003-0000-0000-000000000002', v_mod3_id, '5. Incident response', 'Spill response; Reporting; NOSDRA rules', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: MS13 (Maritime security risk management in the Gulf of Guinea)
  -- =========================================================================
  v_course_id := 'c8130000-0000-0000-0000-000000000013';
  v_mod1_id := 'd8130001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8130001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS13', 8, 'general_technical', v_cat_ms_id, v_subcat_blue_id, 'Blue economy',
    'Maritime security risk management in the Gulf of Guinea',
    'Piracy, kidnapping and theft at sea affect shipping and offshore operations in the Gulf of Guinea. This executive course covers maritime security risk, protection measures and coordination with authorities.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Oct 25 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Assess maritime security threats in the Gulf of Guinea',
      'Apply best management practices for vessels and installations',
      'Coordinate with navies and regional centres',
      'Plan crisis and kidnap response',
      'Govern security spending and contracts'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'Oil and gas operators and service companies',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Run a crisis tabletop on a vessel attack',
      'Assess security plans for an offshore field'
    ],
    ARRAY['BMP West Africa', 'ISPS Code', 'Yaounde Code of Conduct', 'ISO 28000'],
    ARRAY['Solartron ISA (subsea and wet gas measurement)', 'Mokveld (subsea valves)'],
    '2027-10-25 08:30:00+00', '2027-10-26 16:30:00+00',
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
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Threat Landscape & Protection Measures', 1),
    (v_mod2_id, v_course_id, 'Day 2: Coordination, Crisis Response & Governance', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8130001-0001-0000-0000-000000000001', v_mod1_id, '1. Threat landscape', 'Piracy and armed robbery; Crude theft; Trends', 'text', 210, 1, false),
    ('e8130001-0001-0000-0000-000000000002', v_mod1_id, '2. Protection measures', 'BMP West Africa; Security vessels; Citadels', 'text', 210, 2, false),
    ('e8130001-0002-0000-0000-000000000001', v_mod2_id, '3. Coordination', 'Yaounde Code; Regional centres; Navies', 'text', 210, 1, false),
    ('e8130001-0002-0000-0000-000000000002', v_mod2_id, '4. Crisis response and governance', 'Kidnap response; Insurance; Contracting', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: MS14 (Coastal and marine spatial planning)
  -- =========================================================================
  v_course_id := 'c8140000-0000-0000-0000-000000000014';
  v_mod1_id := 'd8140001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8140001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8140001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS14', 8, 'general_technical', v_cat_ms_id, v_subcat_blue_id, 'Blue economy',
    'Coastal and marine spatial planning',
    'Marine spatial planning allocates sea and coastal space between shipping, energy, fishing, conservation and communities, and it reduces conflict before projects start. This course covers methods, data and tools for coastal and marine spatial planning.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 3 to 5, Nov 8 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain marine spatial planning principles and legal basis',
      'Map sea uses, conflicts and sensitivities',
      'Use GIS and decision support tools for planning',
      'Engage stakeholders and communities',
      'Draft, adopt and monitor spatial plans'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Map uses and conflicts for a coastal zone',
      'Draft zoning options and present them'
    ],
    ARRAY['UNESCO IOC MSP guide', 'UNCLOS', 'Abidjan Convention'],
    ARRAY['Solartron ISA (subsea and wet gas measurement)', 'Mokveld (subsea valves)'],
    '2027-05-03 08:30:00+00', '2027-05-05 16:30:00+00',
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
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Planning Principles & Mapping Uses and Conflicts', 1),
    (v_mod2_id, v_course_id, 'Day 2: GIS & Planning Tools', 2),
    (v_mod3_id, v_course_id, 'Day 3: Stakeholder Engagement, Zoning & Monitoring', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8140001-0001-0000-0000-000000000001', v_mod1_id, '1. Planning principles', 'Ecosystem approach; Legal basis; International examples', 'text', 240, 1, false),
    ('e8140001-0001-0000-0000-000000000002', v_mod1_id, '2. Mapping uses and conflicts', 'Data sources; Conflict analysis; Sensitivity mapping', 'text', 240, 2, false),
    ('e8140001-0002-0000-0000-000000000001', v_mod2_id, '3. Tools', 'GIS; Decision support tools; Scenario building', 'text', 240, 1, false),
    ('e8140001-0003-0000-0000-000000000001', v_mod3_id, '4. Stakeholder engagement', 'Methods; Communities and fisheries; Industry', 'text', 240, 1, false),
    ('e8140001-0003-0000-0000-000000000002', v_mod3_id, '5. Plans and monitoring', 'Zoning; Indicators; Review cycles', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
