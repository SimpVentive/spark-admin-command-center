
-- Seed Departments
INSERT INTO departments (name, manager_name, location, employee_count, is_active) VALUES
('Engineering', 'Sarah Johnson', 'Hyderabad', 45, true),
('Marketing', 'Jessica Williams', 'Hyderabad', 20, true),
('Sales', 'David Brown', 'Mumbai', 35, true),
('Human Resources', 'Lisa Davis', 'Hyderabad', 12, true),
('Quality Assurance', 'Amanda Martinez', 'Pune', 18, true),
('Research & Development', 'Robert Miller', 'Bangalore', 25, true),
('Finance', 'Michael Roberts', 'Mumbai', 15, true),
('Operations', 'Karen Thompson', 'Chennai', 30, true);

-- Seed Locations
INSERT INTO locations (name, address, type, is_active, department_count, employee_count) VALUES
('Hyderabad HQ', 'Hitech City, Madhapur, Hyderabad', 'headquarters', true, 4, 95),
('Mumbai Office', 'Bandra Kurla Complex, Mumbai', 'branch', true, 2, 50),
('Bangalore Tech Park', 'Whitefield IT Park, Bangalore', 'branch', true, 1, 25),
('Pune Development Center', 'Hinjewadi Phase 2, Pune', 'branch', true, 1, 18),
('Chennai Operations', 'Tidel Park, Taramani, Chennai', 'branch', true, 1, 30);

-- Seed LASER KPIs
INSERT INTO laser_kpi_definitions (id, name, description, unit, measurement_frequency, category, is_active) VALUES
('a1b2c3d4-1111-4000-8000-000000000001', 'Sales Conversion Rate', 'Percentage of leads converted to sales', 'percentage', 'weekly', 'Sales', true),
('a1b2c3d4-1111-4000-8000-000000000002', 'Code Review Turnaround', 'Average hours to complete code review', 'hours', 'weekly', 'Engineering', true),
('a1b2c3d4-1111-4000-8000-000000000003', 'Customer Satisfaction Score', 'Average CSAT rating', 'score', 'monthly', 'Customer Service', true),
('a1b2c3d4-1111-4000-8000-000000000004', 'Bug Resolution Time', 'Average days to resolve bugs', 'days', 'weekly', 'Engineering', true),
('a1b2c3d4-1111-4000-8000-000000000005', 'Training Completion Rate', 'Percentage of training completed on time', 'percentage', 'monthly', 'HR', true),
('a1b2c3d4-1111-4000-8000-000000000006', 'Sprint Velocity', 'Story points per sprint', 'points', 'biweekly', 'Engineering', true);

-- Role-KPI Mappings
INSERT INTO laser_role_kpi_mappings (job_role_id, kpi_id, target_value, threshold_warning, threshold_critical, comparison_operator) VALUES
('3f0400b4-87f1-480f-ae89-5a1a33c0f12e', 'a1b2c3d4-1111-4000-8000-000000000002', 4, 6, 8, '<='),
('3f0400b4-87f1-480f-ae89-5a1a33c0f12e', 'a1b2c3d4-1111-4000-8000-000000000004', 3, 5, 7, '<='),
('3f0400b4-87f1-480f-ae89-5a1a33c0f12e', 'a1b2c3d4-1111-4000-8000-000000000006', 30, 20, 15, '>='),
('8fe54d9b-4e37-46ed-a513-9b409093b613', 'a1b2c3d4-1111-4000-8000-000000000002', 6, 8, 10, '<='),
('8fe54d9b-4e37-46ed-a513-9b409093b613', 'a1b2c3d4-1111-4000-8000-000000000006', 25, 18, 12, '>='),
('53441f79-088e-4145-8bb9-98b6635b3aee', 'a1b2c3d4-1111-4000-8000-000000000001', 25, 18, 12, '>='),
('53441f79-088e-4145-8bb9-98b6635b3aee', 'a1b2c3d4-1111-4000-8000-000000000003', 4.2, 3.5, 3.0, '>=');

-- Cause Definitions
INSERT INTO laser_cause_definitions (id, kpi_id, cause_name, cause_category, description, default_weight, requires_training) VALUES
('b2c3d4e5-2222-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000002', 'Insufficient Code Standards Knowledge', 'knowledge', 'Developer lacks coding standards understanding', 0.35, true),
('b2c3d4e5-2222-4000-8000-000000000002', 'a1b2c3d4-1111-4000-8000-000000000002', 'Poor Time Management', 'behavioral', 'Does not prioritize reviews', 0.25, true),
('b2c3d4e5-2222-4000-8000-000000000003', 'a1b2c3d4-1111-4000-8000-000000000004', 'Lack of Debugging Skills', 'knowledge', 'Insufficient debugging methodology', 0.40, true),
('b2c3d4e5-2222-4000-8000-000000000004', 'a1b2c3d4-1111-4000-8000-000000000001', 'Weak Negotiation Skills', 'knowledge', 'Lacks negotiation techniques', 0.45, true),
('b2c3d4e5-2222-4000-8000-000000000005', 'a1b2c3d4-1111-4000-8000-000000000001', 'Poor Product Knowledge', 'knowledge', 'Insufficient product understanding', 0.30, true),
('b2c3d4e5-2222-4000-8000-000000000006', 'a1b2c3d4-1111-4000-8000-000000000006', 'Unclear Requirements', 'environmental', 'Requirements ambiguity', 0.20, false);

-- Cause Interventions
INSERT INTO laser_cause_interventions (cause_id, intervention_type, micro_intervention_title, micro_intervention_content, micro_intervention_type, priority) VALUES
('b2c3d4e5-2222-4000-8000-000000000001', 'micro_learning', 'Code Review Best Practices', 'Guide on efficient code review techniques', 'article', 1),
('b2c3d4e5-2222-4000-8000-000000000002', 'micro_learning', 'Time Management for Developers', 'Pomodoro technique for development', 'video', 1),
('b2c3d4e5-2222-4000-8000-000000000003', 'micro_learning', 'Systematic Debugging', 'Scientific debugging method', 'interactive', 1),
('b2c3d4e5-2222-4000-8000-000000000004', 'micro_learning', 'Consultative Selling', 'Transform sales approach', 'article', 1),
('b2c3d4e5-2222-4000-8000-000000000005', 'micro_learning', 'Product Deep Dive', 'Product features walkthrough', 'video', 1);

-- Performance Signals
INSERT INTO laser_performance_signals (employee_id, kpi_id, kpi_value, measurement_date, source) VALUES
('f3584467-1f80-494e-b528-4a3cca9a1130', 'a1b2c3d4-1111-4000-8000-000000000002', 3.5, '2026-02-08', 'github_integration'),
('f3584467-1f80-494e-b528-4a3cca9a1130', 'a1b2c3d4-1111-4000-8000-000000000002', 4.2, '2026-02-15', 'github_integration'),
('f3584467-1f80-494e-b528-4a3cca9a1130', 'a1b2c3d4-1111-4000-8000-000000000002', 7.8, '2026-02-22', 'github_integration'),
('f3584467-1f80-494e-b528-4a3cca9a1130', 'a1b2c3d4-1111-4000-8000-000000000002', 8.5, '2026-03-01', 'github_integration'),
('cb73e570-7b56-4c5b-ae52-144fff48a868', 'a1b2c3d4-1111-4000-8000-000000000006', 28, '2026-02-08', 'jira_integration'),
('cb73e570-7b56-4c5b-ae52-144fff48a868', 'a1b2c3d4-1111-4000-8000-000000000006', 22, '2026-02-22', 'jira_integration'),
('cb73e570-7b56-4c5b-ae52-144fff48a868', 'a1b2c3d4-1111-4000-8000-000000000006', 14, '2026-03-01', 'jira_integration'),
('75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'a1b2c3d4-1111-4000-8000-000000000001', 22, '2026-02-08', 'crm_integration'),
('75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'a1b2c3d4-1111-4000-8000-000000000001', 18, '2026-02-15', 'crm_integration'),
('75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'a1b2c3d4-1111-4000-8000-000000000001', 11, '2026-03-01', 'crm_integration'),
('00980e80-dd69-437e-8567-c993798ad7eb', 'a1b2c3d4-1111-4000-8000-000000000004', 2.5, '2026-02-08', 'jira_integration'),
('00980e80-dd69-437e-8567-c993798ad7eb', 'a1b2c3d4-1111-4000-8000-000000000004', 3.0, '2026-02-22', 'jira_integration'),
('00980e80-dd69-437e-8567-c993798ad7eb', 'a1b2c3d4-1111-4000-8000-000000000004', 6.5, '2026-03-01', 'jira_integration');

-- Content Items
INSERT INTO content_items (title, content_type, description, file_format, duration_seconds, tags, is_active) VALUES
('Introduction to Agile Methodology', 'video', 'Agile principles and Scrum overview', 'mp4', 2400, ARRAY['agile', 'scrum'], true),
('Advanced React Patterns', 'video', 'React hooks and performance', 'mp4', 3600, ARRAY['react', 'frontend'], true),
('Leadership Communication Workshop', 'presentation', 'Leadership communication styles', 'pptx', NULL, ARRAY['leadership'], true),
('GxP Compliance Handbook', 'document', 'Good Practice compliance guide', 'pdf', NULL, ARRAY['compliance'], true),
('Data Analytics with Python', 'video', 'Pandas and data visualization', 'mp4', 5400, ARRAY['python'], true),
('Code Review Techniques', 'document', 'Code review best practices', 'pdf', NULL, ARRAY['code-review'], true),
('Sales Negotiation Masterclass', 'video', 'B2B negotiation strategies', 'mp4', 4200, ARRAY['sales'], true),
('Project Management Fundamentals', 'presentation', 'Core PM concepts', 'pptx', NULL, ARRAY['project-management'], true);

-- Content Categories
INSERT INTO content_categories (name, description, color, is_active) VALUES
('Technical Skills', 'Programming and technical knowledge', '#3B82F6', true),
('Leadership & Management', 'Leadership development', '#8B5CF6', true),
('Compliance & Regulatory', 'Industry compliance training', '#EF4444', true),
('Soft Skills', 'Communication and interpersonal skills', '#10B981', true),
('Sales & Marketing', 'Sales techniques and marketing', '#F59E0B', true);

-- Assessments
INSERT INTO assessments (title, assessment_type, passing_score, time_limit_minutes, max_attempts) VALUES
('Agile Methodology Certification', 'E-Learning Test', 80, 60, 3),
('React Proficiency Test', 'Skills Evaluation', 70, 45, 2),
('Leadership Skills Assessment', 'Quiz', 60, 30, 1),
('GxP Compliance Quiz', 'E-Learning Test', 85, 90, 2),
('Sales Skills Evaluation', 'Practical Assessment', 75, 40, 2);

-- Question Bank (valid difficulty levels)
INSERT INTO question_bank (question_text, question_type, difficulty_level, correct_answer, explanation, points) VALUES
('What is the primary purpose of a Sprint Retrospective?', 'multiple_choice', 'intermediate', 'Improve team processes', 'Focuses on identifying improvements.', 10),
('Which React hook is used for side effects?', 'multiple_choice', 'basic', 'useEffect', 'useEffect handles side effects.', 5),
('What does GxP stand for?', 'multiple_choice', 'basic', 'Good x Practice', 'GxP = Good Practice quality guidelines.', 5),
('In consultative selling, what should you identify first?', 'multiple_choice', 'intermediate', 'Customer pain points', 'Begins with understanding challenges.', 10);

-- Deviations
INSERT INTO laser_deviations (id, employee_id, kpi_id, role_kpi_mapping_id, actual_value, target_value, deviation_percentage, severity, status) 
SELECT 'c3d4e5f6-3333-4000-8000-000000000001'::uuid, 'f3584467-1f80-494e-b528-4a3cca9a1130', 'a1b2c3d4-1111-4000-8000-000000000002', rkm.id, 8.5, 4, 112.5, 'critical', 'open'
FROM laser_role_kpi_mappings rkm WHERE rkm.job_role_id = '3f0400b4-87f1-480f-ae89-5a1a33c0f12e' AND rkm.kpi_id = 'a1b2c3d4-1111-4000-8000-000000000002' LIMIT 1;

INSERT INTO laser_deviations (id, employee_id, kpi_id, role_kpi_mapping_id, actual_value, target_value, deviation_percentage, severity, status) 
SELECT 'c3d4e5f6-3333-4000-8000-000000000002'::uuid, 'cb73e570-7b56-4c5b-ae52-144fff48a868', 'a1b2c3d4-1111-4000-8000-000000000006', rkm.id, 14, 25, 44, 'warning', 'open'
FROM laser_role_kpi_mappings rkm WHERE rkm.job_role_id = '8fe54d9b-4e37-46ed-a513-9b409093b613' AND rkm.kpi_id = 'a1b2c3d4-1111-4000-8000-000000000006' LIMIT 1;

INSERT INTO laser_deviations (id, employee_id, kpi_id, role_kpi_mapping_id, actual_value, target_value, deviation_percentage, severity, status) 
SELECT 'c3d4e5f6-3333-4000-8000-000000000003'::uuid, '75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'a1b2c3d4-1111-4000-8000-000000000001', rkm.id, 11, 25, 56, 'critical', 'open'
FROM laser_role_kpi_mappings rkm WHERE rkm.job_role_id = '53441f79-088e-4145-8bb9-98b6635b3aee' AND rkm.kpi_id = 'a1b2c3d4-1111-4000-8000-000000000001' LIMIT 1;

-- RCA Results
INSERT INTO laser_rca_results (id, deviation_id, cause_id, probability_score, is_primary_cause, analysis_data) VALUES
('d4e5f6a7-4444-4000-8000-000000000001', 'c3d4e5f6-3333-4000-8000-000000000001', 'b2c3d4e5-2222-4000-8000-000000000001', 0.72, true, '{"analysis_method": "bayesian", "confidence": "high"}'),
('d4e5f6a7-4444-4000-8000-000000000002', 'c3d4e5f6-3333-4000-8000-000000000001', 'b2c3d4e5-2222-4000-8000-000000000002', 0.45, false, '{"analysis_method": "bayesian", "confidence": "medium"}'),
('d4e5f6a7-4444-4000-8000-000000000003', 'c3d4e5f6-3333-4000-8000-000000000003', 'b2c3d4e5-2222-4000-8000-000000000004', 0.68, true, '{"analysis_method": "bayesian", "confidence": "high"}'),
('d4e5f6a7-4444-4000-8000-000000000004', 'c3d4e5f6-3333-4000-8000-000000000003', 'b2c3d4e5-2222-4000-8000-000000000005', 0.52, false, '{"analysis_method": "bayesian", "confidence": "medium"}');

-- Assigned Interventions
INSERT INTO laser_assigned_interventions (deviation_id, employee_id, rca_result_id, intervention_type, micro_intervention_title, micro_intervention_content, status) VALUES
('c3d4e5f6-3333-4000-8000-000000000001', 'f3584467-1f80-494e-b528-4a3cca9a1130', 'd4e5f6a7-4444-4000-8000-000000000001', 'micro_learning', 'Code Review Best Practices', 'Guide on efficient code review', 'assigned'),
('c3d4e5f6-3333-4000-8000-000000000001', 'f3584467-1f80-494e-b528-4a3cca9a1130', 'd4e5f6a7-4444-4000-8000-000000000002', 'micro_learning', 'Time Management', 'Pomodoro for developers', 'assigned'),
('c3d4e5f6-3333-4000-8000-000000000003', '75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'd4e5f6a7-4444-4000-8000-000000000003', 'micro_learning', 'Consultative Selling', 'Transform sales approach', 'in_progress'),
('c3d4e5f6-3333-4000-8000-000000000003', '75a8f032-2e5e-4a0b-a515-1e0ea93ad900', 'd4e5f6a7-4444-4000-8000-000000000004', 'micro_learning', 'Product Deep Dive', 'Product features walkthrough', 'assigned');

-- Employee Details
INSERT INTO employee_details (profile_id, date_of_birth, qualification, experience, skills, nationality, marital_status, blood_group) VALUES
('f3584467-1f80-494e-b528-4a3cca9a1130', '1992-05-15', 'M.Tech CS', '8 years', 'Java, Python, React, AWS', 'Indian', 'Married', 'B+'),
('cb73e570-7b56-4c5b-ae52-144fff48a868', '1995-08-22', 'B.Tech IT', '5 years', 'React, TypeScript, Next.js', 'Indian', 'Single', 'O+'),
('75a8f032-2e5e-4a0b-a515-1e0ea93ad900', '1990-11-03', 'MBA Marketing', '10 years', 'Sales, CRM, Negotiation', 'Indian', 'Married', 'A+'),
('1e74a929-829b-4b20-8515-51d4bb25eae9', '1993-03-18', 'MBA HR', '7 years', 'Talent Management', 'Indian', 'Married', 'AB+'),
('00980e80-dd69-437e-8567-c993798ad7eb', '1994-07-10', 'B.Tech CS', '6 years', 'Selenium, Cypress, API Testing', 'Indian', 'Single', 'B-')
ON CONFLICT (profile_id) DO NOTHING;
