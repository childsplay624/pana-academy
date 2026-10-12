-- Migration: Seed Courses AD11, AD12, AD13, AD14, AD15
-- Domain 3: Integrated Automation and Digital Operations
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ad_id UUID;
  v_subcat_ad_icss_id UUID;
  v_subcat_ad_digital_id UUID;
  v_subcat_ad_networks_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category
  SELECT id INTO v_cat_ad_id FROM public.course_categories WHERE slug = 'integrated-automation-and-digital-operations' OR domain_no = 3 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_ad_icss_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'automation-and-icss' LIMIT 1;
  IF v_subcat_ad_icss_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Automation and ICSS', 'automation-and-icss', 1)
    RETURNING id INTO v_subcat_ad_icss_id;
  END IF;

  SELECT id INTO v_subcat_ad_digital_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'digital-operations-and-plant-intelligence' LIMIT 1;
  IF v_subcat_ad_digital_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Digital operations and plant intelligence', 'digital-operations-and-plant-intelligence', 2)
    RETURNING id INTO v_subcat_ad_digital_id;
  END IF;

  SELECT id INTO v_subcat_ad_networks_id FROM public.course_subcategories WHERE category_id = v_cat_ad_id AND slug = 'industrial-networks-cybersecurity-and-control-rooms' LIMIT 1;
  IF v_subcat_ad_networks_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ad_id, 'Industrial networks, cybersecurity and control rooms', 'industrial-networks-cybersecurity-and-control-rooms', 3)
    RETURNING id INTO v_subcat_ad_networks_id;
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
  -- COURSE 1: AD11 (Generative AI for engineering and operations teams)
  -- =========================================================================
  v_course_id := 'c3110000-0000-0000-0000-000000000011';
  v_mod1_id := 'd3110001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3110001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD11', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_digital_id, 'Digital operations and plant intelligence',
    'Generative AI for engineering and operations teams',
    'Generative AI tools can draft reports, search long documents and summarise data in seconds, but they can also produce confident errors and leak confidential information. This short course shows engineering, operations and regulatory staff how to use these tools productively, check their output and stay within company and data rules.',
    v_instructor_id, 'beginner', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 8 to 9, Jul 19 to 20, Nov 15 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain in plain terms how large language models work and where they fail',
      'Write clear prompts for common technical and administrative tasks',
      'Use AI assistants to search, summarise and compare procedures and reports',
      'Check AI output against source documents and engineering judgement',
      'Apply confidentiality, data protection and approval rules to AI use'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Draft and check a shift report and a procedure summary with an AI assistant',
      'Compare AI output against a source standard and list the errors',
      'Write a one page team guideline for AI use'
    ],
    ARRAY['ISO/IEC 42001', 'NIST AI RMF 1.0', 'Nigeria Data Protection Act 2023'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
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
    (v_mod1_id, v_course_id, 'Day 1: How Generative AI Works & Prompting for Technical Work', 1),
    (v_mod2_id, v_course_id, 'Day 2: Practical Use Cases & Risk, Governance and Verification', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3110001-0001-0000-0000-000000000001', v_mod1_id, '1. How generative AI works', 'Language models and training data; Strengths and failure modes; Hallucination and bias.', 'text', 180, 1, false),
    ('c3110001-0001-0000-0000-000000000002', v_mod1_id, '2. Prompting for technical work', 'Prompt structure and context; Iterating and asking for sources; Templates for common tasks.', 'text', 180, 2, false),
    ('c3110001-0002-0000-0000-000000000001', v_mod2_id, '3. Practical use cases', 'Shift reports and handovers; Procedure and standard summaries; Data and spreadsheet help; Regulatory correspondence drafts.', 'text', 240, 1, false),
    ('c3110001-0002-0000-0000-000000000002', v_mod2_id, '4. Risk, governance and verification', 'Confidential data rules; Checking output; Company AI policies; Nigeria Data Protection Act obligations.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: AD12 (Industrial networks: Profinet, Modbus, EtherNet/IP and OPC UA)
  -- =========================================================================
  v_course_id := 'c3120000-0000-0000-0000-000000000012';
  v_mod1_id := 'd3120001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3120001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3120001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3120001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD12', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'Industrial networks: Profinet, Modbus, EtherNet/IP and OPC UA',
    'Industrial networks carry control, safety and data traffic, and a single bad switch setting or cable fault can stop a plant. This competence course covers the design, configuration and troubleshooting of Modbus, Profinet, EtherNet/IP and OPC UA networks.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 15 to 18, Aug 23 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the main fieldbus and industrial Ethernet protocols and where each fits',
      'Design network topologies with suitable redundancy',
      'Configure Profinet, Modbus, EtherNet/IP and OPC UA devices',
      'Troubleshoot network faults using diagnostic tools and packet captures',
      'Apply segmentation and basic security controls'
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
      'Build and configure a mixed protocol network on a training rig',
      'Find planted faults using a network analyser',
      'Set up an OPC UA server and client with security enabled'
    ],
    ARRAY['IEC 61158', 'IEC 61784', 'IEC 62541', 'IEC 62443 3 3'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
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
    (v_mod1_id, v_course_id, 'Day 1: Network Fundamentals & Modbus', 1),
    (v_mod2_id, v_course_id, 'Day 2: Profinet and EtherNet/IP', 2),
    (v_mod3_id, v_course_id, 'Day 3: OPC UA', 3),
    (v_mod4_id, v_course_id, 'Day 4: Troubleshooting & Security and Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3120001-0001-0000-0000-000000000001', v_mod1_id, '1. Network fundamentals', 'OSI model for control engineers; Topologies, VLANs and redundancy rings; Industrial cabling and connectors.', 'text', 300, 1, false),
    ('c3120001-0001-0000-0000-000000000002', v_mod1_id, '2. Modbus', 'RTU and TCP framing; Register maps; Common integration problems.', 'text', 300, 2, false),
    ('c3120001-0002-0000-0000-000000000001', v_mod2_id, '3. Profinet and EtherNet/IP', 'Device configuration; Real time classes; Diagnostics.', 'text', 300, 1, false),
    ('c3120001-0003-0000-0000-000000000001', v_mod3_id, '4. OPC UA', 'Information models; Client and server setup; Built in security.', 'text', 300, 1, false),
    ('c3120001-0004-0000-0000-000000000001', v_mod4_id, '5. Troubleshooting', 'Network analysers and Wireshark; Switch diagnostics; Common faults.', 'text', 300, 1, false),
    ('c3120001-0004-0000-0000-000000000002', v_mod4_id, '6. Security and assessment', 'Segmentation and firewalls; Practical competence test.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: AD13 (OT cybersecurity to ISA/IEC 62443)
  -- =========================================================================
  v_course_id := 'c3130000-0000-0000-0000-000000000013';
  v_mod1_id := 'd3130001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3130001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3130001-0000-0000-0000-000000000003';
  v_mod4_id := 'd3130001-0000-0000-0000-000000000004';
  v_mod5_id := 'd3130001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD13', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'OT cybersecurity to ISA/IEC 62443',
    'Cyber attacks on energy and process assets are growing, and many operators now require IEC 62443 competence from their own staff and suppliers. This course covers OT threats, risk assessment, secure architecture and programme management, and prepares candidates for the ISA/IEC 62443 cybersecurity certificate examinations.',
    v_instructor_id, 'advanced', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Nov 1 to 5. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain OT threats and why OT security differs from IT security',
      'Apply IEC 62443 zones, conduits and target security levels',
      'Carry out an OT cyber risk assessment',
      'Design secure architectures, remote access and monitoring',
      'Build an OT security programme with supplier requirements'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Zone a gas plant network and set target security levels',
      'Run a tabletop exercise on a ransomware incident',
      'Write security requirements for a system integrator contract'
    ],
    ARRAY['ISA/IEC 62443 series', 'NIST SP 800 82', 'IEC 62351', 'NIST CSF 2.0'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
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
    (v_mod1_id, v_course_id, 'Day 1: OT Threat Landscape', 1),
    (v_mod2_id, v_course_id, 'Day 2: IEC 62443 Framework & Risk Assessment', 2),
    (v_mod3_id, v_course_id, 'Day 3: Secure Design', 3),
    (v_mod4_id, v_course_id, 'Day 4: Security Operations & Programme Management', 4),
    (v_mod5_id, v_course_id, 'Day 5: Examination Preparation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3130001-0001-0000-0000-000000000001', v_mod1_id, '1. OT threat landscape', 'Major incidents; Attack paths into control systems; Threat actors.', 'text', 300, 1, false),
    ('c3130001-0002-0000-0000-000000000001', v_mod2_id, '2. IEC 62443 framework', 'Structure of the series; Roles of asset owner, integrator and supplier; Security levels.', 'text', 300, 1, false),
    ('c3130001-0002-0000-0000-000000000002', v_mod2_id, '3. Risk assessment', 'System under consideration; Zones and conduits; Risk ranking.', 'text', 300, 2, false),
    ('c3130001-0003-0000-0000-000000000001', v_mod3_id, '4. Secure design', 'Segmentation and DMZ; Secure remote access; Hardening.', 'text', 300, 1, false),
    ('c3130001-0004-0000-0000-000000000001', v_mod4_id, '5. Security operations', 'Patching and backups; Monitoring and detection; Incident response.', 'text', 300, 1, false),
    ('c3130001-0004-0000-0000-000000000002', v_mod4_id, '6. Programme management', 'Policies; Supplier and integrator requirements; Metrics.', 'text', 300, 2, false),
    ('c3130001-0005-0000-0000-000000000001', v_mod5_id, '7. Examination preparation', 'Body of knowledge review; Mock examination.', 'text', 210, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: AD14 (OT cybersecurity governance for executives and regulators)
  -- =========================================================================
  v_course_id := 'c3140000-0000-0000-0000-000000000014';
  v_mod1_id := 'd3140001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3140001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD14', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'OT cybersecurity governance for executives and regulators',
    'Boards, executives and regulators carry accountability for cyber risk to plants and grids but rarely get briefed in plain terms. This short executive course explains the risk, the controls that matter and the questions leaders should ask of operators and suppliers.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jul 12 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe OT cyber risk in terms of safety, production and reputation',
      'Explain the main standards and regulatory frameworks',
      'Set governance, roles and metrics for OT security',
      'Oversee incident readiness and recovery',
      'Ask informed questions of operators, suppliers and auditors'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies',
      'International oil companies and joint ventures',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Run an executive tabletop exercise on a ransomware attack on a gas plant',
      'Draft ten board questions for an OT security review'
    ],
    ARRAY['ISA/IEC 62443', 'NIST CSF 2.0', 'ISO/IEC 27001'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
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
    (v_mod1_id, v_course_id, 'Day 1: OT Cyber Risk for Leaders & Frameworks and Regulation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Governance, Metrics & Incident Readiness', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3140001-0001-0000-0000-000000000001', v_mod1_id, '1. OT cyber risk for leaders', 'Recent attacks on energy assets; Business and safety impact; Insurance trends.', 'text', 210, 1, false),
    ('c3140001-0001-0000-0000-000000000002', v_mod1_id, '2. Frameworks and regulation', 'IEC 62443; NIST CSF; National and sector requirements.', 'text', 210, 2, false),
    ('c3140001-0002-0000-0000-000000000001', v_mod2_id, '3. Governance and metrics', 'Board roles; Reporting metrics; Investment priorities.', 'text', 210, 1, false),
    ('c3140001-0002-0000-0000-000000000002', v_mod2_id, '4. Incident readiness', 'Crisis response; Recovery planning; Exercises.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: AD15 (Control room design and human factors to ISO 11064)
  -- =========================================================================
  v_course_id := 'c3150000-0000-0000-0000-000000000015';
  v_mod1_id := 'd3150001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3150001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3150001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD15', 3, 'instrumentation_automation', v_cat_ad_id, v_subcat_ad_networks_id, 'Industrial networks, cybersecurity and control rooms',
    'Control room design and human factors to ISO 11064',
    'Control room design shapes how quickly operators see and respond to problems, and poor layouts and screens have played a part in many incidents. This course applies ISO 11064 and human factors methods to new and existing control rooms.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 7 to 9, Dec 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Apply ISO 11064 principles to control room layout and workstations',
      'Assess operator workload and staffing',
      'Improve HMI graphics and alarm presentation',
      'Plan lighting, noise and environment',
      'Run a human factors review for a control room upgrade'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Assess a control room layout against ISO 11064',
      'Estimate operator workload for a consolidated control room'
    ],
    ARRAY['ISO 11064', 'ISA 101', 'EEMUA 201', 'EEMUA 191'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
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
    (v_mod1_id, v_course_id, 'Day 1: Human Factors Basics & Layout and Workstations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Control Room Environment', 2),
    (v_mod3_id, v_course_id, 'Day 3: HMI, Alarms, Workload & Upgrades', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c3150001-0001-0000-0000-000000000001', v_mod1_id, '1. Human factors basics', 'Perception and attention; Fatigue and shift work; Situation awareness.', 'text', 270, 1, false),
    ('c3150001-0001-0000-0000-000000000002', v_mod1_id, '2. Layout and workstations', 'ISO 11064 process; Sight lines and displays; Furniture and access.', 'text', 270, 2, false),
    ('c3150001-0002-0000-0000-000000000001', v_mod2_id, '3. Environment', 'Lighting; Noise; Temperature.', 'text', 270, 1, false),
    ('c3150001-0003-0000-0000-000000000001', v_mod3_id, '4. HMI and alarms', 'High performance HMI; Alarm presentation.', 'text', 180, 1, false),
    ('c3150001-0003-0000-0000-000000000002', v_mod3_id, '5. Workload and upgrades', 'Workload assessment; Staffing; Upgrade planning.', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
