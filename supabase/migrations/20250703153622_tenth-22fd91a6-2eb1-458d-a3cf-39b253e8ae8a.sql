
-- Create program sessions table for scheduling
CREATE TABLE IF NOT EXISTS public.program_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user learning progress table
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('ilt', 'elearning', 'peer-to-peer')),
  hours_completed DECIMAL(10,2) DEFAULT 0,
  total_hours DECIMAL(10,2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;

-- =========================
-- Programs
-- =========================

DROP POLICY IF EXISTS "Programs are viewable by authenticated users"
ON public.programs;

CREATE POLICY "Programs are viewable by authenticated users"
ON public.programs
FOR SELECT
USING (auth.role() = 'authenticated');

-- =========================
-- Program Sessions
-- =========================

DROP POLICY IF EXISTS "Program sessions are viewable by authenticated users"
ON public.program_sessions;

CREATE POLICY "Program sessions are viewable by authenticated users"
ON public.program_sessions
FOR SELECT
USING (auth.role() = 'authenticated');

-- =========================
-- User Enrollments
-- =========================

DROP POLICY IF EXISTS "Users can view their own enrollments"
ON public.user_program_enrollments;

CREATE POLICY "Users can view their own enrollments"
ON public.user_program_enrollments
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own enrollments"
ON public.user_program_enrollments;

CREATE POLICY "Users can insert their own enrollments"
ON public.user_program_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own enrollments"
ON public.user_program_enrollments;

CREATE POLICY "Users can update their own enrollments"
ON public.user_program_enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- =========================
-- Learning Progress
-- =========================

DROP POLICY IF EXISTS "Users can view their own learning progress"
ON public.user_learning_progress;

CREATE POLICY "Users can view their own learning progress"
ON public.user_learning_progress
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own learning progress"
ON public.user_learning_progress;

CREATE POLICY "Users can insert their own learning progress"
ON public.user_learning_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own learning progress"
ON public.user_learning_progress;

CREATE POLICY "Users can update their own learning progress"
ON public.user_learning_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON public.user_program_enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.user_program_enrollments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
