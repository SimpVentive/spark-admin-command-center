
-- Company payment/subscription tracking (manual)
CREATE TABLE public.company_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'Free',
  plan_status TEXT NOT NULL DEFAULT 'active' CHECK (plan_status IN ('active', 'trial', 'expired', 'suspended')),
  amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one-time')),
  start_date DATE,
  end_date DATE,
  payment_method TEXT,
  last_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage company payments"
  ON public.company_payments FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- CRM notes/communication log for companies
CREATE TABLE public.company_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'support', 'billing', 'onboarding', 'announcement')),
  subject TEXT,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage company notes"
  ON public.company_notes FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Timestamps triggers
CREATE TRIGGER update_company_payments_updated_at
  BEFORE UPDATE ON public.company_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_notes_updated_at
  BEFORE UPDATE ON public.company_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
