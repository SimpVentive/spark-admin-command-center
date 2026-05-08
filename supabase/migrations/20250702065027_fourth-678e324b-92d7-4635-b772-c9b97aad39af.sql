
-- Insert sample LTI providers
INSERT INTO public.lti_providers (name, lti_version, platform_id, issuer, privacy_level, is_active) VALUES
('Canvas LMS', 'LTI-1p3', 'https://canvas.instructure.com', 'https://canvas.instructure.com', 'public', true),
('Moodle Platform', 'LTI-1p1', NULL, NULL, 'public', true),
('Blackboard Learn', 'LTI-1p1', NULL, NULL, 'email_only', true);

-- Insert sample LTI tools
INSERT INTO public.lti_tools (
  provider_id, 
  name, 
  description, 
  tool_url, 
  launch_url, 
  icon_url, 
  category, 
  consumer_key, 
  consumer_secret_encrypted,
  grade_passback_enabled,
  deep_linking_enabled,
  is_active
) VALUES
(
  (SELECT id FROM public.lti_providers WHERE name = 'Canvas LMS' LIMIT 1),
  'Khan Academy',
  'Interactive math and science lessons with personalized learning dashboard',
  'https://www.khanacademy.org',
  'https://www.khanacademy.org/api/internal/lti/basic_launch',
  'https://cdn.kastatic.org/images/khan-logo-dark-background-2.png',
  'Mathematics',
  'khan_academy_key',
  'encrypted_secret_123',
  true,
  false,
  true
),
(
  (SELECT id FROM public.lti_providers WHERE name = 'Moodle Platform' LIMIT 1),
  'H5P Interactive Content',
  'Create and share rich HTML5 content and interactive experiences',
  'https://h5p.org',
  'https://h5p.org/lti/launch',
  'https://h5p.org/sites/default/files/h5p-logo.png',
  'Interactive Content',
  'h5p_consumer_key',
  'encrypted_h5p_secret',
  false,
  true,
  true
),
(
  (SELECT id FROM public.lti_providers WHERE name = 'Blackboard Learn' LIMIT 1),
  'Coursera for Business',
  'Professional courses and certifications from top universities and companies',
  'https://www.coursera.org',
  'https://www.coursera.org/lti/launch',
  'https://coursera-university-assets.s3.amazonaws.com/logos/coursera-logo-square.png',
  'Professional Development',
  'coursera_key',
  'encrypted_coursera_secret',
  true,
  false,
  true
),
(
  (SELECT id FROM public.lti_providers WHERE name = 'Canvas LMS' LIMIT 1),
  'Labster Virtual Labs',
  'Immersive virtual laboratory simulations for science education',
  'https://www.labster.com',
  'https://www.labster.com/lti/launch',
  'https://www.labster.com/wp-content/uploads/2019/01/labster-logo.png',
  'Science Labs',
  'labster_consumer',
  'encrypted_labster_key',
  true,
  true,
  true
),
(
  (SELECT id FROM public.lti_providers WHERE name = 'Moodle Platform' LIMIT 1),
  'LinkedIn Learning',
  'Professional skills development with expert-led courses',
  'https://www.linkedin.com/learning',
  'https://www.linkedin.com/learning-login/lti/launch',
  'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
  'Professional Skills',
  'linkedin_key',
  'encrypted_linkedin_secret',
  false,
  false,
  true
);
