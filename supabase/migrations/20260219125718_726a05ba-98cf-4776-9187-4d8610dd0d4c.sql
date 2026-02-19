
-- Add manager ratification flag to TNA cycles
ALTER TABLE public.tna_cycles 
ADD COLUMN IF NOT EXISTS manager_ratification_required boolean NOT NULL DEFAULT false;

-- Add manager modifications tracking to tni_submissions
ALTER TABLE public.tni_submissions 
ADD COLUMN IF NOT EXISTS manager_modifications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS manager_changes_count integer NOT NULL DEFAULT 0;
