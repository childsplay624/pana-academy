-- =============================================================================
-- Migration: 20270101000041_seed_courses_pr01_pr02.sql
-- Description: Seed Domain 7 (Production) courses PR01 and PR02:
--              PR01: Enhanced oil recovery screening and design
--              PR02: Waterflood management and surveillance
-- =============================================================================

DO $$
DECLARE
  v_cat_pr_id UUID;
  v_subcat_eor_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 7 (Production)
  SELECT id INTO v_cat_pr_id
  FROM public.course_categories
  WHERE slug = 'production' OR domain_no = 7
  LIMIT 1;

  -- 2. Resolve Subcategory: Enhanced oil recovery (EOR)
  SELECT id INTO v_subcat_eor_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_pr_id AND slug = 'enhanced-oil-recovery-eor'
  LIMIT 1;

  -- 3. Resolve Instructor Profile
  SELECT id INTO v_instructor_id
  FROM auth.users
  WHERE email LIKE '%pana%' OR email LIKE '%admin%'
  LIMIT 1;

  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE 1: PR01 (Enhanced oil recovery screening and design)
  -- =========================================================================
  v_course_id := 'cf010000-0000-0000-0000-000000000001';
  v_mod1_id := 'df010001-0000-0000-0000-000000000001';
  v_mod2_id := 'df010001-0000-0000-0000-000000000002';
  v_mod3_id := 'df010001-0000-0000-0000-000000000003';
  v_mod4_id := 'df010001-0000-0000-0000-000000000004';
  v_mod5_id := 'df010001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR01', 7, 'general_technical', v_cat_pr_id, v_subcat_eor_id, 'Enhanced oil recovery (EOR)',
    'Enhanced oil recovery screening and design',
    'Enhanced oil recovery can add a large share of the oil left behind after primary and waterflood recovery, but only when the method matches the reservoir and the economics hold. This advanced course covers EOR screening, thermal, gas and chemical methods, pilot design and project economics.',
    v_instructor_id, 'advanced', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 26. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Screen reservoirs for EOR using rock, fluid and operating criteria',
      'Explain displacement mechanisms for thermal, gas and chemical methods',
      'Design laboratory and field pilot programmes',
      'Model EOR performance and estimate incremental recovery',
      'Build an EOR business case with risks and costs'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Screen five Nigerian reservoirs for EOR and rank methods',
      'Design a polymer pilot with monitoring plan',
      'Build a simple EOR economic model'
    ],
    ARRAY['SPE EOR screening criteria', 'API RP 63', 'SPE PRMS'],
    ARRAY['AECI', 'Oil Dynamix (project specific)', 'AUPCLLC (project specific)', 'ITT Bornemann (multiphase pumping)', 'Xylem (water treatment)'],
    '2027-03-22 08:30:00+00', '2027-03-26 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Recovery Fundamentals & EOR Mechanisms', 1),
    (v_mod2_id, v_course_id, 'Day 2: EOR Screening & Gas Injection Methods', 2),
    (v_mod3_id, v_course_id, 'Day 3: Chemical EOR Methods & Formulations', 3),
    (v_mod4_id, v_course_id, 'Day 4: Thermal Methods, Pilot Design & Modelling', 4),
    (v_mod5_id, v_course_id, 'Day 5: Economics, Risk & Phased Implementation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef010001-0001-0000-0000-000000000001', v_mod1_id, '1. Recovery fundamentals', 'Displacement efficiency; Sweep efficiency; Residual oil', 'text', 420, 1, false),
    ('ef010001-0002-0000-0000-000000000001', v_mod2_id, '2. EOR screening', 'Screening criteria; Analogue databases; Data gaps', 'text', 210, 1, false),
    ('ef010001-0002-0000-0000-000000000002', v_mod2_id, '3. Gas methods', 'Miscible and immiscible gas; WAG; CO2 and hydrocarbon gas', 'text', 210, 2, false),
    ('ef010001-0003-0000-0000-000000000001', v_mod3_id, '4. Chemical methods', 'Polymer flooding; Surfactant and alkaline methods; Low salinity water', 'text', 420, 1, false),
    ('ef010001-0004-0000-0000-000000000001', v_mod4_id, '5. Thermal methods', 'Steam injection; In situ combustion; Applicability in Africa', 'text', 210, 1, false),
    ('ef010001-0004-0000-0000-000000000002', v_mod4_id, '6. Pilot design and modelling', 'Laboratory tests; Pilot layouts; Simulation', 'text', 210, 2, false),
    ('ef010001-0005-0000-0000-000000000001', v_mod5_id, '7. Economics and implementation', 'Costs and incremental oil; Risks; Phased development', 'text', 420, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: PR02 (Waterflood management and surveillance)
  -- =========================================================================
  v_course_id := 'cf020000-0000-0000-0000-000000000002';
  v_mod1_id := 'df020001-0000-0000-0000-000000000001';
  v_mod2_id := 'df020001-0000-0000-0000-000000000002';
  v_mod3_id := 'df020001-0000-0000-0000-000000000003';
  v_mod4_id := 'df020001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR02', 7, 'general_technical', v_cat_pr_id, v_subcat_eor_id, 'Enhanced oil recovery (EOR)',
    'Waterflood management and surveillance',
    'Waterflooding is the most common secondary recovery method, and its performance depends on how well injection and production are managed day to day. This course covers waterflood design, surveillance and optimisation.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 8 to 11, Aug 16 to 19. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain waterflood displacement and sweep',
      'Design injection patterns and rates',
      'Use surveillance tools such as Hall plots and voidage replacement',
      'Diagnose injectivity loss, early breakthrough and channelling',
      'Optimise injection allocation across a field'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build Hall and Chan plots from field data and diagnose problems',
      'Reallocate injection across a pattern to improve sweep'
    ],
    ARRAY['SPE waterflood monographs', 'API RP 63', 'NACE SP0499'],
    ARRAY['AECI', 'Oil Dynamix (project specific)', 'AUPCLLC (project specific)', 'ITT Bornemann (multiphase pumping)', 'Xylem (water treatment)'],
    '2027-02-08 08:30:00+00', '2027-02-11 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Waterflood Fundamentals & Pattern Design', 1),
    (v_mod2_id, v_course_id, 'Day 2: Surveillance Tools & Diagnostic Plots', 2),
    (v_mod3_id, v_course_id, 'Day 3: Problems, Injectivity Loss & Diagnosis', 3),
    (v_mod4_id, v_course_id, 'Day 4: Injection Optimisation & Case Studies', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef020001-0001-0000-0000-000000000001', v_mod1_id, '1. Waterflood fundamentals', 'Fractional flow; Mobility ratio; Sweep', 'text', 210, 1, false),
    ('ef020001-0001-0000-0000-000000000002', v_mod1_id, '2. Design', 'Pattern selection; Water quality; Injection pressure limits', 'text', 210, 2, false),
    ('ef020001-0002-0000-0000-000000000001', v_mod2_id, '3. Surveillance', 'Voidage replacement; Hall plots; Chan plots', 'text', 420, 1, false),
    ('ef020001-0003-0000-0000-000000000001', v_mod3_id, '4. Problems and diagnosis', 'Injectivity loss; Channelling; Water cut increase', 'text', 420, 1, false),
    ('ef020001-0004-0000-0000-000000000001', v_mod4_id, '5. Optimisation', 'Injection allocation; Conformance control; Infill drilling', 'text', 210, 1, false),
    ('ef020001-0004-0000-0000-000000000002', v_mod4_id, '6. Case studies', 'Field examples; Lessons learned', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
