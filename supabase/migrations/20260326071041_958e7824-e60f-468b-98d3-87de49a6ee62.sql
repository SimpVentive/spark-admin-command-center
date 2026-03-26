-- Add block-based pricing columns to company_payments
ALTER TABLE public.company_payments
  ADD COLUMN IF NOT EXISTS block_id text,
  ADD COLUMN IF NOT EXISTS block_seats integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incremental_seats integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incremental_rate numeric,
  ADD COLUMN IF NOT EXISTS discount_percent numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS change_reason text;

-- Add block/incremental breakdown to subscription_invoices
ALTER TABLE public.subscription_invoices
  ADD COLUMN IF NOT EXISTS block_id text,
  ADD COLUMN IF NOT EXISTS block_charge numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS incremental_charge numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;