-- Remaining User Roles
INSERT INTO user_roles (user_id, role) VALUES
  ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'manager'),
  ('b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'trainer'),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'user')
ON CONFLICT (user_id, role) DO NOTHING;

-- More program enrollments for test user
INSERT INTO user_program_enrollments (id, user_id, program_id,  enrollment_type, status, attendance_confirmed) VALUES
  ('e1000001-0000-4000-8000-000000000005', '838bd8f1-817d-4926-969b-ffa11ddcadcd', '550e8400-e29b-41d4-a716-446655440003', 'self-enrolled', 'enrolled', true),
  ('e1000001-0000-4000-8000-000000000006', '838bd8f1-817d-4926-969b-ffa11ddcadcd', '550e8400-e29b-41d4-a716-446655440004', 'assigned', 'completed', true)
ON CONFLICT DO NOTHING;

-- User Learning Path Enrollments
INSERT INTO user_learning_path_enrollments (user_id, learning_path_id, status) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'a1b2c3d4-1111-4000-8000-000000000001', 'in_progress'),
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'a1b2c3d4-1111-4000-8000-000000000002', 'enrolled'),
  ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'a1b2c3d4-1111-4000-8000-000000000003', 'in_progress'),
  ('b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'a1b2c3d4-1111-4000-8000-000000000004', 'enrolled'),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'a1b2c3d4-1111-4000-8000-000000000001', 'in_progress'),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'a1b2c3d4-1111-4000-8000-000000000005', 'enrolled')
ON CONFLICT DO NOTHING;

-- Assessment Results
INSERT INTO assessment_results (user_id, assessment_id, score, passing_score, status, attempt_number, started_at, completed_at, time_spent_minutes) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', '2e17d6c3-2512-4d73-80b2-4cf134a9985f', 88, 70, 'passed', 1, '2026-02-10 09:00:00+00', '2026-02-10 09:45:00+00', 45),
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'e68decb8-d7bf-46a9-a9f0-ebe73f7a5b9e', 92, 75, 'passed', 1, '2026-02-15 10:00:00+00', '2026-02-15 10:30:00+00', 30),
  ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'fc7d309c-88e2-4c0d-9bea-186b28a33395', 65, 70, 'failed', 1, '2026-02-12 14:00:00+00', '2026-02-12 14:55:00+00', 55),
  ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'fc7d309c-88e2-4c0d-9bea-186b28a33395', 78, 70, 'passed', 2, '2026-02-20 14:00:00+00', '2026-02-20 14:40:00+00', 40),
  ('b2b1ab89-2c56-49f4-8945-076d86f94ebd', '2e17d6c3-2512-4d73-80b2-4cf134a9985f', 95, 70, 'passed', 1, '2026-02-08 11:00:00+00', '2026-02-08 11:25:00+00', 25),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'e68decb8-d7bf-46a9-a9f0-ebe73f7a5b9e', 72, 75, 'failed', 1, '2026-02-18 09:00:00+00', '2026-02-18 09:50:00+00', 50),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', '2e17d6c3-2512-4d73-80b2-4cf134a9985f', 84, 70, 'passed', 1, '2026-02-25 10:00:00+00', '2026-02-25 10:35:00+00', 35)
ON CONFLICT DO NOTHING;

-- Kirkpatrick Evaluations (valid metric_names: satisfaction, knowledge_gain, application, business_impact)
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
  ('11111111-1111-1111-1111-111111111111', '1', 'satisfaction', 9, 'Excellent course content and delivery', '2026-02-16'),
  ('11111111-1111-1111-1111-111111111111', '2', 'knowledge_gain', 8, 'Significant knowledge improvement', '2026-02-20'),
  ('11111111-1111-1111-1111-111111111111', '3', 'application', 7, 'Applying new skills on the job', '2026-03-01'),
  ('11111111-1111-1111-1111-111111111111', '4', 'business_impact', 8, 'Reduced compliance violations by 40%', '2026-03-05'),
  ('22222222-2222-2222-2222-222222222222', '1', 'satisfaction', 8, 'Engaging digital content', '2026-02-17'),
  ('22222222-2222-2222-2222-222222222222', '2', 'knowledge_gain', 9, 'Strong learning outcomes', '2026-02-22'),
  ('22222222-2222-2222-2222-222222222222', '3', 'application', 7, 'Gradual adoption of new practices', '2026-03-02'),
  ('33333333-3333-3333-3333-333333333333', '1', 'satisfaction', 7, 'Good overall experience', '2026-02-18'),
  ('33333333-3333-3333-3333-333333333333', '2', 'knowledge_gain', 8, 'Clear improvement in compliance awareness', '2026-02-25'),
  ('44444444-4444-4444-4444-444444444444', '1', 'satisfaction', 8, 'Well-structured program', '2026-02-28'),
  ('e1000001-0000-4000-8000-000000000005', '1', 'satisfaction', 7, 'Good content, could be more interactive', '2026-02-28'),
  ('e1000001-0000-4000-8000-000000000006', '1', 'satisfaction', 9, 'Very practical and hands-on', '2026-02-20'),
  ('e1000001-0000-4000-8000-000000000006', '2', 'knowledge_gain', 8, 'Solid knowledge acquisition', '2026-02-25'),
  ('e1000001-0000-4000-8000-000000000006', '3', 'application', 6, 'Starting to apply learnings', '2026-03-03'),
  ('e1000001-0000-4000-8000-000000000006', '4', 'business_impact', 7, 'Measurable improvement in team output', '2026-03-07')
ON CONFLICT DO NOTHING;