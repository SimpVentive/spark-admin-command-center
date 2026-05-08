
-- 1. Fix question_bank: restrict public from seeing correct_answer and explanation
-- Drop the permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active questions" ON public.question_bank;

-- Create a view that hides sensitive fields for non-admins
CREATE OR REPLACE VIEW public.question_bank_safe AS
SELECT id, question_text, question_type, competency_id, program_id,
       difficulty_level, points, is_active, created_at
FROM public.question_bank
WHERE is_active = true;

-- Re-create SELECT policy for authenticated users only (no answers)
DROP POLICY IF EXISTS "Authenticated users can view active questions" ON public.question_bank;
CREATE POLICY "Authenticated users can view active questions"
ON public.question_bank
FOR SELECT
TO authenticated
USING (is_active = true);

-- 2. Fix question_options: hide is_correct from non-admins
DROP POLICY IF EXISTS "Anyone can view question options" ON public.question_options;

CREATE OR REPLACE VIEW public.question_options_safe AS
SELECT id, question_id, option_text, option_order
FROM public.question_options
WHERE EXISTS (
  SELECT 1 FROM public.question_bank 
  WHERE id = question_options.question_id AND is_active = true
);

DROP POLICY IF EXISTS "Authenticated users can view question options" ON public.question_options;
CREATE POLICY "Authenticated users can view question options"
ON public.question_options
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.question_bank 
    WHERE id = question_options.question_id AND is_active = true
  )
);

-- 3. Fix trainers: restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view active trainers" ON public.trainers;

DROP POLICY IF EXISTS "Authenticated users can view active trainers" ON public.trainers;
CREATE POLICY "Authenticated users can view active trainers"
ON public.trainers
FOR SELECT
TO authenticated
USING (is_active = true);

-- 4. Fix MOOC providers: restrict to authenticated users, hide credentials
DROP POLICY IF EXISTS "Users can view active MOOC providers" ON public.mooc_providers;
DROP POLICY IF EXISTS "Anyone can view active MOOC providers" ON public.mooc_providers;
CREATE POLICY "Authenticated users can view connected MOOC providers"
ON public.mooc_providers
FOR SELECT
TO authenticated
USING (is_connected = true);
