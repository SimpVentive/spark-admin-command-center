
-- Insert LTI 1.1 sample data (if not already present)
INSERT INTO public.lti_providers (
  id,
  name,
  lti_version,
  platform_id,
  issuer,
  privacy_level,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Canvas LMS',
  'LTI-1p1',
  NULL,
  NULL,
  'public',
  true
), (
  '550e8400-e29b-41d4-a716-446655440002',
  'Moodle Platform',
  'LTI-1p1',
  NULL,
  NULL,
  'public',
  true
) ON CONFLICT (id) DO NOTHING;

-- Insert LTI 1.3 provider
INSERT INTO public.lti_providers (
  id,
  name,
  platform_id,
  issuer,
  auth_login_url,
  auth_token_url,
  key_set_url,
  deployment_id,
  lti_version,
  privacy_level,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'Modern LTI 1.3 Platform',
  'https://skillspark.app',
  'https://skillspark.app',
  'https://skillspark.app/api/lti/login',
  'https://skillspark.app/api/lti/token',
  'https://skillspark.app/.well-known/jwks.json',
  'skillspark-deployment-1',
  'LTI-1p3',
  'public',
  true
) ON CONFLICT (id) DO NOTHING;

-- Insert sample LTI tools
INSERT INTO public.lti_tools (
  id,
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
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
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
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440002',
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
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
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
) ON CONFLICT (id) DO NOTHING;

-- Insert LTI 1.3 sample tools
INSERT INTO public.lti_tools (
  id,
  provider_id,
  name,
  description,
  tool_url,
  launch_url,
  icon_url,
  category,
  client_id,
  deep_linking_enabled,
  names_roles_service_enabled,
  assignments_grades_service_enabled,
  is_active
) VALUES 
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440003',
  'Advanced Interactive Simulator',
  'Next-generation interactive learning simulator with AI-powered assessments and real-time collaboration features.',
  'https://demo-lti13.example.com',
  'https://demo-lti13.example.com/launch',
  'https://demo-lti13.example.com/icon.png',
  'Simulation',
  'skillspark-client-simulator',
  true,
  true,
  true,
  true
),
(
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440003',
  'AI-Powered Content Studio',
  'Create, edit, and publish interactive learning content with artificial intelligence assistance and deep analytics.',
  'https://ai-studio-lti13.example.com',
  'https://ai-studio-lti13.example.com/launch',
  'https://ai-studio-lti13.example.com/icon.png',
  'Content Creation',
  'skillspark-client-studio',
  true,
  true,
  true,
  true
) ON CONFLICT (id) DO NOTHING;
