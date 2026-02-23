
-- Add locations and roles columns to tna_cycles for employee matching
ALTER TABLE public.tna_cycles 
ADD COLUMN IF NOT EXISTS locations text[] NOT NULL DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS roles text[] NOT NULL DEFAULT '{}'::text[];
