-- =============================================================================
-- Migration: 20270101000038_seed_course_va06.sql
-- Description: Seed Domain 2 (Valves and actuation) course VA06
--              VA06: Cavitation, flashing and noise in control valves
-- =============================================================================

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_ctrl_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
BEGIN
  -- 1. Resolve Category (Valves and actuation) & Subcategory (High performance control)
  SELECT id INTO v_cat_id
  FROM public.course_categories
  WHERE slug = 'valves-and-actuation'
  LIMIT 1;

  SELECT id INTO v_subcat_ctrl_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_id AND slug = 'high-performance-control'
  LIMIT 1;

  -- 2. Resolve Instructor Profile
  SELECT id INTO v_instructor_id
  FROM auth.users
  WHERE email LIKE '%pana%' OR email LIKE '%admin%'
  LIMIT 1;

  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE: VA06 (Cavitation, flashing and noise in control valves)
  -- =========================================================================
  v_course_id := 'c4060000-0000-0000-0000-000000000006';
  v_mod1_id := 'd2060001-0000-0000-0000-000000000001';
  v_mod2_id := 'd2060001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'VA06', 2, 'flow_control', v_cat_id, v_subcat_ctrl_id, 'High performance control',
    'Cavitation, flashing and noise in control valves',
    'Cavitation, flashing and noise destroy valve trims and piping and breach workplace noise limits. This short advanced course explains the physics and the trim and system solutions that work.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 8 to 9, Jun 21 to 22, Oct 4 to 5. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain cavitation, flashing and aerodynamic noise mechanisms',
      'Predict the onset of cavitation and noise levels',
      'Select anti cavitation and low noise trims',
      'Recommend system changes that reduce damage',
      'Review vendor proposals for severe pressure drop duties'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Assess four valve duties for cavitation and noise and recommend solutions',
      'Review a vendor offer for a high pressure drop valve'
    ],
    ARRAY['IEC 60534 8 3', 'IEC 60534 8 4', 'ISA RP75.23'],
    ARRAY['Mokveld', 'Neway Valve', 'Rotork', 'Valmet', 'Multi-Instrument'],
    '2027-02-08 08:30:00+00', '2027-02-09 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Physics of Damage & Prediction Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Trim Solutions & System Architecture', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e2060001-0001-0000-0000-000000000001', v_mod1_id, '1. Physics of damage', 'Vapour pressure and pressure recovery; Cavitation stages; Flashing', 'text', 210, 1, false),
    ('e2060001-0001-0000-0000-000000000002', v_mod1_id, '2. Prediction methods', 'Sigma and FL methods; IEC noise prediction; Limits', 'text', 210, 2, false),
    ('e2060001-0002-0000-0000-000000000001', v_mod2_id, '3. Trim solutions', 'Multi stage and multi path trims; Diffusers and silencers; Materials', 'text', 210, 1, false),
    ('e2060001-0002-0000-0000-000000000002', v_mod2_id, '4. System solutions', 'Staging pressure drop; Piping changes; Vendor review', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
