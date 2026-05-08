-- Add new columns to companies table
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS company_size text,
  ADD COLUMN IF NOT EXISTS gstin text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS pin_code text,
  ADD COLUMN IF NOT EXISTS primary_domain text,
  ADD COLUMN IF NOT EXISTS subdomain text,
  ADD COLUMN IF NOT EXISTS billing_contact_name text,
  ADD COLUMN IF NOT EXISTS billing_contact_email text,
  ADD COLUMN IF NOT EXISTS billing_contact_phone text,
  ADD COLUMN IF NOT EXISTS billing_contact_designation text,
  ADD COLUMN IF NOT EXISTS csm_assigned text;

-- Add contract fields to company_payments
ALTER TABLE public.company_payments
  ADD COLUMN IF NOT EXISTS contract_value numeric,
  ADD COLUMN IF NOT EXISTS po_number text,
  ADD COLUMN IF NOT EXISTS contract_start_date date,
  ADD COLUMN IF NOT EXISTS contract_end_date date;

-- Create company_features table for feature toggles per company
CREATE TABLE IF NOT EXISTS public.company_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  is_addon boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, feature_key)
);

ALTER TABLE public.company_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins manage company features" ON public.company_features;
CREATE POLICY "Super admins manage company features"
  ON public.company_features
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Create company_activity_log for activity tracking
CREATE TABLE IF NOT EXISTS public.company_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  action text NOT NULL,
  description text,
  actor_email text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins view company activity" ON public.company_activity_log;
CREATE POLICY "Super admins view company activity"
  ON public.company_activity_log
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Trigger for company_features updated_at
DROP TRIGGER IF EXISTS update_company_features_updated_at ON public.company_features;
CREATE TRIGGER update_company_features_updated_at
  BEFORE UPDATE ON public.company_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();