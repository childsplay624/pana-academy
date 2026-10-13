-- Migration: Seed Courses PR08 to PR12
-- Domain 7: Production
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_pr_id UUID;
  v_subcat_chem_id UUID;
  v_subcat_fox_id UUID;
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
  SELECT id INTO v_subcat_chem_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'production-chemicals' LIMIT 1;
  IF v_subcat_chem_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'Production chemicals', 'production-chemicals', 3)
    RETURNING id INTO v_subcat_chem_id;
  END IF;

  SELECT id INTO v_subcat_fox_id FROM public.course_subcategories WHERE category_id = v_cat_pr_id AND slug = 'the-field-operations-excellence-the-fox-production' LIMIT 1;
  IF v_subcat_fox_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_pr_id, 'The Field Operations Excellence (THE FOx)', 'the-field-operations-excellence-the-fox-production', 4)
    RETURNING id INTO v_subcat_fox_id;
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
  -- COURSE 1: PR08 (Corrosion inhibition and chemical injection management)
  -- =========================================================================
  v_course_id := 'cf080000-0000-0000-0000-000000000008';
  v_mod1_id := 'df080001-0000-0000-0000-000000000001';
  v_mod2_id := 'df080001-0000-0000-0000-000000000002';
  v_mod3_id := 'df080001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR08', 7, 'general_technical', v_cat_pr_id, v_subcat_chem_id, 'Production chemicals',
    'Corrosion inhibition and chemical injection management',
    'Corrosion inhibitors protect pipelines and facilities only if they reach the metal at the right dose. This competence course trains staff to run chemical injection and corrosion inhibition programmes.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
    ARRAY[
      'Explain internal corrosion mechanisms in oil and gas systems',
      'Select inhibitors for given conditions',
      'Set and verify injection rates',
      'Monitor with coupons, probes and residuals',
      'Maintain injection equipment'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Process industries: refining, petrochemicals, fertiliser, gas processing',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Calculate and verify injection rates for a pipeline',
      'Interpret coupon and probe data'
    ],
    ARRAY['NACE SP0775', 'NACE SP0106', 'ISO 21457'],
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
    (v_mod1_id, v_course_id, 'Day 1: Corrosion Mechanisms & Laboratory Inhibitor Selection', 1),
    (v_mod2_id, v_course_id, 'Day 2: Chemical Injection Pumps, Quills & Rate Verification', 2),
    (v_mod3_id, v_course_id, 'Day 3: Monitoring Probes, Residuals & Programme Management', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef080001-0001-0000-0000-000000000001', v_mod1_id, '1. Corrosion mechanisms', 'CO2 and H2S corrosion; Microbial corrosion; Erosion corrosion', 'text', 270, 1, false),
    ('ef080001-0001-0000-0000-000000000002', v_mod1_id, '2. Inhibitor selection', 'Inhibitor types; Laboratory tests; Compatibility', 'text', 270, 2, false),
    ('ef080001-0002-0000-0000-000000000001', v_mod2_id, '3. Injection systems', 'Pumps and quills; Rate setting; Verification', 'text', 270, 1, false),
    ('ef080001-0003-0000-0000-000000000001', v_mod3_id, '4. Monitoring and assessment', 'Coupons and probes; Residuals; Practical test', 'text', 270, 1, false),
    ('ef080001-0003-0000-0000-000000000002', v_mod3_id, '5. Programme management', 'KPIs; Reporting', 'text', 180, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: PR09 (Flow assurance fundamentals)
  -- =========================================================================
  v_course_id := 'cf090000-0000-0000-0000-000000000009';
  v_mod1_id := 'df090001-0000-0000-0000-000000000001';
  v_mod2_id := 'df090001-0000-0000-0000-000000000002';
  v_mod3_id := 'df090001-0000-0000-0000-000000000003';
  v_mod4_id := 'df090001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR09', 7, 'general_technical', v_cat_pr_id, v_subcat_chem_id, 'Production chemicals',
    'Flow assurance fundamentals',
    'Flow assurance keeps oil and gas moving from reservoir to export through cold seabed lines, long onshore pipelines and ageing facilities. This course covers multiphase flow, slugging, thermal management and solids risks, and how simulation supports operating decisions.',
    v_instructor_id, 'intermediate', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Jun 21 to 24, Dec 6 to 9. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain multiphase flow regimes, hold up and slugging',
      'Assess hydrate, wax and asphaltene risks along a flowline',
      'Design thermal and chemical management strategies',
      'Plan operating strategies for startup, shutdown and cold restart',
      'Use steady state and transient simulation results in decisions'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Analyse a flowline for slugging and hydrate risk',
      'Plan a cold restart strategy for a subsea tieback'
    ],
    ARRAY['DNV RP F109', 'API RP 17A', 'GPSA Engineering Data Book', 'ISO 13628-1'],
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
    (v_mod1_id, v_course_id, 'Day 1: Multiphase Flow Regimes & Slugging Mitigation', 1),
    (v_mod2_id, v_course_id, 'Day 2: Thermal Management, Insulation & Cooldown Times', 2),
    (v_mod3_id, v_course_id, 'Day 3: Solids Management: Hydrates, Wax, Sand & Scale', 3),
    (v_mod4_id, v_course_id, 'Day 4: Cold Restart Operations & Dynamic Flow Simulation', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef090001-0001-0000-0000-000000000001', v_mod1_id, '1. Multiphase flow', 'Flow regimes; Pressure drop; Liquid hold up', 'text', 270, 1, false),
    ('ef090001-0001-0000-0000-000000000002', v_mod1_id, '2. Slugging', 'Terrain and riser slugging; Hydrodynamic slugs; Mitigation and slug catchers', 'text', 270, 2, false),
    ('ef090001-0002-0000-0000-000000000001', v_mod2_id, '3. Thermal management', 'Insulation; Active heating; Cooldown times', 'text', 270, 1, false),
    ('ef090001-0003-0000-0000-000000000001', v_mod3_id, '4. Solids management', 'Hydrates; Wax; Sand and scale', 'text', 270, 1, false),
    ('ef090001-0004-0000-0000-000000000001', v_mod4_id, '5. Operations', 'Startup and cold restart; Shutdown and depressurisation; Pigging', 'text', 270, 1, false),
    ('ef090001-0004-0000-0000-000000000002', v_mod4_id, '6. Simulation', 'Steady state models; Transient models; Using results', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: PR10 (Chemical compatibility, qualification and laboratory testing)
  -- =========================================================================
  v_course_id := 'cf100000-0000-0000-0000-000000000010';
  v_mod1_id := 'df100001-0000-0000-0000-000000000001';
  v_mod2_id := 'df100001-0000-0000-0000-000000000002';
  v_mod3_id := 'df100001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR10', 7, 'general_technical', v_cat_pr_id, v_subcat_chem_id, 'Production chemicals',
    'Chemical compatibility, qualification and laboratory testing',
    'Field chemicals must be compatible with produced fluids, materials and each other, and laboratory tests are how a chemical is proven before it reaches the field. This foundation competence course trains laboratory and field staff to handle chemicals safely and to run and report the standard compatibility and performance tests.',
    v_instructor_id, 'beginner', 'onsite', 21,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Feb 22 to 24, Aug 2 to 4. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Handle and store production chemicals safely using safety data sheets',
      'Carry out fluid, material and chemical to chemical compatibility tests',
      'Run bottle, scale and corrosion performance tests to procedure',
      'Record and report results that support chemical selection',
      'Keep samples and records traceable'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors',
      'Process industries: refining, petrochemicals, fertiliser, gas processing'
    ],
    ARRAY[
      'Run compatibility and bottle tests on supplied samples',
      'Write a chemical qualification report'
    ],
    ARRAY['ISO/IEC 17025', 'NACE TM0374', 'ASTM D4006', 'GHS'],
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
    (v_mod1_id, v_course_id, 'Day 1: Chemical Safety & Fluid/Material Compatibility', 1),
    (v_mod2_id, v_course_id, 'Day 2: Bottle, Scale & Corrosion Performance Tests', 2),
    (v_mod3_id, v_course_id, 'Day 3: Quality Traceability, Calibration & Practical Assessment', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef100001-0001-0000-0000-000000000001', v_mod1_id, '1. Chemical safety', 'Safety data sheets; Handling and PPE; Storage and spills', 'text', 240, 1, false),
    ('ef100001-0001-0000-0000-000000000002', v_mod1_id, '2. Compatibility testing', 'Fluid compatibility; Material and elastomer compatibility; Chemical mixing tests', 'text', 240, 2, false),
    ('ef100001-0002-0000-0000-000000000001', v_mod2_id, '3. Performance tests', 'Demulsifier bottle tests; Scale inhibitor tests; Corrosion inhibitor tests', 'text', 240, 1, false),
    ('ef100001-0003-0000-0000-000000000001', v_mod3_id, '4. Quality and traceability', 'Sampling; Chain of custody; Equipment calibration', 'text', 240, 1, false),
    ('ef100001-0003-0000-0000-000000000002', v_mod3_id, '5. Reporting and assessment', 'Laboratory records; Report writing; Practical test', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: PR11 (Production operations for field operators)
  -- =========================================================================
  v_course_id := 'cf110000-0000-0000-0000-000000000011';
  v_mod1_id := 'df110001-0000-0000-0000-000000000001';
  v_mod2_id := 'df110001-0000-0000-0000-000000000002';
  v_mod3_id := 'df110001-0000-0000-0000-000000000003';
  v_mod4_id := 'df110001-0000-0000-0000-000000000004';
  v_mod5_id := 'df110001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR11', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Production operations for field operators',
    'Field operators keep wells and production facilities running safely every day. This foundation competence course gives new and developing operators a solid grounding in production systems, routine operations, safety and reporting.',
    v_instructor_id, 'beginner', 'onsite', 35,
    'Certificate of Competence', 'Up to 16 participants',
    'Public sessions: Mar 15 to 19, Sep 20 to 24. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Describe the production system from reservoir to export',
      'Carry out routine checks on wells, separators, pumps and compressors',
      'Start up and shut down equipment to procedure',
      'Recognise abnormal conditions and respond safely',
      'Record production data and hand over shifts accurately'
    ],
    ARRAY['No previous training needed. Comfort with basic drawings and data sheets helps.'],
    ARRAY[
      'Operators, technicians, graduate engineers and staff new to the subject',
      'Oil and gas operators and service companies',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Operate a separator train on a process simulator',
      'Carry out a well choke change and record data',
      'Complete a shift handover report'
    ],
    ARRAY['API RP 14C', 'API RP 14J', 'ISO 45001', 'NUPRC operating guidelines'],
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
    (v_mod1_id, v_course_id, 'Day 1: Production System Overview & Key Equipment', 1),
    (v_mod2_id, v_course_id, 'Day 2: Wells, Wellheads & Separation Trains', 2),
    (v_mod3_id, v_course_id, 'Day 3: Rotating Equipment Basics: Pumps & Compressors', 3),
    (v_mod4_id, v_course_id, 'Day 4: Safety Systems (ESD/F&G) & Shift Reporting', 4),
    (v_mod5_id, v_course_id, 'Day 5: Practical Simulator Assessment & Field Checks', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef110001-0001-0000-0000-000000000001', v_mod1_id, '1. Production system overview', 'Reservoir to export; Process flow diagrams; Key equipment', 'text', 300, 1, false),
    ('ef110001-0002-0000-0000-000000000001', v_mod2_id, '2. Wells and wellheads', 'Well types; Wellhead equipment; Choke operation', 'text', 300, 1, false),
    ('ef110001-0002-0000-0000-000000000002', v_mod2_id, '3. Separation and treatment', 'Separators; Dehydration; Water treatment', 'text', 300, 2, false),
    ('ef110001-0003-0000-0000-000000000001', v_mod3_id, '4. Rotating equipment basics', 'Pumps; Compressors; Routine checks', 'text', 300, 1, false),
    ('ef110001-0004-0000-0000-000000000001', v_mod4_id, '5. Safety systems', 'ESD and fire and gas; Permits; Emergency response', 'text', 300, 1, false),
    ('ef110001-0004-0000-0000-000000000002', v_mod4_id, '6. Production data and reporting', 'Daily reports; Well tests; Shift handover', 'text', 300, 2, false),
    ('ef110001-0005-0000-0000-000000000001', v_mod5_id, '7. Practical assessment', 'Simulator tasks; Field checks; Written test', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: PR12 (Artificial lift: ESP, gas lift and rod pumps)
  -- =========================================================================
  v_course_id := 'cf120000-0000-0000-0000-000000000012';
  v_mod1_id := 'df120001-0000-0000-0000-000000000001';
  v_mod2_id := 'df120001-0000-0000-0000-000000000002';
  v_mod3_id := 'df120001-0000-0000-0000-000000000003';
  v_mod4_id := 'df120001-0000-0000-0000-000000000004';
  v_mod5_id := 'df120001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'PR12', 7, 'general_technical', v_cat_pr_id, v_subcat_fox_id, 'The Field Operations Excellence (THE FOx)',
    'Artificial lift: ESP, gas lift and rod pumps',
    'Artificial lift keeps wells flowing when reservoir pressure falls, and choosing and running the right lift method has a large effect on output and cost. This course covers ESP, gas lift and rod pump systems.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 26, Sep 13 to 17. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Select artificial lift methods for given well conditions',
      'Design and optimise gas lift systems',
      'Size and monitor ESP systems',
      'Design and diagnose rod pump systems',
      'Troubleshoot lift problems using surveillance data'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures',
      'Engineering, EPC, maintenance and technical service contractors'
    ],
    ARRAY[
      'Design a gas lift string for a well',
      'Size an ESP and diagnose two failures from data',
      'Interpret dynamometer cards'
    ],
    ARRAY['API RP 11L', 'API RP 11S', 'API RP 11V5'],
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
    (v_mod1_id, v_course_id, 'Day 1: Well Inflow & Artificial Lift Selection Criteria', 1),
    (v_mod2_id, v_course_id, 'Day 2: Gas Lift String Design, Valve Mechanics & Optimisation', 2),
    (v_mod3_id, v_course_id, 'Day 3: ESP Sizing, Pump Mechanics & Variable Speed Operation', 3),
    (v_mod4_id, v_course_id, 'Day 4: ESP Electrical Surveillance & Rod Pump Dynamometers', 4),
    (v_mod5_id, v_course_id, 'Day 5: Multi-Lift Troubleshooting & Operational Case Studies', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ef120001-0001-0000-0000-000000000001', v_mod1_id, '1. Lift selection', 'Well inflow; Selection criteria; Economics', 'text', 330, 1, false),
    ('ef120001-0002-0000-0000-000000000001', v_mod2_id, '2. Gas lift design', 'Valve mechanics; Design methods; Unloading', 'text', 330, 1, false),
    ('ef120001-0002-0000-0000-000000000002', v_mod2_id, '3. Gas lift optimisation', 'Injection allocation; Diagnostics; Instability', 'text', 330, 2, false),
    ('ef120001-0003-0000-0000-000000000001', v_mod3_id, '4. ESP systems', 'Pump, motor and seal; Sizing; Variable speed operation', 'text', 330, 1, false),
    ('ef120001-0004-0000-0000-000000000001', v_mod4_id, '5. ESP surveillance', 'Amp charts; Failure analysis; Run life', 'text', 330, 1, false),
    ('ef120001-0004-0000-0000-000000000002', v_mod4_id, '6. Rod pumps', 'Pumping units; Dynamometer cards; Design', 'text', 330, 2, false),
    ('ef120001-0005-0000-0000-000000000001', v_mod5_id, '7. Troubleshooting', 'Case studies across lift types', 'text', 120, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
