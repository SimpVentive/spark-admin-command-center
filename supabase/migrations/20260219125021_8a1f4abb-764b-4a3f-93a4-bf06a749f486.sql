
-- Add commonly-used fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS employee_id text,
  ADD COLUMN IF NOT EXISTS date_of_joining date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS rank text,
  ADD COLUMN IF NOT EXISTS work_type text;

-- Create employee_details table for extended/sensitive info
CREATE TABLE public.employee_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth date,
  qualification text,
  experience text,
  skills text,
  address text,
  emergency_contact text,
  emergency_phone text,
  blood_group text,
  marital_status text,
  nationality text,
  pan_number text,
  aadhar_number text,
  pf_number text,
  esi_number text,
  salary text,
  shift_timing text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_details ENABLE ROW LEVEL SECURITY;

-- Admins can manage all employee details
CREATE POLICY "Admins can manage employee details"
  ON public.employee_details FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own details
CREATE POLICY "Users can view own employee details"
  ON public.employee_details FOR SELECT
  USING (auth.uid() = profile_id);

-- Users can update their own details
CREATE POLICY "Users can update own employee details"
  ON public.employee_details FOR UPDATE
  USING (auth.uid() = profile_id);

-- Trigger for updated_at
CREATE TRIGGER update_employee_details_updated_at
  BEFORE UPDATE ON public.employee_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
