-- Migration: Seed Courses PD17, PD18, PD19, PD20, PD21
-- Domain 1 / Power and Drives (PANA Institute Catalog 2027)

DO $$
DECLARE
  v_cat_id UUID;
  v_subcat_pump_id UUID;
  v_subcat_elec_id UUID;
  v_subcat_pkg_id UUID;
  v_instructor_id UUID;
  v_course_id UUID;
  v_mod_id UUID;
BEGIN
  -- 1. Resolve Category & Subcategories
  SELECT id INTO v_cat_id FROM public.course_categories WHERE slug = 'power-and-drives' LIMIT 1;
  IF v_cat_id IS NULL THEN
    SELECT id INTO v_cat_id FROM public.course_categories WHERE domain_no = 1 LIMIT 1;
  END IF;

  SELECT id INTO v_subcat_pump_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'pumping-systems' LIMIT 1;
  IF v_subcat_pump_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Pumping systems', 'pumping-systems', 3)
    RETURNING id INTO v_subcat_pump_id;
  END IF;

  SELECT id INTO v_subcat_elec_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'electrical-power-systems-lv-and-mv' LIMIT 1;
  IF v_subcat_elec_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Electrical power systems (LV and MV)', 'electrical-power-systems-lv-and-mv', 2)
    RETURNING id INTO v_subcat_elec_id;
  END IF;

  SELECT id INTO v_subcat_pkg_id FROM public.course_subcategories WHERE category_id = v_cat_id AND slug = 'packaged-and-engineered-systems' LIMIT 1;
  IF v_subcat_pkg_id IS NULL THEN
    INSERT INTO public.course_subcategories (category_id, name, slug, display_order)
    VALUES (v_cat_id, 'Packaged and engineered systems', 'packaged-and-engineered-systems', 4)
    RETURNING id INTO v_subcat_pkg_id;
  END IF;

  -- 2. Resolve Instructor Profile
  SELECT id INTO v_instructor_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM public.profiles LIMIT 1;
  END IF;
  IF v_instructor_id IS NULL THEN
    SELECT id INTO v_instructor_id FROM auth.users LIMIT 1;
  END IF;


  -- =========================================================================
  -- COURSE 1: PD17 (Pump system reliability and energy optimisation)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD17' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD17', 1, 'flow_drives', v_cat_id, v_subcat_pump_id, 'Pumping systems',
      'Pump system reliability and energy optimisation',
      'Pumping systems use a large share of industrial electricity and often run far from their best efficiency point, which wastes energy and shortens equipment life. This course shows engineers how to assess pumping systems and raise reliability and efficiency together.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Runs on request, as a public session once enough nominations are received or in house at your site. Venue and fee TBD.',
      ARRAY[
        'Assess a pumping system against its best efficiency point',
        'Identify sources of energy waste such as throttling and recirculation',
        'Relate operating point to failure rates and maintenance cost',
        'Evaluate options such as impeller trim, VSDs and resizing',
        'Build a business case for improvement'
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
        'Carry out a pumping system assessment on a plant case study',
        'Calculate savings from a VSD retrofit and an impeller trim'
      ],
      ARRAY['ISO 14414', 'ISO 50001', 'Hydraulic Institute guidelines'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-01-01 08:30:00+00', '2027-12-31 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Pumping System Assessment & Reliability Correlations', 'Data collection, system curves, efficiency mapping, operation away from BEP, and failure statistics (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. System assessment', 'Data collection; System curves; Efficiency mapping.', 'text', 240, 1),
    (v_mod_id, '2. Reliability links', 'Operation away from BEP; Failure statistics; Maintenance cost.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Energy Saving Measures & Optimization Technologies', 'Speed control, VSD retrofits, impeller trimming, pump resizing, and control valve elimination (5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Energy saving measures', 'Speed control; Impeller trim; Right sizing.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Continuous Monitoring, KPIs & Investment Business Cases', 'Energy/reliability KPIs, condition monitoring dashboards, lifecycle costing, payback, and CAPEX approval (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Monitoring', 'Energy and reliability KPIs; Condition data; Dashboards.', 'text', 240, 1),
    (v_mod_id, '5. Business case', 'Savings calculation; Payback and lifecycle cost; Approval.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 2: PD18 (Variable speed drives: application, commissioning and troubleshooting)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD18' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD18', 1, 'flow_drives', v_cat_id, v_subcat_elec_id, 'Electrical power systems (LV and MV)',
      'Variable speed drives: application, commissioning and troubleshooting',
      'Variable speed drives save energy and give fine process control, but poor application and commissioning cause trips, motor damage and harmonics. This competence course trains technicians and engineers to select, install, set up and fault find VSDs.',
      v_instructor_id, 'intermediate', 'onsite', 28,
      'Certificate of Competence', 'Up to 16 participants',
      'Public sessions: Feb 1 to 4, Aug 16 to 19. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Explain drive topologies and control methods',
        'Select drives for pump, fan, conveyor and compressor loads',
        'Commission a drive and tune key parameters',
        'Address harmonics, EMC and motor insulation stress',
        'Diagnose common drive faults using fault logs'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Manufacturing, cement, food, beverage and mining',
        'Power generation, transmission and distribution',
        'Oil and gas operators and service companies',
        'Engineering, EPC, maintenance and technical service contractors'
      ],
      ARRAY[
        'Commission a drive and motor set on a training rig',
        'Diagnose four induced faults'
      ],
      ARRAY['IEC 61800', 'IEC 60034 17', 'IEEE 519'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-02-01 08:30:00+00', '2027-02-04 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Drive Principles, Topologies & Load Sizing', 'Rectifiers, DC links, PWM inverters, V/f, open/closed loop vector, dynamic braking, and load sizing (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Drive principles', 'Rectifier, DC link and inverter; V/f and vector control; Braking.', 'text', 270, 1),
    (v_mod_id, '2. Application and selection', 'Load types; Sizing; Bypass and redundancy.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Electrical Installation, EMC & Motor Protection', 'Cabling, 360-degree shielding, EMC glanding, dv/dt filters, line reactors, and bearing currents (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Installation', 'Cabling, EMC and earthing; Filters and reactors; Motor protection.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Commissioning, Autotuning & Industrial Comms', 'Parameter sets, motor identification run, PID speed loops, ramp profiles, and fieldbus comms (4.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Commissioning', 'Parameter setup; Autotuning; Communication setup.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Diagnostic Fault Finding & Practical Competence Exam', 'Fault memory logs, overvoltage/overcurrent tracing, cooling checks, and assessed hands-on tasks (9h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Fault finding', 'Fault codes and logs; Overcurrent and overvoltage trips; Cooling and environment.', 'text', 270, 1),
    (v_mod_id, '6. Practical assessment', 'Commissioning task; Fault task; Written test.', 'quiz', 270, 2);


  -- =========================================================================
  -- COURSE 3: PD19 (Large motors and VSD systems for compressors and pumps)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD19' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD19', 1, 'flow_drives', v_cat_id, v_subcat_elec_id, 'Electrical power systems (LV and MV)',
      'Large motors and VSD systems for compressors and pumps',
      'Large motors and medium voltage drives now power compressors and pumps that once ran on gas turbines. This advanced course covers selection, design review, testing and protection of large motor and VSD trains.',
      v_instructor_id, 'advanced', 'onsite', 28,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Jan 25 to 28. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Specify large induction and synchronous motors for process duties',
        'Compare MV drive topologies and their effects on the network',
        'Review torsional and lateral dynamics of motor driven trains',
        'Plan factory, string and site testing',
        'Set protection and monitoring for motor and drive systems'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'Oil and gas operators and service companies',
        'Power generation, transmission and distribution',
        'Process industries: refining, petrochemicals, fertiliser, gas processing'
      ],
      ARRAY[
        'Review a motor and drive datasheet package',
        'Assess a torsional study for a compressor train'
      ],
      ARRAY['API 541', 'API 546', 'IEC 61800 4', 'IEC 60034'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-01-25 08:30:00+00', '2027-01-28 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Large Motors Specification & MV Drive Topologies', 'Induction vs synchronous, cooling methods, Ex enclosures, CSI/VSI/LCI topologies, and grid effects (9h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Large motors', 'Induction and synchronous; Enclosures and cooling; Hazardous area motors.', 'text', 270, 1),
    (v_mod_id, '2. MV drives', 'Topologies; Network effects; Redundancy.', 'text', 270, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Complete Train Dynamics, Torsional Analysis & Couplings', 'Torsional natural frequencies, Campbell diagrams, gearbox interaction, couplings, and lateral checks (4.5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Train dynamics', 'Torsional analysis; Gearboxes; Lateral checks.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Factory Acceptance, String Testing & Site Commissioning', 'API 541 routine/type tests, full-load string testing, back-to-back testing, and site integration (4.5h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. Testing', 'Factory tests; String tests; Site tests.', 'text', 270, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 4: Protection, Condition Monitoring & Electrification Case Studies', 'Motor relays, partial discharge monitoring, drive diagnostics, lessons learned, and checklists (9h)', 4)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '5. Protection and monitoring', 'Motor protection; Drive diagnostics; Online monitoring.', 'text', 270, 1),
    (v_mod_id, '6. Case studies', 'Electrification projects; Lessons learned; Specification checklists.', 'text', 270, 2);


  -- =========================================================================
  -- COURSE 4: PD20 (Packaged equipment skids: design review, FAT and SAT)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD20' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD20', 1, 'flow_drives', v_cat_id, v_subcat_pkg_id, 'Packaged and engineered systems',
      'Packaged equipment skids: design review, FAT and SAT',
      'Packaged skids arrive on site as complete systems, so problems missed at the factory turn into costly delays in the field. This course trains engineers to review skid design and run effective factory and site acceptance tests.',
      v_instructor_id, 'intermediate', 'onsite', 21,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Feb 22 to 24, Aug 9 to 11. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Review skid layout, structure and piping for operability and access',
        'Check instrumentation, control and electrical scope against specifications',
        'Prepare FAT and SAT procedures and punch lists',
        'Witness tests and judge acceptance',
        'Manage handover documentation'
      ],
      ARRAY['Working knowledge of plant operations or two years of relevant experience.'],
      ARRAY[
        'Engineers, supervisors and senior technicians who work with this equipment or process every day',
        'Engineering, EPC, maintenance and technical service contractors',
        'Oil and gas operators and service companies',
        'International oil companies and joint ventures'
      ],
      ARRAY[
        'Review a skid design package and raise comments',
        'Write an FAT procedure and punch list'
      ],
      ARRAY['API 614', 'API 616', 'IEC 62381', 'ISO 9001'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-02-22 08:30:00+00', '2027-02-24 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Mechanical Skid Design, Structure & Electrical/Control Scope', 'Layout, ergonomics, lifting lugs, structural stress, junction boxes, and hazardous area compliance (8h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Skid design review', 'Layout and access; Structure and lifting; Piping and stress.', 'text', 240, 1),
    (v_mod_id, '2. Electrical and control scope', 'Panels and wiring; Control logic; Hazardous area compliance.', 'text', 240, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Factory Acceptance Test (FAT) Protocols & Punch Listing', 'FAT inspection test plans, hydrostatic testing, unbalance runs, loop checks, and punch categorization (5h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. FAT planning and execution', 'Procedures; Witnessing; Punch lists.', 'text', 300, 1);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 3: Site Acceptance Testing (SAT), Plant Integration & Handover', 'Site tie-ins, cold/hot alignment, commissioning checks, manufacturer data books, and handover sign-off (8h)', 3)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '4. SAT and integration', 'Site tests; Integration with plant systems; Performance checks.', 'text', 240, 1),
    (v_mod_id, '5. Documentation and handover', 'Data books; Certificates; Handover.', 'text', 240, 2);


  -- =========================================================================
  -- COURSE 5: PD21 (Electric drive conversion of gas turbine driven trains)
  -- =========================================================================
  SELECT id INTO v_course_id FROM public.courses WHERE code = 'PD21' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO public.courses (
      code, domain_no, category, category_id, subcategory_id, course_area,
      title, description, instructor_id, level, course_type, duration_hours,
      award, class_size, delivery_options, learning_outcomes, requirements,
      target_audience, practical_work, standards, oem_partners,
      start_date, end_date, price, is_free, is_price_tbd, status
    ) VALUES (
      'PD21', 1, 'flow_drives', v_cat_id, v_subcat_pkg_id, 'Packaged and engineered systems',
      'Electric drive conversion of gas turbine driven trains',
      'Replacing gas turbine drivers with electric motors cuts emissions and maintenance, but it changes power demand, controls and plant layout. This short advanced course sets out the technical and commercial case for electrifying compressor and pump trains.',
      v_instructor_id, 'advanced', 'onsite', 14,
      'Certificate of Attendance', 'Up to 16 participants',
      'Public sessions: Mar 15 to 16, Sep 6 to 7. Venue and fee TBD. In house dates on request.',
      ARRAY[
        'Assess the emission and cost case for electric drive conversion',
        'Identify power supply, grid and network implications',
        'Outline motor, drive and gearbox options',
        'Plan the conversion project, shutdown and risks',
        'Compare full and partial electrification options'
      ],
      ARRAY['Degree or diploma in a relevant field and five years of experience, or the intermediate course.'],
      ARRAY[
        'Senior engineers, specialists and technical leads responsible for design, integrity or performance',
        'International oil companies and joint ventures',
        'Oil and gas operators and service companies',
        'Sustainability, ESG and energy transition teams'
      ],
      ARRAY[
        'Build an emissions and cost comparison for a compressor train conversion',
        'Identify the power supply risks for an onshore site'
      ],
      ARRAY['API 541', 'API 546', 'ISO 14064 1'],
      ARRAY['ITT Bornemann', 'ITT Goulds Pumps', 'Baker Hughes', 'ACTOM', 'Siemens', 'GE Vernova', 'Petronash', 'Xylem', 'Thomassen Energy'],
      '2027-03-15 08:30:00+00', '2027-03-16 16:30:00+00',
      0, false, true, 'published'
    ) RETURNING id INTO v_course_id;
  END IF;

  DELETE FROM public.modules WHERE course_id = v_course_id;

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 1: Drivers for Electrification & Power Supply Architecture', 'Emissions/carbon pricing, gas turbine OPEX vs motor availability, grid supply, and generation (7h)', 1)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '1. Why electrify', 'Emissions and carbon pricing; Maintenance and availability; Operator experience.', 'text', 210, 1),
    (v_mod_id, '2. Power supply options', 'Grid supply; Onsite generation; Renewable integration.', 'text', 210, 2);

  INSERT INTO public.modules (course_id, title, description, order_index)
  VALUES (v_course_id, 'Day 2: Technical Drive Solutions & Brownfield Project Delivery', 'Motor/VSD configurations, gearbox retrofits, skid footprint, shutdown phasing, and business case (7h)', 2)
  RETURNING id INTO v_mod_id;
  INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index) VALUES
    (v_mod_id, '3. Technical solutions', 'Motors, drives and gearboxes; Controls changes; Space and weight.', 'text', 210, 1),
    (v_mod_id, '4. Project planning', 'Phasing and shutdown; Risks; Business case.', 'text', 210, 2);

END $$;
