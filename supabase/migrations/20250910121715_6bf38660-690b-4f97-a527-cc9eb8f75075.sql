-- Create skill templates table for admin use (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.skill_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  skills JSONB NOT NULL DEFAULT '[]',
  target_roles TEXT[] DEFAULT '{}',
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.skill_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill templates
DROP POLICY IF EXISTS "Anyone can view active skill templates" ON public.skill_templates;
CREATE POLICY "Anyone can view active skill templates"
ON public.skill_templates
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage skill templates" ON public.skill_templates;
CREATE POLICY "Admins can manage skill templates"
ON public.skill_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_skill_templates_updated_at ON public.skill_templates;
CREATE TRIGGER update_skill_templates_updated_at
  BEFORE UPDATE ON public.skill_templates
  FOR EACH ROW  
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default skill templates
INSERT INTO public.skill_templates (name, description, skills, target_roles, department) 
VALUES
('Software Development', 'Core skills for software developers', 
 '[{"name": "JavaScript", "level": "intermediate"}, {"name": "React", "level": "intermediate"}, {"name": "Node.js", "level": "beginner"}, {"name": "Git", "level": "intermediate"}, {"name": "SQL", "level": "beginner"}]',
 ARRAY['Developer', 'Senior Developer', 'Tech Lead'], 'Engineering'),
 
('Digital Marketing', 'Essential digital marketing skills',
 '[{"name": "SEO", "level": "intermediate"}, {"name": "Google Analytics", "level": "intermediate"}, {"name": "Content Marketing", "level": "advanced"}, {"name": "Social Media Marketing", "level": "intermediate"}]',
 ARRAY['Marketing Specialist', 'Marketing Manager'], 'Marketing'),
 
('Project Management', 'Project management fundamentals',
 '[{"name": "Agile", "level": "advanced"}, {"name": "Scrum", "level": "advanced"}, {"name": "Risk Management", "level": "intermediate"}, {"name": "Stakeholder Management", "level": "intermediate"}]',
 ARRAY['Project Manager', 'Program Manager'], 'Operations'),
 
('Data Analysis', 'Data analysis and visualization skills',
 '[{"name": "Excel", "level": "advanced"}, {"name": "SQL", "level": "intermediate"}, {"name": "Python", "level": "beginner"}, {"name": "Tableau", "level": "intermediate"}, {"name": "Statistics", "level": "intermediate"}]',
 ARRAY['Data Analyst', 'Business Analyst'], 'Analytics')
ON CONFLICT DO NOTHING;