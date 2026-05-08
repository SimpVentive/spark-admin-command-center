-- Create learning preferences table for AI recommendations
CREATE TABLE IF NOT EXISTS public.learning_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topics_of_interest TEXT[] DEFAULT '{}',
  preferred_learning_style TEXT DEFAULT 'mixed',
  difficulty_preference TEXT DEFAULT 'intermediate',
  time_availability_hours INTEGER DEFAULT 10,
  preferred_content_types TEXT[] DEFAULT '{}',
  learning_goals TEXT[] DEFAULT '{}',
  target_job_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.learning_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can view their own learning preferences" 
ON public.learning_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can insert their own learning preferences" 
ON public.learning_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own learning preferences" ON public.learning_preferences;
CREATE POLICY "Users can update their own learning preferences" 
ON public.learning_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all learning preferences" ON public.learning_preferences;
CREATE POLICY "Admins can manage all learning preferences"
ON public.learning_preferences
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create recommendation feedback table
CREATE TABLE IF NOT EXISTS public.recommendation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES public.path_recommendations(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'not_relevant', 'too_easy', 'too_difficult', 'completed')),
  feedback_text TEXT,
  action_type TEXT CHECK (action_type IN ('clicked', 'enrolled', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.recommendation_feedback;
CREATE POLICY "Users can view their own feedback"
ON public.recommendation_feedback
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.recommendation_feedback;
CREATE POLICY "Users can insert their own feedback"
ON public.recommendation_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert feedback" ON public.recommendation_feedback;
CREATE POLICY "System can insert feedback"
ON public.recommendation_feedback
FOR INSERT
WITH CHECK (true);

-- Create skill templates table for admin use
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

-- Add trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_learning_preferences_updated_at ON public.learning_preferences;
CREATE TRIGGER update_learning_preferences_updated_at
  BEFORE UPDATE ON public.learning_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_skill_templates_updated_at ON public.skill_templates;
CREATE TRIGGER update_skill_templates_updated_at
  BEFORE UPDATE ON public.skill_templates
  FOR EACH ROW  
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default skill templates
INSERT INTO public.skill_templates (name, description, skills, target_roles, department) VALUES
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
 ARRAY['Data Analyst', 'Business Analyst'], 'Analytics');