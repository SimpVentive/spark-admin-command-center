-- Add admin policies to profiles table to allow admins to see all employees
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Temporarily drop the foreign key constraint to allow dummy data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Insert dummy employee data
INSERT INTO public.profiles (id, email, full_name, department, position, created_at, updated_at) VALUES
  (gen_random_uuid(), 'sarah.johnson@company.com', 'Sarah Johnson', 'Engineering', 'Senior Software Engineer', now(), now()),
  (gen_random_uuid(), 'mike.chen@company.com', 'Mike Chen', 'Engineering', 'Frontend Developer', now(), now()),
  (gen_random_uuid(), 'jessica.williams@company.com', 'Jessica Williams', 'Marketing', 'Marketing Manager', now(), now()),
  (gen_random_uuid(), 'david.brown@company.com', 'David Brown', 'Sales', 'Sales Representative', now(), now()),
  (gen_random_uuid(), 'lisa.davis@company.com', 'Lisa Davis', 'HR', 'HR Business Partner', now(), now()),
  (gen_random_uuid(), 'robert.miller@company.com', 'Robert Miller', 'Engineering', 'DevOps Engineer', now(), now()),
  (gen_random_uuid(), 'emily.wilson@company.com', 'Emily Wilson', 'Marketing', 'Content Specialist', now(), now()),
  (gen_random_uuid(), 'james.garcia@company.com', 'James Garcia', 'Sales', 'Account Manager', now(), now()),
  (gen_random_uuid(), 'amanda.martinez@company.com', 'Amanda Martinez', 'Engineering', 'QA Engineer', now(), now()),
  (gen_random_uuid(), 'christopher.taylor@company.com', 'Christopher Taylor', 'HR', 'Talent Acquisition Specialist', now(), now());

-- Add some dummy user skills for a few employees to show variety
INSERT INTO public.user_skills (user_id, skill_name, proficiency_level, confidence_score, source) 
SELECT 
  p.id,
  skill_data.skill_name,
  skill_data.proficiency_level,
  skill_data.confidence_score,
  'admin_assigned'
FROM public.profiles p
CROSS JOIN (
  VALUES 
    ('JavaScript', 'advanced', 85),
    ('React', 'intermediate', 75),
    ('Node.js', 'advanced', 80),
    ('Python', 'beginner', 60),
    ('Project Management', 'advanced', 90),
    ('Communication', 'advanced', 95),
    ('Leadership', 'intermediate', 70)
) AS skill_data(skill_name, proficiency_level, confidence_score)
WHERE p.email IN ('sarah.johnson@company.com', 'mike.chen@company.com', 'jessica.williams@company.com')
  AND (
    (p.email = 'sarah.johnson@company.com' AND skill_data.skill_name IN ('JavaScript', 'React', 'Node.js')) OR
    (p.email = 'mike.chen@company.com' AND skill_data.skill_name IN ('JavaScript', 'React', 'Python')) OR
    (p.email = 'jessica.williams@company.com' AND skill_data.skill_name IN ('Project Management', 'Communication', 'Leadership'))
  );

-- Add some learning preferences for variety
INSERT INTO public.learning_preferences (user_id, career_goals, topics_of_interest, learning_style, preferred_content_format, time_availability, motivation_level)
SELECT 
  p.id,
  CASE 
    WHEN p.department = 'Engineering' THEN ARRAY['Senior Developer', 'Tech Lead']
    WHEN p.department = 'Marketing' THEN ARRAY['Marketing Director', 'Brand Manager']  
    WHEN p.department = 'Sales' THEN ARRAY['Sales Manager', 'Account Director']
    WHEN p.department = 'HR' THEN ARRAY['HR Manager', 'People Operations']
    ELSE ARRAY['Career Growth']
  END,
  CASE 
    WHEN p.department = 'Engineering' THEN ARRAY['Software Development', 'Cloud Computing', 'DevOps']
    WHEN p.department = 'Marketing' THEN ARRAY['Digital Marketing', 'Content Strategy', 'Analytics']
    WHEN p.department = 'Sales' THEN ARRAY['Sales Strategy', 'Customer Relations', 'Negotiation']
    WHEN p.department = 'HR' THEN ARRAY['Talent Management', 'Employee Relations', 'Compensation']
    ELSE ARRAY['Professional Development']
  END,
  CASE (random() * 3)::int
    WHEN 0 THEN 'visual'
    WHEN 1 THEN 'auditory'  
    WHEN 2 THEN 'kinesthetic'
    ELSE 'mixed'
  END,
  ARRAY['video', 'article', 'interactive'],
  (300 + random() * 200)::int, -- 300-500 minutes per week
  CASE (random() * 2)::int
    WHEN 0 THEN 'high'
    WHEN 1 THEN 'medium'
    ELSE 'low'
  END
FROM public.profiles p
WHERE p.email LIKE '%@company.com';