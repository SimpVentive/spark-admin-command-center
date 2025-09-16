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

-- Insert sample enrollments with valid enrollment types
INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'self_enrolled', 'completed', '2024-01-15 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'admin_enrolled', 'completed', '2024-02-01 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'self_enrolled', 'enrolled', '2024-03-01 14:15:00+00'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', 'admin_enrolled', 'completed', '2024-01-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'self_enrolled', 'completed', '2024-02-15 13:45:00+00');