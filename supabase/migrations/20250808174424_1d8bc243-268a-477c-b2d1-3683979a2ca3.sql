-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Authenticated users can create organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Authenticated users can update organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Authenticated users can delete organizational units" ON public.organizational_units;

-- Create new policies with proper authentication checks
CREATE POLICY "Anyone can view active organizational units" 
ON public.organizational_units 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create organizational units" 
ON public.organizational_units 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update organizational units" 
ON public.organizational_units 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete organizational units" 
ON public.organizational_units 
FOR DELETE 
USING (auth.uid() IS NOT NULL);