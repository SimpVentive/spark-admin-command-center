
-- Add 'location_admin' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'location_admin';

-- ============================================
-- VENUES TABLE (Internal & External)
-- ============================================
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  venue_type TEXT NOT NULL DEFAULT 'internal' CHECK (venue_type IN ('internal', 'external')),
  address TEXT,
  city TEXT,
  capacity INTEGER,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  facilities TEXT[],
  hourly_rate NUMERIC(10,2),
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view venues" ON public.venues FOR SELECT TO authenticated USING (is_active = true);

-- ============================================
-- EVENTS TABLE (Training Events linked to Programs)
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  program_id UUID REFERENCES public.training_programs(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL DEFAULT 'offline' CHECK (event_type IN ('offline', 'online_virtual', 'elearning', 'blended')),
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  max_participants INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  meeting_link TEXT,
  budget_allocated NUMERIC(12,2) DEFAULT 0,
  budget_spent NUMERIC(12,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (is_active = true);

-- ============================================
-- EVENT SESSIONS (Multiple sessions per event)
-- ============================================
CREATE TABLE public.event_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  session_order INTEGER DEFAULT 1,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage event_sessions" ON public.event_sessions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view event_sessions" ON public.event_sessions FOR SELECT TO authenticated USING (is_active = true);

-- ============================================
-- EVENT TRAINERS (Link trainers to events)
-- ============================================
CREATE TABLE public.event_trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'primary' CHECK (role IN ('primary', 'co_trainer', 'guest')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, trainer_id)
);

ALTER TABLE public.event_trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage event_trainers" ON public.event_trainers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view event_trainers" ON public.event_trainers FOR SELECT TO authenticated USING (true);

-- ============================================
-- EVENT ASSESSMENTS (PRE, POST, Feedback, L3 per event/session)
-- ============================================
CREATE TABLE public.event_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.event_sessions(id) ON DELETE SET NULL,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  assessment_purpose TEXT NOT NULL CHECK (assessment_purpose IN ('pre_test', 'post_test', 'feedback', 'l3_feedback')),
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, session_id, assessment_id, assessment_purpose)
);

ALTER TABLE public.event_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage event_assessments" ON public.event_assessments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view event_assessments" ON public.event_assessments FOR SELECT TO authenticated USING (true);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.event_sessions(id) ON DELETE SET NULL,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (event_id, session_id, employee_id)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage attendance" ON public.attendance FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT TO authenticated USING (employee_id = auth.uid());

-- ============================================
-- TRAINER FEEDBACK (Trainer → Learner)
-- ============================================
CREATE TABLE public.trainer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.event_sessions(id) ON DELETE SET NULL,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  areas_of_improvement TEXT,
  strengths TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.trainer_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage trainer_feedback" ON public.trainer_feedback FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own feedback" ON public.trainer_feedback FOR SELECT TO authenticated USING (employee_id = auth.uid());

-- ============================================
-- EVENT ENROLLMENTS (Who's enrolled in event)
-- ============================================
CREATE TABLE public.event_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrollment_status TEXT DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'waitlisted', 'cancelled', 'completed')),
  enrolled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (event_id, employee_id)
);

ALTER TABLE public.event_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage event_enrollments" ON public.event_enrollments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own enrollments" ON public.event_enrollments FOR SELECT TO authenticated USING (employee_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trainer_feedback_updated_at BEFORE UPDATE ON public.trainer_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
