
-- =====================================================
-- FIX 1: Restrict trainers table to authenticated users only
-- (removes public exposure of email/phone)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view active trainers" ON public.trainers;
CREATE POLICY "Authenticated users can view active trainers"
ON public.trainers FOR SELECT TO authenticated
USING (is_active = true);

-- =====================================================
-- FIX 2: Remove broad SELECT on question_bank that exposes correct_answer
-- Users must use question_bank_safe view instead
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view active questions" ON public.question_bank;
-- Only admins can access the raw table (already has admin ALL policy)

-- =====================================================
-- FIX 3: Remove broad SELECT on question_options that exposes is_correct
-- Users must use question_options_safe view instead
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view question options" ON public.question_options;
-- Only admins can access the raw table (already has admin ALL policy)

-- =====================================================
-- FIX 4: Add admin management policies to lti_tools
-- (currently only has public SELECT, no insert/update/delete)
-- =====================================================
DROP POLICY IF EXISTS "Public can view active LTI tools" ON public.lti_tools;

CREATE POLICY "Authenticated users can view active LTI tools"
ON public.lti_tools FOR SELECT TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage LTI tools"
ON public.lti_tools FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- FIX 5: Fix SSO configurations - allow admin access
-- (currently USING(false) blocks even admins)
-- =====================================================
DROP POLICY IF EXISTS "Restrict SSO configurations access" ON public.sso_configurations;

CREATE POLICY "Admins can manage SSO configurations"
ON public.sso_configurations FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- FIX 6: Restrict job_roles write operations to admins
-- (currently allows anyone to insert/update/delete)
-- =====================================================
DROP POLICY IF EXISTS "Allow delete for job roles" ON public.job_roles;
DROP POLICY IF EXISTS "Allow insert for job roles" ON public.job_roles;
DROP POLICY IF EXISTS "Allow update for job roles" ON public.job_roles;

CREATE POLICY "Admins can manage job roles"
ON public.job_roles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
