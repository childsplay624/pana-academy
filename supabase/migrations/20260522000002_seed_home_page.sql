DO $$
DECLARE
  v_page_id UUID;
BEGIN
  -- Check if home page exists, if not create it
  SELECT id INTO v_page_id FROM pages WHERE slug = 'home';
  
  IF v_page_id IS NULL THEN
    INSERT INTO pages (title, slug, status, page_type, show_in_navbar, show_in_footer)
    VALUES ('Home', 'home', 'published', 'dynamic', false, false)
    RETURNING id INTO v_page_id;
  END IF;

  -- Delete existing sections to reset the home page to the new default layout
  DELETE FROM page_sections WHERE page_id = v_page_id;

  -- Insert dynamic sections in the exact order of the original hardcoded homepage
  INSERT INTO page_sections (page_id, section_type, content, order_index, is_active)
  VALUES 
    (v_page_id, 'dynamic_hero', '{}'::jsonb, 0, true),
    (v_page_id, 'dynamic_stats', '{}'::jsonb, 1, true),
    (v_page_id, 'dynamic_how_it_works', '{}'::jsonb, 2, true),
    (v_page_id, 'dynamic_categories', '{}'::jsonb, 3, true),
    (v_page_id, 'dynamic_features', '{}'::jsonb, 4, true),
    (v_page_id, 'dynamic_top_courses', '{}'::jsonb, 5, true),
    (v_page_id, 'dynamic_upcoming_courses', '{}'::jsonb, 6, true),
    (v_page_id, 'dynamic_news', '{}'::jsonb, 7, true),
    (v_page_id, 'dynamic_testimonials', '{}'::jsonb, 8, true);
END $$;
