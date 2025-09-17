-- Create MOOC Providers table
CREATE TABLE public.mooc_providers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  provider_type text NOT NULL, -- 'coursera', 'linkedin_learning', 'udemy_business', 'edx'
  api_endpoint text,
  client_id text,
  client_secret_encrypted text,
  is_connected boolean DEFAULT false,
  last_sync_at timestamp with time zone,
  sync_frequency text DEFAULT 'daily', -- 'daily', 'weekly', 'manual'
  total_courses integer DEFAULT 0,
  active_enrollments integer DEFAULT 0,
  monthly_cost numeric DEFAULT 0,
  annual_cost numeric DEFAULT 0,
  seat_limit integer DEFAULT 0,
  seats_used integer DEFAULT 0,
  renewal_date date,
  status text DEFAULT 'pending', -- 'pending', 'active', 'disconnected', 'expired'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  config_data jsonb DEFAULT '{}'::jsonb
);

-- Create MOOC Courses table
CREATE TABLE public.mooc_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES public.mooc_providers(id) ON DELETE CASCADE,
  external_course_id text NOT NULL,
  title text NOT NULL,
  description text,
  instructor text,
  provider_name text NOT NULL,
  category text,
  level text, -- 'beginner', 'intermediate', 'advanced'
  duration_weeks integer,
  rating numeric,
  student_count integer DEFAULT 0,
  price numeric DEFAULT 0,
  currency text DEFAULT 'USD',
  image_url text,
  course_url text,
  skills_covered text[],
  prerequisites text[],
  in_catalog boolean DEFAULT false,
  organization_enrollments integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(provider_id, external_course_id)
);

-- Create MOOC Enrollments table
CREATE TABLE public.mooc_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  course_id uuid NOT NULL REFERENCES public.mooc_courses(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.mooc_providers(id),
  external_enrollment_id text,
  enrolled_at timestamp with time zone DEFAULT now(),
  due_date timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  progress_percentage integer DEFAULT 0,
  time_spent_hours numeric DEFAULT 0,
  status text DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'overdue', 'dropped'
  enrollment_type text DEFAULT 'individual', -- 'individual', 'bulk', 'mandatory'
  grade_received text,
  certificate_earned boolean DEFAULT false,
  certificate_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create MOOC Sync Logs table
CREATE TABLE public.mooc_sync_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES public.mooc_providers(id) ON DELETE CASCADE,
  sync_type text NOT NULL, -- 'courses', 'enrollments', 'progress', 'full'
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  status text DEFAULT 'running', -- 'running', 'completed', 'failed'
  records_processed integer DEFAULT 0,
  records_updated integer DEFAULT 0,
  records_created integer DEFAULT 0,
  error_message text,
  sync_data jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.mooc_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mooc_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mooc_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mooc_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mooc_providers
CREATE POLICY "Admins can manage MOOC providers" ON public.mooc_providers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active MOOC providers" ON public.mooc_providers
  FOR SELECT USING (is_connected = true);

-- RLS Policies for mooc_courses  
CREATE POLICY "Admins can manage MOOC courses" ON public.mooc_courses
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view catalog courses" ON public.mooc_courses
  FOR SELECT USING (in_catalog = true AND is_active = true);

-- RLS Policies for mooc_enrollments
CREATE POLICY "Admins can manage all MOOC enrollments" ON public.mooc_enrollments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own MOOC enrollments" ON public.mooc_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MOOC enrollments" ON public.mooc_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MOOC enrollments" ON public.mooc_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for mooc_sync_logs
CREATE POLICY "Admins can view MOOC sync logs" ON public.mooc_sync_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create update timestamp triggers
CREATE TRIGGER update_mooc_providers_updated_at
  BEFORE UPDATE ON public.mooc_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mooc_courses_updated_at
  BEFORE UPDATE ON public.mooc_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mooc_enrollments_updated_at
  BEFORE UPDATE ON public.mooc_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.mooc_providers (name, provider_type, is_connected, total_courses, active_enrollments, monthly_cost, annual_cost, seat_limit, seats_used, status, last_sync_at) VALUES
('Coursera Business', 'coursera', true, 4500, 234, 1200, 14400, 250, 234, 'active', now() - interval '2 minutes'),
('LinkedIn Learning', 'linkedin_learning', true, 3200, 156, 950, 11400, 200, 156, 'active', now() - interval '1 hour'),
('Udemy Business', 'udemy_business', false, 0, 0, 700, 8400, 100, 0, 'pending', null);

-- Get provider IDs for sample courses
INSERT INTO public.mooc_courses (provider_id, external_course_id, title, description, instructor, provider_name, category, level, duration_weeks, rating, student_count, price, image_url, in_catalog, organization_enrollments) 
SELECT 
  p.id,
  'ML-SPEC-001',
  'Machine Learning Specialization',
  'Master machine learning fundamentals and build real-world applications.',
  'Andrew Ng',
  'Coursera',
  'Technology',
  'intermediate',
  11,
  4.9,
  185000,
  49,
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
  true,
  45
FROM public.mooc_providers p WHERE p.provider_type = 'coursera'
LIMIT 1;

INSERT INTO public.mooc_courses (provider_id, external_course_id, title, description, instructor, provider_name, category, level, duration_weeks, rating, student_count, price, image_url, in_catalog, organization_enrollments)
SELECT 
  p.id,
  'DM-STRAT-001',
  'Digital Marketing Strategy',
  'Learn to create effective digital marketing campaigns.',
  'Sarah Miller',
  'LinkedIn Learning',
  'Marketing',
  'beginner',
  6,
  4.7,
  67000,
  29.99,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  false,
  0
FROM public.mooc_providers p WHERE p.provider_type = 'linkedin_learning'
LIMIT 1;

INSERT INTO public.mooc_courses (provider_id, external_course_id, title, description, instructor, provider_name, category, level, duration_weeks, rating, student_count, price, image_url, in_catalog, organization_enrollments)
SELECT 
  p.id,
  'PM-PROF-001',
  'Project Management Professional',
  'Comprehensive PMP certification preparation course.',
  'Google',
  'Coursera',
  'Management',
  'intermediate',
  8,
  4.8,
  120000,
  39,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
  true,
  23
FROM public.mooc_providers p WHERE p.provider_type = 'coursera'
LIMIT 1;