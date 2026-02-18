-- Add departments, locations, and roles columns to training_programs
ALTER TABLE public.training_programs 
ADD COLUMN IF NOT EXISTS departments text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS locations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS roles text[] DEFAULT '{}';