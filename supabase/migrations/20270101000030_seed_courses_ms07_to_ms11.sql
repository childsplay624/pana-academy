-- Migration: Seed Courses MS07 to MS11
-- Domain 8: Marine and subsea
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ms_id UUID;
  v_subcat_subsea_id UUID;
  v_subcat_blue_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 8
  SELECT id INTO v_cat_ms_id FROM public.course_categories WHERE slug = 'marine-and-subsea' OR domain_no = 8 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_subsea_id FROM public.course_subcategories WHERE category_id = v_cat_ms_id AND slug = 'subsea' LIMIT 1;
  IF v_subcat_subsea_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ms_id, 'Subsea', 'subsea', 2)
    RETURNING id INTO v_subcat_subsea_id;
  END IF;

  SELECT id INTO v_subcat_blue_id FROM public.course_subcategories WHERE category_id = v_cat_ms_id AND slug = 'blue-economy' LIMIT 1;
  IF v_subcat_blue_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ms_id, 'Blue economy', 'blue-economy', 3)
    RETURNING id INTO v_subcat_blue_id;
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
  -- COURSE 1: MS07 (Subsea pipeline and riser integrity)
  -- =========================================================================
  v_course_id := 'c8070000-0000-0000-0000-000000000007';
  v_mod1_id := 'd8070001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8070001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8070001-0000-0000-0000-000000000003';
  v_mod4_id := 'd8070001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS07', 8, 'general_technical', v_cat_ms_id, v_subcat_subsea_id, 'Subsea',
    'Subsea pipeline and riser integrity',
    'Subsea pipelines and risers carry production across the seabed and up to floating facilities, and their failure can be catastrophic. This advanced course covers integrity threats, inspection, assessment and repair.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Aug 23 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify integrity threats to subsea pipelines and risers',
      'Plan inspection using pigging, ROV and monitoring',
      'Assess defects with fitness for service methods',
      'Manage free spans, stability and fatigue',
      'Plan repair and contingency strategies'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Assess a corrosion defect using DNV RP F101',
      'Build a riser integrity management plan'
    ],
    ARRAY['DNV ST F101', 'DNV RP F101', 'API RP 17B', 'API RP 1111'],
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
    (v_mod1_id, v_course_id, 'Day 1: Subsea Pipeline Integrity Threats & Inspection', 1),
    (v_mod2_id, v_course_id, 'Day 2: Defect Assessment & Fitness for Service', 2),
    (v_mod3_id, v_course_id, 'Day 3: Free Spans, On-Bottom Stability & Upheaval Buckling', 3),
    (v_mod4_id, v_course_id, 'Day 4: Riser Integrity, Repair Clamps & Contingency Planning', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8070001-0001-0000-0000-000000000001', v_mod1_id, '1. Integrity threats', 'Corrosion; Fatigue; Third party damage', 'text', 270, 1, false),
    ('e8070001-0001-0000-0000-000000000002', v_mod1_id, '2. Inspection', 'Intelligent pigging; ROV surveys; Riser monitoring', 'text', 270, 2, false),
    ('e8070001-0002-0000-0000-000000000001', v_mod2_id, '3. Assessment', 'Defect assessment; Remaining life; Fitness for service', 'text', 270, 1, false),
    ('e8070001-0003-0000-0000-000000000001', v_mod3_id, '4. Free spans and stability', 'Span assessment; On bottom stability; Upheaval buckling', 'text', 270, 1, false),
    ('e8070001-0004-0000-0000-000000000001', v_mod4_id, '5. Riser integrity', 'Flexible and rigid risers; Fatigue; Annulus testing', 'text', 270, 1, false),
    ('e8070001-0004-0000-0000-000000000002', v_mod4_id, '6. Repair and contingency', 'Repair clamps; Contingency planning; Case studies', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: MS08 (ROV operations and subsea inspection planning)
  -- =========================================================================
  v_course_id := 'c8080000-0000-0000-0000-000000000008';
  v_mod1_id := 'd8080001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8080001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8080001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS08', 8, 'general_technical', v_cat_ms_id, v_subcat_subsea_id, 'Subsea',
    'ROV operations and subsea inspection planning',
    'ROVs carry out most subsea inspection, maintenance and repair work. This course covers ROV systems, capabilities and the planning of inspection campaigns.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Describe ROV classes, tooling and support systems',
      'Plan subsea inspection scopes and campaigns',
      'Specify survey and inspection deliverables',
      'Supervise ROV operations from the client side',
      'Review inspection data and raise anomalies'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Plan an ROV inspection campaign for a subsea field',
      'Review inspection footage and raise anomalies'
    ],
    ARRAY['IMCA R 004', 'IMCA R 006', 'ISO 13628-8'],
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
    (v_mod1_id, v_course_id, 'Day 1: ROV Systems, Tooling & Inspection Techniques', 1),
    (v_mod2_id, v_course_id, 'Day 2: Campaign Planning, Vessel Selection & Weather Windows', 2),
    (v_mod3_id, v_course_id, 'Day 3: Client Supervision, HSE & Anomaly Criteria Reporting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8080001-0001-0000-0000-000000000001', v_mod1_id, '1. ROV systems', 'Classes; Tooling; Launch and recovery', 'text', 240, 1, false),
    ('e8080001-0001-0000-0000-000000000002', v_mod1_id, '2. Inspection techniques', 'Visual; Cathodic protection; Sonar and survey', 'text', 240, 2, false),
    ('e8080001-0002-0000-0000-000000000001', v_mod2_id, '3. Campaign planning', 'Scopes; Vessel selection; Weather', 'text', 240, 1, false),
    ('e8080001-0003-0000-0000-000000000001', v_mod3_id, '4. Client supervision', 'Daily reporting; HSE; Change control', 'text', 240, 1, false),
    ('e8080001-0003-0000-0000-000000000002', v_mod3_id, '5. Data and anomalies', 'Data review; Anomaly criteria; Reporting', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: MS09 (Subsea decommissioning and late life planning)
  -- =========================================================================
  v_course_id := 'c8090000-0000-0000-0000-000000000009';
  v_mod1_id := 'd8090001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8090001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8090001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS09', 8, 'general_technical', v_cat_ms_id, v_subcat_subsea_id, 'Subsea',
    'Subsea decommissioning and late life planning',
    'Decommissioning liabilities for subsea infrastructure are large and growing, and regulators now expect plans and funding years before production ends. This advanced course covers late life planning, options assessment and decommissioning execution.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain decommissioning regulations and liabilities',
      'Compare removal and leave in place options',
      'Plan well abandonment and infrastructure removal',
      'Estimate costs, schedule and funding',
      'Engage regulators and stakeholders'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Run a comparative assessment for a subsea tieback',
      'Build a decommissioning cost estimate'
    ],
    ARRAY['IMO 1989 Guidelines', 'OSPAR Decision 98/3', 'Petroleum Industry Act 2021', 'NORSOK D-010'],
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
    (v_mod1_id, v_course_id, 'Day 1: Regulatory Framework & Late Life Asset Planning', 1),
    (v_mod2_id, v_course_id, 'Day 2: Comparative Options Assessment & Environmental Impact', 2),
    (v_mod3_id, v_course_id, 'Day 3: Execution, Decommissioning Funds & Stakeholders', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8090001-0001-0000-0000-000000000001', v_mod1_id, '1. Regulatory framework', 'International rules; National requirements under the PIA; Liabilities', 'text', 240, 1, false),
    ('e8090001-0001-0000-0000-000000000002', v_mod1_id, '2. Late life planning', 'Cessation of production; Cost reduction; Asset transfer', 'text', 240, 2, false),
    ('e8090001-0002-0000-0000-000000000001', v_mod2_id, '3. Options assessment', 'Comparative assessment; Environmental impact; Safety risk', 'text', 240, 1, false),
    ('e8090001-0003-0000-0000-000000000001', v_mod3_id, '4. Execution', 'Plug and abandonment; Removal methods; Waste handling', 'text', 240, 1, false),
    ('e8090001-0003-0000-0000-000000000002', v_mod3_id, '5. Cost and stakeholders', 'Estimating; Decommissioning funds; Engagement', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: MS10 (Blue economy policy, investment and governance)
  -- =========================================================================
  v_course_id := 'c8100000-0000-0000-0000-000000000010';
  v_mod1_id := 'd8100001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8100001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS10', 8, 'general_technical', v_cat_ms_id, v_subcat_blue_id, 'Blue economy',
    'Blue economy policy, investment and governance',
    'The blue economy covers fisheries, shipping, ports, offshore energy, tourism and coastal communities, and governments are building policy around it. This executive course covers blue economy policy, investment and governance.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 8 to 9. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Define the blue economy and its sectors',
      'Assess national blue economy opportunities',
      'Design policy and governance frameworks',
      'Attract investment and blended finance',
      'Balance growth with ocean health'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Draft a blue economy priority list for a coastal state',
      'Review a blue bond structure'
    ],
    ARRAY['AU Africa Blue Economy Strategy', 'UN SDG 14', 'World Bank blue economy guidance'],
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
    (v_mod1_id, v_course_id, 'Day 1: Blue Economy Concepts, Global Frameworks & Policy', 1),
    (v_mod2_id, v_course_id, 'Day 2: Blue Finance, PPPs & Ocean Sustainability Governance', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8100001-0001-0000-0000-000000000001', v_mod1_id, '1. Blue economy concepts', 'Sectors; Global frameworks; African Union strategy', 'text', 210, 1, false),
    ('e8100001-0001-0000-0000-000000000002', v_mod1_id, '2. Opportunities and policy', 'National strategies; Institutions; Regulation', 'text', 210, 2, false),
    ('e8100001-0002-0000-0000-000000000001', v_mod2_id, '3. Investment and finance', 'Blue bonds; Public private partnerships; Development finance', 'text', 210, 1, false),
    ('e8100001-0002-0000-0000-000000000002', v_mod2_id, '4. Sustainability and governance', 'Ocean health; Communities; Monitoring', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: MS11 (Offshore wind fundamentals, fixed and floating)
  -- =========================================================================
  v_course_id := 'c8110000-0000-0000-0000-000000000011';
  v_mod1_id := 'd8110001-0000-0000-0000-000000000001';
  v_mod2_id := 'd8110001-0000-0000-0000-000000000002';
  v_mod3_id := 'd8110001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'MS11', 8, 'general_technical', v_cat_ms_id, v_subcat_blue_id, 'Blue economy',
    'Offshore wind fundamentals, fixed and floating',
    'Offshore wind is growing quickly worldwide, and floating designs open deeper waters, including off West Africa. This course covers the technology, site assessment, installation and operation of fixed and floating offshore wind.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 15 to 17, Sep 20 to 22. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain offshore wind turbine and foundation technology',
      'Compare fixed and floating concepts',
      'Assess wind resource and site conditions',
      'Describe installation, grid connection and operations',
      'Identify skills and supply chain links with oil and gas'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Assess a site for fixed or floating wind',
      'Map oil and gas capabilities to offshore wind needs'
    ],
    ARRAY['IEC 61400-3-1', 'IEC 61400-3-2', 'DNV ST 0119', 'DNV ST 0126'],
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
    (v_mod1_id, v_course_id, 'Day 1: Turbine Basics, Monopiles & Floating Platforms', 1),
    (v_mod2_id, v_course_id, 'Day 2: Wind Resource, Seabed & Metocean Site Assessment', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation Vessels, Export Cables & O&M Operations', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e8110001-0001-0000-0000-000000000001', v_mod1_id, '1. Offshore wind basics', 'Turbines; Capacity factors; Global market', 'text', 240, 1, false),
    ('e8110001-0001-0000-0000-000000000002', v_mod1_id, '2. Foundations', 'Monopiles and jackets; Floating platforms; Moorings', 'text', 240, 2, false),
    ('e8110001-0002-0000-0000-000000000001', v_mod2_id, '3. Site assessment', 'Wind resource; Seabed and metocean; Permitting', 'text', 240, 1, false),
    ('e8110001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation and grid', 'Installation vessels; Export cables; Substations', 'text', 240, 1, false),
    ('e8110001-0003-0000-0000-000000000002', v_mod3_id, '5. Operations and transition', 'O&M; Oil and gas skills transfer; Supply chain', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
