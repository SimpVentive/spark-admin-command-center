-- Add admin policies to profiles table to allow admins to see all employees
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- DYNAMIC BULK USER + PROFILE INSERT
-- Supabase Compatible
-- =====================================================
DO $$
DECLARE
  employee RECORD;
BEGIN

  FOR employee IN
    SELECT *
    FROM (
      VALUES
        ('11111111-1111-1111-1111-111111111111'::uuid, 'demo@company.com','Demo User', 'Training', 'Employee'),
        ('0fca4f40-2def-47b9-965b-0b458011b4fb'::uuid, 'ceo@simpventive.com','Chandra Mouli', 'Executive', 'CEO'),
        ('ba7f78f7-a976-4a3a-8a61-e65df2b2ee79'::uuid, 'cvissa@gmail.com', 'Chandra Mouli Vissa', 'Executive', 'Employee'),
        ('b2b1ab89-2c56-49f4-8945-076d86f94ebd'::uuid, 'srikanthmath149@gmail.com', 'Srikanth Math', 'Engineering', 'Employee'),
        ('838bd8f1-817d-4926-969b-ffa11ddcadcd'::uuid, 'anil.n@unitol.in', 'Anil N', 'Engineering', 'Employee'),
        ('da41b39d-9b74-476b-8f64-c76ab352fc7f'::uuid, 'narayana.t@unitol.in', 'Narayana T', 'Engineering', 'Employee'),
        ('550e8400-e29b-41d4-a716-446655440010'::uuid, 'sarah.johnson@company.com', 'Sarah Johnson', 'Engineering', 'Senior Software Engineer'),
        ('550e8400-e29b-41d4-a716-446655440011'::uuid, 'mike.chen@company.com', 'Mike Chen', 'Engineering', 'Frontend Developer'),
        ('550e8400-e29b-41d4-a716-446655440012'::uuid, 'jessica.williams@company.com', 'Jessica Williams', 'Marketing', 'Marketing Manager'),
        ('550e8400-e29b-41d4-a716-446655440013'::uuid, 'david.brown@company.com', 'David Brown', 'Sales', 'Sales Representative'),
        ('550e8400-e29b-41d4-a716-446655440014'::uuid, 'lisa.davis@company.com', 'Lisa Davis', 'HR', 'HR Business Partner'),
        ('550e8400-e29b-41d4-a716-446655440015'::uuid, 'robert.miller@company.com', 'Robert Miller', 'Engineering', 'DevOps Engineer'),
        ('550e8400-e29b-41d4-a716-446655440016'::uuid, 'emily.wilson@company.com', 'Emily Wilson', 'Marketing', 'Content Specialist'),
        ('550e8400-e29b-41d4-a716-446655440017'::uuid, 'james.garcia@company.com', 'James Garcia', 'Sales', 'Account Manager'),
        ('550e8400-e29b-41d4-a716-446655440018'::uuid, 'amanda.martinez@company.com', 'Amanda Martinez', 'Engineering', 'QA Engineer'),
        ('550e8400-e29b-41d4-a716-446655440019'::uuid, 'christopher.taylor@company.com', 'Christopher Taylor', 'HR', 'Talent Acquisition Specialist')
    ) AS t(id, email, full_name, department, position)

  LOOP

    -- Skip existing users
    IF EXISTS (
      SELECT 1
      FROM auth.users
      WHERE email = employee.email
    ) THEN
      CONTINUE;
    END IF;

    -- =========================================
    -- INSERT auth.users
    -- =========================================

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      phone_change,
      phone_change_token,
      reauthentication_token,
      created_at,
      updated_at
    )
    VALUES (
      employee.id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      employee.email,
      -- Password = UniTol2011
      '$2a$10$0GTyLduyAVQM2QzR0cSUp.L0H8cLycG5V5RIrmCgvt0nJLpy0/loO',
      now(),
      jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
      ),
      jsonb_build_object(
        'sub', employee.id::text,
        'email', employee.email,
        'full_name', employee.full_name,
        'email_verified', true,
        'phone_verified', false
      ),
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      now(),
      now()
    );

    -- =========================================
    -- INSERT auth.identities
    -- =========================================

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      employee.id,

      jsonb_build_object(
        'sub', employee.id::text,
        'email', employee.email,
        'full_name', employee.full_name,
        'email_verified', true,
        'phone_verified', false
      ),

      'email',
      employee.id,

      now(),
      now()
    );

   

  END LOOP;

END $$;

ALTER TABLE public.user_skills
DROP CONSTRAINT user_skills_source_check;

ALTER TABLE public.user_skills
ADD CONSTRAINT user_skills_source_check
CHECK (
  source IN (
    'resume',
    'linkedin',
    'assessment',
    'manual',
    'admin_assigned'
  )
);

INSERT INTO public.user_skills (
  user_id,
  skill_name,
  proficiency_level,
  confidence_score,
  source
) 
SELECT 
  p.id,
  skill_data.skill_name,
  skill_data.proficiency_level,
  skill_data.confidence_score,
  'assessment'
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
WHERE p.email IN (
  'sarah.johnson@company.com',
  'mike.chen@company.com',
  'jessica.williams@company.com'
)
AND (
  (p.email = 'sarah.johnson@company.com'
    AND skill_data.skill_name IN ('JavaScript', 'React', 'Node.js'))

  OR

  (p.email = 'mike.chen@company.com'
    AND skill_data.skill_name IN ('JavaScript', 'React', 'Python'))

  OR

  (p.email = 'jessica.williams@company.com'
    AND skill_data.skill_name IN ('Project Management', 'Communication', 'Leadership'))
);

ALTER TABLE public.learning_preferences
  ADD COLUMN IF NOT EXISTS preferred_content_format TEXT[],
  ADD COLUMN IF NOT EXISTS preferred_duration_minutes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS motivation_level TEXT;


-- Add some learning preferences for variety
INSERT INTO public.learning_preferences (user_id, career_goals, topics_of_interest, preferred_learning_style, preferred_content_format, preferred_duration_minutes, motivation_level)
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