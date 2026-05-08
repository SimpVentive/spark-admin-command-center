-- Insert sample Kirkpatrick evaluations for demonstration purposes
-- First, create some minimal required data if it doesn't exist

-- Insert a sample user (using auth.users compatible UUID format)
INSERT INTO profiles (id, full_name, email, department, position) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'Demo User', 'demo@company.com', 'Training', 'Employee')
ON CONFLICT (id) DO NOTHING;

-- Insert sample training programs (only if they don't exist)
INSERT INTO training_programs (id, title, description, category, level, duration_hours, is_active) VALUES
('22222222-2222-2222-2222-222222222222'::uuid, 'Leadership Excellence Program', 'Comprehensive leadership development', 'Managerial', 'Intermediate', 40, true),
('33333333-3333-3333-3333-333333333333'::uuid, 'Customer Service Excellence', 'Advanced customer service skills', 'Behavioral', 'Intermediate', 16, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample enrollments (using basic enrollment_type)
INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
('44444444-4444-4444-4444-444444444444'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'assigned', 'completed', '2024-01-15 09:00:00+00'),
('55555555-5555-5555-5555-555555555555'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'assigned', 'completed', '2024-02-01 10:30:00+00')
ON CONFLICT (id) DO NOTHING;

-- Now insert Kirkpatrick evaluations for all 4 levels
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Level 1 (Reaction) - Leadership Program
('44444444-4444-4444-4444-444444444444'::uuid, '1', 'satisfaction', 8.5, 'Great content and engaging facilitator', '2024-01-16'),
('44444444-4444-4444-4444-444444444444'::uuid, '1', 'relevance', 9.0, 'Highly relevant to my current role', '2024-01-16'),
('44444444-4444-4444-4444-444444444444'::uuid, '1', 'engagement', 8.0, 'Interactive sessions were very engaging', '2024-01-16'),

-- Level 2 (Learning) - Leadership Program
('44444444-4444-4444-4444-444444444444'::uuid, '2', 'knowledge_gain', 8.0, 'Significant improvement in leadership concepts understanding', '2024-01-17'),
('44444444-4444-4444-4444-444444444444'::uuid, '2', 'skill_improvement', 7.5, 'Better delegation and communication skills demonstrated', '2024-01-17'),

-- Level 3 (Behavior) - Leadership Program (60 days later)
('44444444-4444-4444-4444-444444444444'::uuid, '3', 'on_job_application', 8.5, 'Consistently applying new leadership techniques in team meetings', '2024-03-17'),
('44444444-4444-4444-4444-444444444444'::uuid, '3', 'behavior_change', 8.0, 'More collaborative approach, improved team communication', '2024-03-17'),

-- Level 4 (Results) - Leadership Program (120 days later)
('44444444-4444-4444-4444-444444444444'::uuid, '4', 'business_impact', 8.0, 'Team productivity increased by 15%, reduced turnover', '2024-05-15'),
('44444444-4444-4444-4444-444444444444'::uuid, '4', 'roi_achievement', 7.5, 'Positive ROI through improved team performance', '2024-05-15'),

-- Level 1 (Reaction) - Customer Service Program
('55555555-5555-5555-5555-555555555555'::uuid, '1', 'satisfaction', 9.5, 'Excellent training with practical examples', '2024-02-02'),
('55555555-5555-5555-5555-555555555555'::uuid, '1', 'relevance', 9.0, 'Directly applicable to daily work', '2024-02-02'),
('55555555-5555-5555-5555-555555555555'::uuid, '1', 'engagement', 9.0, 'Role-playing exercises were fantastic', '2024-02-02'),

-- Level 2 (Learning) - Customer Service Program
('55555555-5555-5555-5555-555555555555'::uuid, '2', 'knowledge_gain', 9.0, 'Excellent understanding of service principles', '2024-02-03'),
('55555555-5555-5555-5555-555555555555'::uuid, '2', 'skill_improvement', 8.5, 'Noticeable improvement in conflict resolution', '2024-02-03'),

-- Level 3 (Behavior) - Customer Service Program (45 days later)
('55555555-5555-5555-5555-555555555555'::uuid, '3', 'on_job_application', 9.5, 'Excellent application of de-escalation techniques', '2024-03-18'),
('55555555-5555-5555-5555-555555555555'::uuid, '3', 'behavior_change', 9.0, 'Significant improvement in customer satisfaction ratings', '2024-03-18'),

-- Level 4 (Results) - Customer Service Program (90 days later)
('55555555-5555-5555-5555-555555555555'::uuid, '4', 'business_impact', 9.0, 'Customer satisfaction scores increased by 25%', '2024-05-01'),
('55555555-5555-5555-5555-555555555555'::uuid, '4', 'roi_achievement', 8.5, 'Strong ROI through reduced customer complaints and increased retention', '2024-05-01');