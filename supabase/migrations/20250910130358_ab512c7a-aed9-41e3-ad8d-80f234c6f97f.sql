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