-- =============================================================================
-- Migration: 20270101000039_seed_course_ad10.sql
-- Description: Seed Domain 3 (Integrated automation and digital operations) course AD10
--              AD10: Real time historians and operational data management
-- =============================================================================

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_digital_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
BEGIN
  -- 1. Resolve Category (Integrated automation and digital operations)
  SELECT id INTO v_cat_id
  FROM public.course_categories
  WHERE slug = 'integrated-automation-and-digital-operations'
  LIMIT 1;

  -- 2. Resolve Subcategory (Digital operations and plant intelligence)
  SELECT id INTO v_subcat_digital_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_id AND slug = 'digital-operations-and-plant-intelligence'
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
  -- COURSE: AD10 (Real time historians and operational data management)
  -- =========================================================================
  v_course_id := 'c3100000-0000-0000-0000-000000000010';
  v_mod1_id := 'd3100001-0000-0000-0000-000000000001';
  v_mod2_id := 'd3100001-0000-0000-0000-000000000002';
  v_mod3_id := 'd3100001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'AD10', 3, 'instrumentation_automation', v_cat_id, v_subcat_digital_id, 'Digital operations and plant intelligence',
    'Real time historians and operational data management',
    'Plant historians hold years of process data, yet most engineers use them only to look at a trend after a trip. This course shows how historians store data, how to keep that data trustworthy, and how to build calculations, event records and dashboards that support daily decisions.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, May 10 to 12, Sep 6 to 8. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe historian architecture, interfaces and data compression',
      'Improve tag naming, metadata and data quality',
      'Build calculated tags, event frames and asset hierarchies',
      'Design dashboards that operators and managers actually use',
      'Use historian data to investigate trips and performance losses'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Build an asset hierarchy and dashboard for a compressor station',
      'Investigate a unit trip using historian trends and event frames',
      'Fix compression settings that hide a fault'
    ],
    ARRAY['ISA 95', 'IEC 62443 3 3', 'ISO 8000'],
    ARRAY['Siemens', 'HIMA', 'Avanceon', 'Valmet', 'Thomassen Energy'],
    '2027-01-18 08:30:00+00', '2027-01-20 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Historian Architecture & Data Quality', 1),
    (v_mod2_id, v_course_id, 'Day 2: Calculations & Operational Events', 2),
    (v_mod3_id, v_course_id, 'Day 3: Dashboards, Reporting & Troubleshooting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e3100001-0001-0000-0000-000000000001', v_mod1_id, '1. Historian architecture', 'Interfaces and collectors; Compression and exception settings; Redundancy and buffering', 'text', 240, 1, false),
    ('e3100001-0001-0000-0000-000000000002', v_mod1_id, '2. Data quality and structure', 'Tag naming conventions; Asset frameworks and metadata; Data validation and gaps', 'text', 240, 2, false),
    ('e3100001-0002-0000-0000-000000000001', v_mod2_id, '3. Calculations and events', 'Calculated tags; Event frames for batches, trips and downtime; Notifications', 'text', 240, 1, false),
    ('e3100001-0003-0000-0000-000000000001', v_mod3_id, '4. Dashboards and reporting', 'Dashboard design principles; KPI reports; Sharing data securely', 'text', 240, 1, false),
    ('e3100001-0003-0000-0000-000000000002', v_mod3_id, '5. Troubleshooting with data', 'Trip investigation; Performance loss tracking; Exporting data for analysis', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
