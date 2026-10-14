-- =============================================================================
-- Migration: 20270101000044_correct_mm10_course_details.sql
-- Description: Correct MM10 (Pressure, temperature and level instrumentation in practice)
--              to match brochure page:
--              - Level: Foundation ('beginner')
--              - Award: 'Certificate of Competence' ('Competence')
--              - Duration: 4 days (28 hours)
--              - Dates: Feb 8 to 11, Aug 23 to 26
--              - Subcategory: Level, pressure and temperature instrumentation
--              - Clean modules (4) and lessons (6)
-- =============================================================================

DO $$
DECLARE
  v_cat_mm_id UUID;
  v_subcat_instr_id UUID;
  v_course_id UUID := 'ca100000-0000-0000-0000-000000000010';
  v_mod1_id UUID := 'da100001-0000-0000-0000-000000000001';
  v_mod2_id UUID := 'da100001-0000-0000-0000-000000000002';
  v_mod3_id UUID := 'da100001-0000-0000-0000-000000000003';
  v_mod4_id UUID := 'da100001-0000-0000-0000-000000000004';
BEGIN
  -- Category: Measurement and management
  SELECT id INTO v_cat_mm_id
  FROM public.course_categories
  WHERE slug = 'measurement-and-management' OR domain_no = 4
  LIMIT 1;

  -- Subcategory: Level, pressure and temperature instrumentation
  SELECT id INTO v_subcat_instr_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_mm_id AND slug = 'level-pressure-and-temperature-instrumentation'
  LIMIT 1;

  -- 1. Update MM10 course record
  UPDATE public.courses
  SET
    domain_no = 4,
    category = 'flow_measurement',
    category_id = v_cat_mm_id,
    subcategory_id = v_subcat_instr_id,
    course_area = 'Level, pressure and temperature instrumentation',
    title = 'Pressure, temperature and level instrumentation in practice',
    description = 'Pressure, temperature and level instruments are the most common measurements in any plant. This foundation competence course teaches technicians how these instruments work, how to install and calibrate them, and how to recognise faults.',
    level = 'beginner',
    duration_hours = 28,
    award = 'Certificate of Competence',
    delivery_options = 'Public sessions: Feb 8 to 11, Aug 23 to 26. Venue and fee TBD. In house dates on request.',
    start_date = '2027-02-08 08:30:00+00',
    end_date = '2027-02-11 16:30:00+00',
    learning_outcomes = ARRAY[
      'Explain pressure, temperature and level measurement principles',
      'Install and connect transmitters, thermowells and level devices correctly',
      'Calibrate common instruments and record results',
      'Recognise and correct common installation and measurement faults',
      'Work safely on instruments in live plants'
    ],
    requirements = ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    target_audience = ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining'
    ],
    practical_work = ARRAY[
      'Calibrate pressure and temperature transmitters on the bench',
      'Commission a radar level transmitter on a tank rig',
      'Find faults in impulse line installations'
    ],
    standards = ARRAY['ISA 51.1', 'IEC 61298', 'IEC 60751', 'IEC 60584'],
    oem_partners = ARRAY['Agar Corporation', 'Solartron ISA', 'Multi-Instrument']
  WHERE id = v_course_id;

  -- 2. Remove any stray or misassociated lessons from previous collision
  DELETE FROM public.lessons
  WHERE id = 'ea100001-0002-0000-0000-000000000002';

  -- 3. Upsert clean modules
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Pressure & Temperature Measurement', 1),
    (v_mod2_id, v_course_id, 'Day 2: Level Measurement', 2),
    (v_mod3_id, v_course_id, 'Day 3: Installation Practice', 3),
    (v_mod4_id, v_course_id, 'Day 4: Fault Finding & Practical Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  -- 4. Upsert clean lessons
  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea100001-0001-0000-0000-000000000001', v_mod1_id, '1. Pressure measurement', 'Gauges, switches and transmitters; Impulse lines and manifolds; Calibration', 'text', 270, 1, false),
    ('ea100001-0001-0000-0000-000000000002', v_mod1_id, '2. Temperature measurement', 'Thermocouples and RTDs; Thermowells; Calibration', 'text', 270, 2, false),
    ('ea100001-0002-0000-0000-000000000001', v_mod2_id, '3. Level measurement', 'DP and displacer; Radar and guided wave; Interface level', 'text', 420, 1, false),
    ('ea100001-0003-0000-0000-000000000001', v_mod3_id, '4. Installation practice', 'Mounting and tubing; Hazardous area points; Isolation for work', 'text', 420, 1, false),
    ('ea100001-0004-0000-0000-000000000001', v_mod4_id, '5. Fault finding', 'Plugged lines; Drift; Wiring faults', 'text', 270, 1, false),
    ('ea100001-0004-0000-0000-000000000002', v_mod4_id, '6. Practical assessment', 'Calibration task; Fault task; Written test', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
