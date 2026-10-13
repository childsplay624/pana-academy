-- Migration: Seed Courses SU06 to SU10
-- Domain 9: Sustainability solutions and services
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_su_id UUID;
  v_subcat_decarb_id UUID;
  v_subcat_esg_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 9
  SELECT id INTO v_cat_su_id FROM public.course_categories WHERE slug = 'sustainability-solutions-and-services' OR domain_no = 9 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_decarb_id FROM public.course_subcategories WHERE category_id = v_cat_su_id AND slug = 'decarbonisation-solutions' LIMIT 1;
  IF v_subcat_decarb_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_su_id, 'Decarbonisation solutions', 'decarbonisation-solutions', 1)
    RETURNING id INTO v_subcat_decarb_id;
  END IF;

  SELECT id INTO v_subcat_esg_id FROM public.course_subcategories WHERE category_id = v_cat_su_id AND slug = 'esg-services' LIMIT 1;
  IF v_subcat_esg_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_su_id, 'ESG services', 'esg-services', 2)
    RETURNING id INTO v_subcat_esg_id;
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
  -- COURSE 6: SU06 (Industrial energy efficiency audits)
  -- =========================================================================
  v_course_id := 'c9060000-0000-0000-0000-000000000006';
  v_mod1_id := 'd9060001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9060001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9060001-0000-0000-0000-000000000003';
  v_mod4_id := 'd9060001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU06', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Industrial energy efficiency audits',
    'Energy audits find the cheapest cuts in cost and emissions in plants that run on steam, compressed air, motors and heat. This course trains engineers to plan and carry out industrial energy audits and prepares them for professional energy manager certification.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Exam prep', 'Up to 16 participants',
    'Public sessions: Apr 12 to 15, Oct 11 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Plan audits to ISO 50002 at different levels of detail',
      'Measure and analyse energy use in steam, compressed air, pumping and power systems',
      'Identify and quantify savings opportunities',
      'Calculate costs, savings and payback',
      'Present audit findings that lead to action'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Carry out a walk through audit of a utility plant and quantify savings',
      'Calculate payback for a waste heat recovery project',
      'Present findings to a mock management team'
    ],
    ARRAY['ISO 50002', 'ISO 50001', 'ISO 50015', 'ASHRAE audit procedures'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-04-12 08:30:00+00', '2027-04-15 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Audit Planning, ISO 50002 & Steam Systems', 1),
    (v_mod2_id, v_course_id, 'Day 2: Compressed Air, Motors & VSD Opportunities', 2),
    (v_mod3_id, v_course_id, 'Day 3: Pumps, Fans, Cooling Towers & Chiller Systems', 3),
    (v_mod4_id, v_course_id, 'Day 4: Economics, Payback, Reporting & Exam Prep', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9060001-0001-0000-0000-000000000001', v_mod1_id, '1. Audit planning', 'ISO 50002 levels; Data requests; Metering plans', 'text', 270, 1, false),
    ('e9060001-0001-0000-0000-000000000002', v_mod1_id, '2. Steam and heat systems', 'Boiler efficiency; Steam traps; Waste heat recovery', 'text', 270, 2, false),
    ('e9060001-0002-0000-0000-000000000001', v_mod2_id, '3. Compressed air and motors', 'Leak surveys; Motor efficiency; VSD opportunities', 'text', 270, 1, false),
    ('e9060001-0003-0000-0000-000000000001', v_mod3_id, '4. Pumps, fans and cooling', 'System efficiency; Chillers; Cooling towers', 'text', 270, 1, false),
    ('e9060001-0004-0000-0000-000000000001', v_mod4_id, '5. Economics and reporting', 'Savings calculations; Payback and NPV; Audit reports', 'text', 270, 1, false),
    ('e9060001-0004-0000-0000-000000000002', v_mod4_id, '6. Examination preparation', 'Body of knowledge review; Practice questions; Exam technique', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 7: SU07 (Decarbonisation roadmaps and marginal abatement cost curves)
  -- =========================================================================
  v_course_id := 'c9070000-0000-0000-0000-000000000007';
  v_mod1_id := 'd9070001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9070001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9070001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU07', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Decarbonisation roadmaps and marginal abatement cost curves',
    'Companies need decarbonisation roadmaps that are credible to investors and affordable to execute. Marginal abatement cost curves rank options by cost per tonne. This advanced course covers building both.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 8 to 10, Aug 16 to 18. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build an emissions baseline and business as usual projection',
      'Identify abatement options across Scope 1, 2 and 3',
      'Calculate cost per tonne and build a MAC curve',
      'Sequence options into a roadmap with targets and capital plans',
      'Align the roadmap with science based target methods'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Manufacturing, cement, food, beverage and mining',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Build a MAC curve for an upstream asset',
      'Turn it into a 2035 roadmap with milestones'
    ],
    ARRAY['SBTi Corporate Net Zero Standard', 'GHG Protocol', 'TPT Disclosure Framework', 'IFRS S2'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-02-08 08:30:00+00', '2027-02-10 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Baseline Projection & Abatement Options', 1),
    (v_mod2_id, v_course_id, 'Day 2: Marginal Abatement Cost Curve Construction', 2),
    (v_mod3_id, v_course_id, 'Day 3: Roadmap Development, Capital Sequencing & Governance', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9070001-0001-0000-0000-000000000001', v_mod1_id, '1. Baseline and projection', 'Baseline; Growth scenarios; Target setting', 'text', 240, 1, false),
    ('e9070001-0001-0000-0000-000000000002', v_mod1_id, '2. Abatement options', 'Efficiency; Methane; Electrification; Fuel switching', 'text', 300, 2, false),
    ('e9070001-0002-0000-0000-000000000001', v_mod2_id, '3. MAC curves', 'Cost per tonne; Building the curve; Limitations', 'text', 240, 1, false),
    ('e9070001-0003-0000-0000-000000000001', v_mod3_id, '4. Roadmap development', 'Sequencing; Capital and operating plans; Carbon pricing', 'text', 240, 1, false),
    ('e9070001-0003-0000-0000-000000000002', v_mod3_id, '5. Targets and governance', 'SBTi methods; Transition plans; Tracking', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 8: SU08 (Carbon markets, Article 6 and carbon credit project development)
  -- =========================================================================
  v_course_id := 'c9080000-0000-0000-0000-000000000008';
  v_mod1_id := 'd9080001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9080001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9080001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU08', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Carbon markets, Article 6 and carbon credit project development',
    'Carbon markets are changing under Article 6 of the Paris Agreement, and African countries are setting up frameworks to attract carbon finance. This course covers market rules, project development and credit integrity.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain compliance and voluntary carbon markets and Article 6 mechanisms',
      'Assess project eligibility and methodologies',
      'Describe the project cycle from design to issuance',
      'Judge credit quality and integrity',
      'Explain national frameworks including Nigeria''s carbon market policy'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Sustainability, ESG and energy transition teams',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Screen a cookstove and a flare reduction project for eligibility',
      'Estimate credits and revenue for a project'
    ],
    ARRAY['Paris Agreement Article 6', 'ICVCM Core Carbon Principles', 'Verra VCS', 'Gold Standard', 'ISO 14064-2'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    NULL, NULL,
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
    (v_mod1_id, v_course_id, 'Day 1: Carbon Market Basics & Article 6 Frameworks', 1),
    (v_mod2_id, v_course_id, 'Day 2: Methodologies, Baselines & Project Development', 2),
    (v_mod3_id, v_course_id, 'Day 3: Credit Integrity, ICVCM & National Registries', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9080001-0001-0000-0000-000000000001', v_mod1_id, '1. Carbon market basics', 'Compliance and voluntary markets; Prices; Buyers', 'text', 240, 1, false),
    ('e9080001-0001-0000-0000-000000000002', v_mod1_id, '2. Article 6', 'Article 6.2 and 6.4; Corresponding adjustments; Host country approval', 'text', 240, 2, false),
    ('e9080001-0002-0000-0000-000000000001', v_mod2_id, '3. Project development', 'Methodologies; Baselines and additionality; Monitoring', 'text', 240, 1, false),
    ('e9080001-0003-0000-0000-000000000001', v_mod3_id, '4. Integrity', 'ICVCM Core Carbon Principles; Permanence and leakage; Community benefit', 'text', 240, 1, false),
    ('e9080001-0003-0000-0000-000000000002', v_mod3_id, '5. National frameworks', 'Nigeria carbon market activation; Registries; Revenue sharing', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 9: SU09 (Renewable energy project development and finance)
  -- =========================================================================
  v_course_id := 'c9090000-0000-0000-0000-000000000009';
  v_mod1_id := 'd9090001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9090001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9090001-0000-0000-0000-000000000003';
  v_mod4_id := 'd9090001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU09', 9, 'general_technical', v_cat_su_id, v_subcat_decarb_id, 'Decarbonisation solutions',
    'Renewable energy project development and finance',
    'Renewable energy projects need sound technical design and bankable finance, and many African projects stall between the two. This course covers development stages, contracts, risk and financing for solar, wind and hybrid projects.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 12 to 15, Oct 11 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the renewable project development cycle',
      'Assess resource, site and grid connection',
      'Structure PPAs and project contracts',
      'Build a project finance model',
      'Identify and allocate risks for lenders'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams',
      'Ministries, departments and government agencies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Build a project finance model for a solar plant',
      'Allocate risks in a contract matrix'
    ],
    ARRAY['IFC Performance Standards', 'Equator Principles', 'IEC 61724', 'NERC regulations'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-04-12 08:30:00+00', '2027-04-15 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Development Cycle & Resource Grid Connection', 1),
    (v_mod2_id, v_course_id, 'Day 2: Contracts, PPAs, EPC & O&M Structuring', 2),
    (v_mod3_id, v_course_id, 'Day 3: Project Finance Structures & Blended Finance', 3),
    (v_mod4_id, v_course_id, 'Day 4: Risk Allocation & African Case Studies', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9090001-0001-0000-0000-000000000001', v_mod1_id, '1. Development cycle', 'Stages; Permits; Land', 'text', 270, 1, false),
    ('e9090001-0001-0000-0000-000000000002', v_mod1_id, '2. Resource and technical', 'Resource assessment; Grid connection; Technology choice', 'text', 270, 2, false),
    ('e9090001-0002-0000-0000-000000000001', v_mod2_id, '3. Contracts', 'PPAs; EPC contracts; O&M contracts', 'text', 270, 1, false),
    ('e9090001-0003-0000-0000-000000000001', v_mod3_id, '4. Finance', 'Project finance structures; Lenders'' requirements; Blended finance', 'text', 270, 1, false),
    ('e9090001-0004-0000-0000-000000000001', v_mod4_id, '5. Risk', 'Risk matrix; Mitigation; Insurance', 'text', 270, 1, false),
    ('e9090001-0004-0000-0000-000000000002', v_mod4_id, '6. Case studies', 'African projects; Lessons learned; Market outlook', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 10: SU10 (Sustainability disclosure under IFRS S1 and S2)
  -- =========================================================================
  v_course_id := 'c9100000-0000-0000-0000-000000000010';
  v_mod1_id := 'd9100001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9100001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9100001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU10', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Sustainability disclosure under IFRS S1 and S2',
    'IFRS S1 and S2 make sustainability and climate disclosure part of financial reporting, and Nigeria was an early adopter. This course explains the requirements and how to prepare compliant disclosures.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 25 to 27, Jul 12 to 14. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain IFRS S1 general requirements and IFRS S2 climate requirements',
      'Identify material sustainability risks and opportunities',
      'Prepare governance, strategy, risk and metrics disclosures',
      'Connect disclosures with financial statements',
      'Plan for assurance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Draft IFRS S2 disclosures for an energy company case',
      'Map financial effects of two climate risks'
    ],
    ARRAY['IFRS S1', 'IFRS S2', 'SASB Standards', 'FRC Nigeria adoption roadmap'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-01-25 08:30:00+00', '2027-01-27 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Standards Overview, Roadmap & Materiality', 1),
    (v_mod2_id, v_course_id, 'Day 2: Disclosure Content: Governance, Strategy & Metrics', 2),
    (v_mod3_id, v_course_id, 'Day 3: Financial Connectivity, Data & Assurance Readiness', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9100001-0001-0000-0000-000000000001', v_mod1_id, '1. Standards overview', 'ISSB background; IFRS S1; IFRS S2; Nigeria adoption roadmap', 'text', 180, 1, false),
    ('e9100001-0001-0000-0000-000000000002', v_mod1_id, '2. Materiality and risks', 'Identifying risks and opportunities; SASB industry standards', 'text', 150, 2, false),
    ('e9100001-0002-0000-0000-000000000001', v_mod2_id, '3. Disclosure content', 'Governance; Strategy; Risk management; Metrics and targets', 'text', 300, 1, false),
    ('e9100001-0003-0000-0000-000000000001', v_mod3_id, '4. Connectivity and data', 'Financial linkages; Data systems; Controls', 'text', 240, 1, false),
    ('e9100001-0003-0000-0000-000000000002', v_mod3_id, '5. Assurance readiness', 'Assurance levels; Evidence; Common gaps', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
