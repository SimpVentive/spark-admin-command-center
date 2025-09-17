-- Create Kirkpatrick dummy data with correct metric names
-- Insert sample evaluations using the exact metric names from the forms

INSERT INTO kirkpatrick_evaluations (id, enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Level 1 (Reaction) evaluations - using 'satisfaction' metric
('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '1', 'satisfaction', 8.5, 'Great content and engaging facilitator', '2024-01-16'),
('77777777-7777-7777-7777-777777777771', '22222222-2222-2222-2222-222222222222', '1', 'satisfaction', 9.5, 'Excellent training with practical examples', '2024-02-02'),
('88888888-8888-8888-8888-888888888881', '33333333-3333-3333-3333-333333333333', '1', 'satisfaction', 7.5, 'Good overview but could use more depth', '2024-03-02'),

-- Level 2 (Learning) evaluations - using 'knowledge_gain' metric
('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', '2', 'knowledge_gain', 8.0, 'Significant improvement in understanding concepts', '2024-01-17'),
('77777777-7777-7777-7777-777777777772', '22222222-2222-2222-2222-222222222222', '2', 'knowledge_gain', 9.0, 'Excellent understanding of service principles', '2024-02-03'),
('88888888-8888-8888-8888-888888888882', '33333333-3333-3333-3333-333333333333', '2', 'knowledge_gain', 7.8, 'Good knowledge acquisition with room for improvement', '2024-03-03'),

-- Level 3 (Behavior) evaluations - using 'application' metric  
('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', '3', 'application', 8.5, 'Consistently applying new leadership techniques in team meetings', '2024-03-17'),
('77777777-7777-7777-7777-777777777773', '22222222-2222-2222-2222-222222222222', '3', 'application', 9.5, 'Excellent application of de-escalation techniques', '2024-03-18'),
('88888888-8888-8888-8888-888888888883', '33333333-3333-3333-3333-333333333333', '3', 'application', 7.0, 'Some application but inconsistent usage', '2024-04-18'),

-- Level 4 (Results) evaluations - using 'business_impact' metric
('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', '4', 'business_impact', 8.0, 'Team productivity increased by 15%, reduced turnover', '2024-05-15'),
('77777777-7777-7777-7777-777777777774', '22222222-2222-2222-2222-222222222222', '4', 'business_impact', 9.0, 'Customer satisfaction scores increased by 25%', '2024-05-01'),
('88888888-8888-8888-8888-888888888884', '33333333-3333-3333-3333-333333333333', '4', 'business_impact', 7.2, 'Moderate improvement in digital presence and traffic', '2024-06-12'),

-- Additional evaluations for better analytics demonstration
('99999999-9999-9999-9999-999999999991', '44444444-4444-4444-4444-444444444444', '1', 'satisfaction', 8.8, 'Very engaging and well-structured content', '2024-01-20'),
('99999999-9999-9999-9999-999999999992', '44444444-4444-4444-4444-444444444444', '2', 'knowledge_gain', 8.3, 'Strong knowledge improvement demonstrated', '2024-01-21'),
('99999999-9999-9999-9999-999999999993', '44444444-4444-4444-4444-444444444444', '3', 'application', 8.0, 'Good application of learned concepts on the job', '2024-03-21'),
('99999999-9999-9999-9999-999999999994', '44444444-4444-4444-4444-444444444444', '4', 'business_impact', 7.8, 'Measurable improvements in team coordination and efficiency', '2024-05-20');