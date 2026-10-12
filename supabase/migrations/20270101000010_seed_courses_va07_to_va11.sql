-- Migration: Seed Courses VA07, VA08, VA09, VA10, VA11
-- Domain 2 / Valves and Actuation (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_axial_id UUID;
  v_subcat_act_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategories
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'valves-and-actuation' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 2 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_axial_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'axial-flow-and-safety' LIMIT 1;
  IF v_subcat_axial_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Axial flow and safety', 'axial-flow-and-safety', 3)
    RETURNING id INTO v_subcat_axial_id;
  END IF;

  SELECT id INTO v_subcat_act_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'actuation-and-flow-control' LIMIT 1;
  IF v_subcat_act_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Actuation and flow control', 'actuation-and-flow-control', 4)
    RETURNING id INTO v_subcat_act_id;
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
  -- COURSE 1: VA07 (Pressure relief and safety valves: API 520, 521 and 526)
  -- =========================================================================
  v_course_id := 'c4070000-0000-0000-0000-000000000007';
  v_mod1_id := 'd2070001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2070001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2070001-0000-0000-0000-000000000003';
  v_mod4_id := 'd2070001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA07', 2, 'flow_control', v_cat_id, v_subcat_axial_id, 'Axial flow and safety',
    'Pressure relief and safety valves: API 520, 521 and 526',
    'Pressure relief devices are the last line of defence against overpressure. This course explains how to identify relief scenarios, size and select relief valves to API 520, 521 and 526, and design and document relief systems.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 25, Sep 13 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify overpressure scenarios using API 521',
      'Size relief valves for gas, liquid and two phase relief',
      'Select conventional, balanced and pilot operated valves',
      'Check inlet and outlet piping losses',
      'Document relief design for audit'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Size relief valves for three scenarios',
      'Check inlet losses and back pressure for a real installation'
    ],
    ARRAY['API 520', 'API 521', 'API 526', 'API 527', 'ASME VIII'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-03-22 08:30:00+00', '2027-03-25 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Overpressure Scenarios & Relief Device Classification', 1),
    (v_mod2_id, v_course_id, 'Day 2: Multi-Phase & Sizing Equations (API 520)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation Dynamics & Inlet/Outlet Loss Verification', 3),
    (v_mod4_id, v_course_id, 'Day 4: Relief System Documentation & Mechanical Integrity', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4070001-0001-0000-0000-000000000001', v_mod1_id, '1. Overpressure scenarios', 'Blocked outlet; Fire case; Tube rupture and control failure.', 'text', 210, 1, false),
    ('c4070001-0001-0000-0000-000000000002', v_mod1_id, '2. Relief device types', 'Conventional and balanced bellows; Pilot operated valves; Rupture discs.', 'text', 210, 2, false),
    ('c4070001-0002-0000-0000-000000000001', v_mod2_id, '3. Sizing', 'Gas and vapour; Liquid; Two phase basics.', 'text', 420, 1, false),
    ('c4070001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation', 'Inlet loss and outlet back pressure; Flare and vent systems; Supports and reaction forces.', 'text', 420, 1, false),
    ('c4070001-0004-0000-0000-000000000001', v_mod4_id, '5. Documentation', 'Relief design basis; Datasheets; Audit trail.', 'text', 210, 1, false),
    ('c4070001-0004-0000-0000-000000000002', v_mod4_id, '6. Integrity', 'Inspection intervals; Records; Management of change.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: VA08 (Safety relief valve testing, overhaul and recertification)
  -- =========================================================================
  v_course_id := 'c4080000-0000-0000-0000-000000000008';
  v_mod1_id := 'd2080001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2080001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2080001-0000-0000-0000-000000000003';
  v_mod4_id := 'd2080001-0000-0000-0000-000000000004';
  v_mod5_id := 'd2080001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA08', 2, 'flow_control', v_cat_id, v_subcat_axial_id, 'Axial flow and safety',
    'Safety relief valve testing, overhaul and recertification',
    'Safety relief valves must be tested and overhauled on a fixed cycle, and each test must be traceable. This competence course trains technicians to receive, test, overhaul, set and recertify relief valves in a workshop.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Receive valves with correct documentation and run as received tests',
      'Dismantle, inspect and repair valve internals',
      'Set pressure, blowdown and seat tightness to specification',
      'Seal, tag and certify valves for return to service',
      'Keep calibration and traceability records'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Overhaul and set two relief valves to specification',
      'Complete a recertification package for audit'
    ],
    ARRAY['API 527', 'API 576', 'ASME VIII', 'National Board NB 23'],
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
    (v_mod1_id, v_course_id, 'Day 1: Safety Relief Valve Principles & Nameplate Analysis', 1),
    (v_mod2_id, v_course_id, 'Day 2: Workshop Receiving, Condition Assessment & Pop Testing', 2),
    (v_mod3_id, v_course_id, 'Day 3: Bench Setting & Seat Tightness Testing (API 527)', 3),
    (v_mod4_id, v_course_id, 'Day 4: Quality Records, Sealing, Tagging & Traceability', 4),
    (v_mod5_id, v_course_id, 'Day 5: Practical Overhaul Assessment & Recertification Examination', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4080001-0001-0000-0000-000000000001', v_mod1_id, '1. Relief valve design', 'Spring and pilot designs; Set pressure and blowdown; Nameplates.', 'text', 300, 1, false),
    ('c4080001-0002-0000-0000-000000000001', v_mod2_id, '2. Workshop receiving', 'Receiving and records; As received pop tests; Condition reports.', 'text', 300, 1, false),
    ('c4080001-0002-0000-0000-000000000002', v_mod2_id, '3. Overhaul', 'Disc and nozzle lapping; Spring checks; Guide and stem inspection.', 'text', 300, 2, false),
    ('c4080001-0003-0000-0000-000000000001', v_mod3_id, '4. Setting and testing', 'Test bench use; Set pressure adjustment; Seat tightness to API 527.', 'text', 300, 1, false),
    ('c4080001-0004-0000-0000-000000000001', v_mod4_id, '5. Certification', 'Sealing and tagging; Certificates; Return to service.', 'text', 300, 1, false),
    ('c4080001-0004-0000-0000-000000000002', v_mod4_id, '6. Quality and records', 'Traceability; Gauge calibration; Workshop audits.', 'text', 300, 2, false),
    ('c4080001-0005-0000-0000-000000000001', v_mod5_id, '7. Assessment', 'Practical overhaul and setting; Written test; Feedback.', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: VA09 (Axial flow valves for compressor anti surge and pipeline duty)
  -- =========================================================================
  v_course_id := 'c4090000-0000-0000-0000-000000000009';
  v_mod1_id := 'd2090001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2090001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA09', 2, 'flow_control', v_cat_id, v_subcat_axial_id, 'Axial flow and safety',
    'Axial flow valves for compressor anti surge and pipeline duty',
    'Axial flow valves give fast, stable control on compressor anti surge, pressure control and pipeline duties, and axial non slam check valves protect pumps and compressors from reverse flow. This short course covers their design, application and maintenance.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 14 to 15, Dec 6 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the axial flow principle and its benefits over conventional valves',
      'Select axial valves for anti surge, control and check duties',
      'Specify actuation for fast stroking response',
      'Plan inspection, maintenance and diagnostics',
      'Recognise failure modes from field cases'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Specify an axial anti surge valve for a compressor case study',
      'Compare an axial check valve and a swing check for a pump discharge'
    ],
    ARRAY['API 6D', 'IEC 60534', 'API 617'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-06-14 08:30:00+00', '2027-06-15 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Axial Flow Design Principles & Fast Stroking Anti-Surge Control', 1),
    (v_mod2_id, v_course_id, 'Day 2: Non-Slam Check Valves, Pipeline Duties & Diagnostics', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4090001-0001-0000-0000-000000000001', v_mod1_id, '1. Axial valve design', 'Flow path; Piston and cage designs; Seals.', 'text', 210, 1, false),
    ('c4090001-0001-0000-0000-000000000002', v_mod1_id, '2. Anti surge and control duties', 'Speed of response; Actuation; Noise control.', 'text', 210, 2, false),
    ('c4090001-0002-0000-0000-000000000001', v_mod2_id, '3. Pipeline and check duties', 'Non slam check valves; Pressure regulation; HIPPS applications.', 'text', 210, 1, false),
    ('c4090001-0002-0000-0000-000000000002', v_mod2_id, '4. Maintenance and diagnostics', 'Inspection and overhaul; Diagnostics; Field cases.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: VA10 (Emergency shutdown valves and partial stroke testing)
  -- =========================================================================
  v_course_id := 'c4100000-0000-0000-0000-000000000010';
  v_mod1_id := 'd2100001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2100001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2100001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA10', 2, 'flow_control', v_cat_id, v_subcat_act_id, 'Actuation and flow control',
    'Emergency shutdown valves and partial stroke testing',
    'Emergency shutdown valves must close on demand, and proof tests and partial stroke tests are how plants show that they will. This course covers ESD valve design, testing and the link to safety integrity levels.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 24, Sep 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the role of ESD valves in safety instrumented functions',
      'Select valve, actuator and solenoid for an ESD duty',
      'Plan full and partial stroke testing',
      'Use test data in SIL verification',
      'Learn from ESD valve failures on demand'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Design a test regime for an ESD valve to meet a SIL 2 target',
      'Review proof test records and find weak points'
    ],
    ARRAY['IEC 61511', 'API 6D', 'ISA TR96.05.01'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-03-22 08:30:00+00', '2027-03-24 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: ESD Valve Role & Fail-Safe Actuation Architecture', 1),
    (v_mod2_id, v_course_id, 'Day 2: Proof Testing & Automated Partial Stroke Testing (PST)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Safety Integrity Verification (SIL) & Failure Case Studies', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4100001-0001-0000-0000-000000000001', v_mod1_id, '1. ESD valve role', 'Safety functions; Failure modes; Tight shut off needs.', 'text', 240, 1, false),
    ('c4100001-0001-0000-0000-000000000002', v_mod1_id, '2. Design and selection', 'Fail safe actuators; Solenoids and quick exhaust; Certification data.', 'text', 240, 2, false),
    ('c4100001-0002-0000-0000-000000000001', v_mod2_id, '3. Testing', 'Proof testing; Partial stroke testing; Diagnostic coverage.', 'text', 300, 1, false),
    ('c4100001-0003-0000-0000-000000000001', v_mod3_id, '4. SIL and records', 'Test intervals; PFD effect; Records.', 'text', 240, 1, false),
    ('c4100001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Valve failures on demand; Lessons learned; Specification checklists.', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: VA11 (Pneumatic, hydraulic and electric actuators)
  -- =========================================================================
  v_course_id := 'c4110000-0000-0000-0000-000000000011';
  v_mod1_id := 'd2110001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2110001-0000-0000-0000-000000000002';
  v_mod3_id := 'd2110001-0000-0000-0000-000000000003';
  v_mod4_id := 'd2110001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA11', 2, 'flow_control', v_cat_id, v_subcat_act_id, 'Actuation and flow control',
    'Pneumatic, hydraulic and electric actuators',
    'Actuators turn control signals into valve movement, and an actuator that sticks or stalls can leave a plant unsafe. This competence course trains technicians to install, set up, maintain and fault find pneumatic, hydraulic and electric actuators.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: May 3 to 6, Nov 15 to 18. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain how each actuator type works',
      'Size an actuator to valve torque or thrust',
      'Set up limit switches, positioners and torque settings',
      'Maintain actuators, solenoids and hydraulic units',
      'Diagnose common actuator faults'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Mount and set up actuators on three valves',
      'Diagnose induced actuator faults'
    ],
    ARRAY['ISO 5211', 'ISO 22153', 'IEC 60079'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-05-03 08:30:00+00', '2027-05-06 16:30:00+00',
    0, false, true, 'published'
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Actuator Working Principles & Torque/Thrust Sizing', 1),
    (v_mod2_id, v_course_id, 'Day 2: Control Accessories, Positioners & Limit Switches', 2),
    (v_mod3_id, v_course_id, 'Day 3: Stroke Calibration, Torque Setting & Fail Safe Verification', 3),
    (v_mod4_id, v_course_id, 'Day 4: Actuator Maintenance & Workshop Diagnostic Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('c4110001-0001-0000-0000-000000000001', v_mod1_id, '1. Actuator types', 'Pneumatic; Hydraulic; Electric.', 'text', 210, 1, false),
    ('c4110001-0001-0000-0000-000000000002', v_mod1_id, '2. Sizing', 'Torque and thrust; Safety factors; Supply pressure effects.', 'text', 210, 2, false),
    ('c4110001-0002-0000-0000-000000000001', v_mod2_id, '3. Accessories', 'Positioners; Solenoids; Limit switches.', 'text', 420, 1, false),
    ('c4110001-0003-0000-0000-000000000001', v_mod3_id, '4. Setup and calibration', 'Stroke setting; Torque and limit settings; Fail position checks.', 'text', 420, 1, false),
    ('c4110001-0004-0000-0000-000000000001', v_mod4_id, '5. Maintenance', 'Seals and springs; Hydraulic power units; Electric actuator servicing.', 'text', 210, 1, false),
    ('c4110001-0004-0000-0000-000000000002', v_mod4_id, '6. Fault finding and assessment', 'Common faults; Practical test; Written test.', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
