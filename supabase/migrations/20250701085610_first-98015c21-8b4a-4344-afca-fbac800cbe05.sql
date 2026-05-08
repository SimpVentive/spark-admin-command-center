
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  department text,
  position text,
  manager_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  level text NOT NULL CHECK (level IN ('Basic', 'Beginner', 'Intermediate', 'Advanced')),
  theme text,
  outline text NOT NULL,
  icon text,
  venue text,
  faculty text,
  pre_test_info text,
  pre_read_info text,
  multiple_batches boolean DEFAULT false,
  program_type text NOT NULL CHECK (program_type IN ('tna', 'mandatory', 'self-directed', 'eligible')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create program sessions table (for handling multiple batches/dates)
CREATE TABLE IF NOT EXISTS public.program_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL REFERENCES public.programs ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_participants integer,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create user program enrollments table
CREATE TABLE IF NOT EXISTS public.user_program_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs ON DELETE CASCADE,
  session_id uuid REFERENCES public.program_sessions ON DELETE SET NULL,
  enrollment_type text NOT NULL CHECK (enrollment_type IN ('assigned', 'requested', 'self-enrolled')),
  status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  attendance_confirmed boolean DEFAULT false,
  date_change_requested boolean DEFAULT false,
  requested_session_id uuid REFERENCES public.program_sessions,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, program_id)
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.programs ON DELETE CASCADE,
  title text NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('E-Learning Test', 'Skills Evaluation', 'Quiz', 'Practical Assessment')),
  time_limit_minutes integer,
  passing_score integer NOT NULL,
  max_attempts integer DEFAULT 3,
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- Create user assessment attempts table
CREATE TABLE IF NOT EXISTS public.user_assessment_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES public.assessments ON DELETE CASCADE,
  attempt_number integer NOT NULL,
  score integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, assessment_id, attempt_number)
);

-- Create notifications/requests table
CREATE TABLE IF NOT EXISTS public.user_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  program_id uuid REFERENCES public.programs ON DELETE CASCADE,
  request_type text NOT NULL CHECK (request_type IN ('cannot_attend', 'date_change', 'nomination_request')),
  message text,
  requested_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only see and edit their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Programs: All authenticated users can view programs
DROP POLICY IF EXISTS "Authenticated users can view programs" ON public.programs;
CREATE POLICY "Authenticated users can view programs" ON public.programs
  FOR SELECT TO authenticated USING (true);

-- Program sessions: All authenticated users can view sessions
DROP POLICY IF EXISTS "Authenticated users can view program sessions" ON public.program_sessions;
CREATE POLICY "Authenticated users can view program sessions" ON public.program_sessions
  FOR SELECT TO authenticated USING (true);

-- User enrollments: Users can only see their own enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.user_program_enrollments;
CREATE POLICY "Users can view their own enrollments" ON public.user_program_enrollments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own enrollments" ON public.user_program_enrollments;
CREATE POLICY "Users can insert their own enrollments" ON public.user_program_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.user_program_enrollments;
CREATE POLICY "Users can update their own enrollments" ON public.user_program_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Assessments: All authenticated users can view assessments
DROP POLICY IF EXISTS "Authenticated users can view assessments" ON public.assessments;
CREATE POLICY "Authenticated users can view assessments" ON public.assessments
  FOR SELECT TO authenticated USING (true);

-- User assessment attempts: Users can only see their own attempts
DROP POLICY IF EXISTS "Users can view their own assessment attempts" ON public.user_assessment_attempts;
CREATE POLICY "Users can view their own assessment attempts" ON public.user_assessment_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment attempts" ON public.user_assessment_attempts;
CREATE POLICY "Users can insert their own assessment attempts" ON public.user_assessment_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Users can update their own assessment attempts" ON public.user_assessment_attempts;
CREATE POLICY "Users can update their own assessment attempts" ON public.user_assessment_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- User requests: Users can only see their own requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.user_requests;
CREATE POLICY "Users can view their own requests" ON public.user_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own requests" ON public.user_requests;
CREATE POLICY "Users can insert their own requests" ON public.user_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample programs data
INSERT INTO public.programs (title, level, theme, outline, icon, venue, faculty, pre_test_info, pre_read_info, multiple_batches, program_type) VALUES
-- TNA Programs
('Advanced Leadership Development', 'Advanced', 'Leadership', 'Comprehensive leadership skills development for senior managers covering strategic thinking, team management, and organizational transformation.', '👑', 'Corporate Training Center, Mumbai', 'Dr. Sarah Johnson, Leadership Expert', 'Available from 2024-07-01', 'Leadership handbook and case studies', true, 'tna'),
('Digital Transformation Strategy', 'Intermediate', 'Technology', 'Learn to lead digital transformation initiatives in your organization covering change management, technology adoption, and process optimization.', '🚀', 'Tech Hub, Bangalore', 'Prof. Michael Chen', 'Available from 2024-07-20', 'Digital strategy framework guide', false, 'tna'),

-- Mandatory Programs
('Compliance and Ethics Training', 'Basic', 'Compliance', 'Essential compliance training covering company policies, ethical practices, regulatory requirements, and legal obligations.', '⚖️', 'Online Training Platform', 'Legal Team', 'Available from 2024-07-15', 'Company code of conduct', true, 'mandatory'),

-- Self-Directed Programs
('Data Analytics Fundamentals', 'Beginner', 'Analytics', 'Introduction to data analytics tools and techniques for business insights covering Excel, SQL basics, and data visualization.', '📊', 'E-Learning Platform', 'Analytics Team', 'Available immediately', 'Statistics refresher materials', false, 'self-directed'),

-- Eligible Programs
('Strategic Planning Workshop', 'Advanced', 'Strategy', 'Comprehensive workshop on strategic planning methodologies and implementation frameworks for senior executives.', '🎯', 'Executive Training Center, Delhi', 'Dr. Rajesh Kumar, Strategy Consultant', 'Available immediately', 'Strategic planning guide', false, 'eligible'),
('Innovation Management', 'Intermediate', 'Innovation', 'Learn to foster innovation culture and manage innovation processes in your organization including ideation and implementation.', '💡', 'Innovation Hub, Pune', 'Prof. Anita Sharma', 'Available immediately', 'Innovation framework guide', false, 'eligible'),
('Financial Management for Non-Finance Managers', 'Basic', 'Finance', 'Essential financial concepts and tools for managers without financial background covering budgeting, analysis, and reporting.', '💰', 'Finance Academy, Hyderabad', 'CA Priya Nair', 'Available immediately', 'Finance basics handbook', false, 'eligible');

-- Insert sample program sessions with proper date casting
INSERT INTO public.program_sessions (program_id, start_date, end_date, max_participants) 
SELECT id, DATE '2024-07-15', DATE '2024-07-19', 20 FROM public.programs WHERE title = 'Advanced Leadership Development'
UNION ALL
SELECT id, DATE '2024-08-05', DATE '2024-08-07', 15 FROM public.programs WHERE title = 'Digital Transformation Strategy'
UNION ALL
SELECT id, DATE '2024-07-22', DATE '2024-07-22', 50 FROM public.programs WHERE title = 'Compliance and Ethics Training'
UNION ALL
SELECT id, DATE '2024-07-20', DATE '2024-07-20', 25 FROM public.programs WHERE title = 'Strategic Planning Workshop'
UNION ALL
SELECT id, DATE '2024-07-25', DATE '2024-07-25', 20 FROM public.programs WHERE title = 'Innovation Management'
UNION ALL
SELECT id, DATE '2024-08-05', DATE '2024-08-05', 30 FROM public.programs WHERE title = 'Financial Management for Non-Finance Managers';

-- Insert sample assessments with proper date casting
INSERT INTO public.assessments (program_id, title, assessment_type, time_limit_minutes, passing_score, due_date)
SELECT 
  p.id,
  CASE 
    WHEN p.title = 'Compliance and Ethics Training' THEN 'GXP Compliance Final Test'
    WHEN p.title = 'Advanced Leadership Development' THEN 'Leadership Assessment'
    WHEN p.title = 'Data Analytics Fundamentals' THEN 'Safety Knowledge Check'
    WHEN p.title = 'Digital Transformation Strategy' THEN 'Project Management Practical'
  END,
  CASE 
    WHEN p.title = 'Compliance and Ethics Training' THEN 'E-Learning Test'
    WHEN p.title = 'Advanced Leadership Development' THEN 'Skills Evaluation'
    WHEN p.title = 'Data Analytics Fundamentals' THEN 'Quiz'
    WHEN p.title = 'Digital Transformation Strategy' THEN 'Practical Assessment'
  END,
  CASE 
    WHEN p.title = 'Compliance and Ethics Training' THEN 60
    WHEN p.title = 'Advanced Leadership Development' THEN 45
    WHEN p.title = 'Data Analytics Fundamentals' THEN 30
    WHEN p.title = 'Digital Transformation Strategy' THEN 90
  END,
  CASE 
    WHEN p.title = 'Compliance and Ethics Training' THEN 80
    WHEN p.title = 'Advanced Leadership Development' THEN 75
    WHEN p.title = 'Data Analytics Fundamentals' THEN 70
    WHEN p.title = 'Digital Transformation Strategy' THEN 70
  END,
  CASE 
    WHEN p.title = 'Compliance and Ethics Training' THEN DATE '2025-06-15'
    WHEN p.title = 'Advanced Leadership Development' THEN DATE '2025-06-20'
    WHEN p.title = 'Data Analytics Fundamentals' THEN DATE '2025-06-25'
    WHEN p.title = 'Digital Transformation Strategy' THEN DATE '2025-06-18'
  END
FROM public.programs p
WHERE p.title IN ('Compliance and Ethics Training', 'Advanced Leadership Development', 'Data Analytics Fundamentals', 'Digital Transformation Strategy');
