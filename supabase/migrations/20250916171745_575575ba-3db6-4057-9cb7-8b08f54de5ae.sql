-- Create evaluations table for Kirkpatrick model
CREATE TABLE IF NOT EXISTS public.kirkpatrick_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('1', '2', '3', '4')),
  metric_name TEXT NOT NULL CHECK (metric_name IN (
    'satisfaction',
    'relevance',
    'engagement',
    'knowledge_gain',
    'skill_improvement',
    'application',
    'on_job_application',
    'behavior_change',
    'business_impact',
    'roi_achievement'
  )),
  score DECIMAL(3,1) NOT NULL CHECK (score >= 1.0 AND score <= 10.0),
  notes TEXT,
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_kirkpatrick_evaluations_enrollment_id ON public.kirkpatrick_evaluations(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_kirkpatrick_evaluations_level ON public.kirkpatrick_evaluations(level);
CREATE INDEX IF NOT EXISTS idx_kirkpatrick_evaluations_metric_name ON public.kirkpatrick_evaluations(metric_name);
CREATE INDEX IF NOT EXISTS idx_kirkpatrick_evaluations_evaluation_date ON public.kirkpatrick_evaluations(evaluation_date);

-- Enable Row Level Security
ALTER TABLE public.kirkpatrick_evaluations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view evaluations for their enrollments" ON public.kirkpatrick_evaluations;
CREATE POLICY "Users can view evaluations for their enrollments"
ON public.kirkpatrick_evaluations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_program_enrollments 
    WHERE user_program_enrollments.id = kirkpatrick_evaluations.enrollment_id 
    AND user_program_enrollments.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert evaluations for their enrollments" ON public.kirkpatrick_evaluations;
CREATE POLICY "Users can insert evaluations for their enrollments"
ON public.kirkpatrick_evaluations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_program_enrollments 
    WHERE user_program_enrollments.id = kirkpatrick_evaluations.enrollment_id 
    AND user_program_enrollments.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update evaluations for their enrollments" ON public.kirkpatrick_evaluations;
CREATE POLICY "Users can update evaluations for their enrollments"
ON public.kirkpatrick_evaluations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_program_enrollments 
    WHERE user_program_enrollments.id = kirkpatrick_evaluations.enrollment_id 
    AND user_program_enrollments.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can manage all evaluations" ON public.kirkpatrick_evaluations;
CREATE POLICY "Admins can manage all evaluations"
ON public.kirkpatrick_evaluations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_kirkpatrick_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS update_kirkpatrick_evaluations_updated_at ON public.kirkpatrick_evaluations;
CREATE TRIGGER update_kirkpatrick_evaluations_updated_at
  BEFORE UPDATE ON public.kirkpatrick_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kirkpatrick_evaluations_updated_at();