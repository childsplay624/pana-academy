-- Migration: Seed Courses SC10 to SC14
-- Domain 10: Supply chain management
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_sc_id UUID;
  v_subcat_proc_id UUID;
  v_subcat_logistics_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 10
  SELECT id INTO v_cat_sc_id FROM public.course_categories WHERE slug = 'supply-chain-management' OR domain_no = 10 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_proc_id FROM public.course_subcategories WHERE category_id = v_cat_sc_id AND slug = 'procurement-and-contracting' LIMIT 1;
  IF v_subcat_proc_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_sc_id, 'Procurement and contracting', 'procurement-and-contracting', 2)
    RETURNING id INTO v_subcat_proc_id;
  END IF;

  SELECT id INTO v_subcat_logistics_id FROM public.course_subcategories WHERE category_id = v_cat_sc_id AND slug = 'logistics-warehousing-and-inventory-optimisation' LIMIT 1;
  IF v_subcat_logistics_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_sc_id, 'Logistics, warehousing and inventory optimisation', 'logistics-warehousing-and-inventory-optimisation', 3)
    RETURNING id INTO v_subcat_logistics_id;
  END IF;

  -- 3. Resolve Instructor Profile
  SELECT id INTO v_instructor_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM public.profiles LIMIT 1;
  END IF;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;

  -- =========================================================================
  -- COURSE 1: SC10 (Public procurement for energy projects)
  -- =========================================================================
  v_course_id := 'c1010000-0000-0000-0000-000000000010';
  v_mod1_id := 'd1010001-0000-0000-0000-000000000001';
  v_mod2_id := 'd1010001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC10', 10, 'general_technical', v_cat_sc_id, v_subcat_proc_id, 'Procurement and contracting',
    'Public procurement for energy projects',
    'Ministries, agencies and state companies procure power plants, pipelines, grid equipment and services under public procurement law, and poor procurement leads to stalled projects and audit queries. This executive course covers how to plan and run energy procurement that delivers value for money with transparency.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Aug 23 to 24. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the Public Procurement Act and Bureau of Public Procurement requirements',
      'Choose procurement methods for energy works, goods and services',
      'Set evaluation criteria that balance price, quality and lifecycle cost',
      'Manage integrity, conflicts of interest and complaints',
      'Oversee contract delivery and audit readiness'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Evaluate bids for a public mini grid tender',
      'Review a procurement file for audit readiness'
    ],
    ARRAY['Public Procurement Act 2007', 'UNCITRAL Model Law on Public Procurement', 'OECD Recommendation on Public Procurement'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-08-23 08:30:00+00', '2027-08-24 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Legal & Institutional Framework, Planning & Procurement Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Evaluation, Award Criteria, Integrity & Delivery Auditing', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e1010001-0001-0000-0000-000000000001', v_mod1_id, '1. Legal and institutional framework', 'Public Procurement Act 2007; BPP thresholds and approvals; PPP and concession rules', 'text', 210, 1, false),
    ('e1010001-0001-0000-0000-000000000002', v_mod1_id, '2. Planning and methods', 'Needs and budgets; Open, selective and direct methods; Framework agreements', 'text', 210, 2, false),
    ('e1010001-0002-0000-0000-000000000001', v_mod2_id, '3. Evaluation and award', 'Value for money; Lifecycle cost; Technical and financial evaluation', 'text', 210, 1, false),
    ('e1010001-0002-0000-0000-000000000002', v_mod2_id, '4. Integrity and delivery', 'Transparency; Complaints; Contract monitoring and audit', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: SC11 (Oil and gas logistics: marine, aviation and land)
  -- =========================================================================
  v_course_id := 'ca110000-0000-0000-0000-000000000010';
  v_mod1_id := 'da110001-0000-0000-0000-000000000001';
  v_mod2_id := 'da110001-0000-0000-0000-000000000002';
  v_mod3_id := 'da110001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC11', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'Oil and gas logistics: marine, aviation and land',
    'Oil and gas operations depend on marine, aviation and road logistics to move people and materials to remote and offshore sites. This course covers planning, safety and cost control across these modes.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 5 to 7, Oct 18 to 20. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Plan integrated logistics for onshore and offshore operations',
      'Manage marine vessel and aviation services',
      'Plan road transport with journey management',
      'Control logistics costs with demand planning and sharing',
      'Apply logistics safety standards'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build a weekly logistics plan for an offshore field',
      'Optimise vessel sharing between two operators'
    ],
    ARRAY['IOGP 590', 'IOGP 365', 'IOGP Report 690', 'GOMO guidelines'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-04-05 08:30:00+00', '2027-04-07 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Logistics Planning & Marine Operations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Aviation Logistics & Helicopter Operations', 2),
    (v_mod3_id, v_course_id, 'Day 3: Land Transport & Cost Optimization', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea110001-0001-0000-0000-000000000001', v_mod1_id, '1. Logistics planning', 'Demand forecasting; Shore bases; Integrated planning', 'text', 240, 1, false),
    ('ea110001-0001-0000-0000-000000000002', v_mod1_id, '2. Marine logistics', 'Vessel types; Deck cargo; Vessel sharing', 'text', 240, 2, false),
    ('ea110001-0002-0000-0000-000000000001', v_mod2_id, '3. Aviation logistics', 'Helicopter operations; Passenger management; Safety', 'text', 240, 1, false),
    ('ea110001-0003-0000-0000-000000000001', v_mod3_id, '4. Land logistics', 'Journey management; Convoys and security; Driver standards', 'text', 240, 1, false),
    ('ea110001-0003-0000-0000-000000000002', v_mod3_id, '5. Cost and performance', 'KPIs; Contracts; Optimisation', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: SC12 (Warehouse management and WMS implementation)
  -- =========================================================================
  v_course_id := 'ca120000-0000-0000-0000-000000000010';
  v_mod1_id := 'da120001-0000-0000-0000-000000000001';
  v_mod2_id := 'da120001-0000-0000-0000-000000000002';
  v_mod3_id := 'da120001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC12', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'Warehouse management and WMS implementation',
    'A well run warehouse keeps the right items available and traceable, and a warehouse management system can transform it. This course covers warehouse operations and WMS implementation.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 19 to 21. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Design warehouse layouts and storage methods',
      'Run receiving, put away, picking and issue processes',
      'Control stock accuracy with cycle counting',
      'Specify and implement a WMS',
      'Measure warehouse performance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Redesign a stores layout for faster picking',
      'Write WMS requirements for an MRO store'
    ],
    ARRAY['ISO 9001', 'ISO 28000', 'GS1 standards'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-01-11 08:30:00+00', '2027-01-13 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Warehouse Design & Operations', 1),
    (v_mod2_id, v_course_id, 'Day 2: Stock Accuracy & Inventory Counting', 2),
    (v_mod3_id, v_course_id, 'Day 3: WMS Implementation & Performance Management', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea120001-0001-0000-0000-000000000001', v_mod1_id, '1. Warehouse design', 'Layout; Storage media; Slotting', 'text', 270, 1, false),
    ('ea120001-0001-0000-0000-000000000002', v_mod1_id, '2. Warehouse processes', 'Receiving; Put away; Picking and issue', 'text', 270, 2, false),
    ('ea120001-0002-0000-0000-000000000001', v_mod2_id, '3. Stock accuracy', 'Cycle counting; Variance analysis; Controls', 'text', 270, 1, false),
    ('ea120001-0003-0000-0000-000000000001', v_mod3_id, '4. WMS implementation', 'Requirements; Barcoding and RFID; Go live', 'text', 270, 1, false),
    ('ea120001-0003-0000-0000-000000000002', v_mod3_id, '5. Performance', 'KPIs; Safety and housekeeping', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: SC13 (Inventory analytics and demand forecasting)
  -- =========================================================================
  v_course_id := 'ca130000-0000-0000-0000-000000000010';
  v_mod1_id := 'da130001-0000-0000-0000-000000000001';
  v_mod2_id := 'da130001-0000-0000-0000-000000000002';
  v_mod3_id := 'da130001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC13', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'Inventory analytics and demand forecasting',
    'Inventory analytics and forecasting cut stock while improving availability, but MRO demand is lumpy and needs special methods. This course teaches practical forecasting and analytics for intermittent spares demand.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 15 to 17, Jun 28 to 30, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Analyse demand patterns and classify items',
      'Apply forecasting methods suited to intermittent demand',
      'Measure forecast accuracy and bias',
      'Link forecasts to stock policy',
      'Build inventory dashboards for decision makers'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Forecast intermittent demand for spares',
      'Build an inventory dashboard'
    ],
    ARRAY['ISO 55001', 'ASCM APICS body of knowledge', 'ISO 8000'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-02-15 08:30:00+00', '2027-02-17 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Demand Analysis & Forecasting Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Accuracy, Bias & Review Cycles', 2),
    (v_mod3_id, v_course_id, 'Day 3: Stock Policy & Executive Dashboards', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea130001-0001-0000-0000-000000000001', v_mod1_id, '1. Demand analysis', 'Patterns; Data cleaning; Classification', 'text', 240, 1, false),
    ('ea130001-0001-0000-0000-000000000002', v_mod1_id, '2. Forecasting methods', 'Moving averages; Exponential smoothing; Croston method', 'text', 240, 2, false),
    ('ea130001-0002-0000-0000-000000000001', v_mod2_id, '3. Accuracy', 'Error measures; Bias; Review cycles', 'text', 240, 1, false),
    ('ea130001-0003-0000-0000-000000000001', v_mod3_id, '4. Stock policy', 'Safety stock; Reorder points; Service levels', 'text', 240, 1, false),
    ('ea130001-0003-0000-0000-000000000002', v_mod3_id, '5. Dashboards', 'Visual KPIs; Tools; Management reporting', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: SC14 (SAP MM for materials and inventory teams)
  -- =========================================================================
  v_course_id := 'ca140000-0000-0000-0000-000000000010';
  v_mod1_id := 'da140001-0000-0000-0000-000000000001';
  v_mod2_id := 'da140001-0000-0000-0000-000000000002';
  v_mod3_id := 'da140001-0000-0000-0000-000000000003';
  v_mod4_id := 'da140001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC14', 10, 'general_technical', v_cat_sc_id, v_subcat_logistics_id, 'Logistics, warehousing and inventory optimisation',
    'SAP MM for materials and inventory teams',
    'SAP MM runs procurement and inventory for many energy companies, and staff who know it well save time and avoid costly posting errors. This competence course covers core SAP MM processes for materials and inventory teams.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: May 24 to 27, Nov 22 to 25. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Navigate SAP MM master data',
      'Create purchase requisitions and orders',
      'Post goods receipts, issues and transfers',
      'Run inventory counts and reports',
      'Fix common transaction errors'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Process an end to end procure to pay cycle in a SAP training system',
      'Run a physical inventory count and post differences'
    ],
    ARRAY['SAP S/4HANA MM documentation', 'ISO 9001', 'ISO 8000'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
    '2027-05-24 08:30:00+00', '2027-05-27 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: SAP MM Overview & Master Data Architecture', 1),
    (v_mod2_id, v_course_id, 'Day 2: Procurement Cycle, Requisitions & Purchase Orders', 2),
    (v_mod3_id, v_course_id, 'Day 3: Inventory Management, Goods Receipts & Transfers', 3),
    (v_mod4_id, v_course_id, 'Day 4: Physical Inventory Counts, Reporting & Practical Assessment', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea140001-0001-0000-0000-000000000001', v_mod1_id, '1. SAP MM overview', 'Organisation structure; Navigation; Integration with other modules', 'text', 270, 1, false),
    ('ea140001-0001-0000-0000-000000000002', v_mod1_id, '2. Master data', 'Material master; Vendor master; Info records', 'text', 270, 2, false),
    ('ea140001-0002-0000-0000-000000000001', v_mod2_id, '3. Procurement', 'Requisitions; Purchase orders; Releases', 'text', 270, 1, false),
    ('ea140001-0003-0000-0000-000000000001', v_mod3_id, '4. Inventory management', 'Goods receipt; Goods issue; Transfers', 'text', 270, 1, false),
    ('ea140001-0004-0000-0000-000000000001', v_mod4_id, '5. Physical inventory and reporting', 'Counts; Differences; Reports', 'text', 270, 1, false),
    ('ea140001-0004-0000-0000-000000000002', v_mod4_id, '6. Practical assessment', 'End to end exercise; Error fixing; Written test', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
