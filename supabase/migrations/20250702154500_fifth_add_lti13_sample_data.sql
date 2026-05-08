
-- Add LTI 1.3 provider
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
  gen_random_uuid(),
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
) ON CONFLICT DO NOTHING;

-- Add LTI 1.3 sample tools
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
  gen_random_uuid(),
  (SELECT id FROM public.lti_providers WHERE lti_version = 'LTI-1p3' LIMIT 1),
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
  gen_random_uuid(),
  (SELECT id FROM public.lti_providers WHERE lti_version = 'LTI-1p3' LIMIT 1),
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
),
(
  gen_random_uuid(),
  (SELECT id FROM public.lti_providers WHERE lti_version = 'LTI-1p3' LIMIT 1),
  'Collaborative Workspace',
  'Modern collaborative workspace for team projects with integrated video conferencing and shared whiteboards.',
  'https://workspace-lti13.example.com',
  'https://workspace-lti13.example.com/launch',
  'https://workspace-lti13.example.com/icon.png',
  'Collaboration',
  'skillspark-client-workspace',
  true,
  true,
  false,
  true
) ON CONFLICT DO NOTHING;
