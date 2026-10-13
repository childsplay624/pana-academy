-- Migration: Seed Courses EP05 to EP09
-- Domain 6: Exploration (Oil, Gas and Mining)
-- PANA Institute Catalog 2027

DO $$
DECLARE
  v_cat_ep_id UUID;
  v_subcat_integration_id UUID;
  v_subcat_interpretation_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN
  -- 1. Resolve Category for Domain 6
  SELECT id INTO v_cat_ep_id FROM public.course_categories WHERE slug = 'exploration-oil-gas-and-mining' OR domain_no = 6 LIMIT 1;

  -- 2. Resolve Subcategories
  SELECT id INTO v_subcat_integration_id FROM public.course_subcategories WHERE category_id = v_cat_ep_id AND slug = 'data-integration' LIMIT 1;
  IF v_subcat_integration_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ep_id, 'Data integration', 'data-integration', 2)
    RETURNING id INTO v_subcat_integration_id;
  END IF;

  SELECT id INTO v_subcat_interpretation_id FROM public.course_subcategories WHERE category_id = v_cat_ep_id AND slug = 'data-interpretation' LIMIT 1;
  IF v_subcat_interpretation_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_ep_id, 'Data interpretation', 'data-interpretation', 3)
    RETURNING id INTO v_subcat_interpretation_id;
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
  -- COURSE 1: EP05 (Subsurface data management and the OSDU data platform)
  -- =========================================================================
  v_course_id := 'cc050000-0000-0000-0000-000000000005';
  v_mod1_id := 'dc050001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc050001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc050001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP05', 6, 'general_technical', v_cat_ep_id, v_subcat_integration_id, 'Data integration',
    'Subsurface data management and the OSDU data platform',
    'Subsurface data is scattered across formats, vendors and archives, which slows every study and every licensing round. The OSDU data platform offers an open standard for storing and sharing it. This course covers data management principles and how to adopt OSDU.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Mar 22 to 24, Jul 12 to 14, Nov 15 to 17. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Explain subsurface data types and their management problems',
      'Describe OSDU architecture and data model',
      'Plan data migration and quality improvement',
      'Set governance roles and policies',
      'Support national data repository needs'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'International oil companies and joint ventures',
      'Oil and gas operators and service companies',
      'Regulators and standards agencies'
    ],
    ARRAY[
      'Map a company''s subsurface data flows',
      'Plan a migration of well data to OSDU'
    ],
    ARRAY['OSDU Technical Standard', 'PPDM', 'ISO 8000'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
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
    (v_mod1_id, v_course_id, 'Day 1: Subsurface Data Types & Management Principles', 1),
    (v_mod2_id, v_course_id, 'Day 2: OSDU Platform Architecture & Data Models', 2),
    (v_mod3_id, v_course_id, 'Day 3: Migration, Quality Assurance & Data Governance', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec050001-0001-0000-0000-000000000001', v_mod1_id, '1. Subsurface data', 'Seismic, well and production data; Formats; Volumes', 'text', 240, 1, false),
    ('ec050001-0001-0000-0000-000000000002', v_mod1_id, '2. Data management principles', 'Quality; Metadata; Lifecycle', 'text', 240, 2, false),
    ('ec050001-0002-0000-0000-000000000001', v_mod2_id, '3. OSDU platform', 'Architecture; Data model; Services', 'text', 240, 1, false),
    ('ec050001-0003-0000-0000-000000000001', v_mod3_id, '4. Migration and quality', 'Data loading; Cleansing; Validation', 'text', 240, 1, false),
    ('ec050001-0003-0000-0000-000000000002', v_mod3_id, '5. Governance', 'Roles; Policies; National data repositories', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 2: EP06 (GIS for exploration, licensing and asset management)
  -- =========================================================================
  v_course_id := 'cc060000-0000-0000-0000-000000000006';
  v_mod1_id := 'dc060001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc060001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc060001-0000-0000-0000-000000000003';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP06', 6, 'general_technical', v_cat_ep_id, v_subcat_integration_id, 'Data integration',
    'GIS for exploration, licensing and asset management',
    'GIS links maps, licences, wells, pipelines and communities in one view, which makes it essential for exploration, licensing and asset management. This course teaches practical GIS skills for oil, gas and mining staff in companies and regulators.',
    v_instructor_id, 'intermediate', 'onsite', 21,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 26 to 28, Oct 11 to 13. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Set up coordinate systems and avoid common datum errors',
      'Build and manage spatial databases for licences, wells and infrastructure',
      'Carry out overlay, buffer and proximity analysis',
      'Produce clear maps for licensing rounds and management reports',
      'Publish data through web GIS with access control'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'Regulators and standards agencies',
      'Ministries, departments and government agencies'
    ],
    ARRAY[
      'Build a licence and well map for a basin',
      'Run a route analysis for a pipeline avoiding sensitive areas',
      'Publish a web map for management'
    ],
    ARRAY['ISO 19115', 'IOGP P6/11', 'EPSG geodetic parameter dataset'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
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
    (v_mod1_id, v_course_id, 'Day 1: GIS Fundamentals & Spatial Data Management', 1),
    (v_mod2_id, v_course_id, 'Day 2: Mapping Exploration Assets & Licences', 2),
    (v_mod3_id, v_course_id, 'Day 3: Spatial Analysis & Web GIS Publishing', 3)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec060001-0001-0000-0000-000000000001', v_mod1_id, '1. GIS fundamentals', 'Coordinate systems and datums; Vector and raster data; Nigerian grid and projection issues', 'text', 240, 1, false),
    ('ec060001-0001-0000-0000-000000000002', v_mod1_id, '2. Spatial data management', 'Geodatabases; Metadata; Data quality', 'text', 240, 2, false),
    ('ec060001-0002-0000-0000-000000000001', v_mod2_id, '3. Mapping assets and licences', 'Licence blocks; Wells and pipelines; Communities and sensitive areas', 'text', 240, 1, false),
    ('ec060001-0003-0000-0000-000000000001', v_mod3_id, '4. Spatial analysis', 'Overlay and buffers; Proximity and route analysis; Terrain analysis', 'text', 240, 1, false),
    ('ec060001-0003-0000-0000-000000000002', v_mod3_id, '5. Outputs and sharing', 'Cartography; Web GIS; Access control', 'text', 240, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 3: EP07 (Basin analysis and petroleum systems modelling)
  -- =========================================================================
  v_course_id := 'cc070000-0000-0000-0000-000000000007';
  v_mod1_id := 'dc070001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc070001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc070001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc070001-0000-0000-0000-000000000004';
  v_mod5_id := 'dc070001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP07', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Basin analysis and petroleum systems modelling',
    'Basin analysis and petroleum systems modelling explain where hydrocarbons were generated, how they migrated and where they may be trapped. This advanced course takes geoscientists through the full workflow from basin history to charge risk, with examples from West African margins.',
    v_instructor_id, 'advanced', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 12 to 16. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Reconstruct basin burial and thermal history',
      'Characterise source rocks using geochemical data',
      'Model maturation, expulsion and migration',
      'Assess trap timing and charge risk for prospects',
      'Present petroleum system charts and maps'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Build a 1D burial and thermal model for a well',
      'Interpret geochemical data for source rock quality',
      'Create a petroleum system event chart for a prospect'
    ],
    ARRAY['AAPG petroleum system methods', 'Society of Organic Petrology guidance', 'SPE PRMS'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
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
    (v_mod1_id, v_course_id, 'Day 1: Basin Formation & Stratigraphic Burial History', 1),
    (v_mod2_id, v_course_id, 'Day 2: Thermal History & Maturity Indicators', 2),
    (v_mod3_id, v_course_id, 'Day 3: Source Rocks, Geochemistry & Hydrocarbon Generation', 3),
    (v_mod4_id, v_course_id, 'Day 4: Hydrocarbon Migration Pathways & Seal Integrity', 4),
    (v_mod5_id, v_course_id, 'Day 5: Petroleum System Synthesis & Case Study Workshop', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec070001-0001-0000-0000-000000000001', v_mod1_id, '1. Basin formation', 'Tectonic settings; Subsidence analysis; West African margins', 'text', 270, 1, false),
    ('ec070001-0001-0000-0000-000000000002', v_mod1_id, '2. Stratigraphy and burial history', 'Sequence stratigraphy; Burial curves; Erosion events', 'text', 270, 2, false),
    ('ec070001-0002-0000-0000-000000000001', v_mod2_id, '3. Thermal history', 'Heat flow; Calibration with temperature data; Vitrinite and other indicators', 'text', 270, 1, false),
    ('ec070001-0003-0000-0000-000000000001', v_mod3_id, '4. Source rocks and geochemistry', 'Kerogen types; TOC and Rock Eval; Oil and gas correlation', 'text', 270, 1, false),
    ('ec070001-0003-0000-0000-000000000002', v_mod3_id, '5. Generation and expulsion', 'Kinetics; Transformation ratio; Expulsion efficiency', 'text', 270, 2, false),
    ('ec070001-0004-0000-0000-000000000001', v_mod4_id, '6. Migration and accumulation', 'Migration pathways; Trap timing; Seals', 'text', 270, 1, false),
    ('ec070001-0005-0000-0000-000000000001', v_mod5_id, '7. Petroleum system synthesis', 'Event charts; Charge risk maps; Uncertainty', 'text', 270, 1, false),
    ('ec070001-0005-0000-0000-000000000002', v_mod5_id, '8. Case study workshop', 'Niger Delta examples; Frontier basin examples; Peer review', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 4: EP08 (Seismic interpretation and mapping)
  -- =========================================================================
  v_course_id := 'cc080000-0000-0000-0000-000000000008';
  v_mod1_id := 'dc080001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc080001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc080001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc080001-0000-0000-0000-000000000004';
  v_mod5_id := 'dc080001-0000-0000-0000-000000000005';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP08', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Seismic interpretation and mapping',
    'Seismic interpretation turns seismic volumes into maps of structure and stratigraphy that drive drilling decisions. This course builds practical interpretation skills from well ties to depth maps, using growth faulted deltaic settings as the main examples.',
    v_instructor_id, 'intermediate', 'onsite', 35,
    'Certificate of Attendance', 'Up to 16 participants',
    'Runs on request, as a public session once enough nominations are received or in house at your site.',
    ARRAY[
      'Tie wells to seismic using synthetics',
      'Interpret horizons and faults in 2D and 3D data',
      'Recognise structural and stratigraphic traps',
      'Convert time maps to depth',
      'Present interpretation uncertainty'
    ],
    ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
    ARRAY[
      'Engineers, supervisors and senior technicians who work with this equipment or process every day',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Tie two wells and interpret a 3D volume',
      'Build time and depth maps for a prospect',
      'Present the interpretation to a peer panel'
    ],
    ARRAY['SEG interpretation guidelines', 'SEG Y rev 2', 'SPE PRMS'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
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
    (v_mod1_id, v_course_id, 'Day 1: Seismic Basics for Interpreters', 1),
    (v_mod2_id, v_course_id, 'Day 2: Well Ties & Structural Interpretation', 2),
    (v_mod3_id, v_course_id, 'Day 3: Stratigraphic Interpretation & Depositional Systems', 3),
    (v_mod4_id, v_course_id, 'Day 4: Seismic Attributes & Prospect Mapping', 4),
    (v_mod5_id, v_course_id, 'Day 5: Depth Conversion & Prospect Evaluation', 5)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec080001-0001-0000-0000-000000000001', v_mod1_id, '1. Seismic basics for interpreters', 'Polarity and phase; Resolution; Data quality', 'text', 300, 1, false),
    ('ec080001-0002-0000-0000-000000000001', v_mod2_id, '2. Well ties', 'Synthetics; Wavelets; Check shots', 'text', 300, 1, false),
    ('ec080001-0002-0000-0000-000000000002', v_mod2_id, '3. Structural interpretation', 'Faults; Horizons; Growth faults in deltas', 'text', 300, 2, false),
    ('ec080001-0003-0000-0000-000000000001', v_mod3_id, '4. Stratigraphic interpretation', 'Seismic facies; Channels and fans; Sequence boundaries', 'text', 360, 1, false),
    ('ec080001-0004-0000-0000-000000000001', v_mod4_id, '5. Attributes', 'Amplitude; Coherence; Spectral decomposition', 'text', 360, 1, false),
    ('ec080001-0004-0000-0000-000000000002', v_mod4_id, '6. Mapping', 'Gridding; Contouring; Closure analysis', 'text', 300, 2, false),
    ('ec080001-0005-0000-0000-000000000001', v_mod5_id, '7. Depth conversion', 'Velocity models; Uncertainty; Prospect maps', 'text', 300, 1, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;


  -- =========================================================================
  -- COURSE 5: EP09 (Quantitative interpretation and AVO analysis)
  -- =========================================================================
  v_course_id := 'cc090000-0000-0000-0000-000000000009';
  v_mod1_id := 'dc090001-0000-0000-0000-000000000001';
  v_mod2_id := 'dc090001-0000-0000-0000-000000000002';
  v_mod3_id := 'dc090001-0000-0000-0000-000000000003';
  v_mod4_id := 'dc090001-0000-0000-0000-000000000004';

  INSERT INTO public.courses (
    id, code, domain_no, category, category_id, subcategory_id, course_area,
    title, description, instructor_id, level, course_type, duration_hours,
    award, class_size, delivery_options, learning_outcomes, requirements,
    target_audience, practical_work, standards, oem_partners,
    start_date, end_date, price, is_free, is_price_tbd, status
  ) VALUES (
    v_course_id, 'EP09', 6, 'general_technical', v_cat_ep_id, v_subcat_interpretation_id, 'Data interpretation',
    'Quantitative interpretation and AVO analysis',
    'Quantitative interpretation links seismic amplitudes to rock and fluid properties, cutting dry hole risk in amplitude supported plays. This advanced course covers rock physics, AVO analysis, inversion and risking.',
    v_instructor_id, 'advanced', 'onsite', 28,
    'Certificate of Attendance', 'Up to 16 participants',
    'Public sessions: Apr 12 to 15. Venue and fee TBD. In house dates on request.',
    ARRAY[
      'Build rock physics models from well data',
      'Model and interpret AVO responses',
      'Run and assess seismic inversion',
      'Use QI results to risk prospects',
      'Recognise pitfalls such as tuning and processing artefacts'
    ],
    ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
    ARRAY[
      'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
      'Oil and gas operators and service companies',
      'International oil companies and joint ventures'
    ],
    ARRAY[
      'Run fluid substitution and AVO modelling',
      'Interpret AVO crossplots for a prospect'
    ],
    ARRAY['SEG QI best practice', 'Rock physics handbook methods', 'SPE PRMS'],
    ARRAY['NXT', 'AGI', 'TechnoImaging', 'Geotech', 'Inreena', 'Deep International'],
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
    (v_mod1_id, v_course_id, 'Day 1: Rock Physics & AVO Theory', 1),
    (v_mod2_id, v_course_id, 'Day 2: AVO Analysis & Crossplotting', 2),
    (v_mod3_id, v_course_id, 'Day 3: Seismic Inversion & Quality Checks', 3),
    (v_mod4_id, v_course_id, 'Day 4: Risking with QI & Deepwater Case Studies', 4)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    order_index = EXCLUDED.order_index;

  INSERT INTO public.lessons (id, module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
  VALUES
    ('ec090001-0001-0000-0000-000000000001', v_mod1_id, '1. Rock physics', 'Elastic properties; Fluid substitution; Rock physics templates', 'text', 270, 1, false),
    ('ec090001-0001-0000-0000-000000000002', v_mod1_id, '2. AVO theory', 'Reflection coefficients; AVO classes; Approximations', 'text', 270, 2, false),
    ('ec090001-0002-0000-0000-000000000001', v_mod2_id, '3. AVO analysis', 'Gathers and conditioning; Crossplots; Attributes', 'text', 270, 1, false),
    ('ec090001-0003-0000-0000-000000000001', v_mod3_id, '4. Seismic inversion', 'Deterministic inversion; Stochastic inversion; Quality checks', 'text', 270, 1, false),
    ('ec090001-0004-0000-0000-000000000001', v_mod4_id, '5. Risking with QI', 'DHI checklists; Pitfalls; Calibration with wells', 'text', 270, 1, false),
    ('ec090001-0004-0000-0000-000000000002', v_mod4_id, '6. Case studies', 'Deepwater examples; Success and failure cases; Lessons', 'text', 270, 2, false)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    duration_minutes = EXCLUDED.duration_minutes,
    order_index = EXCLUDED.order_index;

END $$;
