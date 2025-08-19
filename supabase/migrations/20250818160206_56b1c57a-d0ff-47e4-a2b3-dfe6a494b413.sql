-- Create a test enrollment for the current user to demonstrate functionality
INSERT INTO enrollments (student_id, course_id, status, progress_percentage)
VALUES ('61721bd6-19a4-418d-92c9-3089fffb124b', 'd090a8c9-3370-4b06-9004-5c7102d32893', 'enrolled', 45)
ON CONFLICT DO NOTHING;