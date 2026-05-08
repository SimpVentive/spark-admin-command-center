
-- 1. Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- 2. Add company_id to profiles (nullable so existing data is safe)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- 3. Add company_id to organizational_units (nullable)
ALTER TABLE public.organizational_units ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- 4. Add scoped_unit_id to user_roles (nullable - limits admin scope to that org unit)
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS scoped_unit_id uuid REFERENCES public.organizational_units(id);

-- 5. Add company_id to user_roles (nullable - links role to a specific company)
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- 6. Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 7. Super admins can do everything on companies
DROP POLICY IF EXISTS "Super admins can manage all companies" ON public.companies;
CREATE POLICY "Super admins can manage all companies"
  ON public.companies FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- 8. Company admins can view their own company
DROP POLICY IF EXISTS "Company admins can view own company" ON public.companies;
CREATE POLICY "Company admins can view own company"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT ur.company_id FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.company_id IS NOT NULL
    )
  );

-- 9. Updated_at trigger for companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Helper function: get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

-- 11. Helper function: check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'super_admin')
$$;
