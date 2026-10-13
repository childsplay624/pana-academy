-- Migration: Seed Courses SU11 to SU15
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
  -- COURSE 11: SU11 (ESG strategy and governance for boards and executives)
  -- =========================================================================
  v_course_id := 'c9110000-0000-0000-0000-000000000011';
  v_mod1_id := 'd9110001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9110001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU11', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'ESG strategy and governance for boards and executives',
    'Boards are accountable for ESG risks and for the credibility of company commitments. This executive course covers ESG strategy, oversight and the questions boards should ask.',
    v_instructor_id, 'advanced', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Nov 1 to 2. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the ESG landscape and investor expectations',
      'Set board oversight structures for ESG',
      'Link ESG to strategy and capital allocation',
      'Oversee disclosure and greenwashing risk',
      'Evaluate ESG performance and incentives'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Manufacturing, cement, food, beverage and mining',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Run a board simulation on a climate transition decision',
      'Draft board ESG questions for management'
    ],
    ARRAY['IFRS S1', 'IFRS S2', 'Nigerian Code of Corporate Governance 2018', 'OECD Principles of Corporate Governance'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-11-01 08:30:00+00', '2027-11-02 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: ESG Landscape, Investor Pressures & Board Oversight', 1),
    (v_mod2_id, v_course_id, 'Day 2: Strategy, Capital Allocation, Disclosure & Greenwashing Risk', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9110001-0001-0000-0000-000000000001', v_mod1_id, '1. ESG landscape', 'Investors; Regulators; Ratings', 'text', 210, 1, false),
    ('e9110001-0001-0000-0000-000000000002', v_mod1_id, '2. Board oversight', 'Committees; Skills; Reporting lines', 'text', 210, 2, false),
    ('e9110001-0002-0000-0000-000000000001', v_mod2_id, '3. Strategy and capital', 'Material issues; Transition plans; Investment decisions', 'text', 210, 1, false),
    ('e9110001-0002-0000-0000-000000000002', v_mod2_id, '4. Disclosure and risk', 'Greenwashing; Litigation; Assurance', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 12: SU12 (Environmental and social impact assessment and IFC Performance Standards)
  -- =========================================================================
  v_course_id := 'c9120000-0000-0000-0000-000000000012';
  v_mod1_id := 'd9120001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9120001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9120001-0000-0000-0000-000000000003';
  v_mod4_id := 'd9120001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU12', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Environmental and social impact assessment and IFC Performance Standards',
    'ESIAs and the IFC Performance Standards decide whether projects get permits and finance. This course covers ESIA process, baseline studies, impact assessment and management plans.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 19 to 22, Oct 25 to 28. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain ESIA legal and lender requirements',
      'Plan scoping and baseline studies',
      'Assess environmental and social impacts',
      'Prepare management and monitoring plans',
      'Apply IFC Performance Standards'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Run a scoping exercise for a pipeline',
      'Prepare an ESMP outline',
      'Gap assess an ESIA against IFC PS'
    ],
    ARRAY['IFC Performance Standards 1 to 8', 'Nigerian EIA Act', 'Equator Principles IV', 'ISO 14001'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-04-19 08:30:00+00', '2027-04-22 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Frameworks, Scoping & Baseline Surveys', 1),
    (v_mod2_id, v_course_id, 'Day 2: Environmental Impact Assessment & Cumulative Impacts', 2),
    (v_mod3_id, v_course_id, 'Day 3: Social Topics, Land Acquisition & Vulnerable Groups', 3),
    (v_mod4_id, v_course_id, 'Day 4: Management Plans, Grievance, Review & Compliance', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9120001-0001-0000-0000-000000000001', v_mod1_id, '1. Frameworks', 'Nigerian EIA Act; IFC Performance Standards; Equator Principles', 'text', 300, 1, false),
    ('e9120001-0001-0000-0000-000000000002', v_mod1_id, '2. Scoping and baseline', 'Scoping; Baseline surveys; Stakeholders', 'text', 300, 2, false),
    ('e9120001-0002-0000-0000-000000000001', v_mod2_id, '3. Impact assessment', 'Methods; Significance; Cumulative impacts', 'text', 300, 1, false),
    ('e9120001-0003-0000-0000-000000000001', v_mod3_id, '4. Social topics', 'Land acquisition; Livelihoods; Indigenous and vulnerable groups', 'text', 300, 1, false),
    ('e9120001-0004-0000-0000-000000000001', v_mod4_id, '5. Management plans', 'ESMP; Monitoring; Grievance mechanisms', 'text', 300, 1, false),
    ('e9120001-0004-0000-0000-000000000002', v_mod4_id, '6. Review and compliance', 'Gap analysis; Lender audits', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 13: SU13 (Climate risk and scenario analysis)
  -- =========================================================================
  v_course_id := 'c9130000-0000-0000-0000-000000000013';
  v_mod1_id := 'd9130001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9130001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9130001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU13', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Climate risk and scenario analysis',
    'Climate risk analysis tests how a business holds up under physical and transition scenarios, and IFRS S2 requires it. This advanced course covers scenario selection, quantification of financial impact and integration with risk management and disclosure.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, May 10 to 12, Sep 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Identify physical and transition risks and opportunities',
      'Select and adapt climate scenarios',
      'Quantify financial impacts at asset and portfolio level',
      'Integrate results in enterprise risk management',
      'Disclose results in line with IFRS S2'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Power generation, transmission and distribution',
      'Sustainability, ESG and energy transition teams'
    ],
    ARRAY[
      'Run a transition scenario on an oil and gas portfolio',
      'Assess flood risk for coastal assets'
    ],
    ARRAY['IFRS S2', 'TCFD guidance', 'NGFS scenarios', 'ISO 14091'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
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
    (v_mod1_id, v_course_id, 'Day 1: Physical vs Transition Risks & Climate Scenarios', 1),
    (v_mod2_id, v_course_id, 'Day 2: Asset-Level Financial Quantification & Stranded Assets', 2),
    (v_mod3_id, v_course_id, 'Day 3: ERM Integration, IFRS S2 Disclosure & Sector Cases', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9130001-0001-0000-0000-000000000001', v_mod1_id, '1. Climate risks', 'Physical risks; Transition risks; Opportunities', 'text', 240, 1, false),
    ('e9130001-0001-0000-0000-000000000002', v_mod1_id, '2. Scenarios', 'NGFS and IEA scenarios; Selection; Narratives', 'text', 240, 2, false),
    ('e9130001-0002-0000-0000-000000000001', v_mod2_id, '3. Quantification', 'Asset level analysis; Carbon prices; Stranded assets', 'text', 240, 1, false),
    ('e9130001-0003-0000-0000-000000000001', v_mod3_id, '4. Integration and disclosure', 'Risk registers; Strategy links; IFRS S2 disclosure', 'text', 240, 1, false),
    ('e9130001-0003-0000-0000-000000000002', v_mod3_id, '5. Case studies', 'Energy sector examples; Banking examples; Lessons', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 14: SU14 (Energy transition policy and regulation for public institutions)
  -- =========================================================================
  v_course_id := 'c9140000-0000-0000-0000-000000000014';
  v_mod1_id := 'd9140001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9140001-0000-0000-0000-000000000002';
  v_mod3_id := 'd9140001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU14', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Energy transition policy and regulation for public institutions',
    'Ministries, regulators and agencies design and run the policies that decide the pace and fairness of the energy transition. This executive course covers transition policy instruments, regulation, finance and implementation for public institutions, with a focus on Nigeria and Africa.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Dec 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain the energy transition and Africa''s position in it',
      'Compare policy instruments such as standards, tariffs, carbon pricing and subsidies',
      'Design regulatory frameworks for renewables, gas and efficiency',
      'Mobilise climate and transition finance',
      'Plan implementation, monitoring and a just transition'
    ],
    ARRAY['Management, regulatory or policy responsibility in a related area.'],
    ARRAY[
      'Executives, managers, regulators and policy makers who make decisions in this area',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Design a policy package for a state electricity market',
      'Evaluate a renewable auction design'
    ],
    ARRAY['Nigeria Energy Transition Plan', 'Electricity Act 2023', 'Climate Change Act 2021', 'IEA policy databases'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-12-13 08:30:00+00', '2027-12-15 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Transition Context, Energy Access & Policy Instruments', 1),
    (v_mod2_id, v_course_id, 'Day 2: Regulatory Frameworks (Electricity Act 2023 & Renewables)', 2),
    (v_mod3_id, v_course_id, 'Day 3: Transition Finance, Just Transition & Implementation Units', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9140001-0001-0000-0000-000000000001', v_mod1_id, '1. Energy transition context', 'Global trends; Africa''s energy access gap; Nigeria Energy Transition Plan', 'text', 240, 1, false),
    ('e9140001-0001-0000-0000-000000000002', v_mod1_id, '2. Policy instruments', 'Standards; Tariffs and auctions; Carbon pricing; Subsidy reform', 'text', 300, 2, false),
    ('e9140001-0002-0000-0000-000000000001', v_mod2_id, '3. Regulation', 'Electricity Act 2023; Gas and renewables regulation; Institutional roles', 'text', 240, 1, false),
    ('e9140001-0003-0000-0000-000000000001', v_mod3_id, '4. Finance', 'Climate finance; Development banks; Private capital', 'text', 240, 1, false),
    ('e9140001-0003-0000-0000-000000000002', v_mod3_id, '5. Implementation and just transition', 'Delivery units; Monitoring; Jobs and communities', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 15: SU15 (Host community development and social performance)
  -- =========================================================================
  v_course_id := 'c9150000-0000-0000-0000-000000000015';
  v_mod1_id := 'd9150001-0000-0000-0000-000000000001';
  v_mod2_id := 'd9150001-0000-0000-0000-000000000002';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'SU15', 9, 'general_technical', v_cat_su_id, v_subcat_esg_id, 'ESG services',
    'Host community development and social performance',
    'Host community relations shape whether energy projects can operate, and the Petroleum Industry Act created host community development trusts. This short course covers social performance and community development.',
    v_instructor_id, 'intermediate', 'onsite', 14,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 8 to 9, Sep 20 to 21. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain host community provisions of the PIA',
      'Map stakeholders and social risks',
      'Design community development programmes',
      'Run grievance mechanisms',
      'Measure social performance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Ministries, departments and government agencies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Map stakeholders for an onshore field',
      'Design a grievance mechanism'
    ],
    ARRAY['Petroleum Industry Act 2021', 'IFC Performance Standard 1', 'IPIECA social guidance'],
    ARRAY['Econotherm (waste heat recovery)', 'Intertek', 'Vyeus', 'Baker Hughes (hydrogen and CCUS)'],
    '2027-03-08 08:30:00+00', '2027-03-09 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Legal Framework (PIA Chapter 3) & Stakeholder Mapping', 1),
    (v_mod2_id, v_course_id, 'Day 2: Community Development, Needs Assessment & Grievance', 2)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('e9150001-0001-0000-0000-000000000001', v_mod1_id, '1. Legal framework', 'PIA Chapter 3; Trust structures; Funding', 'text', 210, 1, false),
    ('e9150001-0001-0000-0000-000000000002', v_mod1_id, '2. Stakeholder mapping', 'Communities; Risks; Engagement plans', 'text', 210, 2, false),
    ('e9150001-0002-0000-0000-000000000001', v_mod2_id, '3. Community development', 'Needs assessment; Programme design; Partnerships', 'text', 210, 1, false),
    ('e9150001-0002-0000-0000-000000000002', v_mod2_id, '4. Grievance and performance', 'Grievance mechanisms; KPIs; Reporting', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
