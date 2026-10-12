-- Migration: Seed Courses PD12, PD13, PD14, PD15, PD16
-- Domain 1 / Power and Drives (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_elec_id UUID;
  v_subcat_pump_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategories
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'power-and-drives' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 1 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_elec_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'electrical-power-systems-lv-and-mv' LIMIT 1;
  IF v_subcat_elec_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Electrical power systems (LV and MV)', 'electrical-power-systems-lv-and-mv', 2)
    RETURNING id INTO v_subcat_elec_id;
  END IF;

  SELECT id INTO v_subcat_pump_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'pumping-systems' LIMIT 1;
  IF v_subcat_pump_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Pumping systems', 'pumping-systems', 3)
    RETURNING id INTO v_subcat_pump_id;
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
  -- COURSE 1: PD12 (Gas engine and diesel generator captive power operation)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD12' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD12', 1, 'flow_drives', v_cat_id, v_subcat_elec_id, 'Electrical power systems (LV and MV)',
      'Gas engine and diesel generator captive power operation',
      'Many industrial sites and estates depend on gas engines and diesel generators for their own power. This competence course trains operators and technicians to run, maintain and troubleshoot captive generating sets for reliable output and lower fuel cost.',
      v_instructor_id, 'intermediate', 'onsite', 35,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: May 10 to 14, Nov 22 to 26. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain engine, alternator and control system operation',
        'Carry out pre start checks, start up, synchronisation and load sharing',
        'Perform routine maintenance to OEM schedules',
        'Troubleshoot common engine and alternator faults',
        'Monitor fuel efficiency and report plant performance'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Manufacturing, cement, food, beverage and mining',
        'Oil and gas operators and service companies'
      ],
      ARRAY[
        'Start, synchronise and load a generating set on a simulator',
        'Carry out a scheduled service and record findings',
        'Trace and fix three fault scenarios'
      ],
      ARRAY['ISO 8528', 'ISO 3046', 'IEC 60034', 'OEM operation manuals'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-05-10 08:30:00+00', '2027-05-14 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Four-Stroke Engine Fundamentals & Fuel/Ignition Systems', 'Cycle thermodynamics, gas vs diesel differences, fuel injection, air manifolds, and ignition (5h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Engine fundamentals', 'Four stroke cycle; Gas and diesel engine differences; Fuel, air and ignition systems.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Alternators, AVR Excitation & Synchronising Controls', 'Generator principles, AVR, protection functions, governors, synchronising, and load sharing (10h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. Alternators and excitation', 'Generator principles; AVR and excitation; Protection functions.', 'text', 300, 1),
    (v_mod_id, '3. Controls and synchronisation', 'Governors; Synchronising and load sharing; Island and grid parallel operation.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Auxiliary Systems, Fuel Gas Conditioning & Heat Recovery', 'Cooling, lubrication circuits, gas conditioning skids, exhaust, and CHP waste heat recovery (5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Auxiliary systems', 'Cooling and lubrication; Fuel gas conditioning; Exhaust and heat recovery.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: OEM Scheduled Maintenance & Root-Cause Troubleshooting', 'Service intervals, lube oil analysis, valve/plug checks, starting failures, and misfire diagnosis (10h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Maintenance', 'Service intervals; Oil analysis; Valve and plug checks.', 'text', 300, 1),
    (v_mod_id, '6. Troubleshooting', 'Starting failures; Detonation and misfire; Overheating and alarms.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Heat Rate Tracking, Log Keeping & Practical Competence Exam', 'Efficiency metrics, heat rate curves, operational logs, and hands-on competence evaluation (5h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Performance and assessment', 'Heat rate and fuel tracking; Log keeping; Practical competence test.', 'quiz', 300, 1);


  -- =========================================================================
  -- COURSE 2: PD13 (Solar PV, battery storage and hybrid microgrids for industrial sites)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD13' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD13', 1, 'flow_drives', v_cat_id, v_subcat_elec_id, 'Electrical power systems (LV and MV)',
      'Solar PV, battery storage and hybrid microgrids for industrial sites',
      'Solar PV with batteries is now cheaper than diesel for many industrial and commercial sites, and hybrid microgrids are spreading across Africa. This course covers design, sizing, protection, control and operation of hybrid systems that combine solar, storage, gas or diesel and the grid.',
      v_instructor_id, 'intermediate', 'onsite', 35,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Feb 15 to 19, Aug 23 to 27. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Assess site load profiles and resource data for a hybrid system',
        'Size PV arrays, inverters and battery storage for given objectives',
        'Design protection, earthing and control for a microgrid',
        'Explain dispatch strategies that reduce fuel use and maintain reliability',
        'Evaluate project economics and operation and maintenance needs'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Manufacturing, cement, food, beverage and mining',
        'Sustainability, ESG and energy transition teams',
        'Ministries, departments and government agencies'
      ],
      ARRAY[
        'Size a hybrid system for a real site load profile using design software',
        'Compare dispatch strategies for fuel saving',
        'Build a simple financial model for the project'
      ],
      ARRAY['IEC 62446', 'IEC 62548', 'IEC 62933', 'IEEE 1547', 'IEC 62619'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-02-15 08:30:00+00', '2027-02-19 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Energy Resource, Load Profiling & Plant Baselines', 'Load profiling, solar irradiance datasets, diesel/gas baselines, and hybrid viability (5h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Energy resource and load analysis', 'Load profiling; Solar resource data; Diesel and gas baselines.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: PV System Engineering & Battery Energy Storage (BESS)', 'Modules, strings, central/string inverters, BESS chemistries, C-rate sizing, and BMS safety (10h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. PV system design', 'Modules and strings; Inverters; Yield estimation.', 'text', 300, 1),
    (v_mod_id, '3. Battery storage', 'Battery chemistries; Sizing for energy and power; Battery management and safety.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Hybrid Microgrid Control & Genset Integration', 'Grid-forming vs grid-following inverters, spinning reserve, dispatch logic, and genset integration (5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Hybrid and microgrid control', 'Grid forming and following; Dispatch strategies; Generator integration.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Protection, Earthing Schemes & Project Financials', 'DC/AC protection, islanding detection, earthing schemes, LCOE, CAPEX/OPEX, and PPA models (8.5h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Protection and earthing', 'DC and AC protection; Islanding; Earthing schemes.', 'text', 300, 1),
    (v_mod_id, '6. Economics and contracting', 'LCOE and payback; Energy service and PPA models.', 'text', 210, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Asset O&M, SCADA Monitoring & Battery Lifecycle', 'Monitoring KPIs, PR ratios, thermography inspection, cleaning protocols, and SoH battery health (5h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Operation and maintenance', 'Monitoring and KPIs; Cleaning and inspection; Battery health.', 'text', 300, 1);


  -- =========================================================================
  -- COURSE 3: PD14 (Power quality, harmonics and energy efficiency in plants)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD14' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD14', 1, 'flow_drives', v_cat_id, v_subcat_elec_id, 'Electrical power systems (LV and MV)',
      'Power quality, harmonics and energy efficiency in plants',
      'Harmonics, voltage dips, flicker and poor power factor damage motors, drives and electronics and waste energy that is paid for on every bill. This course explains the main power quality problems in industrial plants, how to measure them correctly and which solutions work.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Jan 18 to 20, Jul 26 to 28. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Identify the main power quality disturbances and their sources',
        'Measure and interpret harmonics, flicker and voltage events with analysers',
        'Assess compliance with IEEE 519 and IEC limits',
        'Select mitigation such as filters, reactors and power factor correction',
        'Estimate energy and cost savings from power quality improvements'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Power generation, transmission and distribution',
        'Manufacturing, cement, food, beverage and mining',
        'Process industries: refining, petrochemicals, fertiliser, gas processing'
      ],
      ARRAY[
        'Analyse a power quality survey from a plant with VSD loads',
        'Select and justify a mitigation option with a cost estimate'
      ],
      ARRAY['IEEE 519', 'IEC 61000 4 30', 'EN 50160', 'IEC 61000 3 12'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-01-18 08:30:00+00', '2027-01-20 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Power Quality Fundamentals & Harmonics Generation', 'Disturbance types, equipment impacts, capacitor resonance, IEEE 519, and IEC limits (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Power quality basics', 'Types of disturbance; Effects on equipment; Utility and plant responsibilities.', 'text', 240, 1),
    (v_mod_id, '2. Harmonics', 'Sources and spectra; Resonance with capacitors; Limits and standards.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Measurement Standards, Analyser Setup & Data Surveys', 'Class A analysers, survey campaign planning, flicker, unbalance, and event capture (5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Measurement', 'Analyser classes and setup; Survey planning; Data interpretation.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Harmonic Mitigation, PFC & Energy Cost Business Cases', 'Passive/active harmonic filters, detuned PFC, voltage ride-through, and tariff payback (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Mitigation', 'Passive and active filters; Power factor correction; Ride through and voltage support.', 'text', 240, 1),
    (v_mod_id, '5. Energy and cost', 'Losses and tariffs; Savings estimates; Business case.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 4: PD15 (Centrifugal pump selection, operation and API 610 essentials)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD15' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD15', 1, 'flow_drives', v_cat_id, v_subcat_pump_id, 'Pumping systems',
      'Centrifugal pump selection, operation and API 610 essentials',
      'Centrifugal pumps are the most common rotating machines in any plant, and many failures come from simple operating mistakes. This foundation course gives operators and new engineers a clear grasp of pump hydraulics, selection, operation and the requirements of API 610.',
      v_instructor_id, 'beginner', 'onsite', 28,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 17 to 20, Nov 8 to 11. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Read pump curves and system curves to find the operating point',
        'Explain NPSH and how to avoid cavitation',
        'Describe API 610 pump types and key construction features',
        'Start, operate and stop pumps correctly',
        'Recognise common operating problems and their causes'
      ],
      ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
      ARRAY[
        'Operators, technicians, graduate engineers and staff new to the subject',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining'
      ],
      ARRAY[
        'Find operating points on curves for changing system conditions',
        'Run a pump test rig and record performance',
        'Create cavitation on the rig and correct it'
      ],
      ARRAY['API 610', 'ISO 13709', 'ISO 9906', 'Hydraulic Institute standards'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-05-17 08:30:00+00', '2027-05-20 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Pump Hydraulics, Curves & Suction Conditions', 'Head, flow, efficiency, affinity laws, NPSHa/NPSHr, cavitation, and recirculation (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Pump hydraulics', 'Head, flow and efficiency; Pump and system curves; Affinity laws.', 'text', 270, 1),
    (v_mod_id, '2. Suction conditions', 'NPSH available and required; Cavitation; Recirculation.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Pump Configurations & API 610 Classifications', 'OH, BB and VS pump types, casing designs, impellers, baseplates, and nozzle load limits (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Pump types and API 610', 'OH, BB and VS types; Casings, impellers and bearings; Baseplates and nozzle loads.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Mechanical Seals, Bearings & Lubrication Practice', 'Seal basics, bearing arrangements, lubrication selection, and oil level checks (4.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Seals, bearings and lubrication', 'Seal basics; Bearing types; Lubrication checks.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Safe Operation, Parallel Pumping & Troubleshooting', 'Priming, venting, minimum flow protection, series/parallel operation, leaks, and checklists (9h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Operation', 'Priming and venting; Minimum flow protection; Parallel and series operation.', 'text', 270, 1),
    (v_mod_id, '6. Problems and routine checks', 'Vibration and noise; Seal leaks; Operator checklists.', 'text', 270, 2);


  -- =========================================================================
  -- COURSE 5: PD16 (Mechanical seals and API 682 seal plans)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD16' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD16', 1, 'flow_drives', v_cat_id, v_subcat_pump_id, 'Pumping systems',
      'Mechanical seals and API 682 seal plans',
      'Mechanical seals are the most frequent cause of pump maintenance and a common source of leaks and fires. This course explains seal designs, API 682 categories, arrangements and piping plans, and the operating conditions that make seals last.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 10 to 12, Nov 15 to 17. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain seal components and how the faces stay lubricated',
        'Select seal categories, arrangements and plans for a given fluid',
        'Read API 682 piping plan drawings and set them up correctly',
        'Diagnose seal failures from face and component condition',
        'Apply installation and commissioning good practice'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Manufacturing, cement, food, beverage and mining'
      ],
      ARRAY[
        'Select a seal and plan for four process fluids',
        'Examine failed seals and identify causes'
      ],
      ARRAY['API 682', 'ISO 21049', 'Hydraulic Institute guidelines'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-05-10 08:30:00+00', '2027-05-12 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Seal Fundamentals, Face Mechanics & API 682 Categories', 'Face lubrication, pusher/bellows designs, cartridge assemblies, Categories 1/2/3, and Arrangements 1/2/3 (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Seal fundamentals', 'Seal faces and materials; Pusher and bellows seals; Cartridge seals.', 'text', 240, 1),
    (v_mod_id, '2. API 682 categories and arrangements', 'Categories 1, 2 and 3; Arrangements 1, 2 and 3; Selection logic.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: API 682 Piping Plans, Flush/Quench & Barrier Systems', 'Flush plans (11, 21, 23, 31, 32), quench plans (52, 53A/B/C), dual seals, buffer fluids, and instrumentation (5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Seal piping plans', 'Flush and quench plans; Buffer and barrier systems; Plan instrumentation.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Seal Failure Diagnostics, Assembly & Commissioning Good Practice', 'Distress patterns, thermal cracking, O-ring degradation, installation tolerances, venting, and commissioning (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Failure analysis', 'Face distress patterns; Elastomer and spring failures; Root causes in operation.', 'text', 240, 1),
    (v_mod_id, '5. Installation and operation', 'Installation checks; Commissioning and venting; Monitoring in service.', 'text', 240, 2);

END $$;
