-- Create sample user program enrollments
INSERT INTO user_program_enrollments (id, user_id, program_id, enrollment_type, status, enrolled_at) VALUES
-- Enrollments for the first user (ceo@simpventive.com)
('11111111-1111-1111-1111-111111111111', '0fca4f40-2def-47b9-965b-0b458011b4fb', '7252fbb0-6921-42fb-996c-1f06e6c74390', 'self_enrolled', 'enrolled', '2024-01-15 10:00:00+00'),
('22222222-2222-2222-2222-222222222222', '0fca4f40-2def-47b9-965b-0b458011b4fb', 'ec3c75d0-0474-4c59-a385-5e10eff4e52b', 'self_enrolled', 'enrolled', '2024-02-01 10:00:00+00'),
-- Enrollments for the second user (cvissa@gmail.com) 
('33333333-3333-3333-3333-333333333333', 'ba7f78f7-a976-4a3a-8a61-e65df2b2ee79', '8248a467-43bf-4a05-acd0-912256e1316d', 'assigned', 'enrolled', '2024-03-01 10:00:00+00'),
-- Enrollments for the third user (srikanthmath149@gmail.com)
('44444444-4444-4444-4444-444444444444', 'b2b1ab89-2c56-49f4-8945-076d86f94ebd', 'd2b09e02-0d49-4de7-b759-e214f0d933cc', 'assigned', 'enrolled', '2024-01-18 10:00:00+00');