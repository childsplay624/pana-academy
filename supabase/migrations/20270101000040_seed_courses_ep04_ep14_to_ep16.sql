-- =============================================================================
-- Migration: 20270101000040_seed_courses_ep04_ep14_to_ep16.sql
-- Description: Seed Domain 6 (Exploration - Oil, Gas and Mining) courses:
--              EP04: Mineral exploration sampling, drilling and QA/QC
--              EP14: Subsurface visualisation and 3D geological modelling
--              EP15: Prospect evaluation, risking and portfolio presentation
--              EP16: Exploration data submissions for regulators and licensing rounds
-- =============================================================================

DO $$
DECLARE
  v_cat_ep_id UUID;
  v_subcat_acq_id UUID;
  v_subcat_disp_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 6
  SELECT id INTO v_cat_ep_id
  FROM public.course_categories
  WHERE slug = 'exploration-oil-gas-and-mining' OR domain_no = 6
  LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_acq_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_ep_id AND slug = 'data-acquisition'
  LIMIT 1;

  SELECT id INTO v_subcat_disp_id
  FROM public.course_subcategories
  WHERE category_id = v_cat_ep_id AND slug = 'data-display'
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
  -- COURSE 1: EP04 (Mineral exploration sampling, drilling and QA/QC)
  -- =========================================================================
  v_course_id := 'cc040000-0000-0000-0000-000000000004';
  v_mod1_id := 'dc040001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc040001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc040001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc040001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP04', 6, 'general_technical', v_cat_ep_id, v_subcat_acq_id, 'Data acquisition',
    'Mineral exploration sampling, drilling and QA/QC',
    'In mineral exploration, the quality of samples decides whether a deposit can be valued and financed. This course covers sampling methods, drilling, logging and QA/QC to the standards that investors, stock exchanges and regulators expect.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 15 to 18, Aug 9 to 12. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Choose sampling and drilling methods for a mineral target',
      'Log core and chips consistently',
      'Design QA/QC programmes with standards, blanks and duplicates',
      'Manage chain of custody and laboratory submissions',
      'Interpret QA/QC results and act on failures'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Engineering, EPC, maintenance and technical service contractors',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Design a QA/QC programme for a gold drilling campaign',
      'Analyse QA/QC results and identify failures'
    ],
    ARRAY['JORC Code 2012', 'CIM Best Practice Guidelines', 'ISO/IEC 17025'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Getech', 'Intecsea', 'Deep International (project based)'],
    '2027-02-15 08:30:00+00', '2027-02-18 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Exploration Stages & Drilling Methods', 1),
    (v_mod2_id, v_course_id, 'Day 2: Core & Chip Logging Protocols', 2),
    (v_mod3_id, v_course_id, 'Day 3: QA/QC Design & Performance Analysis', 3),
    (v_mod4_id, v_course_id, 'Day 4: Laboratory Submissions & Data Management', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec040001-0001-0000-0000-000000000001', v_mod1_id, '1. Exploration stages', 'Target generation; Sampling programmes; Budgets', 'text', 210, 1, false),
    ('ec040001-0001-0000-0000-000000000002', v_mod1_id, '2. Drilling methods', 'RC drilling; Diamond core; Auger and air core', 'text', 210, 2, false),
    ('ec040001-0002-0000-0000-000000000001', v_mod2_id, '3. Logging', 'Core logging; Structural data; Photography', 'text', 420, 1, false),
    ('ec040001-0003-0000-0000-000000000001', v_mod3_id, '4. QA/QC', 'Standards, blanks and duplicates; Control charts; Failure actions', 'text', 420, 1, false),
    ('ec040001-0004-0000-0000-000000000001', v_mod4_id, '5. Laboratories and custody', 'Sample preparation; Chain of custody; Laboratory audits', 'text', 210, 1, false),
    ('ec040001-0004-0000-0000-000000000002', v_mod4_id, '6. Data management', 'Databases; Validation; Reporting', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EP14 (Subsurface visualisation and 3D geological modelling)
  -- =========================================================================
  v_course_id := 'cc140000-0000-0000-0000-000000000014';
  v_mod1_id := 'dc140001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc140001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc140001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc140001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP14', 6, 'general_technical', v_cat_ep_id, v_subcat_disp_id, 'Data display',
    'Subsurface visualisation and 3D geological modelling',
    '3D geological models bring seismic, well and conceptual geology together and feed volumetrics and reservoir simulation. This course covers structural and property modelling and the visualisation that helps teams agree on the subsurface picture.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 5 to 8, Oct 18 to 21. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build a structural framework from horizons and faults',
      'Construct a 3D grid suited to the reservoir and later simulation',
      'Model facies and properties with geostatistics',
      'Calculate volumes and test uncertainty',
      'Present models clearly to multidisciplinary teams'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build a 3D model for a channel reservoir from seismic and wells',
      'Run volumetric uncertainty with three scenarios'
    ],
    ARRAY['SPE PRMS', 'RESQML', 'SEG Y and LAS standards'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Getech', 'Intecsea', 'Deep International (project based)'],
    '2027-04-05 08:30:00+00', '2027-04-08 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Modelling Workflow & Structural Modelling', 1),
    (v_mod2_id, v_course_id, 'Day 2: 3D Reservoir Gridding', 2),
    (v_mod3_id, v_course_id, 'Day 3: Facies Geostatistical Modelling', 3),
    (v_mod4_id, v_course_id, 'Day 4: Property Modelling, Volumetrics & Uncertainty', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec140001-0001-0000-0000-000000000001', v_mod1_id, '1. Modelling workflow', 'Data loading and QC; Conceptual models; Project setup', 'text', 210, 1, false),
    ('ec140001-0001-0000-0000-000000000002', v_mod1_id, '2. Structural modelling', 'Fault modelling; Horizon modelling; Zonation', 'text', 210, 2, false),
    ('ec140001-0002-0000-0000-000000000001', v_mod2_id, '3. Gridding', 'Grid design; Layering; Upscaling considerations', 'text', 420, 1, false),
    ('ec140001-0003-0000-0000-000000000001', v_mod3_id, '4. Facies modelling', 'Object based methods; Pixel based methods; Trends', 'text', 420, 1, false),
    ('ec140001-0004-0000-0000-000000000001', v_mod4_id, '5. Property modelling', 'Porosity and permeability; Saturation height; Variograms', 'text', 210, 1, false),
    ('ec140001-0004-0000-0000-000000000002', v_mod4_id, '6. Volumetrics, uncertainty and visualisation', 'Volumes; Scenario modelling; Visual communication', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EP15 (Prospect evaluation, risking and portfolio presentation)
  -- =========================================================================
  v_course_id := 'cc150000-0000-0000-0000-000000000015';
  v_mod1_id := 'dc150001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc150001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc150001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP15', 6, 'general_technical', v_cat_ep_id, v_subcat_disp_id, 'Data display',
    'Prospect evaluation, risking and portfolio presentation',
    'Exploration portfolios compete for limited capital, and prospects must be risked and valued on a consistent basis. This advanced course covers prospect risking, volume estimation, economics and the presentation of portfolios to management and partners.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: May 10 to 12, Nov 22 to 24. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Assess geological chance of success with consistent risk elements',
      'Estimate prospect volumes probabilistically',
      'Run simple prospect economics',
      'Rank prospects in a portfolio',
      'Present prospects clearly to management and partners'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Risk and value two prospects and present them to a review panel',
      'Rank a portfolio of six prospects'
    ],
    ARRAY['SPE PRMS', 'Rose and Associates risking practice', 'AAPG risk guidance'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Getech', 'Intecsea', 'Deep International (project based)'],
    '2027-05-10 08:30:00+00', '2027-05-12 16:30:00+00',
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
    (v_mod1_id, v_course_id, 'Day 1: Risk Assessment & Volume Estimation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Prospect Economics & Fiscal Terms', 2),
    (v_mod3_id, v_course_id, 'Day 3: Portfolio Management & Stakeholder Presentation', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec150001-0001-0000-0000-000000000001', v_mod1_id, '1. Risk assessment', 'Charge, reservoir, trap and seal; Consistent scoring; Bias', 'text', 240, 1, false),
    ('ec150001-0001-0000-0000-000000000002', v_mod1_id, '2. Volume estimation', 'Probabilistic methods; Monte Carlo; Dependencies', 'text', 240, 2, false),
    ('ec150001-0002-0000-0000-000000000001', v_mod2_id, '3. Economics', 'Fiscal terms; Expected monetary value; Decision trees', 'text', 240, 1, false),
    ('ec150001-0003-0000-0000-000000000001', v_mod3_id, '4. Portfolio management', 'Ranking; Diversification; Capital limits', 'text', 240, 1, false),
    ('ec150001-0003-0000-0000-000000000002', v_mod3_id, '5. Presentation', 'Prospect summaries; Peer review panels; Partner meetings', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EP16 (Exploration data submissions for regulators and licensing rounds)
  -- =========================================================================
  v_course_id := 'cc160000-0000-0000-0000-000000000016';
  v_mod1_id := 'dc160001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc160001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc160001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP16', 6, 'general_technical', v_cat_ep_id, v_subcat_disp_id, 'Data display',
    'Exploration data submissions for regulators and licensing rounds',
    'Regulators depend on complete, well formatted exploration data to manage licences and attract investment through licensing rounds. This course shows company and regulatory staff how to prepare, submit, check and use exploration data submissions.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jan 18 to 20, Jul 5 to 7. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe statutory data submission requirements for exploration and appraisal',
      'Prepare seismic, well and report data in required formats',
      'Check submissions for completeness and quality',
      'Manage national data repositories and data release',
      'Prepare data packages for licensing rounds'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies',
      'Oil and gas operators and service companies'
    ],
    ARRAY[
      'Check a well data submission against requirements',
      'Assemble a data room package for a licence block'
    ],
    ARRAY['Petroleum Industry Act 2021', 'NUPRC data guidelines', 'SEG Y rev 2', 'LAS 3.0'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Getech', 'Intecsea', 'Deep International (project based)'],
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
    (v_mod1_id, v_course_id, 'Day 1: Regulatory Framework & Data Formats', 1),
    (v_mod2_id, v_course_id, 'Day 2: Submission, Validation & Quality Checking', 2),
    (v_mod3_id, v_course_id, 'Day 3: National Repositories & Licensing Rounds', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec160001-0001-0000-0000-000000000001', v_mod1_id, '1. Regulatory framework', 'Petroleum Industry Act data provisions; Regulator guidelines', 'text', 180, 1, false),
    ('ec160001-0001-0000-0000-000000000002', v_mod1_id, '2. Data formats', 'SEG Y; LAS and DLIS; Reports', 'text', 270, 2, false),
    ('ec160001-0002-0000-0000-000000000001', v_mod2_id, '3. Submission and checking', 'Checklists; Quality control; Feedback loops', 'text', 270, 1, false),
    ('ec160001-0003-0000-0000-000000000001', v_mod3_id, '4. National data repositories', 'Storage; Access; Release rules', 'text', 270, 1, false),
    ('ec160001-0003-0000-0000-000000000002', v_mod3_id, '5. Licensing rounds', 'Data packages; Data rooms; Promotion', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
