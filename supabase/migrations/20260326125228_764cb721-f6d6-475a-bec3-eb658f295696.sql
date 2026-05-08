
-- Tenant onboarding pipeline table
-- Tracks each company's onboarding journey through stages
-- Links to existing companies table without conflicting
CREATE TABLE IF NOT EXISTS public.tenant_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  stage text NOT NULL DEFAULT 'invited' CHECK (stage IN ('invited','setup','configuring','training','live')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  days_in_pipeline integer NOT NULL DEFAULT 0,
  csm_assigned text,
  content_template text,
  admin_name text,
  admin_email text,
  admin_designation text,
  admin_role text DEFAULT 'Company Admin',
  billing_contact_name text,
  billing_contact_email text,
  billing_same_as_admin boolean DEFAULT false,
  contract_start_date date,
  internal_notes text,
  auto_configure boolean DEFAULT true,
  send_invite boolean DEFAULT true,
  create_checklist boolean DEFAULT true,
  add_to_pipeline boolean DEFAULT true,
  generate_invoice boolean DEFAULT true,
  onboarded_at timestamptz,
  went_live_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Onboarding checklist items per tenant
CREATE TABLE IF NOT EXISTS public.onboarding_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid REFERENCES public.tenant_onboarding(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  target_day text,
  is_done boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Default checklist template table
CREATE TABLE IF NOT EXISTS public.onboarding_checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  target_days integer DEFAULT 10,
  is_default boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.onboarding_template_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.onboarding_checklist_templates(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  target_day text,
  sort_order integer NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.tenant_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_template_items ENABLE ROW LEVEL SECURITY;

-- Super admin only policies
DROP POLICY IF EXISTS "Super admins can manage tenant onboarding" ON public.tenant_onboarding;
CREATE POLICY "Super admins can manage tenant onboarding" ON public.tenant_onboarding
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can manage onboarding checklist" ON public.onboarding_checklist;
CREATE POLICY "Super admins can manage onboarding checklist" ON public.onboarding_checklist
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can manage checklist templates" ON public.onboarding_checklist_templates;
CREATE POLICY "Super admins can manage checklist templates" ON public.onboarding_checklist_templates
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can manage template items" ON public.onboarding_template_items;
CREATE POLICY "Super admins can manage template items" ON public.onboarding_template_items
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_tenant_onboarding_updated_at ON public.tenant_onboarding;
CREATE TRIGGER update_tenant_onboarding_updated_at
  BEFORE UPDATE ON public.tenant_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default checklist template
INSERT INTO public.onboarding_checklist_templates (name, description, target_days, is_default) VALUES
  ('Default Onboarding Template', 'Applied to all new Block 3+ tenants', 10, true);

-- Insert default template items
INSERT INTO public.onboarding_template_items (template_id, label, target_day, sort_order)
SELECT t.id, item.label, item.target_day, item.sort_order
FROM public.onboarding_checklist_templates t
CROSS JOIN (VALUES
  ('Invitation email sent', 'Day 1', 1),
  ('Admin account created & verified', 'Day 1', 2),
  ('Company profile completed', 'Day 2', 3),
  ('Users imported (CSV/SSO)', 'Day 3', 4),
  ('Departments & hierarchy set up', 'Day 4', 5),
  ('Branding & logo applied', 'Day 5', 6),
  ('Compliance modules configured', 'Day 5', 7),
  ('Default learning paths created', 'Day 6', 8),
  ('First course assigned to users', 'Day 7', 9),
  ('Admin walkthrough session done', 'Day 8', 10),
  ('UAT sign-off received', 'Day 9', 11),
  ('Go-live confirmation', 'Day 10', 12)
) AS item(label, target_day, sort_order)
WHERE t.is_default = true;
