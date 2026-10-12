-- Seed Migration: Publish Course PD01 (Centrifugal compressor operation, performance and surge control)
-- PANA Institute Academic Catalog 2027

-- Ensure industrial metadata columns exist and allow modern category_id
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS standards TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS oem_partners TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS award TEXT DEFAULT 'Certificate of Attendance',
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS practical_work TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS class_size TEXT,
ADD COLUMN IF NOT EXISTS delivery_options TEXT;

-- Make legacy category column optional if present
DO $$
BEGIN
  ALTER TABLE public.courses ALTER COLUMN category DROP NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

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
  
  -- If category not found by slug, create or find by domain_no
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

  -- Fallback if no profiles exist yet
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- 3. Check if Course PD01 already exists
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD01' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code,
      domain_no,
      category,
      category_id,
      subcategory_id,
      course_area,
      title,
      description,
      instructor_id,
      level,
      course_type,
      duration_hours,
      award,
      class_size,
      delivery_options,
      learning_outcomes,
      requirements,
      target_audience,
      practical_work,
      standards,
      oem_partners,
      start_date,
      end_date,
      price,
      is_free,
      status
    )
    VALUES (
      'PD01',
      1,
      'flow_drives',
      v_cat_id,
      v_subcat_id,
      'Compression and turbomachinery',
      'Centrifugal compressor operation, performance and surge control',
      'Centrifugal compressors move most of the gas in upstream, midstream and process plants, and most of their trips trace back to operation near surge, fouling or poor control. This course explains how the machine behaves on its performance map, how anti surge control protects it, and how operators and engineers read the signs before a trip.',
      v_instructor_id,
      'intermediate',
      'onsite',
      35,
      'Certificate of Competence',
      'Up to 16 participants',
      'Public sessions: Mar 8 to 12, Sep 13 to 17. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Read a compressor performance map and locate the operating point, surge line and stonewall',
        'Explain how gas composition, suction conditions and speed shift compressor performance',
        'Describe anti surge and performance control loops and set them up correctly',
        'Recognise early signs of fouling, seal and bearing problems from process and condition data',
        'Carry out safe startup, loading, unloading and shutdown sequences'
      ],
      ARRAY[
        'Working knowledge of plant operations or two years of relevant experience.'
      ],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'International oil companies and joint ventures',
        'Process industries: refining, petrochemicals, fertiliser, gas processing'
      ],
      ARRAY[
        'Plot a train''s operating point and surge margin from a day of plant data',
        'Tune an anti surge loop on a dynamic simulator and test a fast stop',
        'Diagnose three trip scenarios from historian trends and alarm logs'
      ],
      ARRAY['API 617', 'API 614', 'API 692', 'ASME PTC 10'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-03-08 08:30:00+00',
      '2027-03-12 16:30:00+00',
      0,
      false,
      'published'
    )
    RETURNING id INTO v_course_id;
  ELSE
    UPDATE public.courses
    SET
      domain_no = 1,
      category = 'flow_drives',
      category_id = v_cat_id,
      subcategory_id = v_subcat_id,
      course_area = 'Compression and turbomachinery',
      title = 'Centrifugal compressor operation, performance and surge control',
      description = 'Centrifugal compressors move most of the gas in upstream, midstream and process plants, and most of their trips trace back to operation near surge, fouling or poor control. This course explains how the machine behaves on its performance map, how anti surge control protects it, and how operators and engineers read the signs before a trip.',
      level = 'intermediate',
      course_type = 'onsite',
      duration_hours = 35,
      award = 'Certificate of Competence',
      class_size = 'Up to 16 participants',
      delivery_options = 'Public sessions: Mar 8 to 12, Sep 13 to 17. Venue and fee TBD. In house dates on request.',
      learning_outcomes = ARRAY[
        'Read a compressor performance map and locate the operating point, surge line and stonewall',
        'Explain how gas composition, suction conditions and speed shift compressor performance',
        'Describe anti surge and performance control loops and set them up correctly',
        'Recognise early signs of fouling, seal and bearing problems from process and condition data',
        'Carry out safe startup, loading, unloading and shutdown sequences'
      ],
      requirements = ARRAY[
        'Working knowledge of plant operations or two years of relevant experience.'
      ],
      target_audience = ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Oil and gas operators and service companies',
        'International oil companies and joint ventures',
        'Process industries: refining, petrochemicals, fertiliser, gas processing'
      ],
      practical_work = ARRAY[
        'Plot a train''s operating point and surge margin from a day of plant data',
        'Tune an anti surge loop on a dynamic simulator and test a fast stop',
        'Diagnose three trip scenarios from historian trends and alarm logs'
      ],
      standards = ARRAY['API 617', 'API 614', 'API 692', 'ASME PTC 10'],
      oem_partners = ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      start_date = '2027-03-08 08:30:00+00',
      end_date = '2027-03-12 16:30:00+00',
      status = 'published'
    WHERE id = v_course_id;
  END IF;

  -- 4. Insert Syllabus Modules & Topics
  -- Clean existing modules if re-seeding
  DELETE FROM public.modules WHERE course_id = v_course_id;

  -- DAY 1
  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Compressor Fundamentals', 'Thermodynamics, head, flow, impeller design, and casing configurations (5h)', 1)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index)
  VALUES 
    (v_mod_id, 'Gas laws and compression thermodynamics', 'Gas laws, ideal vs real gas equations, compressibility factor Z, and thermodynamic processes.', 'text', 75, 1),
    (v_mod_id, 'Head, flow, efficiency and power calculations', 'Polytropic and isentropic equations, calculating required shaft power and head.', 'text', 75, 2),
    (v_mod_id, 'Impeller, diffuser and casing mechanical design', 'Open vs closed impellers, vaned vs vaneless diffusers, and volute geometries.', 'text', 75, 3),
    (v_mod_id, 'Single shaft vs. integrally geared machines', 'Multi-stage barrel compressors vs high-speed integrally geared pinions.', 'text', 75, 4);

  -- DAY 2
  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Performance Maps, Surge and Stonewall', 'Plotting operating points, fan laws, surge dynamics, and choke limits (10h)', 2)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index)
  VALUES 
    (v_mod_id, 'Polytropic and isentropic head; Fan laws and speed effects', 'Understanding speed variations, affinity laws, and steepness of head-flow curves.', 'text', 90, 1),
    (v_mod_id, 'Effect of gas molecular weight and suction temperature', 'How gas density, molar mass shifts, and inlet throttling alter the performance map.', 'text', 90, 2),
    (v_mod_id, 'Plotting the operating point from live plant DCS data', 'Real-time flow coefficient calculation and positioning on OEM curves.', 'text', 90, 3),
    (v_mod_id, 'Physics of surge and rotating stall in rotors and seals', 'Aerodynamic flow reversal, pressure pulsations, and thrust bearing loading during surge.', 'text', 90, 4),
    (v_mod_id, 'Surge margin, control line, choke and stonewall limits', 'Safety margin definition, surge control line (SCL), and sonic velocity choking.', 'text', 90, 5);

  -- DAY 3
  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Anti Surge and Performance Control', 'Recycle valve sizing, controller algorithms, and load sharing (5h)', 3)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index)
  VALUES 
    (v_mod_id, 'Recycle valve sizing, response times, and fast-stop tests', 'Cv sizing, noise attenuation, actuator stroking speed (< 1.5s), and positioner tuning.', 'text', 75, 1),
    (v_mod_id, 'Anti-surge controller algorithms and set point tuning', 'PID + open-loop quick response bias, invariant coordinate systems.', 'text', 75, 2),
    (v_mod_id, 'Load sharing between parallel compression trains', 'Balancing mass flow, equalizing distance to surge across multiple trains.', 'text', 75, 3),
    (v_mod_id, 'Valve stroke testing and dynamic loop tuning', 'Proof testing anti-surge valves without disturbing process production.', 'text', 75, 4);

  -- DAY 4
  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Auxiliary Systems & Troubleshooting', 'Lube oil, dry gas seals, scrubbers, trip logic, and fault finding (10h)', 4)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index)
  VALUES 
    (v_mod_id, 'Lube and seal oil systems; Dry gas seal support panels', 'API 614 lubrication consoles, API 692 dry gas seal seal gas conditioning and separation.', 'text', 90, 1),
    (v_mod_id, 'Suction scrubbers, coolers, and trip logic interlocks', 'Liquid carryover protection, demister pads, high liquid level trip logic.', 'text', 90, 2),
    (v_mod_id, 'Safe startup, loading, unloading, and shutdown procedures', 'Pressurization, settle-out pressure calculation, bypass opening, and warm-up.', 'text', 90, 3),
    (v_mod_id, 'Fouling, online washing, and performance recovery techniques', 'Compressor wash systems, solvent injection, and aerodynamic loss recovery.', 'text', 90, 4),
    (v_mod_id, 'Trip root cause analysis from historian trends & alarm logs', 'Step-by-step diagnostic methodology for spurious vs true protective trips.', 'text', 90, 5);

  -- DAY 5
  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 5: Performance Monitoring & Assessment', 'ASME PTC 10 testing, efficiency tracking, and certification exam (5h)', 5)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index)
  VALUES 
    (v_mod_id, 'Field performance testing according to ASME PTC 10 principles', 'Type 1 and Type 2 test compliance, instrumentation accuracy, and test execution.', 'text', 90, 1),
    (v_mod_id, 'Efficiency tracking and degradation trending', 'Polytropic efficiency decay, intercooler fouling, and seal clearance degradation.', 'text', 90, 2),
    (v_mod_id, 'Practical demonstration and Certificate of Competence exam', 'Written assessment and simulated compressor surge trip diagnostic exam.', 'quiz', 90, 3);

END $$;
