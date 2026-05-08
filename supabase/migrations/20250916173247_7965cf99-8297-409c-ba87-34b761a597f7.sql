-- Insert sample training programs
INSERT INTO training_programs (id, title, description, category, level, duration_hours, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Leadership Excellence Program', 'Comprehensive leadership development for middle management', 'Managerial', 'Intermediate', 40, true),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Digital Marketing Fundamentals', 'Essential digital marketing skills for modern businesses', 'Functional', 'Beginner', 24, true),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Project Management Certification', 'Complete project management methodology training', 'Managerial', 'Advanced', 60, true),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Customer Service Excellence', 'Advanced customer service and communication skills', 'Behavioral', 'Intermediate', 16, true);

-- Sample Programs Data

INSERT INTO public.programs (
  id,
  title,
  level,
  theme,
  outline,
  icon,
  venue,
  faculty,
  pre_test_info,
  pre_read_info,
  multiple_batches,
  program_type
)
VALUES

(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Leadership Excellence Program',
  'Intermediate',
  'Leadership Development',
  'Comprehensive leadership development program for middle management focusing on communication, decision-making, and team management.',
  'Users',
  'Conference Hall A',
  'Dr. Rajesh Kumar',
  'Online leadership assessment before training',
  'Read the leadership handbook shared via email',
  true,
  'tna'
),

(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Digital Marketing Fundamentals',
  'Beginner',
  'Marketing',
  'Introduction to SEO, social media marketing, paid campaigns, analytics, and content marketing strategies.',
  'BarChart3',
  'Training Room 2',
  'Ananya Sharma',
  'Basic marketing concepts quiz',
  'Review the digital marketing starter guide',
  false,
  'self-directed'
),

(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Project Management Certification',
  'Advanced',
  'Project Management',
  'Advanced project management methodologies including Agile, Scrum, risk management, and stakeholder communication.',
  'ClipboardList',
  'Auditorium',
  'Michael Johnson',
  'PMP readiness assessment',
  'Complete project planning case study',
  true,
  'mandatory'
),

(
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'Customer Service Excellence',
  'Intermediate',
  'Customer Experience',
  'Customer handling techniques, communication strategies, escalation management, and empathy building.',
  'Headphones',
  'Online',
  'Priya Menon',
  'Customer interaction scenario test',
  'Read customer communication guidelines',
  false,
  'eligible'
),

(
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'DevOps and Cloud Engineering',
  'Advanced',
  'Technology',
  'Hands-on DevOps practices including CI/CD pipelines, Docker, Kubernetes, and AWS deployment.',
  'Cloud',
  'Lab 3',
  'Suresh Reddy',
  'Linux and scripting assessment',
  'Install Docker and VS Code before session',
  true,
  'tna'
),

(
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'Workplace Ethics and Compliance',
  'Basic',
  'Compliance',
  'Mandatory ethics and compliance awareness program covering company policies and workplace conduct.',
  'Shield',
  'Online',
  'Compliance Team',
  'Compliance awareness questionnaire',
  'Review employee code of conduct',
  false,
  'mandatory'
),

(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Data Analytics with Power BI',
  'Intermediate',
  'Analytics',
  'Practical training on data visualization, dashboards, DAX formulas, and reporting using Power BI.',
  'PieChart',
  'Training Lab',
  'Kiran Patel',
  'Excel proficiency test',
  'Install Power BI Desktop',
  true,
  'self-directed'
),

(
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Effective Business Communication',
  'Beginner',
  'Communication Skills',
  'Training on email etiquette, presentation skills, public speaking, and interpersonal communication.',
  'MessageSquare',
  'Seminar Hall',
  'Neha Verma',
  'Communication skills self-assessment',
  'Read communication best practices PDF',
  false,
  'eligible'
);

-- Insert sample enrollments
INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
('550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'self-enrolled', 'completed', '2024-01-15 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'self-enrolled', 'completed', '2024-02-01 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'self-enrolled', 'enrolled', '2024-03-01 14:15:00+00'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '550e8400-e29b-41d4-a716-446655440013'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'self-enrolled', 'completed', '2024-01-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440024'::uuid, '550e8400-e29b-41d4-a716-446655440014'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'self-enrolled', 'completed', '2024-02-15 13:45:00+00');

INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
-- Enrollments for the first user (ceo@simpventive.com)
('11111111-1111-1111-1111-111111111111'::uuid, '0fca4f40-2def-47b9-965b-0b458011b4fb'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'self-enrolled', 'enrolled', '2024-01-15 10:00:00+00'),
('22222222-2222-2222-2222-222222222222'::uuid, '0fca4f40-2def-47b9-965b-0b458011b4fb'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'self-enrolled', 'enrolled', '2024-02-01 10:00:00+00'),
-- Enrollments for the second user (cvissa@gmail.com) 
('33333333-3333-3333-3333-333333333333'::uuid, 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'assigned', 'enrolled', '2024-03-01 10:00:00+00'),
-- Enrollments for the third user (srikanthmath149@gmail.com)
('44444444-4444-4444-4444-444444444444'::uuid, 'b2b1ab89-2c56-49f4-8945-076d86f94ebd'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'assigned', 'enrolled', '2024-01-18 10:00:00+00');

-- Insert Level 1 (Reaction) evaluations
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program
('550e8400-e29b-41d4-a716-446655440020'::uuid, '1', 'satisfaction', 8.5, 'Great content and engaging facilitator', '2024-01-16'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '1', 'relevance', 9.0, 'Highly relevant to my current role', '2024-01-16'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '1', 'engagement', 8.0, 'Interactive sessions were very engaging', '2024-01-16'),

-- Michael Chen - Digital Marketing
('550e8400-e29b-41d4-a716-446655440021'::uuid, '1', 'satisfaction', 7.5, 'Good overview but could use more technical depth', '2024-02-02'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '1', 'relevance', 8.5, 'Useful for understanding marketing basics', '2024-02-02'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '1', 'engagement', 7.0, 'Some sections were a bit dry', '2024-02-02'),

-- David Thompson - Customer Service
('550e8400-e29b-41d4-a716-446655440023'::uuid, '1', 'satisfaction', 9.5, 'Excellent training with practical examples', '2024-01-21'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '1', 'relevance', 9.0, 'Directly applicable to daily work', '2024-01-21'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '1', 'engagement', 9.0, 'Role-playing exercises were fantastic', '2024-01-21');

-- Insert Level 2 (Learning) evaluations
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program
('550e8400-e29b-41d4-a716-446655440020'::uuid, '2', 'knowledge_gain', 8.0, 'Significant improvement in leadership concepts understanding', '2024-01-17'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '2', 'skill_improvement', 7.5, 'Better delegation and communication skills demonstrated', '2024-01-17'),

-- Michael Chen - Digital Marketing
('550e8400-e29b-41d4-a716-446655440021'::uuid, '2', 'knowledge_gain', 8.5, 'Strong grasp of digital marketing fundamentals', '2024-02-03'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '2', 'skill_improvement', 7.0, 'Basic skills acquired, needs practice', '2024-02-03'),

-- David Thompson - Customer Service
('550e8400-e29b-41d4-a716-446655440023'::uuid, '2', 'knowledge_gain', 9.0, 'Excellent understanding of service principles', '2024-01-22'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '2', 'skill_improvement', 8.5, 'Noticeable improvement in conflict resolution', '2024-01-22');

-- Insert Level 3 (Behavior) evaluations (30-60 days after training)
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program (60 days later)
('550e8400-e29b-41d4-a716-446655440020'::uuid, '3', 'on_job_application', 8.5, 'Consistently applying new leadership techniques in team meetings', '2024-03-17'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '3', 'behavior_change', 8.0, 'More collaborative approach, improved team communication', '2024-03-17'),

-- Michael Chen - Digital Marketing (45 days later)
('550e8400-e29b-41d4-a716-446655440021'::uuid, '3', 'on_job_application', 7.0, 'Started implementing SEO best practices in projects', '2024-03-18'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '3', 'behavior_change', 6.5, 'Some application but inconsistent usage', '2024-03-18'),

-- David Thompson - Customer Service (45 days later)
('550e8400-e29b-41d4-a716-446655440023'::uuid, '3', 'on_job_application', 9.5, 'Excellent application of de-escalation techniques', '2024-03-06'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '3', 'behavior_change', 9.0, 'Significant improvement in customer satisfaction ratings', '2024-03-06');

-- Insert Level 4 (Results) evaluations (90+ days after training)
INSERT INTO kirkpatrick_evaluations (enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Sarah Johnson - Leadership Program (120 days later)
('550e8400-e29b-41d4-a716-446655440020'::uuid, '4', 'business_impact', 8.0, 'Team productivity increased by 15%, reduced turnover', '2024-05-15'),
('550e8400-e29b-41d4-a716-446655440020'::uuid, '4', 'roi_achievement', 7.5, 'Positive ROI through improved team performance', '2024-05-15'),

-- Michael Chen - Digital Marketing (100 days later)
('550e8400-e29b-41d4-a716-446655440021'::uuid, '4', 'business_impact', 7.0, 'Website traffic increased by 12% after implementing SEO', '2024-05-12'),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '4', 'roi_achievement', 6.8, 'Moderate ROI from improved digital presence', '2024-05-12'),

-- David Thompson - Customer Service (90 days later)
('550e8400-e29b-41d4-a716-446655440023'::uuid, '4', 'business_impact', 9.0, 'Customer satisfaction scores increased by 25%', '2024-04-20'),
('550e8400-e29b-41d4-a716-446655440023'::uuid, '4', 'roi_achievement', 8.5, 'Strong ROI through reduced customer complaints and increased retention', '2024-04-20');