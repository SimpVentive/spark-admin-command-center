-- CRITICAL SECURITY FIXES

-- 1. Enable RLS on all learning-related tables that currently lack it
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_path_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sso_configurations ENABLE ROW LEVEL SECURITY;

-- 2. Add RLS policies for learning_paths (public read, authenticated users can see all)
DROP POLICY IF EXISTS "Anyone can view learning paths" ON public.learning_paths;
CREATE POLICY "Anyone can view learning paths" 
ON public.learning_paths 
FOR SELECT 
USING (true);

-- 3. Add RLS policies for learning_path_modules
DROP POLICY IF EXISTS "Anyone can view learning path modules" ON public.learning_path_modules;
CREATE POLICY "Anyone can view learning path modules" 
ON public.learning_path_modules 
FOR SELECT 
USING (true);

-- 4. Add RLS policies for user_learning_path_enrollments (users can only see their own)
DROP POLICY IF EXISTS "Users can view their own learning path enrollments" ON public.user_learning_path_enrollments;
CREATE POLICY "Users can view their own learning path enrollments" 
ON public.user_learning_path_enrollments 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own learning path enrollments" ON public.user_learning_path_enrollments;
CREATE POLICY "Users can insert their own learning path enrollments" 
ON public.user_learning_path_enrollments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own learning path enrollments" ON public.user_learning_path_enrollments;
CREATE POLICY "Users can update their own learning path enrollments" 
ON public.user_learning_path_enrollments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Add RLS policies for user_module_progress
DROP POLICY IF EXISTS "Users can view their own module progress" ON public.user_module_progress;
CREATE POLICY "Users can view their own module progress" 
ON public.user_module_progress 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own module progress" ON public.user_module_progress;
CREATE POLICY "Users can insert their own module progress" 
ON public.user_module_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own module progress" ON public.user_module_progress;
CREATE POLICY "Users can update their own module progress" 
ON public.user_module_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 6. Add RLS policies for certifications (public read)
DROP POLICY IF EXISTS "Anyone can view certifications" ON public.certifications;
CREATE POLICY "Anyone can view certifications" 
ON public.certifications 
FOR SELECT 
USING (true);

-- 7. Add RLS policies for user_certifications (users can only see their own)
DROP POLICY IF EXISTS "Users can view their own certifications" ON public.user_certifications;
CREATE POLICY "Users can view their own certifications" 
ON public.user_certifications 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own certifications" ON public.user_certifications;
CREATE POLICY "Users can insert their own certifications" 
ON public.user_certifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 8. Add RLS policies for user_certification_attempts
DROP POLICY IF EXISTS "Users can view their own certification attempts" ON public.user_certification_attempts;
CREATE POLICY "Users can view their own certification attempts" 
ON public.user_certification_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own certification attempts" ON public.user_certification_attempts;
CREATE POLICY "Users can insert their own certification attempts" 
ON public.user_certification_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own certification attempts" ON public.user_certification_attempts;
CREATE POLICY "Users can update their own certification attempts" 
ON public.user_certification_attempts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 9. Add missing INSERT policy for profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 10. Secure SSO configurations (admin only - for now, restrict to no access until admin roles are implemented)
DROP POLICY IF EXISTS "Restrict SSO configurations access" ON public.sso_configurations;
CREATE POLICY "Restrict SSO configurations access" 
ON public.sso_configurations 
FOR ALL 
USING (false);

-- 11. Fix database function security - update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- 12. Fix update_updated_at_column function security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 13. Fix cleanup_expired_lti_sessions function security
CREATE OR REPLACE FUNCTION public.cleanup_expired_lti_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.lti_sessions 
    WHERE expires_at < now() - INTERVAL '1 day';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;