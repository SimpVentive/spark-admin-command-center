-- Bandwidth tracking per company
CREATE TABLE IF NOT EXISTS public.company_bandwidth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  month_year text NOT NULL,
  bandwidth_used_gb numeric DEFAULT 0,
  bandwidth_quota_gb numeric DEFAULT 60,
  bandwidth_video_gb numeric DEFAULT 0,
  bandwidth_scorm_gb numeric DEFAULT 0,
  bandwidth_docs_gb numeric DEFAULT 0,
  bandwidth_img_gb numeric DEFAULT 0,
  bandwidth_api_gb numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, month_year)
);

ALTER TABLE public.company_bandwidth ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage company bandwidth" ON public.company_bandwidth;
CREATE POLICY "Super admins can manage company bandwidth"
  ON public.company_bandwidth FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Content pool: tracks which content items are assigned to which companies
CREATE TABLE IF NOT EXISTS public.company_content_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  pool_type text NOT NULL CHECK (pool_type IN ('mandatory', 'optional', 'pulled')),
  pushed_by uuid REFERENCES auth.users(id),
  completion_pct numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, content_id)
);

ALTER TABLE public.company_content_pool ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage company content pool" ON public.company_content_pool;
CREATE POLICY "Super admins can manage company content pool"
  ON public.company_content_pool FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Company members can view their content pool" ON public.company_content_pool;
CREATE POLICY "Company members can view their content pool"
  ON public.company_content_pool FOR SELECT TO authenticated
  USING (public.can_access_company(company_id));