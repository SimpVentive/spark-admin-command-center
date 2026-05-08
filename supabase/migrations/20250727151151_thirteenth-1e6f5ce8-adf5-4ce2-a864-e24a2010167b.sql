-- Allow authenticated users to create learning paths
DROP POLICY IF EXISTS "Authenticated users can create learning paths" ON public.learning_paths;
CREATE POLICY "Authenticated users can create learning paths" 
ON public.learning_paths 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update learning paths
DROP POLICY IF EXISTS "Authenticated users can update learning paths" ON public.learning_paths;
CREATE POLICY "Authenticated users can update learning paths" 
ON public.learning_paths 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to create learning path modules
DROP POLICY IF EXISTS "Authenticated users can create learning path modules" ON public.learning_path_modules;
CREATE POLICY "Authenticated users can create learning path modules" 
ON public.learning_path_modules 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update learning path modules
DROP POLICY IF EXISTS "Authenticated users can update learning path modules" ON public.learning_path_modules;
CREATE POLICY "Authenticated users can update learning path modules" 
ON public.learning_path_modules 
FOR UPDATE 
USING (auth.role() = 'authenticated');