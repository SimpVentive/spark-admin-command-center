
-- LEARNING PATHS
INSERT INTO learning_paths (id, title, description, level, category, total_duration_hours, assessment_enabled, certification_enabled) VALUES
('a1b2c3d4-1111-4000-8000-000000000001', 'GxP Compliance Mastery', 'Comprehensive GxP compliance training', 'intermediate', 'Compliance', 40, true, true),
('a1b2c3d4-1111-4000-8000-000000000002', 'Leadership Development Track', 'Core leadership competencies', 'advanced', 'Leadership', 60, true, true),
('a1b2c3d4-1111-4000-8000-000000000003', 'Data Science Fundamentals', 'Intro to data science', 'beginner', 'Technical', 30, true, false),
('a1b2c3d4-1111-4000-8000-000000000004', 'Clinical Trial Management', 'End-to-end clinical trial skills', 'intermediate', 'Clinical', 50, true, true),
('a1b2c3d4-1111-4000-8000-000000000005', 'Digital Transformation in Pharma', 'Digital tools and AI in pharma', 'advanced', 'Technology', 45, false, false)
ON CONFLICT DO NOTHING;

INSERT INTO learning_path_modules (id, learning_path_id, title, description, order_index, duration_hours, is_required) VALUES
('b2c3d4e5-1111-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001', 'Introduction to GxP', 'Overview of Good Practice', 1, 8, true),
('b2c3d4e5-1111-4000-8000-000000000002', 'a1b2c3d4-1111-4000-8000-000000000001', 'GMP Deep Dive', 'Good Manufacturing Practice', 2, 10, true),
('b2c3d4e5-1111-4000-8000-000000000003', 'a1b2c3d4-1111-4000-8000-000000000001', 'GLP and GCP Essentials', 'Lab and clinical standards', 3, 12, true),
('b2c3d4e5-1111-4000-8000-000000000004', 'a1b2c3d4-1111-4000-8000-000000000001', 'Compliance Documentation', 'SOPs and CAPA', 4, 10, false),
('b2c3d4e5-1111-4000-8000-000000000005', 'a1b2c3d4-1111-4000-8000-000000000002', 'Self-Leadership', 'Personal leadership style', 1, 12, true),
('b2c3d4e5-1111-4000-8000-000000000006', 'a1b2c3d4-1111-4000-8000-000000000002', 'Team Dynamics', 'High-performing teams', 2, 15, true),
('b2c3d4e5-1111-4000-8000-000000000007', 'a1b2c3d4-1111-4000-8000-000000000002', 'Strategic Thinking', 'Strategic acumen', 3, 18, true),
('b2c3d4e5-1111-4000-8000-000000000008', 'a1b2c3d4-1111-4000-8000-000000000002', 'Executive Presence', 'Communication and influence', 4, 15, false),
('b2c3d4e5-1111-4000-8000-000000000009', 'a1b2c3d4-1111-4000-8000-000000000003', 'Statistics Primer', 'Core stats', 1, 10, true),
('b2c3d4e5-1111-4000-8000-000000000010', 'a1b2c3d4-1111-4000-8000-000000000003', 'Python for Data Analysis', 'Python and Pandas', 2, 12, true),
('b2c3d4e5-1111-4000-8000-000000000011', 'a1b2c3d4-1111-4000-8000-000000000003', 'Data Visualization', 'Stories with data', 3, 8, false),
('b2c3d4e5-1111-4000-8000-000000000012', 'a1b2c3d4-1111-4000-8000-000000000004', 'Trial Design', 'Clinical protocols', 1, 15, true),
('b2c3d4e5-1111-4000-8000-000000000013', 'a1b2c3d4-1111-4000-8000-000000000004', 'Site Management', 'Managing trial sites', 2, 12, true),
('b2c3d4e5-1111-4000-8000-000000000014', 'a1b2c3d4-1111-4000-8000-000000000004', 'Regulatory Submissions', 'Regulatory docs', 3, 13, true),
('b2c3d4e5-1111-4000-8000-000000000015', 'a1b2c3d4-1111-4000-8000-000000000004', 'Post-Market Surveillance', 'Safety monitoring', 4, 10, false)
ON CONFLICT DO NOTHING;

-- CERTIFICATIONS
INSERT INTO certifications (id, title, description, issuer, level, category, duration_hours, validity_months, passing_score, price, skills_covered) VALUES
('c3d4e5f6-1111-4000-8000-000000000001', 'Certified GxP Professional', 'GxP certification', 'PharmaQual Institute', 'intermediate', 'Compliance', 40, 24, 80, 599, ARRAY['GMP','GLP','GCP']),
('c3d4e5f6-1111-4000-8000-000000000002', 'Clinical Research Associate', 'CRA certification', 'ACRP', 'advanced', 'Clinical', 60, 36, 75, 899, ARRAY['Clinical Monitoring','ICH-GCP']),
('c3d4e5f6-1111-4000-8000-000000000003', 'Six Sigma Green Belt', 'Process improvement', 'ASQ', 'intermediate', 'Quality', 35, 48, 70, 450, ARRAY['DMAIC','Statistical Analysis']),
('c3d4e5f6-1111-4000-8000-000000000004', 'Pharma Data Analyst', 'Data analytics', 'SkillSpark Academy', 'beginner', 'Technical', 30, 24, 65, 349, ARRAY['SQL','Python','Biostatistics'])
ON CONFLICT DO NOTHING;

-- TRAINERS
INSERT INTO trainers (id, name, specialization, rating, programs_count, location, status, is_external, email, bio) VALUES
('d4e5f6a7-1111-4000-8000-000000000001', 'Dr. Ananya Sharma', 'GxP Compliance', 4.8, 12, 'Mumbai', 'active', false, 'ananya@company.com', '15 years GxP'),
('d4e5f6a7-1111-4000-8000-000000000002', 'Prof. Rajesh Kumar', 'Clinical Research', 4.6, 8, 'Hyderabad', 'active', true, 'rajesh@pharma.com', 'Phase II-IV expert'),
('d4e5f6a7-1111-4000-8000-000000000003', 'Ms. Priya Patel', 'Leadership', 4.9, 15, 'Bangalore', 'active', true, 'priya@leader.com', 'Executive coach'),
('d4e5f6a7-1111-4000-8000-000000000004', 'Dr. Vikram Singh', 'Data Science', 4.5, 6, 'Delhi', 'active', false, 'vikram@company.com', 'R&D analytics'),
('d4e5f6a7-1111-4000-8000-000000000005', 'Mr. Arun Nair', 'Regulatory Affairs', 4.7, 10, 'Chennai', 'active', true, 'arun@reg.com', 'FDA/EMA expert'),
('d4e5f6a7-1111-4000-8000-000000000006', 'Dr. Meera Joshi', 'Pharmacovigilance', 4.4, 5, 'Pune', 'on_leave', false, 'meera@company.com', 'Signal detection')
ON CONFLICT DO NOTHING;

-- ROI COST ENTRIES
INSERT INTO roi_cost_entries (id, category, budget, actual, period, notes) VALUES
('e5f6a7b8-1111-4000-8000-000000000001', 'Instructor Fees', 250000, 235000, 'Q1 2026', 'External trainers'),
('e5f6a7b8-1111-4000-8000-000000000002', 'Technology', 180000, 172000, 'Q1 2026', 'LMS & MOOC'),
('e5f6a7b8-1111-4000-8000-000000000003', 'Content Development', 120000, 145000, 'Q1 2026', 'E-learning production'),
('e5f6a7b8-1111-4000-8000-000000000004', 'Travel', 80000, 65000, 'Q1 2026', 'Offsite sessions'),
('e5f6a7b8-1111-4000-8000-000000000005', 'Employee Time', 320000, 310000, 'Q1 2026', 'Opportunity cost'),
('e5f6a7b8-1111-4000-8000-000000000006', 'Instructor Fees', 270000, 260000, 'Q4 2025', 'Previous quarter'),
('e5f6a7b8-1111-4000-8000-000000000007', 'Technology', 180000, 180000, 'Q4 2025', 'Stable costs'),
('e5f6a7b8-1111-4000-8000-000000000008', 'Certifications', 60000, 58000, 'Q1 2026', 'Exam fees')
ON CONFLICT DO NOTHING;

-- ROI IMPACT METRICS
INSERT INTO roi_impact_metrics (id, metric_name, before_value, after_value, unit, program_id, report_title, report_status, impact_level, employee_count, measurement_date, notes) VALUES
('f6a7b8c9-1111-4000-8000-000000000001', 'Defect Rate', 4.2, 1.8, 'percentage', '550e8400-e29b-41d4-a716-446655440001'::uuid, 'GxP Impact Q1', 'published', 'high', 45, '2026-02-28', 'Post-GMP improvement'),
('f6a7b8c9-1111-4000-8000-000000000002', 'Engagement Score', 3.2, 4.1, 'score', '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Leadership ROI', 'published', 'high', 30, '2026-02-15', 'EI training impact'),
('f6a7b8c9-1111-4000-8000-000000000003', 'Time to Market', 180, 145, 'days', '550e8400-e29b-41d4-a716-446655440003'::uuid, 'Strategy Impact', 'draft', 'medium', 20, '2026-03-01', 'Faster decisions'),
('f6a7b8c9-1111-4000-8000-000000000004', 'Audit Score', 72, 91, 'percentage', '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Regulatory Outcomes', 'published', 'high', 55, '2026-01-30', 'All depts improved'),
('f6a7b8c9-1111-4000-8000-000000000005', 'NPS', 35, 52, 'score', '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Communication Impact', 'under_review', 'medium', 40, '2026-02-20', 'Better interactions'),
('f6a7b8c9-1111-4000-8000-000000000006', 'Analysis Accuracy', 78, 94, 'percentage', '550e8400-e29b-41d4-a716-446655440003'::uuid, 'Biostatistics Report', 'published', 'high', 15, '2026-03-05', 'Fewer errors'),
('f6a7b8c9-1111-4000-8000-000000000007', 'Retention Rate', 82, 91, 'percentage', '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Team Building ROI', 'published', 'medium', 60, '2026-01-15', 'Higher retention')
ON CONFLICT DO NOTHING;

-- ADMIN RECOMMENDATIONS
INSERT INTO admin_recommendations (id, title, description, recommendation_type, priority, confidence_score, status, supporting_data) VALUES
('d6e7f8a9-1111-4000-8000-000000000001', 'Expand GxP to Sales', 'Sales needs GxP awareness', 'training_gap', 'high', 0.87, 'pending', '{"affected":45}'::jsonb),
('d6e7f8a9-1111-4000-8000-000000000002', 'Launch Data Science Path', '68% managers report gaps', 'skill_development', 'high', 0.92, 'pending', '{"gap":0.68}'::jsonb),
('d6e7f8a9-1111-4000-8000-000000000003', 'Retire Old Workshop', 'Low engagement 12%', 'content_optimization', 'medium', 0.78, 'accepted', '{"rating":2.3}'::jsonb),
('d6e7f8a9-1111-4000-8000-000000000004', 'Peer Learning Program', 'Mentor junior staff', 'program_design', 'medium', 0.71, 'pending', '{"impact":0.30}'::jsonb),
('d6e7f8a9-1111-4000-8000-000000000005', 'Shift to Digital Content', '40% cost savings', 'cost_optimization', 'high', 0.85, 'under_review', '{"savings":180000}'::jsonb)
ON CONFLICT DO NOTHING;
