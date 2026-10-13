-- =============================================================================
-- Migration: 20270101000043_seed_courses_sc05_to_sc09.sql
-- Description: Seed Domain 10 (Supply chain management) courses SC05 to SC09:
--              SC05: Obsolescence management for industrial equipment
--              SC06: Local content compliance in procurement and contracting
--              SC07: Strategic sourcing and category management for energy companies
--              SC08: Upstream contracts and procurement: tender to award
--              SC09: Supplier quality, expediting and inspection
-- =============================================================================

DO $$
DECLARE
  v_cat_sc_id UUID;
  v_subcat_proc_id UUID;
  v_subcat_mro_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category (Supply chain management)
  SELECT id INTO v_cat_sc_id
  FROM public.course_categories
  WHERE slug = 'supply-chain-management'
  LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_proc_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_sc_id AND slug = 'procurement-and-contracting'
  LIMIT 1;

  SELECT id INTO v_subcat_mro_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_sc_id AND slug = 'mros-spares-and-critical-equipment-safety'
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
  -- COURSE 1: SC05 (Obsolescence management for industrial equipment)
  -- =========================================================================
  v_course_id := 'c1005000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1005001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1005001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC05', 10, 'general_technical', v_cat_sc_id, v_subcat_mro_id, 'MROs, spares and critical equipment safety',
    'Obsolescence management for industrial equipment',
    'Control systems, drives and instruments go out of production long before the plants that use them, and a single unavailable card can stop a unit. This short course shows engineers and materials staff how to find obsolescence risks early and manage them at the lowest cost.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 15 to 16, Jun 28 to 29, Oct 18 to 19. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify obsolescence risk across control, electrical and mechanical equipment',
      'Monitor product lifecycle notices from OEMs and databases',
      'Choose mitigations such as last time buys, alternates, repair and redesign',
      'Build and maintain an obsolescence management plan',
      'Report obsolescence risk to management in clear terms'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Build an obsolescence risk register for a control system',
      'Choose mitigations for five obsolete items and cost them'
    ],
    ARRAY['IEC 62402', 'ISO 55001', 'IEC 62443 2 3'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-02-15 08:30:00+00', '2027-02-16 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Obsolescence Basics & OEM Monitoring', 1),
    (v_mod2_id, v_course_id, 'Day 2: Mitigation Options & Management Plans', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1005001-0001-0000-0000-000000000001', v_mod1_id, '1. Obsolescence basics', 'Causes and lifecycle stages; Impact on availability; Typical problem equipment', 'text', 210, 1, false),
    ('e1005001-0001-0000-0000-000000000002', v_mod1_id, '2. Monitoring', 'OEM notices; Obsolescence databases; Installed base registers', 'text', 210, 2, false),
    ('e1005001-0002-0000-0000-000000000001', v_mod2_id, '3. Mitigation options', 'Last time buys; Alternates and emulation; Repair and refurbishment; Redesign', 'text', 270, 1, false),
    ('e1005001-0002-0000-0000-000000000002', v_mod2_id, '4. Obsolescence management plans', 'Ownership; Funding; Reporting and review', 'text', 150, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: SC06 (Local content compliance in procurement and contracting)
  -- =========================================================================
  v_course_id := 'c1006000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1006001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1006001-0000-0000-0000-000000000002';
  v_mod3_id := 'd1006001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC06', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Local content compliance in procurement and contracting',
    'Local content rules shape procurement and contracting across Nigeria’s oil and gas industry, and non compliance can stop contract awards. This course explains the Nigerian Oil and Gas Industry Content Development Act, NCDMB processes and how to plan, deliver and report Nigerian content.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the requirements of the NOGICD Act and its schedule of minimum content',
      'Prepare Nigerian content plans for tenders and projects',
      'Navigate NCDMB registration and approval processes',
      'Track, report and audit Nigerian content delivery',
      'Plan supplier development that builds local capacity'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'International oil companies and joint ventures',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Prepare a Nigerian content plan for a fabrication tender',
      'Audit a contractor’s content report against the plan'
    ],
    ARRAY['NOGICD Act 2010', 'NCDMB guidelines', 'Petroleum Industry Act 2021'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-01-11 08:30:00+00', '2027-01-13 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Legal Framework & Nigerian Content Plans', 1),
    (v_mod2_id, v_course_id, 'Day 2: NCDMB Processes & Authorisations', 2),
    (v_mod3_id, v_course_id, 'Day 3: Compliance, Reporting & Supplier Development', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1006001-0001-0000-0000-000000000001', v_mod1_id, '1. Legal framework', 'NOGICD Act 2010; Schedule of minimum levels; Related regulations', 'text', 240, 1, false),
    ('e1006001-0001-0000-0000-000000000002', v_mod1_id, '2. Nigerian content plans', 'Plan structure; Manpower, fabrication and services; Training plans', 'text', 240, 2, false),
    ('e1006001-0002-0000-0000-000000000001', v_mod2_id, '3. NCDMB processes', 'NOGIC JQS registration; Tender stage approvals; Certificates of authorisation', 'text', 420, 1, false),
    ('e1006001-0003-0000-0000-000000000001', v_mod3_id, '4. Compliance and reporting', 'Monitoring; Reporting templates; Audits and sanctions', 'text', 240, 1, false),
    ('e1006001-0003-0000-0000-000000000002', v_mod3_id, '5. Supplier development', 'Capacity gaps; Partnerships; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: SC07 (Strategic sourcing and category management for energy companies)
  -- =========================================================================
  v_course_id := 'c1007000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1007001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1007001-0000-0000-0000-000000000002';
  v_mod3_id := 'd1007001-0000-0000-0000-000000000003';
  v_mod4_id := 'd1007001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC07', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Strategic sourcing and category management for energy companies',
    'Strategic sourcing and category management cut costs and supply risk by managing spend as a portfolio rather than order by order. This course applies these methods to the categories energy companies spend most on.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 5 to 8, Oct 4 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Analyse spend and segment categories',
      'Build category strategies using portfolio tools',
      'Run market analysis and supplier assessment',
      'Plan and run competitive sourcing events',
      'Manage supplier relationships and track savings'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Build a category strategy for valves and actuators',
      'Run a mock negotiation with a supplier',
      'Calculate savings with an agreed method'
    ],
    ARRAY['ISO 20400', 'CIPS procurement cycle', 'ISO 44001'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-04-05 08:30:00+00', '2027-04-08 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Spend Analysis & Category Strategy', 1),
    (v_mod2_id, v_course_id, 'Day 2: Market & Supplier Analysis', 2),
    (v_mod3_id, v_course_id, 'Day 3: Sourcing Events & Commercial Execution', 3),
    (v_mod4_id, v_course_id, 'Day 4: Supplier Relationship Management & Value Tracking', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1007001-0001-0000-0000-000000000001', v_mod1_id, '1. Spend analysis', 'Data sources; Cleansing; Segmentation', 'text', 300, 1, false),
    ('e1007001-0001-0000-0000-000000000002', v_mod1_id, '2. Category strategy', 'Kraljic matrix; Category plans; Stakeholders', 'text', 300, 2, false),
    ('e1007001-0002-0000-0000-000000000001', v_mod2_id, '3. Market and supplier analysis', 'Market research; Supplier assessment; Cost models', 'text', 360, 1, false),
    ('e1007001-0003-0000-0000-000000000001', v_mod3_id, '4. Sourcing events', 'RFx design; Evaluation; Negotiation', 'text', 360, 1, false),
    ('e1007001-0004-0000-0000-000000000001', v_mod4_id, '5. Supplier relationship management', 'Segmentation; Performance reviews; Collaboration', 'text', 300, 1, false),
    ('e1007001-0004-0000-0000-000000000002', v_mod4_id, '6. Savings and value tracking', 'Savings methods; Reporting', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: SC08 (Upstream contracts and procurement: tender to award)
  -- =========================================================================
  v_course_id := 'c1008000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1008001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1008001-0000-0000-0000-000000000002';
  v_mod3_id := 'd1008001-0000-0000-0000-000000000003';
  v_mod4_id := 'd1008001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC08', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Upstream contracts and procurement: tender to award',
    'Upstream contracts move from requirement to award through strict tender rules that differ between operators, JVs and regulators. This course covers the full contracting cycle used in oil and gas.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site.',
    ARRAY[
      'Plan contracting strategies for upstream scopes',
      'Prepare tender documents and evaluation criteria',
      'Run technical and commercial evaluations fairly',
      'Manage regulatory approvals and award',
      'Handle contract administration and variations'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Write evaluation criteria for a drilling services tender',
      'Evaluate three mock bids and recommend award'
    ],
    ARRAY['NUPRC contracting guidelines', 'NCDMB tender guidelines', 'FIDIC conditions', 'ISO 37001'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    NULL, NULL,
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
    (v_mod1_id, v_course_id, 'Day 1: Contracting Strategy & Tender Preparation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Tender Process Execution', 2),
    (v_mod3_id, v_course_id, 'Day 3: Evaluation, Governance & Contract Award', 3),
    (v_mod4_id, v_course_id, 'Day 4: Contract Administration & Compliance', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1008001-0001-0000-0000-000000000001', v_mod1_id, '1. Contracting strategy', 'Contract types; Packaging scopes; Risk allocation', 'text', 270, 1, false),
    ('e1008001-0001-0000-0000-000000000002', v_mod1_id, '2. Tender preparation', 'Scope of work; Evaluation criteria; Bidders lists', 'text', 270, 2, false),
    ('e1008001-0002-0000-0000-000000000001', v_mod2_id, '3. Tender process', 'Pre bid meetings; Clarifications; Bid opening', 'text', 270, 1, false),
    ('e1008001-0003-0000-0000-000000000001', v_mod3_id, '4. Evaluation and award', 'Technical and commercial evaluation; Approvals; Award', 'text', 270, 1, false),
    ('e1008001-0004-0000-0000-000000000001', v_mod4_id, '5. Contract administration', 'Kick off; Variations; Claims', 'text', 270, 1, false),
    ('e1008001-0004-0000-0000-000000000002', v_mod4_id, '6. Compliance', 'Regulatory approvals; Audit trail; Ethics', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: SC09 (Supplier quality, expediting and inspection)
  -- =========================================================================
  v_course_id := 'c1009000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1009001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1009001-0000-0000-0000-000000000002';
  v_mod3_id := 'd1009001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC09', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Supplier quality, expediting and inspection',
    'Late or defective equipment delays projects and shutdowns, and most problems could have been caught at the supplier. This competence course trains staff in supplier quality, inspection planning, expediting and release.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Competence', 'Up to 16 participants',
    'Public sessions: Apr 12 to 14, Oct 25 to 27. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Assess supplier quality systems before and after award',
      'Plan inspection and test plans with hold and witness points',
      'Expedite orders and manage delays',
      'Witness inspections and release goods',
      'Record and close non conformances'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Build an ITP for a pump order',
      'Expedite a delayed order case and write the recovery plan'
    ],
    ARRAY['ISO 9001', 'API Q1', 'ISO 10005'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-04-12 08:30:00+00', '2027-04-14 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Supplier Quality & Inspection Test Plans', 1),
    (v_mod2_id, v_course_id, 'Day 2: Expediting & Schedule Recovery', 2),
    (v_mod3_id, v_course_id, 'Day 3: Inspection, Release & Practical Assessment', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1009001-0001-0000-0000-000000000001', v_mod1_id, '1. Supplier quality', 'ISO 9001 audits; Pre award surveys; Quality plans', 'text', 240, 1, false),
    ('e1009001-0001-0000-0000-000000000002', v_mod1_id, '2. Inspection and test plans', 'ITPs; Hold and witness points; Document review', 'text', 240, 2, false),
    ('e1009001-0002-0000-0000-000000000001', v_mod2_id, '3. Expediting', 'Schedules; Progress tracking; Escalation', 'text', 420, 1, false),
    ('e1009001-0003-0000-0000-000000000001', v_mod3_id, '4. Inspection and release', 'Witness tests; Release notes; Non conformance', 'text', 240, 1, false),
    ('e1009001-0003-0000-0000-000000000002', v_mod3_id, '5. Practical assessment', 'Inspection task; Expediting case; Written test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
