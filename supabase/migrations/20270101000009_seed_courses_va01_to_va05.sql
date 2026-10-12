-- Migration: Seed Courses VA01, VA02, VA03, VA04, VA05
-- Domain 2 / Valves and Actuation (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_std_id UUID;
  v_subcat_ctrl_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategories
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'valves-and-actuation' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 2 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_std_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'standard-and-industrial-valves' LIMIT 1;
  IF v_subcat_std_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Standard and industrial valves', 'standard-and-industrial-valves', 1)
    RETURNING id INTO v_subcat_std_id;
  END IF;

  SELECT id INTO v_subcat_ctrl_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'high-performance-control' LIMIT 1;
  IF v_subcat_ctrl_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'High performance control', 'high-performance-control', 2)
    RETURNING id INTO v_subcat_ctrl_id;
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
  -- COURSE 1: VA01 (Industrial valve fundamentals: types, standards and selection)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'VA01' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'VA01', 2, 'flow_control', v_cat_id, v_subcat_std_id, 'Standard and industrial valves',
      'Industrial valve fundamentals: types, standards and selection',
      'Valves make up a large share of plant equipment and a larger share of leaks, trips and maintenance hours. This foundation course explains the main valve types, how they are built and rated, and how to choose the right valve for a duty.',
      v_instructor_id, 'beginner', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 10 to 12, Nov 1 to 3. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Identify gate, globe, check, ball, plug and butterfly valves and explain how each works',
        'Read valve data sheets, pressure ratings and material designations',
        'Select a valve type for isolation, regulation and non return duties',
        'Recognise the codes and standards that govern industrial valves',
        'Spot common installation and operating mistakes'
      ],
      ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
      ARRAY[
        'Operators, technicians, graduate engineers and staff new to the subject',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Identify valve types and parts from cutaway samples',
        'Select valves for five process duties using data sheets'
      ],
      ARRAY['ASME B16.34', 'API 600', 'API 602', 'API 6D', 'ISO 5208'],
      ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      '2027-05-10 08:30:00+00', '2027-05-12 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 2,
      category = 'flow_control',
      category_id = v_cat_id,
      subcategory_id = v_subcat_std_id,
      course_area = 'Standard and industrial valves',
      title = 'Industrial valve fundamentals: types, standards and selection',
      description = 'Valves make up a large share of plant equipment and a larger share of leaks, trips and maintenance hours. This foundation course explains the main valve types, how they are built and rated, and how to choose the right valve for a duty.',
      level = 'beginner',
      course_type = 'onsite',
      duration_hours = 21,
      award = 'Certificate of Attendance',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: May 10 to 12, Nov 1 to 3. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Identify gate, globe, check, ball, plug and butterfly valves and explain how each works',
        'Read valve data sheets, pressure ratings and material designations',
        'Select a valve type for isolation, regulation and non return duties',
        'Recognise the codes and standards that govern industrial valves',
        'Spot common installation and operating mistakes'
      ],
      requirements = ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
      target_audience = ARRAY[
        'Operators, technicians, graduate engineers and staff new to the subject',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      practical_work = ARRAY[
        'Identify valve types and parts from cutaway samples',
        'Select valves for five process duties using data sheets'
      ],
      standards = ARRAY['ASME B16.34', 'API 600', 'API 602', 'API 6D', 'ISO 5208'],
      oem_partners = ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      start_date = '2027-05-10 08:30:00+00',
      end_date = '2027-05-12 16:30:00+00',
      price = 0,
      is_free = false,
      is_price_tbd = true,
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 1: Valve Functions, Architectures & Internal Construction', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Valve functions and types', 'Isolation, regulation and non return; Linear and rotary valves; End connections.', 'text', 240, 1),
    (v_mod_id, '2. Construction', 'Bodies and bonnets; Trims, seats and seals; Stem sealing.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 2: Valve Metallurgy, Material Grades & Corrosion Resistance', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Materials and corrosion', 'Material grades; Corrosive and sour service; Trim materials.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 3: Pressure Classes, ASME/API Standards & Installation Good Practice', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Ratings and standards', 'Pressure classes and temperature limits; API, ASME and ISO valve standards; Marking and documentation.', 'text', 240, 1),
    (v_mod_id, '5. Selection and installation', 'Selection by service; Orientation and supports; Handling and storage.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 2: VA02 (Valve maintenance, repair and in service testing)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'VA02' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'VA02', 2, 'flow_control', v_cat_id, v_subcat_std_id, 'Standard and industrial valves',
      'Valve maintenance, repair and in service testing',
      'Valve repair work done well extends valve life and stops leaks, and done poorly it creates new failures. This competence course trains technicians to dismantle, inspect, repair, reassemble and test industrial valves to procedure.',
      v_instructor_id, 'intermediate', 'onsite', 35,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: Jan 18 to 22, Jul 12 to 16. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Prepare a valve for maintenance with correct isolation and decontamination',
        'Dismantle and inspect valves and record as found condition',
        'Repair seats, discs and stems by lapping and machining',
        'Repack glands and replace gaskets to correct torque',
        'Pressure test repaired valves and complete maintenance records'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Overhaul a gate valve and a globe valve from strip down to test',
        'Lap a seat and verify contact',
        'Repack a gland and torque the bonnet bolts in sequence'
      ],
      ARRAY['API 598', 'API 6D', 'ASME B16.34', 'ASME PCC 1'],
      ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      '2027-01-18 08:30:00+00', '2027-01-22 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 2,
      category = 'flow_control',
      category_id = v_cat_id,
      subcategory_id = v_subcat_std_id,
      course_area = 'Standard and industrial valves',
      title = 'Valve maintenance, repair and in service testing',
      description = 'Valve repair work done well extends valve life and stops leaks, and done poorly it creates new failures. This competence course trains technicians to dismantle, inspect, repair, reassemble and test industrial valves to procedure.',
      level = 'intermediate',
      course_type = 'onsite',
      duration_hours = 35,
      award = 'Certificate of Competence',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Jan 18 to 22, Jul 12 to 16. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Prepare a valve for maintenance with correct isolation and decontamination',
        'Dismantle and inspect valves and record as found condition',
        'Repair seats, discs and stems by lapping and machining',
        'Repack glands and replace gaskets to correct torque',
        'Pressure test repaired valves and complete maintenance records'
      ],
      requirements = ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      practical_work = ARRAY[
        'Overhaul a gate valve and a globe valve from strip down to test',
        'Lap a seat and verify contact',
        'Repack a gland and torque the bonnet bolts in sequence'
      ],
      standards = ARRAY['API 598', 'API 6D', 'ASME B16.34', 'ASME PCC 1'],
      oem_partners = ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      start_date = '2027-01-18 08:30:00+00',
      end_date = '2027-01-22 16:30:00+00',
      price = 0,
      is_free = false,
      is_price_tbd = true,
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 1: Safe Isolation, Decontamination & Workshop Handling', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Safe preparation', 'Isolation and permits; Decontamination; Handling and lifting.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 2: Dismantling, Metrology & Seat/Trim Lapping Repair', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. Dismantling and inspection', 'As found records; Wear and damage assessment; Dimensional checks.', 'text', 300, 1),
    (v_mod_id, '3. Seat and trim repair', 'Lapping methods; In situ machining; Trim replacement.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 3: Stem Packing, Bonnet Gaskets & Controlled Bolting', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Packing and gaskets', 'Packing types and installation; Gasket selection; Bolt torque and sequence.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 4: Valve Reassembly, Actuator Mounting & Hydro Testing', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Reassembly', 'Alignment and clearances; Stem and actuator mounting; Final checks.', 'text', 300, 1),
    (v_mod_id, '6. Testing', 'Shell and seat tests; Acceptance criteria; Test records.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 5: Quality Records, Test Reports & Competence Sign-Off', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Records and assessment', 'Maintenance records; Practical competence test; Feedback.', 'text', 300, 1);


  -- =========================================================================
  -- COURSE 3: VA03 (Valve pressure testing to API 598 and API 6D)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'VA03' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'VA03', 2, 'flow_control', v_cat_id, v_subcat_std_id, 'Standard and industrial valves',
      'Valve pressure testing to API 598 and API 6D',
      'Pressure testing confirms that a valve is fit for service, and test records are often audited by clients and regulators. This competence course trains staff to set up, carry out and record shell, seat and backseat tests safely and to the right standard.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: Apr 5 to 7, Oct 18 to 20. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Select the correct test standard and acceptance criteria for a valve',
        'Set up test benches and fixtures safely',
        'Carry out hydrostatic and gas shell, seat and backseat tests',
        'Measure and judge leakage rates',
        'Complete test certificates that meet audit requirements'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Engineering, EPC, maintenance and technical service contractors',
        'Regulators and standards agencies'
      ],
      ARRAY[
        'Carry out shell and seat tests on two valve types',
        'Complete test certificates for audit review'
      ],
      ARRAY['API 598', 'API 6D', 'ISO 5208', 'ISO 10497'],
      ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      '2027-04-05 08:30:00+00', '2027-04-07 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 2,
      category = 'flow_control',
      category_id = v_cat_id,
      subcategory_id = v_subcat_std_id,
      course_area = 'Standard and industrial valves',
      title = 'Valve pressure testing to API 598 and API 6D',
      description = 'Pressure testing confirms that a valve is fit for service, and test records are often audited by clients and regulators. This competence course trains staff to set up, carry out and record shell, seat and backseat tests safely and to the right standard.',
      level = 'intermediate',
      course_type = 'onsite',
      duration_hours = 21,
      award = 'Certificate of Competence',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Apr 5 to 7, Oct 18 to 20. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Select the correct test standard and acceptance criteria for a valve',
        'Set up test benches and fixtures safely',
        'Carry out hydrostatic and gas shell, seat and backseat tests',
        'Measure and judge leakage rates',
        'Complete test certificates that meet audit requirements'
      ],
      requirements = ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Engineering, EPC, maintenance and technical service contractors',
        'Regulators and standards agencies'
      ],
      practical_work = ARRAY[
        'Carry out shell and seat tests on two valve types',
        'Complete test certificates for audit review'
      ],
      standards = ARRAY['API 598', 'API 6D', 'ISO 5208', 'ISO 10497'],
      oem_partners = ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      start_date = '2027-04-05 08:30:00+00',
      end_date = '2027-04-07 16:30:00+00',
      price = 0,
      is_free = false,
      is_price_tbd = true,
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 1: Test Standards, Rig Safety & Equipment Calibration', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Test standards', 'API 598 and API 6D requirements; ISO 5208 leakage rates; Client specifications.', 'text', 240, 1),
    (v_mod_id, '2. Test equipment and safety', 'Test benches and fixtures; Pressure safety and exclusion zones; Gauge calibration.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 2: Hydrostatic & Low/High Pressure Gas Test Execution', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Test execution', 'Shell tests; Seat tests in both directions; Backseat and double block and bleed tests.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 3: Leak Measurement, Audit Trail & Practical Competence Exam', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Results and leakage', 'Leakage measurement; Gas testing; Acceptance decisions.', 'text', 240, 1),
    (v_mod_id, '5. Certification and assessment', 'Test certificates; Audit trail; Practical test.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 4: VA04 (Control valve sizing, selection and characterisation)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'VA04' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'VA04', 2, 'flow_control', v_cat_id, v_subcat_ctrl_id, 'High performance control',
      'Control valve sizing, selection and characterisation',
      'A control valve that is wrongly sized cannot control the process however well the loop is tuned. This course teaches engineers to size and select control valves, choose characteristics and avoid cavitation and noise.',
      v_instructor_id, 'intermediate', 'onsite', 28,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 17 to 20, Nov 15 to 18. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Calculate valve flow coefficients for liquids, gases and steam',
        'Choose valve characteristics to match process behaviour',
        'Select body type, trim and actuator for a duty',
        'Check for cavitation, flashing, choked flow and noise',
        'Prepare a complete control valve data sheet'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Power generation, transmission and distribution'
      ],
      ARRAY[
        'Size valves for liquid, gas and steam duties using IEC 60534 equations',
        'Select trim and actuator and complete a data sheet'
      ],
      ARRAY['IEC 60534', 'ISA 75.01', 'ANSI FCI 70 2'],
      ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      '2027-05-17 08:30:00+00', '2027-05-20 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 2,
      category = 'flow_control',
      category_id = v_cat_id,
      subcategory_id = v_subcat_ctrl_id,
      course_area = 'High performance control',
      title = 'Control valve sizing, selection and characterisation',
      description = 'A control valve that is wrongly sized cannot control the process however well the loop is tuned. This course teaches engineers to size and select control valves, choose characteristics and avoid cavitation and noise.',
      level = 'intermediate',
      course_type = 'onsite',
      duration_hours = 28,
      award = 'Certificate of Attendance',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: May 17 to 20, Nov 15 to 18. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Calculate valve flow coefficients for liquids, gases and steam',
        'Choose valve characteristics to match process behaviour',
        'Select body type, trim and actuator for a duty',
        'Check for cavitation, flashing, choked flow and noise',
        'Prepare a complete control valve data sheet'
      ],
      requirements = ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Power generation, transmission and distribution'
      ],
      practical_work = ARRAY[
        'Size valves for liquid, gas and steam duties using IEC 60534 equations',
        'Select trim and actuator and complete a data sheet'
      ],
      standards = ARRAY['IEC 60534', 'ISA 75.01', 'ANSI FCI 70 2'],
      oem_partners = ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      start_date = '2027-05-17 08:30:00+00',
      end_date = '2027-05-20 16:30:00+00',
      price = 0,
      is_free = false,
      is_price_tbd = true,
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 1: Control Valve Fundamentals & Sizing Equations', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Control valve basics', 'Valve role in the loop; Body styles; Trim types.', 'text', 210, 1),
    (v_mod_id, '2. Sizing equations', 'Liquid sizing; Gas and steam sizing; Piping geometry factors.', 'text', 210, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 2: Valve Inherent & Installed Characteristics', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Characteristics', 'Inherent and installed characteristics; Rangeability; Gain.', 'text', 420, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 3: Actuator Sizing, Positioners & Shutoff Classes', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Selection', 'Actuator sizing; Positioners; Shutoff classes.', 'text', 420, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 4: Severe Service Conditions & Procurement Specification', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Severe conditions', 'Cavitation and flashing; Noise prediction; Trim options.', 'text', 210, 1),
    (v_mod_id, '6. Specification', 'Data sheets; Vendor review; Common mistakes.', 'text', 210, 2);


  -- =========================================================================
  -- COURSE 5: VA05 (Control valve diagnostics with digital valve positioners)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'VA05' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'VA05', 2, 'flow_control', v_cat_id, v_subcat_ctrl_id, 'High performance control',
      'Control valve diagnostics with digital valve positioners',
      'Digital positioners record valve signatures, friction and step response, but few plants use this data to plan maintenance. This advanced course shows how to read positioner diagnostics and turn them into a valve health programme.',
      v_instructor_id, 'advanced', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 17 to 19, Nov 22 to 24. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain how digital positioners measure and control valve position',
        'Run and interpret valve signature and step response tests',
        'Detect friction, deadband, leaks and actuator faults from diagnostic data',
        'Build a valve health programme using online diagnostics',
        'Prioritise valve maintenance by criticality and condition'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Power generation, transmission and distribution'
      ],
      ARRAY[
        'Analyse diagnostic files from twenty valves and rank them for repair',
        'Run a step response test on a training valve'
      ],
      ARRAY['IEC 60534', 'ISA 75.25', 'ISA 75.13'],
      ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      '2027-05-17 08:30:00+00', '2027-05-19 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 2,
      category = 'flow_control',
      category_id = v_cat_id,
      subcategory_id = v_subcat_ctrl_id,
      course_area = 'High performance control',
      title = 'Control valve diagnostics with digital valve positioners',
      description = 'Digital positioners record valve signatures, friction and step response, but few plants use this data to plan maintenance. This advanced course shows how to read positioner diagnostics and turn them into a valve health programme.',
      level = 'advanced',
      course_type = 'onsite',
      duration_hours = 21,
      award = 'Certificate of Attendance',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: May 17 to 19, Nov 22 to 24. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Explain how digital positioners measure and control valve position',
        'Run and interpret valve signature and step response tests',
        'Detect friction, deadband, leaks and actuator faults from diagnostic data',
        'Build a valve health programme using online diagnostics',
        'Prioritise valve maintenance by criticality and condition'
      ],
      requirements = ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      target_audience = ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Power generation, transmission and distribution'
      ],
      practical_work = ARRAY[
        'Analyse diagnostic files from twenty valves and rank them for repair',
        'Run a step response test on a training valve'
      ],
      standards = ARRAY['IEC 60534', 'ISA 75.25', 'ISA 75.13'],
      oem_partners = ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
      start_date = '2027-05-17 08:30:00+00',
      end_date = '2027-05-19 16:30:00+00',
      price = 0,
      is_free = false,
      is_price_tbd = true,
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 1: Digital Positioners & Diagnostic Testing', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Digital positioners', 'Operating principles; HART and fieldbus communication; Asset management software.', 'text', 210, 1),
    (v_mod_id, '2. Diagnostic tests', 'Valve signature; Step response; Online friction monitoring.', 'text', 210, 2);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 2: Diagnostic Signature Interpretation & Fault Detection', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Interpretation', 'Friction and stiction; Actuator leaks; Seat wear.', 'text', 420, 1);

  INSERT INTO public.modules (course_id, title, order_index)
  VALUES (v_course_id, 'Day 3: Valve Health Programmes & Turnaround Maintenance Planning', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Valve health programmes', 'Criticality ranking; Diagnostic schedules; KPIs.', 'text', 210, 1),
    (v_mod_id, '5. Maintenance planning', 'Turnaround scoping; Repair decisions; Case studies.', 'text', 210, 2);

END $$;
