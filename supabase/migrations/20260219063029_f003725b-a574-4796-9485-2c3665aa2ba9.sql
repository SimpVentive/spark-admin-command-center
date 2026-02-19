
-- TNA Cycles table
CREATE TABLE public.tna_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date date NOT NULL,
  end_date date NOT NULL,
  departments text[] DEFAULT '{}',
  workflow_type text NOT NULL DEFAULT 'Individual Input + Manager Approval',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tna_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage TNA cycles" ON public.tna_cycles
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view TNA cycles" ON public.tna_cycles
  FOR SELECT USING (auth.role() = 'authenticated');

-- TNI Submissions table
CREATE TABLE public.tni_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id uuid REFERENCES public.tna_cycles(id) ON DELETE CASCADE NOT NULL,
  employee_id uuid REFERENCES auth.users(id) NOT NULL,
  manager_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  training_needs jsonb DEFAULT '[]',
  employee_comments text,
  manager_comments text,
  manager_approved_at timestamp with time zone,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.tni_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all TNI submissions" ON public.tni_submissions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees can view their own submissions" ON public.tni_submissions
  FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Employees can insert their own submissions" ON public.tni_submissions
  FOR INSERT WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees can update their own pending submissions" ON public.tni_submissions
  FOR UPDATE USING (auth.uid() = employee_id AND status = 'pending');

CREATE POLICY "Managers can view team submissions" ON public.tni_submissions
  FOR SELECT USING (auth.uid() = manager_id);

CREATE POLICY "Managers can update team submissions" ON public.tni_submissions
  FOR UPDATE USING (auth.uid() = manager_id);

-- Triggers for updated_at
CREATE TRIGGER update_tna_cycles_updated_at
  BEFORE UPDATE ON public.tna_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tni_submissions_updated_at
  BEFORE UPDATE ON public.tni_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
