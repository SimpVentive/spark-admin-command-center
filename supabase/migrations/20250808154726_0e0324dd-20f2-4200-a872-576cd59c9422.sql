-- Create organizational units table to store hierarchy structure
CREATE TABLE public.organizational_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('organization', 'department', 'sub-department', 'team')),
  parent_id UUID REFERENCES public.organizational_units(id) ON DELETE CASCADE,
  manager_name TEXT DEFAULT 'CEO',
  employee_count INTEGER DEFAULT 0,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.organizational_units ENABLE ROW LEVEL SECURITY;

-- Create policies for organizational units
CREATE POLICY "Anyone can view active organizational units" 
ON public.organizational_units 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create organizational units" 
ON public.organizational_units 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update organizational units" 
ON public.organizational_units 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete organizational units" 
ON public.organizational_units 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_organizational_units_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_organizational_units_updated_at
  BEFORE UPDATE ON public.organizational_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organizational_units_updated_at();

-- Enable realtime for the table
ALTER TABLE public.organizational_units REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.organizational_units;

-- Insert sample data to match the current structure
INSERT INTO public.organizational_units (id, name, level, parent_id, manager_name, employee_count, description) VALUES
('00000000-0000-0000-0000-000000000001', 'Executive Office', 'organization', NULL, 'CEO', 5, 'Executive leadership team'),
('00000000-0000-0000-0000-000000000002', 'Engineering Department', 'department', '00000000-0000-0000-0000-000000000001', 'John Smith', 25, 'Product development and engineering'),
('00000000-0000-0000-0000-000000000003', 'Frontend Team', 'team', '00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 8, 'UI/UX and frontend development'),
('00000000-0000-0000-0000-000000000004', 'Backend Team', 'team', '00000000-0000-0000-0000-000000000002', 'Mike Chen', 12, 'Backend services and APIs'),
('00000000-0000-0000-0000-000000000005', 'Marketing Department', 'department', '00000000-0000-0000-0000-000000000001', 'Lisa Wang', 15, 'Marketing and communications'),
('00000000-0000-0000-0000-000000000006', 'Digital Marketing', 'team', '00000000-0000-0000-0000-000000000005', 'Alex Rodriguez', 7, 'Online marketing and social media'),
('00000000-0000-0000-0000-000000000007', 'Content Team', 'team', '00000000-0000-0000-0000-000000000005', 'Emma Davis', 5, 'Content creation and strategy');