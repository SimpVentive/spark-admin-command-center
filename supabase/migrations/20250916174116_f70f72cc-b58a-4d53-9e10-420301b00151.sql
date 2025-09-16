-- Create simple dummy data for Kirkpatrick model visualization
-- Use minimal data insertion approach

-- Insert sample Kirkpatrick evaluations using placeholder enrollment IDs
-- This will demonstrate the evaluation structure even if enrollments don't exist
INSERT INTO kirkpatrick_evaluations (id, enrollment_id, level, metric_name, score, notes, evaluation_date) VALUES
-- Level 1 (Reaction) evaluations
('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '1', 'satisfaction', 8.5, 'Great content and engaging facilitator', '2024-01-16'),
('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', '1', 'relevance', 9.0, 'Highly relevant to my current role', '2024-01-16'),
('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', '1', 'engagement', 8.0, 'Interactive sessions were engaging', '2024-01-16'),

-- Level 2 (Learning) evaluations
('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', '2', 'knowledge_gain', 8.0, 'Significant improvement in understanding', '2024-01-17'),
('66666666-6666-6666-6666-666666666665', '11111111-1111-1111-1111-111111111111', '2', 'skill_improvement', 7.5, 'Better skills demonstrated', '2024-01-17'),

-- Level 3 (Behavior) evaluations
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '3', 'on_job_application', 8.5, 'Applying techniques consistently', '2024-03-17'),
('66666666-6666-6666-6666-666666666667', '11111111-1111-1111-1111-111111111111', '3', 'behavior_change', 8.0, 'Improved approach and communication', '2024-03-17'),

-- Level 4 (Results) evaluations
('66666666-6666-6666-6666-666666666668', '11111111-1111-1111-1111-111111111111', '4', 'business_impact', 8.0, 'Team productivity increased by 15%', '2024-05-15'),
('66666666-6666-6666-6666-666666666669', '11111111-1111-1111-1111-111111111111', '4', 'roi_achievement', 7.5, 'Positive ROI through improved performance', '2024-05-15'),

-- Additional Level 1 evaluations for second program
('77777777-7777-7777-7777-777777777771', '22222222-2222-2222-2222-222222222222', '1', 'satisfaction', 9.5, 'Excellent training with practical examples', '2024-02-02'),
('77777777-7777-7777-7777-777777777772', '22222222-2222-2222-2222-222222222222', '1', 'relevance', 9.0, 'Directly applicable to daily work', '2024-02-02'),
('77777777-7777-7777-7777-777777777773', '22222222-2222-2222-2222-222222222222', '1', 'engagement', 9.0, 'Role-playing exercises were fantastic', '2024-02-02'),

-- Additional Level 2 evaluations
('77777777-7777-7777-7777-777777777774', '22222222-2222-2222-2222-222222222222', '2', 'knowledge_gain', 9.0, 'Excellent understanding gained', '2024-02-03'),
('77777777-7777-7777-7777-777777777775', '22222222-2222-2222-2222-222222222222', '2', 'skill_improvement', 8.5, 'Noticeable improvement in skills', '2024-02-03'),

-- Additional Level 3 evaluations
('77777777-7777-7777-7777-777777777776', '22222222-2222-2222-2222-222222222222', '3', 'on_job_application', 9.5, 'Excellent application of techniques', '2024-03-18'),
('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '3', 'behavior_change', 9.0, 'Significant improvement in performance', '2024-03-18'),

-- Additional Level 4 evaluations
('77777777-7777-7777-7777-777777777778', '22222222-2222-2222-2222-222222222222', '4', 'business_impact', 9.0, 'Customer satisfaction increased by 25%', '2024-05-01'),
('77777777-7777-7777-7777-777777777779', '22222222-2222-2222-2222-222222222222', '4', 'roi_achievement', 8.5, 'Strong ROI through reduced complaints', '2024-05-01');