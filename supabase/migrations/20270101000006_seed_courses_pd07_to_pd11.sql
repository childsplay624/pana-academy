-- Migration: Seed Courses PD07, PD08, PD09, PD10, PD11
-- Domain 1 / Power and Drives - Electrical power systems (LV and MV) (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategory
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'power-and-drives' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 1 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'electrical-power-systems-lv-and-mv' LIMIT 1;
  IF v_subcat_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Electrical power systems (LV and MV)', 'electrical-power-systems-lv-and-mv', 2)
    RETURNING id INTO v_subcat_id;
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
  -- COURSE 1: PD07 (MV switchgear operation, switching safety and authorisation)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD07' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD07', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Electrical power systems (LV and MV)',
      'MV switchgear operation, switching safety and authorisation',
      'Switching medium voltage equipment is one of the highest risk tasks in any plant or utility, and most switching accidents involve a missed step, a wrong panel or a failed interlock. This competence course trains electrical staff to operate MV switchgear correctly, write and follow switching programmes and apply the authorisation rules that keep people safe.',
      v_instructor_id, 'intermediate', 'onsite', 28,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: Jun 14 to 17, Dec 6 to 9. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Describe MV switchgear types, interlocks and protection devices',
        'Prepare and follow a written switching programme',
        'Carry out isolation, earthing and proving dead to procedure',
        'Recognise abnormal conditions and respond safely during switching',
        'Demonstrate switching competence under assessment'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Oil and gas operators and service companies',
        'Manufacturing, cement, food, beverage and mining'
      ],
      ARRAY[
        'Write and execute a switching programme on a training panel',
        'Perform isolation, earthing and proving dead under observation',
        'Respond to a simulated breaker failure during switching'
      ],
      ARRAY['IEC 62271', 'IEC 61936', 'NFPA 70E', 'Site electrical safety rules'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-06-14 08:30:00+00', '2027-06-17 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: MV Systems, Equipment, Interlocks & Protection', 'System layouts, switchgear types, interlocks, relays, and arc fault containment (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. MV systems and equipment', 'System layouts and earthing; Air, vacuum and SF6 switchgear; Ring main units and withdrawable breakers.', 'text', 270, 1),
    (v_mod_id, '2. Interlocks and protection', 'Mechanical and key interlocks; Relays and trip circuits; Arc fault containment.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Safety Rules and Authorisation', 'Authorised and competent persons, permits, sanctions for test, and limits of access (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Safety rules and authorisation', 'Authorised and competent persons; Permits and sanction for test; Limits of access.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Switching Programmes and Operational Communication', 'Writing programmes, checking, approval, and live communications during switching (4.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Switching programmes', 'Writing a programme; Checking and approval; Communication during switching.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Isolation, Earthing, Proving Dead & Practical Assessment', 'Integral earths, voltage indicators, proving units, and assessed switching tasks (9h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Isolation, earthing and proving dead', 'Isolation points; Portable and integral earths; Voltage indicators and proving units.', 'text', 270, 1),
    (v_mod_id, '6. Practical assessment', 'Supervised switching tasks; Emergency scenarios; Competence sign off.', 'quiz', 270, 2);


  -- =========================================================================
  -- COURSE 2: PD08 (Protection relays and IEC 61850 substation automation)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD08' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD08', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Electrical power systems (LV and MV)',
      'Protection relays and IEC 61850 substation automation',
      'Protection systems decide how a power system survives a fault, and digital substations now run on IEC 61850 communications. This course takes protection engineers through relay principles, coordination and testing, and the design and commissioning of IEC 61850 based schemes.',
      v_instructor_id, 'advanced', 'onsite', 35,
      'Certificate of Attendance', 'Up to 16 participants',
      'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
      ARRAY[
        'Explain overcurrent, earth fault, distance, differential and motor protection principles',
        'Coordinate protection settings across a radial and interconnected network',
        'Configure IEC 61850 logical nodes, GOOSE messages and sampled values',
        'Plan and perform secondary injection and end to end tests',
        'Review protection performance after a disturbance'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Power generation, transmission and distribution',
        'Oil and gas operators and service companies',
        'Regulators and standards agencies'
      ],
      ARRAY[
        'Coordinate a feeder and transformer scheme using study software',
        'Configure and test GOOSE trip messages between two IEDs',
        'Analyse a disturbance record and explain the relay response'
      ],
      ARRAY['IEC 60255', 'IEC 61850', 'IEEE C37.2', 'IEEE 242'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Protection Principles, CTs/VTs & Transformer Schemes', 'Fault types, CT/VT sizing, overcurrent, earth fault, differential and REF protection (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Protection principles and instrumentation', 'Fault types and calculations; Current and voltage transformers; Zones of protection.', 'text', 270, 1),
    (v_mod_id, '2. Feeder and transformer protection', 'Overcurrent and earth fault; Transformer differential; Restricted earth fault.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Line, Generator and Motor Protection', 'Distance protection, generator protection schemes, and motor protection functions (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Line, generator and motor protection', 'Distance protection; Generator protection; Motor protection functions.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Coordination Studies & IEC 61850 Digital Architecture', 'Time-current curves, grading margins, logical nodes, GOOSE, MMS, and process bus (9h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Coordination studies', 'Time current curves; Grading margins; Coordination software.', 'text', 270, 1),
    (v_mod_id, '5. IEC 61850 architecture', 'Data model and logical nodes; GOOSE and MMS; Process bus and sampled values.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Engineering, SCL Configuration & Interoperability', 'SCL files, vendor configuration tools, interoperability testing, and IEEE 1588 time sync (4.5h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '6. Engineering and configuration', 'SCL files and configuration tools; Interoperability testing; Time synchronisation.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Testing, Commissioning & Disturbance Analysis', 'Secondary injection, GOOSE end-to-end testing, fault records, and root cause diagnosis (9h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Testing and commissioning', 'Secondary injection; GOOSE testing; End to end tests.', 'text', 270, 1),
    (v_mod_id, '8. Disturbance analysis', 'Event and fault records; Root cause of maloperation; Settings review.', 'text', 270, 2);


  -- =========================================================================
  -- COURSE 3: PD09 (Power system studies: load flow, short circuit and arc flash)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD09' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD09', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Electrical power systems (LV and MV)',
      'Power system studies: load flow, short circuit and arc flash',
      'Power system studies show whether a network can carry its load, survive faults and keep people safe from arc flash. Engineers learn to build network models and run load flow, short circuit, motor starting and arc flash studies, then turn results into decisions.',
      v_instructor_id, 'advanced', 'onsite', 35,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Apr 19 to 23. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Build a network model from single line diagrams and equipment data',
        'Run and interpret load flow and voltage drop studies',
        'Calculate short circuit currents to IEC 60909 and check equipment ratings',
        'Assess motor starting and transient stability for large drives',
        'Carry out an arc flash study and produce labels and recommendations'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Power generation, transmission and distribution',
        'Oil and gas operators and service companies',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Model a plant network and run load flow and short circuit cases',
        'Run an arc flash study and produce labels for a switchboard'
      ],
      ARRAY['IEC 60909', 'IEEE 1584', 'IEEE 399', 'IEC 60076'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-04-19 08:30:00+00', '2027-04-23 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Network Modelling & System Parameters', 'Data gathering, per unit system, cables, source impedances, transformers, and load models (5h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Network modelling', 'Data gathering; Per unit system; Source, cable, transformer and load models.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Load Flow Analysis & IEC 60909 Short Circuit Calculations', 'Solution methods, voltage drop, losses, IEC 60909 fault currents, and duty checks (10h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. Load flow', 'Solution methods; Voltage profile and losses; Reactive power and tap settings.', 'text', 300, 1),
    (v_mod_id, '3. Short circuit', 'IEC 60909 method; Equipment duty checks; Fault current limiting.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Motor Starting, Voltage Dips & Transient Stability', 'Starting methods, voltage dip limits, and transient stability for large drives (5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Motor starting and dynamics', 'Starting methods; Voltage dip limits; Transient stability basics.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Harmonics Overview & IEEE 1584 Arc Flash Studies', 'Sources, filter screening, IEEE 1584 incident energy, boundaries, and label mitigation (8.5h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Harmonics overview', 'Sources and resonance; Filter screening.', 'text', 210, 1),
    (v_mod_id, '6. Arc flash studies', 'IEEE 1584 method; Incident energy and boundaries; Labels and mitigation.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Engineering Reporting, Assumptions & Recommendations', 'Study assumptions, executive results presentation, and engineering mitigation recommendations (5h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Reporting', 'Study assumptions; Results presentation; Recommendations.', 'text', 300, 1);


  -- =========================================================================
  -- COURSE 4: PD10 (Arc flash hazard analysis and NFPA 70E electrical safety)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD10' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD10', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Electrical power systems (LV and MV)',
      'Arc flash hazard analysis and NFPA 70E electrical safety',
      'Arc flash injures and kills electrical workers every year, and most incidents happen during routine work on live equipment. This course explains the hazard, how incident energy is assessed and how to choose controls and PPE, with a practical competence assessment.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: May 17 to 19, Nov 15 to 17. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain the causes and effects of arc flash and shock',
        'Read arc flash labels and apply approach boundaries',
        'Select PPE using incident energy and task tables',
        'Prepare an energised work permit and job safety analysis',
        'Apply the hierarchy of controls to reduce arc flash risk'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Manufacturing, cement, food, beverage and mining',
        'Oil and gas operators and service companies',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Select PPE for six real tasks from labels and tables',
        'Complete an energised work permit for a breaker racking task'
      ],
      ARRAY['NFPA 70E', 'IEEE 1584', 'IEC 61482', 'OSHA 1910 Subpart S'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-05-17 08:30:00+00', '2027-05-19 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Electrical Hazards & Incident Energy Risk Assessment', 'Shock/arc flash physics, injury mechanisms, approach boundaries, and task tables (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Electrical hazards', 'Shock and arc flash physics; Injury mechanisms; Incident case studies.', 'text', 270, 1),
    (v_mod_id, '2. Risk assessment', 'Approach boundaries; Incident energy analysis; Task based tables.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Hierarchy of Controls, Insulated Tools & Arc-Rated PPE', 'Elimination, engineering controls, arc-rated clothing, face shields, and insulated tools (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Controls and PPE', 'Elimination and engineering controls; Arc rated clothing; Insulated tools.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Safe Work Practices, LOTO & Competence Assessment', 'Energised work permits, electrically safe work conditions, lockout/tagout, and assessment (7.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Safe work practice', 'Energised work permits; Establishing an electrically safe work condition; Lockout and tagout.', 'text', 270, 1),
    (v_mod_id, '5. Assessment', 'Scenario exercises; Written test.', 'quiz', 180, 2);


  -- =========================================================================
  -- COURSE 5: PD11 (Transformer condition monitoring and lifecycle management)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD11' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD11', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Electrical power systems (LV and MV)',
      'Transformer condition monitoring and lifecycle management',
      'Transformers are long lead, high value assets, and their failure can stop a plant or a city feeder for months. Participants learn to assess transformer health using oil, electrical and thermal tests and to plan maintenance and replacement over the asset life.',
      v_instructor_id, 'intermediate', 'onsite', 28,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Jun 21 to 24, Dec 13 to 16. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Describe transformer design, cooling and insulation systems',
        'Interpret dissolved gas analysis and oil quality results',
        'Select and interpret electrical tests such as winding resistance, ratio and frequency response',
        'Rank transformers by health index and risk',
        'Build a lifecycle plan covering maintenance, refurbishment and replacement'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Manufacturing, cement, food, beverage and mining',
        'Regulators and standards agencies'
      ],
      ARRAY[
        'Interpret DGA results from ten transformers and recommend actions',
        'Build a health index for a substation fleet'
      ],
      ARRAY['IEC 60076', 'IEC 60599', 'IEEE C57.104', 'IEC 60422'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-06-21 08:30:00+00', '2027-06-24 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Transformer Design, Insulation & Oil Ageing', 'Core, windings, cooling, tap changers, paper/oil ageing, moisture, furans, and sampling (10h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Transformer design', 'Core and windings; Cooling classes; Tap changers and bushings.', 'text', 300, 1),
    (v_mod_id, '2. Insulation and oil', 'Paper and oil ageing; Moisture and furans; Oil sampling.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Diagnostic Testing & DGA Interpretation Methods', 'DGA methods (Duval, Rogers), ratio, winding resistance, power factor, and SFRA (5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Diagnostic testing', 'DGA interpretation methods; Ratio, resistance and power factor; Frequency response analysis.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Online Monitoring & Sensor Technologies', 'Online DGA monitors, moisture sensors, bushing monitoring, and infrared thermal imaging (5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Online monitoring', 'Gas and moisture monitors; Bushing monitoring; Thermal imaging.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Fleet Health Indexing & Asset Lifecycle Planning', 'Health index scoring, criticality, risk ranking, refurbishment vs replacement, and spares (8.5h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Health indexing', 'Scoring methods; Criticality and risk.', 'text', 210, 1),
    (v_mod_id, '6. Lifecycle planning', 'Maintenance tasks; Refurbishment versus replacement; Spares and emergency plans.', 'text', 300, 2);

END $$;
