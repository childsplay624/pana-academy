-- Migration: Seed Courses PR03 to PR07
-- Domain 7: Production
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_pr_id UUID;
  v_subcat_eor_id UUID;
  v_subcat_water_id UUID;
  v_subcat_chem_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 7
  SELECT id INTO v_cat_pr_id FROM public.course_categories WHERE slug = 'production' OR domain_no = 7 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_eor_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'enhanced-oil-recovery-eor' LIMIT 1;
  IF v_subcat_eor_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'Enhanced oil recovery (EOR)', 'enhanced-oil-recovery-eor', 1)
    RETURNING id INTO v_subcat_eor_id;
  END IF;

  SELECT id INTO v_subcat_water_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'water-and-process-chemicals' LIMIT 1;
  IF v_subcat_water_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'Water and process chemicals', 'water-and-process-chemicals', 2)
    RETURNING id INTO v_subcat_water_id;
  END IF;

  SELECT id INTO v_subcat_chem_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'production-chemicals' LIMIT 1;
  IF v_subcat_chem_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'Production chemicals', 'production-chemicals', 3)
    RETURNING id INTO v_subcat_chem_id;
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
  -- COURSE 1: PR03 (CO2 EOR and carbon storage synergies)
  -- =========================================================================
  v_course_id := 'cf030000-0000-0000-0000-000000000003';
  v_mod1_id := 'df030001-0000-0000-0000-000000000001';
  v_mod2_id := 'df030001-0000-0000-0000-000000000002';
  v_mod3_id := 'df030001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR03', 7, 'general_technical', v_cat_pr_id, v_subcat_eor_id, 'Enhanced oil recovery (EOR)',
    'CO2 EOR and carbon storage synergies',
    'Injecting CO2 for enhanced oil recovery can also store it permanently, linking production and emission goals. This advanced course covers the technical and commercial links between CO2 EOR and carbon storage.',
    v_instructor_id, 'advanced', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 8 to 10, Sep 13 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain CO2 miscibility and recovery mechanisms',
      'Estimate CO2 retention and storage during EOR',
      'Identify monitoring needed to claim storage',
      'Assess sources, transport and economics of CO2 supply',
      'Evaluate policy and credit frameworks for CO2 EOR storage'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'International oil companies and joint ventures',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Estimate CO2 retention for an EOR project',
      'Build a cost and credit model for CO2 EOR storage'
    ],
    ARRAY['ISO 27916', 'ISO 27914', 'API RP 1173'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: CO2 EOR Mechanisms & Permanent Storage', 1),
    (v_mod2_id, v_course_id, 'Day 2: Monitoring, Verification & Accounting Plans', 2),
    (v_mod3_id, v_course_id, 'Day 3: Supply Chain, Economics & Carbon Credit Policy', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef030001-0001-0000-0000-000000000001', v_mod1_id, '1. CO2 EOR mechanisms', 'Miscibility; Minimum miscibility pressure; Recovery', 'text', 240, 1, false),
    ('ef030001-0001-0000-0000-000000000002', v_mod1_id, '2. Storage during EOR', 'Retention; Recycling; Long term storage', 'text', 240, 2, false),
    ('ef030001-0002-0000-0000-000000000001', v_mod2_id, '3. Monitoring and verification', 'MMV plans; Accounting; Standards', 'text', 240, 1, false),
    ('ef030001-0003-0000-0000-000000000001', v_mod3_id, '4. Supply chain and economics', 'CO2 sources; Pipelines; Costs and credits', 'text', 240, 1, false),
    ('ef030001-0003-0000-0000-000000000002', v_mod3_id, '5. Policy', 'Regulations; Carbon credit eligibility; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: PR04 (Produced water treatment and reinjection)
  -- =========================================================================
  v_course_id := 'cf040000-0000-0000-0000-000000000004';
  v_mod1_id := 'df040001-0000-0000-0000-000000000001';
  v_mod2_id := 'df040001-0000-0000-0000-000000000002';
  v_mod3_id := 'df040001-0000-0000-0000-000000000003';
  v_mod4_id := 'df040001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR04', 7, 'general_technical', v_cat_pr_id, v_subcat_water_id, 'Water and process chemicals',
    'Produced water treatment and reinjection',
    'Produced water volumes rise as fields mature, and discharge limits are tightening. This course covers produced water treatment, reinjection and disposal options and the chemistry that drives them.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 26 to 29, Oct 18 to 21. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Characterise produced water and its contaminants',
      'Select treatment equipment for oil, solids and dissolved components',
      'Design reinjection systems for water quality targets',
      'Meet discharge regulations and monitor compliance',
      'Reduce treatment costs through chemistry and operation'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Sustainability, ESG and energy transition teams',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Select a treatment train for a mature field case',
      'Diagnose an oil in water excursion from operating data'
    ],
    ARRAY['NUPRC environmental guidelines', 'OSPAR guidance', 'API RP 45', 'ISO 9377-2'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Water Characteristics & Primary Treatment Trains', 1),
    (v_mod2_id, v_course_id, 'Day 2: Subsurface Reinjection & Water Compatibility', 2),
    (v_mod3_id, v_course_id, 'Day 3: Environmental Discharge Regulations & Compliance', 3),
    (v_mod4_id, v_course_id, 'Day 4: Operational Chemistry, Troubleshooting & Advanced Reuse', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef040001-0001-0000-0000-000000000001', v_mod1_id, '1. Produced water characteristics', 'Oil in water; Solids; Dissolved salts and metals', 'text', 300, 1, false),
    ('ef040001-0001-0000-0000-000000000002', v_mod1_id, '2. Treatment technologies', 'Hydrocyclones; Flotation; Filtration', 'text', 300, 2, false),
    ('ef040001-0002-0000-0000-000000000001', v_mod2_id, '3. Reinjection', 'Water quality targets; Compatibility; Injectivity', 'text', 300, 1, false),
    ('ef040001-0003-0000-0000-000000000001', v_mod3_id, '4. Discharge and compliance', 'Regulations; Sampling and analysis; Reporting', 'text', 300, 1, false),
    ('ef040001-0004-0000-0000-000000000001', v_mod4_id, '5. Chemicals and operation', 'Clarifiers; Biocides; Troubleshooting', 'text', 300, 1, false),
    ('ef040001-0004-0000-0000-000000000002', v_mod4_id, '6. Reuse and new methods', 'Membranes; Reuse options', 'text', 210, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: PR05 (Boiler and cooling water treatment chemistry)
  -- =========================================================================
  v_course_id := 'cf050000-0000-0000-0000-000000000005';
  v_mod1_id := 'df050001-0000-0000-0000-000000000001';
  v_mod2_id := 'df050001-0000-0000-0000-000000000002';
  v_mod3_id := 'df050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR05', 7, 'general_technical', v_cat_pr_id, v_subcat_water_id, 'Water and process chemicals',
    'Boiler and cooling water treatment chemistry',
    'Boiler and cooling water problems cause scale, corrosion and fouling that waste energy and damage equipment in refineries, power plants and factories. This course covers water treatment chemistry and control.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Feb 1 to 3, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain water chemistry and its effects on boilers and cooling systems',
      'Select pretreatment and internal treatment programmes',
      'Control scale, corrosion and microbial growth',
      'Monitor water quality and chemical dosing',
      'Troubleshoot common water treatment failures'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Manufacturing, cement, food, beverage and mining',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Power generation, transmission and distribution'
    ],
    ARRAY[
      'Calculate cycles of concentration and blowdown',
      'Diagnose a boiler tube failure case from water data'
    ],
    ARRAY['ASME boiler water guidelines', 'IAPWS technical guidance', 'ISO 6567'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Water Chemistry Fundamentals & Pretreatment Systems', 1),
    (v_mod2_id, v_course_id, 'Day 2: Boiler Water Internal Programmes & Blowdown Control', 2),
    (v_mod3_id, v_course_id, 'Day 3: Cooling Water Treatment, Monitoring & Troubleshooting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef050001-0001-0000-0000-000000000001', v_mod1_id, '1. Water chemistry', 'Hardness and alkalinity; Dissolved gases; Silica', 'text', 240, 1, false),
    ('ef050001-0001-0000-0000-000000000002', v_mod1_id, '2. Pretreatment', 'Softening; Reverse osmosis; Demineralisation', 'text', 240, 2, false),
    ('ef050001-0002-0000-0000-000000000001', v_mod2_id, '3. Boiler water treatment', 'Oxygen scavengers; Phosphate and all volatile programmes; Blowdown', 'text', 240, 1, false),
    ('ef050001-0003-0000-0000-000000000001', v_mod3_id, '4. Cooling water treatment', 'Scale and corrosion inhibitors; Biocides; Cycles of concentration', 'text', 240, 1, false),
    ('ef050001-0003-0000-0000-000000000002', v_mod3_id, '5. Monitoring and troubleshooting', 'Test methods; Control limits; Failure cases', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: PR06 (Crude dehydration, desalting and emulsion treatment)
  -- =========================================================================
  v_course_id := 'cf060000-0000-0000-0000-000000000006';
  v_mod1_id := 'df060001-0000-0000-0000-000000000001';
  v_mod2_id := 'df060001-0000-0000-0000-000000000002';
  v_mod3_id := 'df060001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR06', 7, 'general_technical', v_cat_pr_id, v_subcat_chem_id, 'Production chemicals',
    'Crude dehydration, desalting and emulsion treatment',
    'Crude must leave the field with low water and salt content to meet export specifications and protect refineries. This course covers emulsion behaviour, dehydration and desalting equipment, demulsifier selection and troubleshooting.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 24, Sep 20 to 22. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain how emulsions form and what stabilises them',
      'Operate separators, heater treaters and electrostatic coalescers',
      'Select and optimise demulsifiers with bottle tests',
      'Control desalting performance with wash water and mixing',
      'Troubleshoot off specification crude'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Run bottle tests to choose a demulsifier and dose rate',
      'Troubleshoot an off specification BS&W case'
    ],
    ARRAY['API MPMS Chapter 10', 'ASTM D4006', 'ASTM D3230'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Emulsion Science & Separation Equipment', 1),
    (v_mod2_id, v_course_id, 'Day 2: Chemical Demulsifiers & Bottle Testing', 2),
    (v_mod3_id, v_course_id, 'Day 3: Desalting Systems & Quality Troubleshooting', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef060001-0001-0000-0000-000000000001', v_mod1_id, '1. Emulsion science', 'Formation; Stabilising agents; Droplet size', 'text', 240, 1, false),
    ('ef060001-0001-0000-0000-000000000002', v_mod1_id, '2. Separation equipment', 'Separators; Heater treaters; Electrostatic coalescers', 'text', 240, 2, false),
    ('ef060001-0002-0000-0000-000000000001', v_mod2_id, '3. Demulsifiers', 'Chemistry; Bottle testing; Injection points', 'text', 240, 1, false),
    ('ef060001-0003-0000-0000-000000000001', v_mod3_id, '4. Desalting', 'Wash water; Mixing valve setting; Salt specifications', 'text', 240, 1, false),
    ('ef060001-0003-0000-0000-000000000002', v_mod3_id, '5. Troubleshooting', 'Off specification crude; Rag layers; Case studies', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: PR07 (Production chemistry: scale, wax, asphaltene and hydrates)
  -- =========================================================================
  v_course_id := 'cf070000-0000-0000-0000-000000000007';
  v_mod1_id := 'df070001-0000-0000-0000-000000000001';
  v_mod2_id := 'df070001-0000-0000-0000-000000000002';
  v_mod3_id := 'df070001-0000-0000-0000-000000000003';
  v_mod4_id := 'df070001-0000-0000-0000-000000000004';
  v_mod5_id := 'df070001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR07', 7, 'general_technical', v_cat_pr_id, v_subcat_chem_id, 'Production chemicals',
    'Production chemistry: scale, wax, asphaltene and hydrates',
    'Scale, wax, asphaltenes and hydrates block wells and pipelines and cost operators heavily in lost production and interventions. This course covers prediction, prevention and remediation of production chemistry problems.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 26, Sep 13 to 17. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Predict scale, wax, asphaltene and hydrate risks from fluid data',
      'Select inhibitors and treatment programmes',
      'Plan squeeze treatments and continuous injection',
      'Remediate deposits safely',
      'Monitor treatment performance'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Run scale and hydrate prediction for a well',
      'Design a scale squeeze treatment',
      'Plan remediation of a waxed flowline'
    ],
    ARRAY['NACE TM0374', 'ISO 15156', 'GPSA Engineering Data Book'],
    ARRAY['AECL Oil Dynamix', 'AUPCLLC', 'ITT Bornemann', 'Xylem'],
    '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
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
    is_price_tbd = EXCLUDED.is_price_tbd,
    status = EXCLUDED.status;

  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES
    (v_mod1_id, v_course_id, 'Day 1: Water Chemistry & Mineral Scale Prediction', 1),
    (v_mod2_id, v_course_id, 'Day 2: Organic Deposits: Wax & Asphaltenes', 2),
    (v_mod3_id, v_course_id, 'Day 3: Gas Hydrates Formation & Thermodynamic Control', 3),
    (v_mod4_id, v_course_id, 'Day 4: Naphthenates, Emulsions & Injection Treatment Design', 4),
    (v_mod5_id, v_course_id, 'Day 5: Performance Monitoring, Chemical Residuals & Remediation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef070001-0001-0000-0000-000000000001', v_mod1_id, '1. Water chemistry and scale', 'Scale types; Prediction; Inhibitors and squeezes', 'text', 300, 1, false),
    ('ef070001-0002-0000-0000-000000000001', v_mod2_id, '2. Wax', 'Wax appearance temperature; Deposition; Pigging and inhibitors', 'text', 300, 1, false),
    ('ef070001-0002-0000-0000-000000000002', v_mod2_id, '3. Asphaltenes', 'Stability; Prediction; Dispersants', 'text', 300, 2, false),
    ('ef070001-0003-0000-0000-000000000001', v_mod3_id, '4. Hydrates', 'Formation conditions; Thermodynamic and kinetic inhibitors; Remediation', 'text', 300, 1, false),
    ('ef070001-0004-0000-0000-000000000001', v_mod4_id, '5. Naphthenates and emulsions', 'Formation; Control', 'text', 210, 1, false),
    ('ef070001-0004-0000-0000-000000000002', v_mod4_id, '6. Treatment design', 'Injection systems; Compatibility; Dosing', 'text', 300, 2, false),
    ('ef070001-0005-0000-0000-000000000001', v_mod5_id, '7. Monitoring and remediation', 'Residual analysis; Deposit removal; Case studies', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
