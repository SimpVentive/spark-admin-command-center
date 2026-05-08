
-- Create subscription_invoices table for invoice tracking
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  payment_id uuid REFERENCES public.company_payments(id) ON DELETE SET NULL,
  plan_name text NOT NULL DEFAULT 'Starter',
  amount numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  due_date date NOT NULL,
  payment_date date,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Super admin can do everything
DROP POLICY IF EXISTS "Super admins can manage invoices" ON public.subscription_invoices;
CREATE POLICY "Super admins can manage invoices"
ON public.subscription_invoices
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Add seats_included to company_payments if not exists
ALTER TABLE public.company_payments 
  ADD COLUMN IF NOT EXISTS seats_included integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS renewal_date date;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_subscription_invoices_updated_at ON public.subscription_invoices;
CREATE TRIGGER update_subscription_invoices_updated_at
  BEFORE UPDATE ON public.subscription_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
