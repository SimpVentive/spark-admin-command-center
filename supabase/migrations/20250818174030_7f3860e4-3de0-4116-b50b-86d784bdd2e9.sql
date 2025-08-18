-- Create job_roles table to store position/role information
CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.organizational_units(id),
  level TEXT NOT NULL CHECK (level IN ('entry', 'mid', 'senior', 'lead', 'manager', 'director', 'executive')),
  skill_requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(title, department_id)
);

-- Enable RLS
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for job_roles
CREATE POLICY "Anyone can view active job roles" 
ON public.job_roles 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow insert for job roles" 
ON public.job_roles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update for job roles" 
ON public.job_roles 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete for job roles" 
ON public.job_roles 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_job_roles_updated_at
BEFORE UPDATE ON public.job_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample job roles based on the existing positions
INSERT INTO public.job_roles (title, description, level) VALUES
('Senior Developer', 'Experienced software developer with advanced technical skills', 'senior'),
('Frontend Developer', 'Specializes in user interface and user experience development', 'mid'),
('Account Manager', 'Manages client relationships and accounts', 'mid'),
('Marketing Specialist', 'Creates and executes marketing strategies', 'mid'),
('Team Lead', 'Leads a team of developers or specialists', 'lead'),
('Engineering Manager', 'Manages engineering teams and projects', 'manager'),
('Sales Manager', 'Oversees sales operations and team', 'manager');