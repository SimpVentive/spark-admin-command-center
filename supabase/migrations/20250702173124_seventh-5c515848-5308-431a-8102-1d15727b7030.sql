
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view active LTI tools" ON public.lti_tools;

-- Create a new policy that allows public access to active LTI tools
CREATE POLICY "Public can view active LTI tools" 
  ON public.lti_tools 
  FOR SELECT 
  USING (is_active = true);
