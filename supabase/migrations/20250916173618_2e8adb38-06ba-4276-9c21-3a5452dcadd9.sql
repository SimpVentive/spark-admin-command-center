-- Insert sample training programs with valid categories
INSERT INTO training_programs (id, title, description, category, level, duration_hours, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Leadership Excellence Program', 'Comprehensive leadership development for middle management', 'Managerial', 'Intermediate', 40, true),
('550e8400-e29b-41d4-a716-446655440002', 'Digital Marketing Fundamentals', 'Essential digital marketing skills for modern businesses', 'Technical', 'Beginner', 24, true),
('550e8400-e29b-41d4-a716-446655440003', 'Project Management Certification', 'Complete project management methodology training', 'Functional', 'Advanced', 60, true),
('550e8400-e29b-41d4-a716-446655440004', 'Customer Service Excellence', 'Advanced customer service and communication skills', 'Behavioral', 'Intermediate', 16, true);

-- Insert sample user profiles (using fixed UUIDs for consistency)
INSERT INTO profiles (id, full_name, email, department, position) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Sarah Johnson', 'sarah.johnson@company.com', 'Marketing', 'Marketing Manager'),
('550e8400-e29b-41d4-a716-446655440011', 'Michael Chen', 'michael.chen@company.com', 'IT', 'Senior Developer'),
('550e8400-e29b-41d4-a716-446655440012', 'Emily Rodriguez', 'emily.rodriguez@company.com', 'HR', 'HR Specialist'),
('550e8400-e29b-41d4-a716-446655440013', 'David Thompson', 'david.thompson@company.com', 'Sales', 'Sales Representative'),
('550e8400-e29b-41d4-a716-446655440014', 'Lisa Wang', 'lisa.wang@company.com', 'Operations', 'Operations Manager')
ON CONFLICT (id) DO NOTHING;

-- Insert sample enrollments
INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'mandatory', 'completed', '2024-01-15 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'voluntary', 'completed', '2024-02-01 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'mandatory', 'enrolled', '2024-03-01 14:15:00+00'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'voluntary', 'completed', '2024-01-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'mandatory', 'completed', '2024-02-15 13:45:00+00');

-- Insert Level 1 (Reaction) evaluations
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program
('550e8400-e29b-41d4-a716-446655440020', '1', 'satisfaction', 8.5, 'Great content and engaging facilitator', '2024-01-16'),
('550e8400-e29b-41d4-a716-446655440020', '1', 'relevance', 9.0, 'Highly relevant to my current role', '2024-01-16'),
('550e8400-e29b-41d4-a716-446655440020', '1', 'engagement', 8.0, 'Interactive sessions were very engaging', '2024-01-16'),

-- Michael Chen - Digital Marketing
('550e8400-e29b-41d4-a716-446655440021', '1', 'satisfaction', 7.5, 'Good overview but could use more technical depth', '2024-02-02'),
('550e8400-e29b-41d4-a716-446655440021', '1', 'relevance', 8.5, 'Useful for understanding marketing basics', '2024-02-02'),
('550e8400-e29b-41d4-a716-446655440021', '1', 'engagement', 7.0, 'Some sections were a bit dry', '2024-02-02'),

-- David Thompson - Customer Service
('550e8400-e29b-41d4-a716-446655440023', '1', 'satisfaction', 9.5, 'Excellent training with practical examples', '2024-01-21'),
('550e8400-e29b-41d4-a716-446655440023', '1', 'relevance', 9.0, 'Directly applicable to daily work', '2024-01-21'),
('550e8400-e29b-41d4-a716-446655440023', '1', 'engagement', 9.0, 'Role-playing exercises were fantastic', '2024-01-21'),

-- Lisa Wang - Leadership Program  
('550e8400-e29b-41d4-a716-446655440024', '1', 'satisfaction', 8.0, 'Well-structured content', '2024-02-16'),
('550e8400-e29b-41d4-a716-446655440024', '1', 'relevance', 8.5, 'Applicable to operations management', '2024-02-16'),
('550e8400-e29b-41d4-a716-446655440024', '1', 'engagement', 7.5, 'Good interaction level', '2024-02-16');

-- Insert Level 2 (Learning) evaluations
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program
('550e8400-e29b-41d4-a716-446655440020', '2', 'knowledge_gain', 8.0, 'Significant improvement in leadership concepts understanding', '2024-01-17'),
('550e8400-e29b-41d4-a716-446655440020', '2', 'skill_improvement', 7.5, 'Better delegation and communication skills demonstrated', '2024-01-17'),

-- Michael Chen - Digital Marketing
('550e8400-e29b-41d4-a716-446655440021', '2', 'knowledge_gain', 8.5, 'Strong grasp of digital marketing fundamentals', '2024-02-03'),
('550e8400-e29b-41d4-a716-446655440021', '2', 'skill_improvement', 7.0, 'Basic skills acquired, needs practice', '2024-02-03'),

-- David Thompson - Customer Service
('550e8400-e29b-41d4-a716-446655440023', '2', 'knowledge_gain', 9.0, 'Excellent understanding of service principles', '2024-01-22'),
('550e8400-e29b-41d4-a716-446655440023', '2', 'skill_improvement', 8.5, 'Noticeable improvement in conflict resolution', '2024-01-22'),

-- Lisa Wang - Leadership Program
('550e8400-e29b-41d4-a716-446655440024', '2', 'knowledge_gain', 7.5, 'Good understanding of management principles', '2024-02-17'),
('550e8400-e29b-41d4-a716-446655440024', '2', 'skill_improvement', 8.0, 'Improved team coordination skills', '2024-02-17');

-- Insert Level 3 (Behavior) evaluations (30-60 days after training)
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program (60 days later)
('550e8400-e29b-41d4-a716-446655440020', '3', 'on_job_application', 8.5, 'Consistently applying new leadership techniques in team meetings', '2024-03-17'),
('550e8400-e29b-41d4-a716-446655440020', '3', 'behavior_change', 8.0, 'More collaborative approach, improved team communication', '2024-03-17'),

-- Michael Chen - Digital Marketing (45 days later)
('550e8400-e29b-41d4-a716-446655440021', '3', 'on_job_application', 7.0, 'Started implementing SEO best practices in projects', '2024-03-18'),
('550e8400-e29b-41d4-a716-446655440021', '3', 'behavior_change', 6.5, 'Some application but inconsistent usage', '2024-03-18'),

-- David Thompson - Customer Service (45 days later)
('550e8400-e29b-41d4-a716-446655440023', '3', 'on_job_application', 9.5, 'Excellent application of de-escalation techniques', '2024-03-06'),
('550e8400-e29b-41d4-a716-446655440023', '3', 'behavior_change', 9.0, 'Significant improvement in customer satisfaction ratings', '2024-03-06'),

-- Lisa Wang - Leadership Program (60 days later)
('550e8400-e29b-41d4-a716-446655440024', '3', 'on_job_application', 8.0, 'Implementing new delegation strategies effectively', '2024-04-16'),
('550e8400-e29b-41d4-a716-446655440024', '3', 'behavior_change', 7.5, 'More structured approach to team management', '2024-04-16');

-- Insert Level 4 (Results) evaluations (90+ days after training)  
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program (120 days later)
('550e8400-e29b-41d4-a716-446655440020', '4', 'business_impact', 8.0, 'Team productivity increased by 15%, reduced turnover', '2024-05-15'),
('550e8400-e29b-41d4-a716-446655440020', '4', 'roi_achievement', 7.5, 'Positive ROI through improved team performance', '2024-05-15'),

-- Michael Chen - Digital Marketing (100 days later)
('550e8400-e29b-41d4-a716-446655440021', '4', 'business_impact', 7.0, 'Website traffic increased by 12% after implementing SEO', '2024-05-12'),
('550e8400-e29b-41d4-a716-446655440021', '4', 'roi_achievement', 6.8, 'Moderate ROI from improved digital presence', '2024-05-12'),

-- David Thompson - Customer Service (90 days later)
('550e8400-e29b-41d4-a716-446655440023', '4', 'business_impact', 9.0, 'Customer satisfaction scores increased by 25%', '2024-04-20'),
('550e8400-e29b-41d4-a716-446655440023', '4', 'roi_achievement', 8.5, 'Strong ROI through reduced customer complaints and increased retention', '2024-04-20'),

-- Lisa Wang - Leadership Program (120 days later)
('550e8400-e29b-41d4-a716-446655440024', '4', 'business_impact', 7.8, 'Operations efficiency improved by 18%', '2024-06-15'),
('550e8400-e29b-41d4-a716-446655440024', '4', 'roi_achievement', 7.2, 'Good ROI through operational improvements', '2024-06-15');