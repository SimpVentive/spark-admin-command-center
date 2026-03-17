
-- Extend companies table with address, website, and contact info
ALTER TABLE public.companies 
  ADD COLUMN IF NOT EXISTS address_line_1 text,
  ADD COLUMN IF NOT EXISTS address_line_2 text,
  ADD COLUMN IF NOT EXISTS address_line_3 text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS contact_person_name text,
  ADD COLUMN IF NOT EXISTS contact_person_email text,
  ADD COLUMN IF NOT EXISTS contact_person_phone text;

-- Company customization change requests
CREATE TABLE public.company_customizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  change_type text NOT NULL DEFAULT 'feature_request',
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  requested_by text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  ai_estimated_hours numeric,
  ai_impact_score numeric,
  ai_risk_level text,
  ai_affected_modules text[],
  ai_analysis_notes text,
  approved_by uuid,
  approved_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_customizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage customizations"
  ON public.company_customizations
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Trigger for updated_at
CREATE TRIGGER update_company_customizations_updated_at
  BEFORE UPDATE ON public.company_customizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
