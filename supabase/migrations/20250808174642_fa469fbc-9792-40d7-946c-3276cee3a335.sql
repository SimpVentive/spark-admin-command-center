-- Temporarily allow anonymous users to create/update organizational units for testing
-- This should be restricted in production with proper authentication

DROP POLICY IF EXISTS "Authenticated users can create organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Authenticated users can update organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Authenticated users can delete organizational units" ON public.organizational_units;

-- Create more permissive policies for testing
CREATE POLICY "Allow insert for organizational units" 
ON public.organizational_units 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update for organizational units" 
ON public.organizational_units 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete for organizational units" 
ON public.organizational_units 
FOR DELETE 
USING (true);