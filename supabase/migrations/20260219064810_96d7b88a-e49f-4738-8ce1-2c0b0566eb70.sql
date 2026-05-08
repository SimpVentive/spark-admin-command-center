
-- 1. Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  manager_name text,
  location text,
  employee_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view active departments" ON public.departments;
CREATE POLICY "Anyone can view active departments" ON public.departments FOR SELECT USING (is_active = true);

DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  type text,
  latitude numeric,
  longitude numeric,
  department_count integer DEFAULT 0,
  employee_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view active locations" ON public.locations;
CREATE POLICY "Anyone can view active locations" ON public.locations FOR SELECT USING (is_active = true);
DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Location types table
CREATE TABLE IF NOT EXISTS public.location_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.location_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage location types" ON public.location_types;
CREATE POLICY "Admins can manage location types" ON public.location_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view active location types" ON public.location_types;
CREATE POLICY "Anyone can view active location types" ON public.location_types FOR SELECT USING (is_active = true);

-- Seed default location types
INSERT INTO public.location_types (name) VALUES ('Manufacturing Plant'), ('R&D Center'), ('Regional Office'), ('Sales Office');

-- 4. Trainers table
CREATE TABLE IF NOT EXISTS public.trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text,
  rating numeric DEFAULT 0,
  programs_count integer DEFAULT 0,
  location text,
  status text DEFAULT 'Active',
  is_external boolean DEFAULT false,
  email text,
  phone text,
  bio text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage trainers" ON public.trainers;
CREATE POLICY "Admins can manage trainers" ON public.trainers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view active trainers" ON public.trainers;
CREATE POLICY "Anyone can view active trainers" ON public.trainers FOR SELECT USING (is_active = true);
DROP TRIGGER IF EXISTS update_trainers_updated_at ON public.trainers;
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Content categories table
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage content categories" ON public.content_categories;
CREATE POLICY "Admins can manage content categories" ON public.content_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view active content categories" ON public.content_categories;
CREATE POLICY "Anyone can view active content categories" ON public.content_categories FOR SELECT USING (is_active = true);

-- Seed default content categories
INSERT INTO public.content_categories (name, description, color) VALUES
  ('Leadership', 'Leadership development and management training', '#3B82F6'),
  ('Safety', 'Workplace safety procedures and protocols', '#EF4444'),
  ('Technical Skills', 'Technical training and skill development', '#22C55E'),
  ('Compliance', 'Regulatory compliance and legal requirements', '#EAB308'),
  ('Human Resources', 'HR policies, procedures, and employee relations', '#A855F7'),
  ('Customer Service', 'Customer interaction and service excellence', '#F97316');

-- 6. Content items table (for uploaded content)
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type text NOT NULL, -- video, document, presentation, image, scorm
  file_format text,
  file_size bigint,
  file_path text,
  file_url text,
  duration_seconds integer,
  page_count integer,
  slide_count integer,
  category_id uuid REFERENCES public.content_categories(id),
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  is_active boolean DEFAULT true,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage content items" ON public.content_items;
CREATE POLICY "Admins can manage content items" ON public.content_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view active content items" ON public.content_items;
CREATE POLICY "Anyone can view active content items" ON public.content_items FOR SELECT USING (is_active = true);
DROP TRIGGER IF EXISTS update_content_items_updated_at ON public.content_items;
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id),
  user_id uuid NOT NULL,
  score integer,
  passing_score integer,
  status text DEFAULT 'in_progress', -- in_progress, passed, failed
  attempt_number integer DEFAULT 1,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  time_spent_minutes integer,
  answers jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage all assessment results" ON public.assessment_results;
CREATE POLICY "Admins can manage all assessment results" ON public.assessment_results FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can view their own results" ON public.assessment_results;
CREATE POLICY "Users can view their own results" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own results" ON public.assessment_results;
CREATE POLICY "Users can insert their own results" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own results" ON public.assessment_results;
CREATE POLICY "Users can update their own results" ON public.assessment_results FOR UPDATE USING (auth.uid() = user_id);

-- 8. Fix RLS on assessments - allow admin CRUD
DROP POLICY IF EXISTS "Admins can manage assessments" ON public.assessments;
CREATE POLICY "Admins can manage assessments" ON public.assessments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. Fix RLS on program_sessions - allow admin CRUD
DROP POLICY IF EXISTS "Admins can manage program sessions" ON public.program_sessions;
CREATE POLICY "Admins can manage program sessions" ON public.program_sessions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. Storage bucket for content uploads
INSERT INTO storage.buckets (id, name, public)
SELECT
  'content-uploads',
  'content-uploads',
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM storage.buckets
  WHERE id = 'content-uploads'
);

DROP POLICY IF EXISTS "Admins can upload content" ON storage.objects;
CREATE POLICY "Admins can upload content" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content-uploads' AND has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update content" ON storage.objects;
CREATE POLICY "Admins can update content" ON storage.objects FOR UPDATE USING (bucket_id = 'content-uploads' AND has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete content" ON storage.objects;
CREATE POLICY "Admins can delete content" ON storage.objects FOR DELETE USING (bucket_id = 'content-uploads' AND has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Anyone can view content" ON storage.objects;
CREATE POLICY "Anyone can view content" ON storage.objects FOR SELECT USING (bucket_id = 'content-uploads');
