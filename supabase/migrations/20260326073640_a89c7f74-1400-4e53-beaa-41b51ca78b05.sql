
-- Seat block definitions (configurable pricing tiers)
CREATE TABLE IF NOT EXISTS public.seat_blocks (
  id text PRIMARY KEY,
  label text NOT NULL,
  name text NOT NULL,
  seat_from integer NOT NULL,
  seat_to integer NOT NULL DEFAULT 999999,
  rate_per_seat numeric NOT NULL,
  annual_rate_per_seat numeric,
  incremental_rate numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seat_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage seat_blocks" ON public.seat_blocks;
CREATE POLICY "Super admins can manage seat_blocks"
  ON public.seat_blocks FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Insert default blocks per spec
INSERT INTO public.seat_blocks (id, label, name, seat_from, seat_to, rate_per_seat, incremental_rate) VALUES
  ('B1', 'Block 1', 'Starter', 1, 100, 499, 599),
  ('B2', 'Block 2', 'Growth', 101, 250, 449, 549),
  ('B3', 'Block 3', 'Pro', 251, 500, 399, 499),
  ('B4', 'Block 4', 'Enterprise', 501, 1000, 349, 449),
  ('B5', 'Block 5', 'Large Ent.', 1001, 999999, 299, 399);

-- Company-specific discounts
CREATE TABLE IF NOT EXISTS public.company_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  discount_target text NOT NULL DEFAULT 'block', -- 'block', 'incremental', 'both'
  discount_percent numeric NOT NULL DEFAULT 0,
  valid_until date,
  reason text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage company_discounts" ON public.company_discounts;
CREATE POLICY "Super admins can manage company_discounts"
  ON public.company_discounts FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Seat change audit log
CREATE TABLE IF NOT EXISTS public.seat_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  change_type text NOT NULL, -- 'add_incremental', 'upgrade_block', 'discount_add', 'discount_remove', 'block_change'
  details jsonb DEFAULT '{}',
  performed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seat_change_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can manage seat_change_log" ON public.seat_change_log;
CREATE POLICY "Super admins can manage seat_change_log"
  ON public.seat_change_log FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Add active_users count to company_payments if not present
ALTER TABLE public.company_payments ADD COLUMN IF NOT EXISTS active_users integer DEFAULT 0;
ALTER TABLE public.company_payments ADD COLUMN IF NOT EXISTS discount_target text DEFAULT 'block';
ALTER TABLE public.company_payments ADD COLUMN IF NOT EXISTS discount_reason text;
ALTER TABLE public.company_payments ADD COLUMN IF NOT EXISTS discount_valid_until date;
