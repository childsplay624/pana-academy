-- Migration: Seed Courses SU16 and SC01 to SC04
-- Domain 9 (Sustainability solutions and services: SU16)
-- Domain 10 (Supply chain management: SC01 to SC04)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_su_id UUID;
  v_subcat_esg_id UUID;
  v_cat_sc_id UUID;
  v_subcat_mro_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 9 & Domain 10
  SELECT id INTO v_cat_su_id FROM public.course_categories WHERE slug = 'sustainability-solutions-and-services' OR domain_no = 9 LIMIT 1;
  SELECT id INTO v_cat_sc_id FROM public.course_categories WHERE slug = 'supply-chain-management' OR domain_no = 10 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_esg_id FROM public.course_subcategories WHERE category_id = v_cat_su_id AND slug = 'esg-services' LIMIT 1;
  IF v_subcat_esg_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_su_id, 'ESG services', 'esg-services', 2)
    RETURNING id INTO v_subcat_esg_id;
  END IF;

  SELECT id INTO v_subcat_mro_id FROM public.course_subcategories WHERE category_id = v_cat_sc_id AND slug = 'mros-spares-and-critical-equipment-safety' LIMIT 1;
  IF v_subcat_mro_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_sc_id, 'MROs, spares and critical equipment safety', 'mros-spares-and-critical-equipment-safety', 1)
    RETURNING id INTO v_subcat_mro_id;
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
  -- COURSE 1: SU16 (Sustainability reporting with GRI Standards)
  -- =========================================================================
  v_course_id := 'c9160000-0000-0000-0000-000000000016';
  v_mod1_id := 'd9160001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9160001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9160001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU16', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Sustainability reporting with GRI Standards',
    'GRI Standards are the most widely used framework for sustainability reporting, and the oil and gas sector standard sets specific expectations. This course covers GRI reporting from materiality to disclosure and prepares participants for GRI certification.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Exam prep', 'Up to 16 participants',
    'Public sessions: Apr 5 to 7, Aug 9 to 11, Dec 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain GRI structure and reporting principles',
      'Determine material topics through impact assessment',
      'Prepare topic disclosures with sound data',
      'Link GRI reporting with IFRS S1 and S2 and ESRS',
      'Prepare for the GRI certification examination'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Sustainability, ESG and energy transition teams',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Determine material topics for an oil and gas company',
      'Draft three GRI disclosures with a content index'
    ],
    ARRAY['GRI Universal Standards 2021', 'GRI 11 Oil and Gas Sector', 'IFRS S1'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
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
    (v_mod1_id, v_course_id, 'Day 1: GRI Overview, Universal Standards & Materiality', 1),
    (v_mod2_id, v_course_id, 'Day 2: Disclosures, GRI 11 Sector Topics & Content Index', 2),
    (v_mod3_id, v_course_id, 'Day 3: Interoperability (IFRS & ESRS) & Examination Preparation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9160001-0001-0000-0000-000000000001', v_mod1_id, '1. GRI overview', 'Universal standards; Sector standards; Topic standards', 'text', 240, 1, false),
    ('e9160001-0001-0000-0000-000000000002', v_mod1_id, '2. Materiality', 'Impact assessment; Stakeholders; Prioritisation', 'text', 240, 2, false),
    ('e9160001-0002-0000-0000-000000000001', v_mod2_id, '3. Disclosures', 'Data collection; GRI 11 oil and gas topics; Content index', 'text', 240, 1, false),
    ('e9160001-0003-0000-0000-000000000001', v_mod3_id, '4. Interoperability', 'IFRS S1 and S2; ESRS; Assurance', 'text', 240, 1, false),
    ('e9160001-0003-0000-0000-000000000002', v_mod3_id, '5. Examination preparation', 'Mock examination; Review; Exam technique', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: SC01 (MRO inventory optimisation and spares criticality analysis)
  -- =========================================================================
  v_course_id := 'ca010000-0000-0000-0000-000000000010';
  v_mod1_id := 'da010001-0000-0000-0000-000000000001';
  v_mod2_id := 'da010001-0000-0000-0000-000000000002';
  v_mod3_id := 'da010001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC01', 10, 'general_technical', v_cat_sc_id, v_subcat_mro_id, 'MROs, spares and critical equipment safety',
    'MRO inventory optimisation and spares criticality analysis',
    'MRO stores often hold millions of dollars of slow moving stock while critical spares are still missing when equipment fails. This competence course trains materials and maintenance staff to rank spares by criticality and set stock levels that balance cost and risk.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Jan 11 to 13, Jul 5 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Classify MRO inventory with ABC, XYZ and VED analysis',
      'Rank spares by equipment criticality and failure consequence',
      'Set reorder points, safety stock and maximum levels',
      'Identify obsolete and excess stock for disposal',
      'Report inventory health with clear KPIs'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Run ABC, XYZ and VED analysis on a real stores extract',
      'Set stock levels for twenty critical spares',
      'Prepare a stock reduction proposal'
    ],
    ARRAY['ISO 55001', 'ISO 14224', 'SMRP Best Practices'],
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
    (v_mod1_id, v_course_id, 'Day 1: MRO Inventory Basics & Classification Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Spares Criticality Analysis (Lead Time & Failure Risk)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Stock Level Setting & Inventory Health Assessment', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea010001-0001-0000-0000-000000000001', v_mod1_id, '1. MRO inventory basics', 'Stock types; Carrying costs; Service levels', 'text', 240, 1, false),
    ('ea010001-0001-0000-0000-000000000002', v_mod1_id, '2. Classification methods', 'ABC and XYZ analysis; VED criticality; Combined matrices', 'text', 240, 2, false),
    ('ea010001-0002-0000-0000-000000000001', v_mod2_id, '3. Spares criticality analysis', 'Equipment criticality; Lead time and failure risk; Decision trees', 'text', 240, 1, false),
    ('ea010001-0003-0000-0000-000000000001', v_mod3_id, '4. Stock level setting', 'Reorder points; Safety stock for slow movers; Poisson methods', 'text', 240, 1, false),
    ('ea010001-0003-0000-0000-000000000002', v_mod3_id, '5. Inventory health and assessment', 'Excess and obsolete stock; KPIs; Practical test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: SC02 (Critical and insurance spares strategy)
  -- =========================================================================
  v_course_id := 'ca020000-0000-0000-0000-000000000010';
  v_mod1_id := 'da020001-0000-0000-0000-000000000001';
  v_mod2_id := 'da020001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC02', 10, 'general_technical', v_cat_sc_id, v_subcat_mro_id, 'MROs, spares and critical equipment safety',
    'Critical and insurance spares strategy',
    'Insurance spares protect against rare but costly failures of critical equipment such as large motors, transformers and compressor rotors. This short course covers how to decide which insurance spares to hold, how many and how to share them.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 8 to 9, Jun 28 to 29, Oct 11 to 12. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify candidates for insurance spares from critical equipment lists',
      'Evaluate holding decisions using risk and lifecycle cost',
      'Plan pooling and sharing arrangements across sites and partners',
      'Preserve and track insurance spares so they work when needed',
      'Present spares decisions to finance and management'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Evaluate the business case for a spare compressor rotor',
      'Design a spares pool for three sites'
    ],
    ARRAY['ISO 55001', 'API 686', 'IEC 60300-3-10'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Insurance Spares Concepts & Decision Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Pooling, Partner Sharing, Care & Tracking', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea020001-0001-0000-0000-000000000001', v_mod1_id, '1. Insurance spares concepts', 'Definitions; Risk exposure; Accounting treatment', 'text', 210, 1, false),
    ('ea020001-0001-0000-0000-000000000002', v_mod1_id, '2. Decision methods', 'Risk based evaluation; Lifecycle cost; Lead times', 'text', 210, 2, false),
    ('ea020001-0002-0000-0000-000000000001', v_mod2_id, '3. Pooling and sharing', 'Multi site pools; OEM and partner pools; Agreements', 'text', 210, 1, false),
    ('ea020001-0002-0000-0000-000000000002', v_mod2_id, '4. Care and tracking', 'Preservation; Testing; Records', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: SC03 (Materials master data and cataloguing to ISO 8000)
  -- =========================================================================
  v_course_id := 'ca030000-0000-0000-0000-000000000010';
  v_mod1_id := 'da030001-0000-0000-0000-000000000001';
  v_mod2_id := 'da030001-0000-0000-0000-000000000002';
  v_mod3_id := 'da030001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC03', 10, 'general_technical', v_cat_sc_id, v_subcat_mro_id, 'MROs, spares and critical equipment safety',
    'Materials master data and cataloguing to ISO 8000',
    'Poor material master data causes duplicate stock, wrong orders and long searches in the warehouse. This course covers cataloguing standards and data governance for materials.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the impact of material data quality on cost and uptime',
      'Apply naming conventions and noun modifier structures',
      'Use ISO 8000 and eOTD principles',
      'Cleanse and deduplicate material masters',
      'Set governance for new material requests'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Cleanse a sample of 200 material records',
      'Design a new material request workflow'
    ],
    ARRAY['ISO 8000', 'ECCMA eOTD', 'UNSPSC'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Master Data Value & ISO 8000 Cataloguing Standards', 1),
    (v_mod2_id, v_course_id, 'Day 2: Data Cleansing, Deduplication & Vendor Data', 2),
    (v_mod3_id, v_course_id, 'Day 3: Governance, Request Workflows & ERP Integration', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea030001-0001-0000-0000-000000000001', v_mod1_id, '1. Why master data matters', 'Duplicates; Search time; Cost', 'text', 270, 1, false),
    ('ea030001-0001-0000-0000-000000000002', v_mod1_id, '2. Cataloguing standards', 'Noun modifier; Attribute templates; ISO 8000', 'text', 270, 2, false),
    ('ea030001-0002-0000-0000-000000000001', v_mod2_id, '3. Data cleansing', 'Deduplication; Enrichment; Vendor data', 'text', 270, 1, false),
    ('ea030001-0003-0000-0000-000000000001', v_mod3_id, '4. Governance', 'Request workflows; Roles; Quality KPIs', 'text', 270, 1, false),
    ('ea030001-0003-0000-0000-000000000002', v_mod3_id, '5. Systems', 'ERP integration; Tools', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: SC04 (Preservation and storage of critical equipment and spares)
  -- =========================================================================
  v_course_id := 'ca040000-0000-0000-0000-000000000010';
  v_mod1_id := 'da040001-0000-0000-0000-000000000001';
  v_mod2_id := 'da040001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SC04', 10, 'general_technical', v_cat_sc_id, v_subcat_mro_id, 'MROs, spares and critical equipment safety',
    'Preservation and storage of critical equipment and spares',
    'Spares and equipment deteriorate in storage when preservation is neglected, and the failures then show up at installation or startup. This foundation competence course covers preservation, storage and inspection practice for stores and maintenance staff.',
    v_instructor_id, 'beginner', 'onsite', 14,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 8 to 9, Aug 9 to 10. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Apply preservation for rotating, electrical and instrument equipment',
      'Set storage conditions for different materials',
      'Carry out periodic inspection and rotation of shafts',
      'Keep preservation records',
      'Handle and store hazardous and shelf life items'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'Manufacturing, cement, food, beverage and mining'
    ],
    ARRAY[
      'Preserve a motor and a pump for long term storage',
      'Inspect a store and record preservation defects'
    ],
    ARRAY['API 686', 'IEEE 43', 'OEM preservation guidelines'],
    ARRAY['Baker Hughes', 'Siemens', 'ITT Goulds Pumps', 'Rotork', 'Mokveld', 'Neway Valve', 'Xylem'],
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
    (v_mod1_id, v_course_id, 'Day 1: Preservation Principles & Equipment Specific Practice', 1),
    (v_mod2_id, v_course_id, 'Day 2: Storage Conditions, Inspection, Hazardous & Shelf Life', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ea040001-0001-0000-0000-000000000001', v_mod1_id, '1. Preservation principles', 'Corrosion and moisture; Packaging; Preservation materials', 'text', 210, 1, false),
    ('ea040001-0001-0000-0000-000000000002', v_mod1_id, '2. Equipment specific preservation', 'Motors and generators; Pumps and compressors; Instruments and electronics', 'text', 210, 2, false),
    ('ea040001-0002-0000-0000-000000000001', v_mod2_id, '3. Storage and inspection', 'Storage conditions; Shaft rotation and inspection; Records', 'text', 210, 1, false),
    ('ea040001-0002-0000-0000-000000000002', v_mod2_id, '4. Shelf life, hazardous items and assessment', 'Shelf life control; Hazardous goods; Practical test', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
