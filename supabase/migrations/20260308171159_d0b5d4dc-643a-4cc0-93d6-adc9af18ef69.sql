INSERT INTO public.tna_cycles (
  id,
  name,
  status,
  start_date,
  end_date,
  departments,
  workflow_type,
  manager_ratification_required,
  locations,
  roles
)
VALUES (
  'bd930909-c79a-41eb-bc3b-823dae6300e4'::uuid,
  '2026 Annual Training Needs Assessment',
  'active',
  '2026-01-01',
  '2026-03-31',
  ARRAY['Engineering', 'Marketing', 'Sales'],
  'Individual Input + Manager Approval',
  true,
  ARRAY['Hyderabad', 'Remote'],
  ARRAY['Employee', 'Manager']
);

INSERT INTO mooc_providers (
  id,
  name,
  provider_type,
  api_endpoint,
  is_connected,
  sync_frequency,
  total_courses,
  active_enrollments,
  monthly_cost,
  annual_cost,
  seat_limit,
  seats_used,
  renewal_date,
  status
)
VALUES
(
  '60cec36e-973b-4c53-b93c-26d5871a57f5'::uuid,
  'Coursera Business',
  'coursera',
  'https://api.coursera.org',
  true,
  'daily',
  1200,
  45,
  500,
  6000,
  100,
  45,
  '2027-01-01',
  'active'
),

(
  'c239870a-e47c-4139-9f48-16a4024e3c5b'::uuid,
  'LinkedIn Learning',
  'linkedin_learning',
  'https://api.linkedin.com/learning',
  true,
  'daily',
  800,
  28,
  300,
  3600,
  50,
  28,
  '2027-06-01',
  'active'
);

INSERT INTO mooc_courses (
  id,
  provider_id,
  external_course_id,
  title,
  description,
  instructor,
  provider_name,
  category,
  level,
  duration_weeks,
  rating,
  student_count,
  price,
  image_url,
  course_url,
  skills_covered,
  prerequisites,
  in_catalog,
  organization_enrollments
)
VALUES

(
  '02c29d09-c5ea-4750-ad1c-48d89cbffb17'::uuid,
  '60cec36e-973b-4c53-b93c-26d5871a57f5'::uuid,
  'COURSE-101',
  'Cloud Architecture Fundamentals',
  'Learn modern cloud infrastructure and architecture patterns.',
  'Andrew Ng',
  'Coursera',
  'Cloud Computing',
  'intermediate',
  8,
  4.7,
  250000,
  49,
  'https://example.com/cloud.jpg',
  'https://coursera.org/cloud-course',
  ARRAY['AWS', 'Cloud Architecture', 'DevOps'],
  ARRAY['Basic Networking'],
  true,
  15
),

(
  'e7650c2c-932a-4038-9d6f-ec7ca1b6fee4'::uuid,
  'c239870a-e47c-4139-9f48-16a4024e3c5b'::uuid,
  'LL-202',
  'Advanced Excel for Business',
  'Master advanced Excel formulas, dashboards, and automation.',
  'John Smith',
  'LinkedIn Learning',
  'Productivity',
  'beginner',
  4,
  4.5,
  120000,
  29,
  'https://example.com/excel.jpg',
  'https://linkedin.com/learning/excel-course',
  ARRAY['Excel', 'Data Analysis', 'Reporting'],
  ARRAY['Basic Excel'],
  true,
  20
);

INSERT INTO public.library_books (
  id,
  title,
  author,
  isbn,
  category,
  availability,
  location,
  purchase_date,
  condition,
  notes
)
VALUES

(
  'bc92588c-91c3-455d-ac6c-0e68c70b4923'::uuid,
  'Clean Code',
  'Robert C. Martin',
  '9780132350884',
  'Software Engineering',
  'Available',
  'Shelf A1',
  '2025-01-10',
  'Excellent',
  'Popular among engineering teams'
),

(
  '1da82ecd-1cb0-4f07-883e-ab78064cc7a8'::uuid,
  'The Lean Startup',
  'Eric Ries',
  '9780307887894',
  'Business',
  'Available',
  'Shelf B2',
  '2025-02-15',
  'Good',
  'Recommended for product managers'
),

(
  '2fbbf6d7-2222-4d11-9333-9f0c5b44aaaa'::uuid,
  'Atomic Habits',
  'James Clear',
  '9780735211292',
  'Self Development',
  'Available',
  'Shelf C1',
  '2025-03-05',
  'Excellent',
  NULL
),

(
  '3fbbf6d7-3333-4d11-9333-9f0c5b44bbbb'::uuid,
  'Designing Data-Intensive Applications',
  'Martin Kleppmann',
  '9781449373320',
  'Technology',
  'Available',
  'Shelf A3',
  '2025-01-20',
  'Excellent',
  'Advanced backend engineering reference'
);

INSERT INTO tni_submissions (cycle_id, employee_id, manager_id, status, training_needs, employee_comments, submitted_at) VALUES
  ('bd930909-c79a-41eb-bc3b-823dae6300e4', '838bd8f1-817d-4926-969b-ffa11ddcadcd', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'submitted', '[{"skill":"Advanced Excel","priority":"high"}]'::jsonb, 'Need upskilling', '2026-01-15 10:00:00+00'),
  ('bd930909-c79a-41eb-bc3b-823dae6300e4', 'b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'approved', '[{"skill":"Cloud Architecture","priority":"high"}]'::jsonb, 'Cloud skills', '2026-01-10 09:00:00+00');

INSERT INTO mooc_enrollments (user_id, course_id, provider_id, status, progress_percentage, time_spent_hours) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', '02c29d09-c5ea-4750-ad1c-48d89cbffb17', '60cec36e-973b-4c53-b93c-26d5871a57f5', 'in_progress', 65, 12.5),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'e7650c2c-932a-4038-9d6f-ec7ca1b6fee4', 'c239870a-e47c-4139-9f48-16a4024e3c5b', 'in_progress', 30, 5.0);

INSERT INTO library_checkout_records (book_id, user_id, status, due_date) VALUES
  ('bc92588c-91c3-455d-ac6c-0e68c70b4923', '0fca4f40-2def-47b9-965b-0b458011b4fb', 'checked_out', '2026-03-22'),
  ('1da82ecd-1cb0-4f07-883e-ab78064cc7a8', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'checked_out', '2026-03-25');

ALTER TABLE public.user_skills
DROP CONSTRAINT IF EXISTS user_skills_source_check;

ALTER TABLE public.user_skills
ADD CONSTRAINT user_skills_source_check
CHECK (
  source IN (
    'self_reported',
    'assessment',
    'course_completion',
    'manager_assigned'
  )
);

INSERT INTO user_skills (user_id, skill_name, proficiency_level, confidence_score, source) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'Strategic Leadership', 'expert', 92, 'assessment'),
  ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'Project Management', 'advanced', 88, 'assessment'),
  ('b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'GxP Compliance', 'expert', 95, 'assessment'),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'Python Programming', 'intermediate', 60, 'self_reported');

INSERT INTO user_certifications (user_id, certification_id, credential_id, status, earned_date, score) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'c3d4e5f6-1111-4000-8000-000000000001', 'CERT-GXP-001', 'completed', '2026-01-15', 91),
  ('b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'c3d4e5f6-1111-4000-8000-000000000001', 'CERT-GXP-042', 'completed', '2025-12-20', 96);

INSERT INTO learning_preferences (user_id, job_role, preferred_learning_style, preferred_duration_minutes, difficulty_preference, topics_of_interest, career_goals) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'CEO', 'visual', 45, 'adaptive', ARRAY['Leadership'], ARRAY['Executive Leadership']),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'Analyst', 'visual', 20, 'easy', ARRAY['Data Analysis'], ARRAY['Data Scientist']);