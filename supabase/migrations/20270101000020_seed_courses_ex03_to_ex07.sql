-- Migration: Seed Courses EX03 to EX07
-- Domain 5: EPMICE Field Operations and Lifecycle Services
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ex_id UUID;
  v_subcat_fox_id UUID;
  v_subcat_lsta_id UUID;
  v_subcat_integ_id UUID;
  v_subcat_upgrades_id UUID;
  v_subcat_lifecycle_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 5
  SELECT id INTO v_cat_ex_id FROM public.course_categories WHERE slug = 'field-operations-and-lifecycle-services' OR domain_no = 5 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_fox_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'the-field-operations-excellence-the-fox' LIMIT 1;
  IF v_subcat_fox_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox', 1)
    RETURNING id INTO v_subcat_fox_id;
  END IF;

  SELECT id INTO v_subcat_lsta_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'long-term-service-and-technical-agreements-lsta' LIMIT 1;
  IF v_subcat_lsta_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Long term service and technical agreements (LSTA)', 'long-term-service-and-technical-agreements-lsta', 2)
    RETURNING id INTO v_subcat_lsta_id;
  END IF;

  SELECT id INTO v_subcat_integ_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'multivendor-systems-integration' LIMIT 1;
  IF v_subcat_integ_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Multivendor systems integration', 'multivendor-systems-integration', 3)
    RETURNING id INTO v_subcat_integ_id;
  END IF;

  SELECT id INTO v_subcat_upgrades_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'performance-optimisation-and-upgrades' LIMIT 1;
  IF v_subcat_upgrades_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Performance optimisation and upgrades', 'performance-optimisation-and-upgrades', 5)
    RETURNING id INTO v_subcat_upgrades_id;
  END IF;

  SELECT id INTO v_subcat_lifecycle_id FROM public.course_subcategories WHERE category_id = v_cat_ex_id AND slug = 'lifecycle-services-and-performance-assurance' LIMIT 1;
  IF v_subcat_lifecycle_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ex_id, 'Lifecycle services and performance assurance', 'lifecycle-services-and-performance-assurance', 6)
    RETURNING id INTO v_subcat_lifecycle_id;
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
  -- COURSE 1: EX03 (Control of work, permit to work and isolations)
  -- =========================================================================
  v_course_id := 'cb030000-0000-0000-0000-000000000003';
  v_mod1_id := 'db030001-0000-0000-0000-000000000001';
  v_mod2_id := 'db030001-0000-0000-0000-000000000002';
  v_mod3_id := 'db030001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX03', 5, 'general_technical', v_cat_ex_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Control of work, permit to work and isolations',
    'Failures in control of work, permits and isolation are behind many of the worst process safety incidents. This competence course trains permit issuers, performing authorities and isolating authorities to manage work safely.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Jun 28 to 30, Dec 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the control of work process and permit types',
      'Prepare and issue permits with correct hazard identification',
      'Plan and verify mechanical, electrical and process isolations',
      'Manage simultaneous operations and permit interactions',
      'Hand back and close out work safely'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Prepare a permit and isolation plan for a pump change',
      'Verify an isolation on a training rig',
      'Run a SIMOPS review for three overlapping jobs'
    ],
    ARRAY['HSG250', 'Energy Institute isolation guidance', 'ISO 45001', 'OSHA 1910.147'],
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
    (v_mod1_id, v_course_id, 'Day 1: Control of Work Principles & Hazard Identification', 1),
    (v_mod2_id, v_course_id, 'Day 2: Mechanical, Electrical & Process Isolations', 2),
    (v_mod3_id, v_course_id, 'Day 3: Permit Management, Handback & Practical Assessment', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb030001-0001-0000-0000-000000000001', v_mod1_id, '1. Control of work principles', 'Incident history; Roles and responsibilities; Permit types', 'text', 270, 1, false),
    ('eb030001-0001-0000-0000-000000000002', v_mod1_id, '2. Hazard identification and risk assessment', 'Task risk assessment; Gas testing; Controls', 'text', 270, 2, false),
    ('eb030001-0002-0000-0000-000000000001', v_mod2_id, '3. Isolations', 'Mechanical and process isolation; Electrical isolation; Verification and lockout', 'text', 270, 1, false),
    ('eb030001-0003-0000-0000-000000000001', v_mod3_id, '4. Permit management', 'Interaction and SIMOPS; Suspension and handover', 'text', 180, 1, false),
    ('eb030001-0003-0000-0000-000000000002', v_mod3_id, '5. Close out and assessment', 'Hand back; Audit; Practical test', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EX04 (Long term service agreements: structure, KPIs and contract management)
  -- =========================================================================
  v_course_id := 'cb040000-0000-0000-0000-000000000004';
  v_mod1_id := 'db040001-0000-0000-0000-000000000001';
  v_mod2_id := 'db040001-0000-0000-0000-000000000002';
  v_mod3_id := 'db040001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX04', 5, 'general_technical', v_cat_ex_id, v_subcat_lsta_id, 'Long term service and technical agreements (LSTA)',
    'Long term service agreements: structure, KPIs and contract management',
    'Long term service agreements transfer part of equipment performance risk to the OEM, but they only deliver value when they are structured and managed well. This executive course covers LTSA structures, KPIs, commercial terms and contract management.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jul 5 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Compare LTSA models from parts supply to full performance contracts',
      'Define KPIs such as availability, reliability and response time',
      'Assess pricing, incentives and risk allocation',
      'Manage LTSA performance reviews and disputes',
      'Decide when to renew, renegotiate or exit'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Score two LTSA proposals for a gas turbine fleet',
      'Draft a KPI schedule for a compressor LTSA'
    ],
    ARRAY['ISO 55001', 'ISO 44001', 'FIDIC principles'],
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
    (v_mod1_id, v_course_id, 'Day 1: LTSA Models & Performance Measurement', 1),
    (v_mod2_id, v_course_id, 'Day 2: Commercial Terms, Pricing & Risk Allocation', 2),
    (v_mod3_id, v_course_id, 'Day 3: Contract Governance, Performance Reviews & Renewal/Exit', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb040001-0001-0000-0000-000000000001', v_mod1_id, '1. LTSA models', 'Parts and services; Availability guarantees; Performance based contracts', 'text', 240, 1, false),
    ('eb040001-0001-0000-0000-000000000002', v_mod1_id, '2. KPIs and measurement', 'Availability and reliability; Response times; Data ownership', 'text', 240, 2, false),
    ('eb040001-0002-0000-0000-000000000001', v_mod2_id, '3. Commercial terms', 'Pricing and escalation; Incentives and penalties; Liability', 'text', 300, 1, false),
    ('eb040001-0003-0000-0000-000000000001', v_mod3_id, '4. Contract management', 'Governance meetings; Performance reviews; Disputes', 'text', 240, 1, false),
    ('eb040001-0003-0000-0000-000000000002', v_mod3_id, '5. Renewal and exit', 'Benchmarking; Exit planning; Lessons learned', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EX05 (OEM and operator interface management)
  -- =========================================================================
  v_course_id := 'cb050000-0000-0000-0000-000000000005';
  v_mod1_id := 'db050001-0000-0000-0000-000000000001';
  v_mod2_id := 'db050001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX05', 5, 'general_technical', v_cat_ex_id, v_subcat_lifecycle_id, 'Lifecycle services and performance assurance',
    'OEM and operator interface management',
    'When operators and OEMs work at cross purposes, repairs take longer, warranty claims stall and costs rise. This short course shows operator and service company staff how to manage the OEM interface so that support is faster, clearer and cheaper.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 28 to 29, Dec 6 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Map the interfaces between operator, OEM, service contractors and EPC firms',
      'Set communication routes, technical query handling and escalation',
      'Prepare evidence for warranty and performance claims',
      'Run joint performance reviews with shared KPIs',
      'Build long term working relationships with key OEMs'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Build a RACI and escalation plan for an OEM supported compressor station',
      'Prepare a warranty claim pack from failure data'
    ],
    ARRAY['ISO 44001', 'ISO 55001', 'ISO 10002'],
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
    (v_mod1_id, v_course_id, 'Day 1: Interface Mapping, Roles & Communication Escalation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Warranty Claims, Joint Reviews & Long-Term Partnering', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb050001-0001-0000-0000-000000000001', v_mod1_id, '1. Interface mapping', 'Stakeholders and contracts; RACI charts; Common interface failures', 'text', 210, 1, false),
    ('eb050001-0001-0000-0000-000000000002', v_mod1_id, '2. Communication and escalation', 'Technical query process; Escalation ladders; Site and remote support', 'text', 210, 2, false),
    ('eb050001-0002-0000-0000-000000000001', v_mod2_id, '3. Warranty and claims', 'Evidence and data; Claim process; Negotiation', 'text', 210, 1, false),
    ('eb050001-0002-0000-0000-000000000002', v_mod2_id, '4. Joint performance management', 'Shared KPIs; Quarterly reviews; Improvement plans', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EX06 (Multivendor control system integration and interoperability)
  -- =========================================================================
  v_course_id := 'cb060000-0000-0000-0000-000000000006';
  v_mod1_id := 'db060001-0000-0000-0000-000000000001';
  v_mod2_id := 'db060001-0000-0000-0000-000000000002';
  v_mod3_id := 'db060001-0000-0000-0000-000000000003';
  v_mod4_id := 'db060001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX06', 5, 'general_technical', v_cat_ex_id, v_subcat_integ_id, 'Multivendor systems integration',
    'Multivendor control system integration and interoperability',
    'Brownfield plants combine equipment and control systems from many vendors, and making them work as one system is a specialist skill. This advanced course covers integration architectures, protocols, interface management, alarm and data harmonisation and integrated testing.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Oct 11 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Assess an existing multivendor architecture and its weak points',
      'Design integration using OPC UA, Modbus, gateways and middleware',
      'Write interface specifications with clear responsibilities',
      'Harmonise alarms, tags and data across systems',
      'Plan factory, integration and site testing for multivendor systems'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Write an interface specification for a compressor package to DCS link',
      'Plan a system integration test across three vendors',
      'Resolve a tag and alarm conflict case'
    ],
    ARRAY['IEC 62541', 'IEC 62443', 'ISA 95', 'ISA 18.2'],
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
    (v_mod1_id, v_course_id, 'Day 1: Multivendor Landscapes & Integration Technologies', 1),
    (v_mod2_id, v_course_id, 'Day 2: Interface Specifications & Responsibility Matrices', 2),
    (v_mod3_id, v_course_id, 'Day 3: Tag, Data & Alarm Harmonisation', 3),
    (v_mod4_id, v_course_id, 'Day 4: Integrated Testing & Cyber Security Across Vendors', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb060001-0001-0000-0000-000000000001', v_mod1_id, '1. Multivendor landscapes', 'Typical brownfield architectures; Integration risks; Lessons from failed projects', 'text', 270, 1, false),
    ('eb060001-0001-0000-0000-000000000002', v_mod1_id, '2. Integration technologies', 'OPC UA; Modbus and serial links; Gateways and middleware', 'text', 270, 2, false),
    ('eb060001-0002-0000-0000-000000000001', v_mod2_id, '3. Interface management', 'Interface specifications; Responsibility matrices; Change control', 'text', 270, 1, false),
    ('eb060001-0003-0000-0000-000000000001', v_mod3_id, '4. Data and alarm harmonisation', 'Tag naming; Alarm philosophy alignment; Time synchronisation', 'text', 270, 1, false),
    ('eb060001-0004-0000-0000-000000000001', v_mod4_id, '5. Integrated testing', 'FAT and SIT planning; Test harnesses; Defect tracking', 'text', 270, 1, false),
    ('eb060001-0004-0000-0000-000000000002', v_mod4_id, '6. Cyber security across vendors', 'Vendor remote access; Zones and conduits; Patching responsibilities', 'text', 330, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: EX07 (Brownfield control system migration and obsolescence management)
  -- =========================================================================
  v_course_id := 'cb070000-0000-0000-0000-000000000007';
  v_mod1_id := 'db070001-0000-0000-0000-000000000001';
  v_mod2_id := 'db070001-0000-0000-0000-000000000002';
  v_mod3_id := 'db070001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EX07', 5, 'general_technical', v_cat_ex_id, v_subcat_upgrades_id, 'Performance optimisation and upgrades',
    'Brownfield control system migration and obsolescence management',
    'Ageing control systems lose vendor support and spares, and the move to new platforms usually has to happen while the plant keeps running. This advanced course covers obsolescence assessment, migration strategy, code conversion, testing and cutover.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 24, Sep 20 to 22. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Assess obsolescence risk across control and safety systems',
      'Compare phased, hot cutover and full replacement strategies',
      'Plan code conversion and functional testing',
      'Plan cutover with minimum downtime and a safe rollback',
      'Manage safety system and cyber security implications of migration'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Build a migration plan and risk register for an obsolete DCS',
      'Plan a hot cutover for one process unit'
    ],
    ARRAY['IEC 62402', 'IEC 61511', 'IEC 62443', 'ISA 101'],
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
    (v_mod1_id, v_course_id, 'Day 1: Obsolescence Assessment & Migration Strategy', 1),
    (v_mod2_id, v_course_id, 'Day 2: Code Conversion, Graphics Migration & Functional Testing', 2),
    (v_mod3_id, v_course_id, 'Day 3: Cutover Execution, Safety Systems & Cyber Security', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('eb070001-0001-0000-0000-000000000001', v_mod1_id, '1. Obsolescence assessment', 'Lifecycle status; Spares and skills risk; Risk ranking', 'text', 240, 1, false),
    ('eb070001-0001-0000-0000-000000000002', v_mod1_id, '2. Migration strategies', 'Phased migration; Hot cutover; Full replacement', 'text', 240, 2, false),
    ('eb070001-0002-0000-0000-000000000001', v_mod2_id, '3. Engineering and testing', 'Code conversion; Graphics migration; Functional testing', 'text', 300, 1, false),
    ('eb070001-0003-0000-0000-000000000001', v_mod3_id, '4. Cutover execution', 'Cutover planning; Rollback; Operator training', 'text', 240, 1, false),
    ('eb070001-0003-0000-0000-000000000002', v_mod3_id, '5. Safety and security', 'SIS changes under IEC 61511; Security of the new system; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
