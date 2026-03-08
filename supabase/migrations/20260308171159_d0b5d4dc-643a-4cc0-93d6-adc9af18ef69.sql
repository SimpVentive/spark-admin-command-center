INSERT INTO tni_submissions (cycle_id, employee_id, manager_id, status, training_needs, employee_comments, submitted_at) VALUES
  ('bd930909-c79a-41eb-bc3b-823dae6300e4', '838bd8f1-817d-4926-969b-ffa11ddcadcd', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'submitted', '[{"skill":"Advanced Excel","priority":"high"}]'::jsonb, 'Need upskilling', '2026-01-15 10:00:00+00'),
  ('bd930909-c79a-41eb-bc3b-823dae6300e4', 'b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'approved', '[{"skill":"Cloud Architecture","priority":"high"}]'::jsonb, 'Cloud skills', '2026-01-10 09:00:00+00');

INSERT INTO mooc_enrollments (user_id, course_id, provider_id, status, progress_percentage, time_spent_hours) VALUES
  ('0fca4f40-2def-47b9-965b-0b458011b4fb', '02c29d09-c5ea-4750-ad1c-48d89cbffb17', '60cec36e-973b-4c53-b93c-26d5871a57f5', 'in_progress', 65, 12.5),
  ('838bd8f1-817d-4926-969b-ffa11ddcadcd', 'e7650c2c-932a-4038-9d6f-ec7ca1b6fee4', 'c239870a-e47c-4139-9f48-16a4024e3c5b', 'in_progress', 30, 5.0);

INSERT INTO library_checkout_records (book_id, user_id, status, due_date) VALUES
  ('bc92588c-91c3-455d-ac6c-0e68c70b4923', '0fca4f40-2def-47b9-965b-0b458011b4fb', 'checked_out', '2026-03-22'),
  ('1da82ecd-1cb0-4f07-883e-ab78064cc7a8', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', 'checked_out', '2026-03-25');

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