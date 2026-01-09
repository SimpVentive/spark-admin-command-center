-- Remove overly permissive TEMP RLS policies on profiles table
DROP POLICY IF EXISTS "Allow all authenticated users to manage profiles (TEMP)" ON public.profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to view profiles (TEMP)" ON public.profiles;