
-- Phase 2: Multi-tenant company isolation

-- 1. Fix is_admin() to include super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')
$$;

-- 2. Create company access helper
CREATE OR REPLACE FUNCTION public.can_access_company(target_company_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    public.is_super_admin()
    OR target_company_id IS NULL
    OR public.get_user_company_id(auth.uid()) = target_company_id
$$;

-- 3. Add company_id to core tables
ALTER TABLE public.training_programs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.trainers ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.location_types ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.tna_cycles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.content_categories ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.content_tags ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.program_sessions ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.competencies ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.job_roles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.skill_templates ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.mooc_courses ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.mooc_providers ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.sso_configurations ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.library_resources ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- 4. Create indexes for company_id on high-traffic tables
CREATE INDEX IF NOT EXISTS idx_training_programs_company ON public.training_programs(company_id);
CREATE INDEX IF NOT EXISTS idx_events_company ON public.events(company_id);
CREATE INDEX IF NOT EXISTS idx_trainers_company ON public.trainers(company_id);
CREATE INDEX IF NOT EXISTS idx_venues_company ON public.venues(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_company ON public.departments(company_id);
CREATE INDEX IF NOT EXISTS idx_locations_company ON public.locations(company_id);
CREATE INDEX IF NOT EXISTS idx_tna_cycles_company ON public.tna_cycles(company_id);
CREATE INDEX IF NOT EXISTS idx_content_items_company ON public.content_items(company_id);
CREATE INDEX IF NOT EXISTS idx_assessments_company ON public.assessments(company_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_company ON public.learning_paths(company_id);
CREATE INDEX IF NOT EXISTS idx_programs_company ON public.programs(company_id);
CREATE INDEX IF NOT EXISTS idx_job_roles_company ON public.job_roles(company_id);

-- 5. Drop and recreate RLS policies with company scoping

-- training_programs
DROP POLICY IF EXISTS "Admins can manage training programs" ON public.training_programs;
DROP POLICY IF EXISTS "Anyone can view training programs" ON public.training_programs;
CREATE POLICY "Admins can manage training programs" ON public.training_programs FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company training programs" ON public.training_programs FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- events
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company events" ON public.events FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- trainers
DROP POLICY IF EXISTS "Admins can manage trainers" ON public.trainers;
DROP POLICY IF EXISTS "Authenticated users can view active trainers" ON public.trainers;
CREATE POLICY "Admins can manage trainers" ON public.trainers FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company trainers" ON public.trainers FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- venues
DROP POLICY IF EXISTS "Admins can manage venues" ON public.venues;
DROP POLICY IF EXISTS "Authenticated users can view venues" ON public.venues;
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company venues" ON public.venues FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- departments
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
DROP POLICY IF EXISTS "Anyone can view active departments" ON public.departments;
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company departments" ON public.departments FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- locations
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
DROP POLICY IF EXISTS "Anyone can view active locations" ON public.locations;
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company locations" ON public.locations FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- location_types
DROP POLICY IF EXISTS "Admins can manage location types" ON public.location_types;
DROP POLICY IF EXISTS "Anyone can view active location types" ON public.location_types;
CREATE POLICY "Admins can manage location types" ON public.location_types FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company location types" ON public.location_types FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- tna_cycles
DROP POLICY IF EXISTS "Admins can manage TNA cycles" ON public.tna_cycles;
DROP POLICY IF EXISTS "Authenticated users can view TNA cycles" ON public.tna_cycles;
CREATE POLICY "Admins can manage TNA cycles" ON public.tna_cycles FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company TNA cycles" ON public.tna_cycles FOR SELECT
  USING (can_access_company(company_id));

-- content_items
DROP POLICY IF EXISTS "Admins can manage content items" ON public.content_items;
DROP POLICY IF EXISTS "Anyone can view active content items" ON public.content_items;
CREATE POLICY "Admins can manage content items" ON public.content_items FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company content items" ON public.content_items FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- content_categories
DROP POLICY IF EXISTS "Admins can manage content categories" ON public.content_categories;
DROP POLICY IF EXISTS "Anyone can view active content categories" ON public.content_categories;
CREATE POLICY "Admins can manage content categories" ON public.content_categories FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company content categories" ON public.content_categories FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- content_tags
DROP POLICY IF EXISTS "Admins can manage content tags" ON public.content_tags;
DROP POLICY IF EXISTS "Users can view active content tags" ON public.content_tags;
CREATE POLICY "Admins can manage content tags" ON public.content_tags FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company content tags" ON public.content_tags FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- assessments
DROP POLICY IF EXISTS "Admins can manage assessments" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can view assessments" ON public.assessments;
CREATE POLICY "Admins can manage assessments" ON public.assessments FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company assessments" ON public.assessments FOR SELECT
  USING (can_access_company(company_id));

-- learning_paths
DROP POLICY IF EXISTS "Admins can create learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Admins can update learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Anyone can view learning paths" ON public.learning_paths;
CREATE POLICY "Admins can manage learning paths" ON public.learning_paths FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company learning paths" ON public.learning_paths FOR SELECT
  USING (can_access_company(company_id));

-- programs
DROP POLICY IF EXISTS "Authenticated users can view programs" ON public.programs;
CREATE POLICY "Users can view company programs" ON public.programs FOR SELECT
  USING (can_access_company(company_id));

-- competencies
DROP POLICY IF EXISTS "Admins can manage competencies" ON public.competencies;
DROP POLICY IF EXISTS "Anyone can view active competencies" ON public.competencies;
CREATE POLICY "Admins can manage competencies" ON public.competencies FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company competencies" ON public.competencies FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- certifications
DROP POLICY IF EXISTS "Anyone can view certifications" ON public.certifications;
CREATE POLICY "Users can view company certifications" ON public.certifications FOR SELECT
  USING (can_access_company(company_id));

-- badges
DROP POLICY IF EXISTS "Anyone can view active badges" ON public.badges;
CREATE POLICY "Users can view company badges" ON public.badges FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- job_roles
DROP POLICY IF EXISTS "Admins can manage job roles" ON public.job_roles;
DROP POLICY IF EXISTS "Anyone can view active job roles" ON public.job_roles;
CREATE POLICY "Admins can manage job roles" ON public.job_roles FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company job roles" ON public.job_roles FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- skill_templates
DROP POLICY IF EXISTS "Admins can manage skill templates" ON public.skill_templates;
DROP POLICY IF EXISTS "Anyone can view active skill templates" ON public.skill_templates;
CREATE POLICY "Admins can manage skill templates" ON public.skill_templates FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company skill templates" ON public.skill_templates FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- organizational_units (already has company_id from Phase 1)
DROP POLICY IF EXISTS "Admins can manage organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Anyone can view active organizational units" ON public.organizational_units;
CREATE POLICY "Admins can manage organizational units" ON public.organizational_units FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company organizational units" ON public.organizational_units FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- profiles (already has company_id from Phase 1) - update admin policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can manage company profiles" ON public.profiles FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));

-- mooc_courses
DROP POLICY IF EXISTS "Admins can manage MOOC courses" ON public.mooc_courses;
DROP POLICY IF EXISTS "Users can view catalog courses" ON public.mooc_courses;
CREATE POLICY "Admins can manage MOOC courses" ON public.mooc_courses FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company MOOC courses" ON public.mooc_courses FOR SELECT
  USING (in_catalog = true AND is_active = true AND can_access_company(company_id));

-- mooc_providers
DROP POLICY IF EXISTS "Admins can manage MOOC providers" ON public.mooc_providers;
DROP POLICY IF EXISTS "Authenticated users can view connected MOOC providers" ON public.mooc_providers;
CREATE POLICY "Admins can manage MOOC providers" ON public.mooc_providers FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company MOOC providers" ON public.mooc_providers FOR SELECT
  USING (is_connected = true AND can_access_company(company_id));

-- sso_configurations
DROP POLICY IF EXISTS "Admins can manage SSO configurations" ON public.sso_configurations;
CREATE POLICY "Admins can manage SSO configurations" ON public.sso_configurations FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));

-- library_books
DROP POLICY IF EXISTS "Admins can manage books" ON public.library_books;
DROP POLICY IF EXISTS "Anyone can view books" ON public.library_books;
CREATE POLICY "Admins can manage books" ON public.library_books FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company books" ON public.library_books FOR SELECT
  USING (can_access_company(company_id));

-- library_resources
DROP POLICY IF EXISTS "Admins can manage resources" ON public.library_resources;
DROP POLICY IF EXISTS "Anyone can view active resources" ON public.library_resources;
CREATE POLICY "Admins can manage resources" ON public.library_resources FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company resources" ON public.library_resources FOR SELECT
  USING (is_active = true AND can_access_company(company_id));

-- program_sessions
DROP POLICY IF EXISTS "Admins can manage program sessions" ON public.program_sessions;
DROP POLICY IF EXISTS "Authenticated users can view program sessions" ON public.program_sessions;
CREATE POLICY "Admins can manage program sessions" ON public.program_sessions FOR ALL
  USING (is_admin() AND can_access_company(company_id))
  WITH CHECK (is_admin() AND can_access_company(company_id));
CREATE POLICY "Users can view company program sessions" ON public.program_sessions FOR SELECT
  USING (can_access_company(company_id));
