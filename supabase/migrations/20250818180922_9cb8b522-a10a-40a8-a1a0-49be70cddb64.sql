-- Insert sample modules for the Oil and Gas course
INSERT INTO public.modules (course_id, title, description, order_index) VALUES
('d090a8c9-3370-4b06-9004-5c7102d32893', 'Introduction to Oil and Gas Industry', 'Overview of the petroleum industry, its history, and global significance', 1),
('d090a8c9-3370-4b06-9004-5c7102d32893', 'Exploration and Drilling', 'Understanding geological surveys, seismic analysis, and drilling techniques', 2),
('d090a8c9-3370-4b06-9004-5c7102d32893', 'Production and Processing', 'Learn about extraction methods, refining processes, and quality control', 3),
('d090a8c9-3370-4b06-9004-5c7102d32893', 'Safety and Environmental Regulations', 'Critical safety protocols and environmental compliance in the industry', 4);

-- Get the module IDs for inserting lessons
WITH module_data AS (
  SELECT id, title, order_index 
  FROM public.modules 
  WHERE course_id = 'd090a8c9-3370-4b06-9004-5c7102d32893'
)
-- Insert sample lessons for each module
INSERT INTO public.lessons (module_id, title, content, lesson_type, duration_minutes, order_index, is_free)
SELECT 
  m.id,
  lesson_data.title,
  lesson_data.content,
  lesson_data.lesson_type,
  lesson_data.duration_minutes,
  lesson_data.order_index,
  lesson_data.is_free
FROM module_data m
CROSS JOIN (
  -- Module 1: Introduction lessons
  SELECT 'History of Oil and Gas' as title, 
         '<h2>The Evolution of the Petroleum Industry</h2><p>The oil and gas industry has shaped the modern world. From the first oil well drilled in Pennsylvania in 1859 to today''s advanced extraction technologies, this industry has been at the forefront of global economic development.</p><h3>Key Milestones:</h3><ul><li>1859: First commercial oil well</li><li>1901: Spindletop oil discovery in Texas</li><li>1960: Formation of OPEC</li><li>2000s: Shale revolution</li></ul>' as content,
         'video' as lesson_type, 15 as duration_minutes, 1 as order_index, true as is_free, 1 as module_order
  UNION ALL
  SELECT 'Global Market Overview', 
         '<h2>Understanding the Global Oil and Gas Market</h2><p>The petroleum industry is one of the largest sectors in the global economy. Understanding market dynamics, pricing mechanisms, and geopolitical factors is crucial for industry professionals.</p><h3>Market Fundamentals:</h3><ul><li>Supply and demand dynamics</li><li>OPEC influence on pricing</li><li>Geopolitical impact on markets</li><li>Future energy transition challenges</li></ul>',
         'text', 20, 2, true, 1
  UNION ALL
  SELECT 'Industry Structure and Key Players',
         '<h2>Major Companies and Industry Structure</h2><p>The oil and gas industry consists of upstream, midstream, and downstream sectors, each with distinct operations and challenges.</p><h3>Industry Segments:</h3><ul><li>Upstream: Exploration and production</li><li>Midstream: Transportation and storage</li><li>Downstream: Refining and marketing</li></ul>',
         'text', 25, 3, false, 1
  
  -- Module 2: Exploration lessons  
  UNION ALL
  SELECT 'Geological Fundamentals',
         '<h2>Understanding Petroleum Geology</h2><p>Successful oil and gas exploration requires deep understanding of geological processes that create and trap hydrocarbons.</p><h3>Key Concepts:</h3><ul><li>Source rock formation</li><li>Migration pathways</li><li>Reservoir rock characteristics</li><li>Trap mechanisms</li></ul>',
         'video', 30, 1, true, 2
  UNION ALL
  SELECT 'Seismic Survey Techniques',
         '<h2>Modern Seismic Exploration Methods</h2><p>Seismic surveys are the primary tool for identifying potential hydrocarbon reserves. Learn about 2D, 3D, and 4D seismic technologies.</p><h3>Seismic Methods:</h3><ul><li>2D seismic surveys</li><li>3D seismic imaging</li><li>4D time-lapse monitoring</li><li>Marine vs. land surveys</li></ul>',
         'video', 35, 2, false, 2
  UNION ALL
  SELECT 'Drilling Operations',
         '<h2>Modern Drilling Technologies</h2><p>From rotary drilling to advanced directional drilling techniques, understand the technologies that make oil and gas extraction possible.</p><h3>Drilling Types:</h3><ul><li>Vertical drilling</li><li>Horizontal drilling</li><li>Directional drilling</li><li>Hydraulic fracturing</li></ul>',
         'text', 40, 3, false, 2
         
  -- Module 3: Production lessons
  UNION ALL  
  SELECT 'Well Completion Techniques',
         '<h2>Completing Oil and Gas Wells</h2><p>Well completion is the process of making a well ready for production. Learn about casing, cementing, and perforation techniques.</p><h3>Completion Steps:</h3><ul><li>Casing installation</li><li>Cementing operations</li><li>Perforation techniques</li><li>Stimulation methods</li></ul>',
         'video', 45, 1, false, 3
  UNION ALL
  SELECT 'Production Optimization',
         '<h2>Maximizing Well Performance</h2><p>Optimize production through artificial lift systems, enhanced oil recovery techniques, and production monitoring.</p><h3>Optimization Methods:</h3><ul><li>Artificial lift systems</li><li>Enhanced oil recovery</li><li>Production monitoring</li><li>Well intervention techniques</li></ul>',
         'text', 35, 2, false, 3
  UNION ALL
  SELECT 'Refining Processes',
         '<h2>From Crude Oil to Refined Products</h2><p>Understand the complex processes that transform crude oil into gasoline, diesel, and other petroleum products.</p><h3>Refining Steps:</h3><ul><li>Distillation processes</li><li>Cracking and reforming</li><li>Quality control</li><li>Product specifications</li></ul>',
         'video', 50, 3, false, 3
         
  -- Module 4: Safety lessons
  UNION ALL
  SELECT 'Safety Management Systems',
         '<h2>Comprehensive Safety in Oil and Gas Operations</h2><p>Safety is paramount in the oil and gas industry. Learn about risk assessment, safety management systems, and emergency response procedures.</p><h3>Safety Fundamentals:</h3><ul><li>Risk assessment methodologies</li><li>Safety management systems</li><li>Personal protective equipment</li><li>Emergency response planning</li></ul>',
         'video', 40, 1, false, 4
  UNION ALL
  SELECT 'Environmental Compliance',
         '<h2>Environmental Regulations and Best Practices</h2><p>Navigate the complex landscape of environmental regulations and learn sustainable practices for the oil and gas industry.</p><h3>Environmental Focus Areas:</h3><ul><li>Air quality regulations</li><li>Water protection measures</li><li>Waste management</li><li>Carbon footprint reduction</li></ul>',
         'text', 30, 2, false, 4
  UNION ALL
  SELECT 'Industry Best Practices',
         '<h2>Leading Practices for Sustainable Operations</h2><p>Explore industry best practices for sustainable and responsible oil and gas operations, including new technologies and methodologies.</p><h3>Best Practices:</h3><ul><li>Sustainable development goals</li><li>Technology innovations</li><li>Community engagement</li><li>Future industry trends</li></ul>',
         'text', 25, 3, false, 4
) lesson_data
WHERE m.order_index = lesson_data.module_order;