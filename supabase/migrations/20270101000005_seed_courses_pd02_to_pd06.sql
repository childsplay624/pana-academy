-- Migration: Seed Courses PD02, PD03, PD04, PD05, PD06
-- Domain 1 / Power and Drives (PANA Institute Catalog 2027)

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

  IF v_cat_id IS NULL THEN
    INSERT INTO public.course_categories (name, slug, description, domain_no, code_prefix, display_order)
    VALUES ('Power and drives', 'power-and-drives', 'Compression, turbomachinery, electrical power systems, pumps and VSD systems.', 1, 'PD', 1)
    RETURNING id INTO v_cat_id;
  END IF;

  SELECT id INTO v_subcat_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'compression-and-turbomachinery' LIMIT 1;
  IF v_subcat_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Compression and turbomachinery', 'compression-and-turbomachinery', 1)
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
  -- COURSE 1: PD02 (Reciprocating compressor maintenance and diagnostics)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD02' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD02', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Compression and turbomachinery',
      'Reciprocating compressor maintenance and diagnostics',
      'Reciprocating compressors serve gas lift, gas gathering, hydrogen and refrigeration duties where high ratios are needed, and they demand more hands on maintenance than any other rotating machine. Participants learn how the machine works, how to overhaul its critical parts and how to use pressure volume and vibration data to find faults early.',
      v_instructor_id, 'intermediate', 'onsite', 35,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: Jun 21 to 25, Dec 6 to 10. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain the compression cycle, rod load and capacity control of a reciprocating compressor',
        'Inspect and overhaul valves, piston rings, rider bands and packing to manufacturer limits',
        'Measure and record clearances, rod runout and crosshead alignment',
        'Interpret pressure volume cards and vibration signatures to locate faults',
        'Build a maintenance plan that reduces unplanned shutdowns'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Strip, inspect and rebuild a compressor valve assembly to specification',
        'Take rod runout and crosshead clearance readings on a training frame',
        'Diagnose valve and ring faults from a set of pressure volume cards'
      ],
      ARRAY['API 618', 'API 11P', 'ISO 13631'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-06-21 08:30:00+00', '2027-06-25 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 1, category = 'flow_drives', category_id = v_cat_id, subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Reciprocating compressor maintenance and diagnostics',
      description = 'Reciprocating compressors serve gas lift, gas gathering, hydrogen and refrigeration duties where high ratios are needed, and they demand more hands on maintenance than any other rotating machine. Participants learn how the machine works, how to overhaul its critical parts and how to use pressure volume and vibration data to find faults early.',
      level = 'intermediate', course_type = 'onsite', duration_hours = 35,
      award = 'Certificate of Competence', class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Jun 21 to 25, Dec 6 to 10. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Explain the compression cycle, rod load and capacity control of a reciprocating compressor',
        'Inspect and overhaul valves, piston rings, rider bands and packing to manufacturer limits',
        'Measure and record clearances, rod runout and crosshead alignment',
        'Interpret pressure volume cards and vibration signatures to locate faults',
        'Build a maintenance plan that reduces unplanned shutdowns'
      ],
      requirements = ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      practical_work = ARRAY[
        'Strip, inspect and rebuild a compressor valve assembly to specification',
        'Take rod runout and crosshead clearance readings on a training frame',
        'Diagnose valve and ring faults from a set of pressure volume cards'
      ],
      standards = ARRAY['API 618', 'API 11P', 'ISO 13631'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-06-21 08:30:00+00', end_date = '2027-06-25 16:30:00+00',
      price = 0, is_free = false, is_price_tbd = true, status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Machine Design and Operation', 'Frame, crosshead, cylinder arrangement, rod loads, and capacity control methods (5.5h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Machine design and operation: frame and cylinders', 'Frame, crosshead and cylinder arrangement; single and double acting cylinders.', 'text', 165, 1),
    (v_mod_id, 'Rod load reversal and capacity control systems', 'Rod load and reversal criteria; suction valve unloaders and variable clearance pockets.', 'text', 165, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Valves, Pistons, Rings and Packing', 'Overhaul and lift setting for valves, rider band wear, and packing case sealing (9.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. Compressor valves overhaul and lift setting', 'Plate, poppet and ring valve types; failure modes and causes; valve overhaul and lift setting; unloaders and clearance pockets.', 'text', 330, 1),
    (v_mod_id, '3. Pistons, rings and packing cases', 'Ring and rider band materials; packing case design and venting; wear measurement and replacement limits.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Running Gear, Alignment and Grouting', 'Crankshaft, bearings, crosshead clearances, rod runout and alignment (5.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Running gear and alignment', 'Crankshaft, bearings and crosshead; rod runout and drop checks; frame and cylinder alignment; foundation and grouting issues.', 'text', 330, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Lubrication, Cooling and Condition Monitoring', 'Lubrication rates, jackets, PV card analysis, and vibration/ultrasonic signatures (9.5h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Lubrication and cooling systems', 'Frame and cylinder lubrication rates; lubricator setting and checks; jacket cooling and interstage coolers.', 'text', 240, 1),
    (v_mod_id, '6. Condition monitoring and PV card analysis', 'Pressure volume analysis; valve temperature monitoring; vibration and ultrasonic signatures; rod position monitoring.', 'text', 330, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Maintenance Planning & Competence Assessment', 'Overhaul intervals, spares strategy, and Certificate of Competence evaluation (4h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Maintenance planning and strategy', 'Overhaul intervals and condition based tasks; spares strategy for wearing parts; documenting as found and as left.', 'text', 120, 1),
    (v_mod_id, 'Certificate of Competence practical demonstration and test', 'Practical demonstration and written test against stated criteria for PANA Institute certification.', 'quiz', 120, 2);


  -- =========================================================================
  -- COURSE 2: PD03 (Gas turbine operation, maintenance and hot gas path inspection)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD03' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD03', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Compression and turbomachinery',
      'Gas turbine operation, maintenance and hot gas path inspection',
      'Gas turbines drive compressors, pumps and generators across oil, gas and power, and their availability depends on how well the hot section is operated and inspected. This advanced course covers turbine performance, combustion, controls and the planning and execution of borescope and hot gas path inspections.',
      v_instructor_id, 'advanced', 'onsite', 35,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: May 24 to 28. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Analyse gas turbine performance and separate fouling, deterioration and instrument effects',
        'Explain combustion system design, including dry low emission systems, and their operating limits',
        'Plan and interpret borescope and hot gas path inspections',
        'Assess blade, vane and combustor damage against acceptance criteria',
        'Set maintenance intervals using equivalent operating hours and starts'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Power generation, transmission and distribution',
        'International oil companies and joint ventures'
      ],
      ARRAY[
        'Calculate corrected performance from site data and identify fouling',
        'Review a borescope video set and grade findings against limits',
        'Build a hot gas path inspection work pack and schedule'
      ],
      ARRAY['API 616', 'ISO 3977', 'ISO 2314', 'OEM maintenance manuals'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-05-24 08:30:00+00', '2027-05-28 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 1, category = 'flow_drives', category_id = v_cat_id, subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Gas turbine operation, maintenance and hot gas path inspection',
      description = 'Gas turbines drive compressors, pumps and generators across oil, gas and power, and their availability depends on how well the hot section is operated and inspected. This advanced course covers turbine performance, combustion, controls and the planning and execution of borescope and hot gas path inspections.',
      level = 'advanced', course_type = 'onsite', duration_hours = 35,
      award = 'Certificate of Attendance', class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: May 24 to 28. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Analyse gas turbine performance and separate fouling, deterioration and instrument effects',
        'Explain combustion system design, including dry low emission systems, and their operating limits',
        'Plan and interpret borescope and hot gas path inspections',
        'Assess blade, vane and combustor damage against acceptance criteria',
        'Set maintenance intervals using equivalent operating hours and starts'
      ],
      requirements = ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      target_audience = ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Power generation, transmission and distribution',
        'International oil companies and joint ventures'
      ],
      practical_work = ARRAY[
        'Calculate corrected performance from site data and identify fouling',
        'Review a borescope video set and grade findings against limits',
        'Build a hot gas path inspection work pack and schedule'
      ],
      standards = ARRAY['API 616', 'ISO 3977', 'ISO 2314', 'OEM maintenance manuals'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-05-24 08:30:00+00', end_date = '2027-05-28 16:30:00+00',
      price = 0, is_free = false, is_price_tbd = true, status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Gas Turbine Principles & Configurations', 'Brayton cycle, aero-derivative vs heavy duty, and shaft arrangements (5h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Gas turbine principles and arrangements', 'Brayton cycle and component efficiencies; aero derivative and industrial heavy duty designs; single and twin shaft arrangements; ambient and site effects.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Performance Analysis and Combustion Systems', 'Degradation tracking, compressor washing, and DLE combustion systems (10h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '2. Performance analysis and degradation tracking', 'Corrected parameters and baselines; compressor fouling and washing; degradation tracking; heat rate and power calculations.', 'text', 300, 1),
    (v_mod_id, '3. Combustion systems and DLE technology', 'Diffusion and dry low emission combustors; flame stability and dynamics; fuel quality and gas specification; emission limits and tuning.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Controls, Sequencing and Protection', 'Fuel control, purge cycles, overspeed and thermocouple spread monitoring (5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Controls and protection architecture', 'Speed, temperature and fuel control; start sequence and purge; overspeed and flameout protection; vibration and thermocouple spread monitoring.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Hot Section Metallurgy, Borescope & HGPI', 'Superalloys, coatings, borescope imaging, and inspection work packs (10h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Hot section materials and damage mechanisms', 'Superalloys and coatings; creep, oxidation and thermal fatigue; foreign and domestic object damage; repair and life extension.', 'text', 300, 1),
    (v_mod_id, '6. Borescope and hot gas path inspection (HGPI)', 'Inspection planning and access points; reading borescope images; hot gas path scope and sequence; acceptance criteria and reporting.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Maintenance Strategy and Overhaul Planning', 'EOH calculations, major overhauls, LTSAs, and course review (5h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Maintenance strategy and major overhauls', 'Equivalent operating hours and starts; major overhaul planning; long term service agreements; spares and exchange modules.', 'text', 300, 1);


  -- =========================================================================
  -- COURSE 3: PD04 (Dry gas seals: selection, operation and troubleshooting)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD04' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD04', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Compression and turbomachinery',
      'Dry gas seals: selection, operation and troubleshooting',
      'Dry gas seals keep process gas inside the compressor and are now standard on new machines, yet many seal failures start with poor gas conditioning or wrong operating practice. This course explains how the seals work, how the support panel keeps them healthy and how to diagnose problems before a seal is lost.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Apr 12 to 14, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain the working principle of tandem and double dry gas seals',
        'Describe the role of seal gas, separation gas and conditioning equipment',
        'Interpret primary and secondary vent flows and pressures',
        'Identify causes of seal failure such as liquids, particles and reverse rotation',
        'Apply correct startup, standstill and settle out procedures'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'International oil companies and joint ventures'
      ],
      ARRAY[
        'Trace seal gas flow paths on a real panel drawing',
        'Diagnose four seal failure cases from vent data'
      ],
      ARRAY['API 692', 'API 617', 'API 614'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-04-12 08:30:00+00', '2027-04-14 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 1, category = 'flow_drives', category_id = v_cat_id, subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Dry gas seals: selection, operation and troubleshooting',
      description = 'Dry gas seals keep process gas inside the compressor and are now standard on new machines, yet many seal failures start with poor gas conditioning or wrong operating practice. This course explains how the seals work, how the support panel keeps them healthy and how to diagnose problems before a seal is lost.',
      level = 'intermediate', course_type = 'onsite', duration_hours = 21,
      award = 'Certificate of Attendance', class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Apr 12 to 14, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Explain the working principle of tandem and double dry gas seals',
        'Describe the role of seal gas, separation gas and conditioning equipment',
        'Interpret primary and secondary vent flows and pressures',
        'Identify causes of seal failure such as liquids, particles and reverse rotation',
        'Apply correct startup, standstill and settle out procedures'
      ],
      requirements = ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'International oil companies and joint ventures'
      ],
      practical_work = ARRAY[
        'Trace seal gas flow paths on a real panel drawing',
        'Diagnose four seal failure cases from vent data'
      ],
      standards = ARRAY['API 692', 'API 617', 'API 614'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-04-12 08:30:00+00', end_date = '2027-04-14 16:30:00+00',
      price = 0, is_free = false, is_price_tbd = true, status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Seal Principles and Support Systems', 'Face lift-off aerodynamics, tandem vs double seals, and API 692 panels (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Seal principles and face mechanics', 'Face design and lift off; single, tandem and double arrangements; separation seals and barriers.', 'text', 240, 1),
    (v_mod_id, '2. Seal support systems and API 692 panels', 'Seal gas supply and filtration; heating and conditioning; nitrogen separation gas; API 692 panel layouts.', 'text', 300, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Monitoring, Vents and Alarms', 'Primary and secondary vent behaviors, transmitters, and alarm limits (4h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Monitoring and alarms', 'Primary vent flow and pressure; secondary vent behaviour; alarm and trip settings.', 'text', 240, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Failure Modes, Settle-out and Overhaul', 'Contamination root causes, O-ring hang-up, standstill, and maintenance (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Failure modes and diagnostics', 'Liquid and particle contamination; reverse rotation and pressure reversal; hang up and dynamic O ring problems.', 'text', 240, 1),
    (v_mod_id, '5. Operation, maintenance and settle-out practice', 'Startup and settle out practice; seal replacement and refurbishment; records and seal life tracking.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 4: PD05 (Turbomachinery vibration analysis and rotor dynamics)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD05' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD05', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Compression and turbomachinery',
      'Turbomachinery vibration analysis and rotor dynamics',
      'Vibration is the most informative condition signal on rotating equipment, and rotor dynamics explains why machines behave as they do. This advanced course prepares engineers to collect and analyse vibration data on turbomachinery and to sit a vibration analyst certification examination.',
      v_instructor_id, 'advanced', 'onsite', 35,
      'Exam prep', 'Up to 16 participants',
      'Public sessions: Jul 19 to 23. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Select transducers and set up measurements for proximity and casing vibration',
        'Analyse spectra, waveforms, orbits and phase to identify common faults',
        'Explain critical speeds, damping and stability using rotor dynamic concepts',
        'Interpret startup and coastdown data with Bode and polar plots',
        'Apply ISO severity limits and write clear diagnostic reports'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Power generation, transmission and distribution',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Diagnose faults from a library of real turbomachinery datasets',
        'Interpret a coastdown and locate the first critical speed',
        'Sit a timed mock examination'
      ],
      ARRAY['ISO 18436 2', 'ISO 20816', 'ISO 13373', 'API 670', 'API 684'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-07-19 08:30:00+00', '2027-07-23 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 1, category = 'flow_drives', category_id = v_cat_id, subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Turbomachinery vibration analysis and rotor dynamics',
      description = 'Vibration is the most informative condition signal on rotating equipment, and rotor dynamics explains why machines behave as they do. This advanced course prepares engineers to collect and analyse vibration data on turbomachinery and to sit a vibration analyst certification examination.',
      level = 'advanced', course_type = 'onsite', duration_hours = 35,
      award = 'Exam prep', class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Jul 19 to 23. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Select transducers and set up measurements for proximity and casing vibration',
        'Analyse spectra, waveforms, orbits and phase to identify common faults',
        'Explain critical speeds, damping and stability using rotor dynamic concepts',
        'Interpret startup and coastdown data with Bode and polar plots',
        'Apply ISO severity limits and write clear diagnostic reports'
      ],
      requirements = ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      target_audience = ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Power generation, transmission and distribution',
        'Process industries: refining, petrochemicals, fertiliser, gas processing',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      practical_work = ARRAY[
        'Diagnose faults from a library of real turbomachinery datasets',
        'Interpret a coastdown and locate the first critical speed',
        'Sit a timed mock examination'
      ],
      standards = ARRAY['ISO 18436 2', 'ISO 20816', 'ISO 13373', 'API 670', 'API 684'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-07-19 08:30:00+00', end_date = '2027-07-23 16:30:00+00',
      price = 0, is_free = false, is_price_tbd = true, status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Vibration Fundamentals & Measurement Systems', 'Transducers, proximity probes, accelerometers, and API 670 systems (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Vibration fundamentals', 'Amplitude, frequency and phase; displacement, velocity and acceleration; units and conversions.', 'text', 240, 1),
    (v_mod_id, '2. Measurement systems and instrumentation', 'Proximity probes and accelerometers; machine protection systems; data collection settings.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Signal Analysis, Orbits & Centerline', 'FFT resolution, time waveforms, orbits, and shaft centerline tracking (4h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Signal analysis, FFT and orbit patterns', 'FFT, resolution and windowing; time waveform analysis; orbits and shaft centreline.', 'text', 240, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Fault Diagnosis & Rotor Dynamics', 'Unbalance, misalignment, oil whirl/whip, and critical speeds (9.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Fault diagnosis in turbomachinery', 'Unbalance and misalignment; looseness and rubs; bearing and gear defects; oil whirl and whip.', 'text', 330, 1),
    (v_mod_id, '5. Rotor dynamics and stability', 'Critical speeds and mode shapes; bearing stiffness and damping; stability and logarithmic decrement.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Transient Analysis & Coastdown', 'Bode/polar plots, cascade spectra, and resonance identification (4h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '6. Transient analysis and coastdown testing', 'Bode and polar plots; startup and coastdown data; resonance identification.', 'text', 240, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Standards, Reporting & Certification Prep', 'ISO 20816 limits, report writing, and timed mock examination (8h)', 5)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '7. Standards and reporting', 'ISO 20816 limits; alarm setting; report writing and recommendations.', 'text', 240, 1),
    (v_mod_id, '8. Examination preparation and mock test', 'Category II body of knowledge review; practice questions; calculation drills; timed mock examination.', 'quiz', 240, 2);


  -- =========================================================================
  -- COURSE 5: PD06 (Hydrogen blending in gas turbines and compressors)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD06' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD06', 1, 'flow_drives', v_cat_id, v_subcat_id, 'Compression and turbomachinery',
      'Hydrogen blending in gas turbines and compressors',
      'Operators are blending hydrogen into fuel gas and pipeline gas to cut emissions, and this changes how turbines burn and how compressors perform. The course sets out what changes, what limits apply and how to plan a hydrogen blending project safely.',
      v_instructor_id, 'advanced', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Mar 1 to 3, Sep 13 to 15. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain how hydrogen changes flame speed, flashback risk and emissions in gas turbines',
        'Estimate the effect of hydrogen on compressor head, power and speed',
        'Identify material, sealing and instrumentation issues in hydrogen service',
        'Assess hazardous area and safety implications of hydrogen blends',
        'Outline a staged plan for introducing hydrogen into existing equipment'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Power generation, transmission and distribution',
        'International oil companies and joint ventures',
        'Sustainability, ESG and energy transition teams'
      ],
      ARRAY[
        'Calculate the change in compressor head and power for 10 and 30 percent blends',
        'Run a hazard review on a blending skid layout'
      ],
      ARRAY['ISO 14687', 'IEC 60079 10 1', 'ASME B31.12', 'API 617'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-03-01 08:30:00+00', '2027-03-03 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses SET
      domain_no = 1, category = 'flow_drives', category_id = v_cat_id, subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Hydrogen blending in gas turbines and compressors',
      description = 'Operators are blending hydrogen into fuel gas and pipeline gas to cut emissions, and this changes how turbines burn and how compressors perform. The course sets out what changes, what limits apply and how to plan a hydrogen blending project safely.',
      level = 'advanced', course_type = 'onsite', duration_hours = 21,
      award = 'Certificate of Attendance', class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Mar 1 to 3, Sep 13 to 15. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Explain how hydrogen changes flame speed, flashback risk and emissions in gas turbines',
        'Estimate the effect of hydrogen on compressor head, power and speed',
        'Identify material, sealing and instrumentation issues in hydrogen service',
        'Assess hazardous area and safety implications of hydrogen blends',
        'Outline a staged plan for introducing hydrogen into existing equipment'
      ],
      requirements = ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      target_audience = ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Power generation, transmission and distribution',
        'International oil companies and joint ventures',
        'Sustainability, ESG and energy transition teams'
      ],
      practical_work = ARRAY[
        'Calculate the change in compressor head and power for 10 and 30 percent blends',
        'Run a hazard review on a blending skid layout'
      ],
      standards = ARRAY['ISO 14687', 'IEC 60079 10 1', 'ASME B31.12', 'API 617'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-03-01 08:30:00+00', end_date = '2027-03-03 16:30:00+00',
      price = 0, is_free = false, is_price_tbd = true, status = 'published'
    WHERE id = v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Hydrogen Properties & Combustion', 'Heating value, Wobbe index, flame speeds, and flashback dynamics (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Hydrogen properties and combustion kinetics', 'Density, heating value and Wobbe index; flammability and ignition energy; embrittlement.', 'text', 240, 1),
    (v_mod_id, '2. Gas turbine combustion with hydrogen', 'Flashback and dynamics; NOx effects; OEM blend limits and upgrades.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Compression of Hydrogen Blends', 'Molar mass shifts, centrifugal vs reciprocating machines, and sealing (4h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Compression of hydrogen blends', 'Head and speed requirements; reciprocating versus centrifugal; seal and leakage issues.', 'text', 240, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Metallurgy, Safety & Project Planning', 'Materials, hazardous areas, blending skids, and rollout milestones (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Materials, safety and hazardous areas', 'Material selection; gas group IIC equipment; detection and ventilation.', 'text', 240, 1),
    (v_mod_id, '5. Project planning and blending skid layout', 'Feasibility and testing; fuel blending skids; monitoring and approval steps.', 'text', 240, 2);

END $$;
