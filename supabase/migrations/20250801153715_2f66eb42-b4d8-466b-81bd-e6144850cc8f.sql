-- Create programs table with categories
CREATE TABLE public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Managerial', 'Behavioral', 'Functional', 'Technical')),
  level TEXT,
  duration_hours INTEGER,
  faculty TEXT,
  venue TEXT,
  outline TEXT,
  prerequisites TEXT[],
  skills_covered TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for training programs
CREATE POLICY "Anyone can view training programs" 
ON public.training_programs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage training programs" 
ON public.training_programs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_training_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_training_programs_updated_at
BEFORE UPDATE ON public.training_programs
FOR EACH ROW
EXECUTE FUNCTION public.update_training_programs_updated_at();

-- Insert sample data for Pharma industry
INSERT INTO public.training_programs (title, description, category, level, duration_hours, outline) VALUES
-- Managerial Programs
('Leadership Excellence in Pharma', 'Develop leadership skills specific to pharmaceutical industry', 'Managerial', 'Senior', 24, 'Leadership principles, Team management, Strategic thinking'),
('Strategic Planning for Drug Development', 'Strategic approaches to pharmaceutical product development', 'Managerial', 'Senior', 16, 'Market analysis, Product lifecycle, Strategic planning'),
('Quality Management Leadership', 'Lead quality initiatives in pharmaceutical manufacturing', 'Managerial', 'Mid', 20, 'Quality systems, Leadership in GMP environments'),
('Project Management for Clinical Trials', 'Manage complex clinical trial projects', 'Managerial', 'Mid', 32, 'Clinical trial phases, Timeline management, Regulatory compliance'),

-- Behavioral Programs  
('Effective Communication in Healthcare', 'Communication skills for pharmaceutical professionals', 'Behavioral', 'All', 12, 'Medical communication, Stakeholder engagement, Presentation skills'),
('Emotional Intelligence for Leaders', 'Develop emotional intelligence for pharmaceutical leadership', 'Behavioral', 'Senior', 16, 'Self-awareness, Empathy, Team dynamics'),
('Change Management in Pharma', 'Navigate organizational change in pharmaceutical companies', 'Behavioral', 'Mid', 14, 'Change strategies, Resistance management, Cultural transformation'),
('Team Building and Collaboration', 'Build high-performing pharmaceutical teams', 'Behavioral', 'All', 8, 'Team dynamics, Collaboration tools, Conflict resolution'),

-- Functional Programs
('Regulatory Affairs Excellence', 'Master regulatory processes and compliance', 'Functional', 'Mid', 40, 'FDA regulations, Drug approval processes, Documentation standards'),
('Clinical Research Operations', 'Operational excellence in clinical research', 'Functional', 'Mid', 36, 'GCP guidelines, Study management, Site monitoring'),
('Pharmacovigilance and Drug Safety', 'Drug safety monitoring and adverse event reporting', 'Functional', 'Mid', 28, 'Safety reporting, Risk management, Regulatory requirements'),
('Medical Affairs and Scientific Communication', 'Medical affairs functions and scientific engagement', 'Functional', 'Senior', 24, 'Medical strategy, KOL engagement, Scientific publications'),
('Market Access and Health Economics', 'Navigate market access challenges in pharmaceuticals', 'Functional', 'Senior', 20, 'Health economics, Reimbursement strategies, Value demonstration'),

-- Technical Programs
('Biostatistics and Data Analysis', 'Statistical methods for pharmaceutical research', 'Technical', 'Mid', 32, 'Clinical statistics, Data interpretation, Statistical software'),
('Drug Discovery and Development', 'Technical aspects of drug discovery processes', 'Technical', 'Senior', 48, 'Target identification, Lead optimization, Preclinical development'),
('Manufacturing Science and Technology', 'Pharmaceutical manufacturing processes and technology', 'Technical', 'Mid', 36, 'Process development, Scale-up, Manufacturing optimization'),
('Analytical Method Development', 'Develop and validate analytical methods for pharmaceuticals', 'Technical', 'Mid', 28, 'Method validation, Analytical techniques, Quality control'),
('Bioinformatics and Computational Biology', 'Apply computational methods to pharmaceutical research', 'Technical', 'Senior', 40, 'Genomics, Data mining, Computational modeling'),
('Formulation Development', 'Pharmaceutical formulation science and development', 'Technical', 'Mid', 32, 'Drug delivery systems, Formulation optimization, Stability testing'),
('Digital Health Technologies', 'Leverage digital technologies in pharmaceutical development', 'Technical', 'All', 24, 'Digital therapeutics, AI in pharma, Data analytics');