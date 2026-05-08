-- Allow users to read their own roles (fixes super_admin detection)
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());