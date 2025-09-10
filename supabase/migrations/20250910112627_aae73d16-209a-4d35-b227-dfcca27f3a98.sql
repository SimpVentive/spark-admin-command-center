-- Create competencies table
CREATE TABLE public.competencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create question bank table
CREATE TABLE public.question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'essay', 'short_answer')),
  competency_id UUID REFERENCES public.competencies(id),
  program_id UUID REFERENCES public.programs(id),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('L1', 'L2', 'L3', 'L4', 'basic', 'intermediate', 'advanced', 'expert')),
  correct_answer TEXT,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create question options table for multiple choice questions
CREATE TABLE public.question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assessment questions mapping table
CREATE TABLE public.assessment_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  randomize_options BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for competencies
CREATE POLICY "Anyone can view active competencies" ON public.competencies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage competencies" ON public.competencies
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for question bank
CREATE POLICY "Anyone can view active questions" ON public.question_bank
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage questions" ON public.question_bank
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for question options
CREATE POLICY "Anyone can view question options" ON public.question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.question_bank 
      WHERE id = question_options.question_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage question options" ON public.question_options
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for assessment questions
CREATE POLICY "Anyone can view assessment questions" ON public.assessment_questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage assessment questions" ON public.assessment_questions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_competencies_updated_at
  BEFORE UPDATE ON public.competencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_bank_updated_at
  BEFORE UPDATE ON public.question_bank
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample competencies
INSERT INTO public.competencies (name, description) VALUES
  ('Leadership', 'Leadership and management skills'),
  ('Technical Skills', 'Technical and professional competencies'),
  ('Communication', 'Communication and interpersonal skills'),
  ('Project Management', 'Project management and organizational skills'),
  ('Digital Marketing', 'Digital marketing and online presence skills');

-- Insert some sample questions
INSERT INTO public.question_bank (question_text, question_type, competency_id, difficulty_level, correct_answer, explanation, points) VALUES
  ('What is the most important quality of a good leader?', 'multiple_choice', 
   (SELECT id FROM public.competencies WHERE name = 'Leadership' LIMIT 1), 
   'basic', 'A', 'Communication is fundamental to leadership effectiveness', 2),
  
  ('True or False: Active listening is a key component of effective communication.', 'true_false',
   (SELECT id FROM public.competencies WHERE name = 'Communication' LIMIT 1),
   'basic', 'true', 'Active listening builds trust and understanding', 1),
   
  ('Describe the key phases of project management.', 'essay',
   (SELECT id FROM public.competencies WHERE name = 'Project Management' LIMIT 1),
   'intermediate', '', 'Should include initiation, planning, execution, monitoring, and closure', 5);

-- Insert options for multiple choice questions
INSERT INTO public.question_options (question_id, option_text, option_order, is_correct) VALUES
  ((SELECT id FROM public.question_bank WHERE question_text LIKE 'What is the most important%' LIMIT 1), 'Effective Communication', 1, true),
  ((SELECT id FROM public.question_bank WHERE question_text LIKE 'What is the most important%' LIMIT 1), 'Technical Expertise', 2, false),
  ((SELECT id FROM public.question_bank WHERE question_text LIKE 'What is the most important%' LIMIT 1), 'Financial Acumen', 3, false),
  ((SELECT id FROM public.question_bank WHERE question_text LIKE 'What is the most important%' LIMIT 1), 'Strategic Vision', 4, false);