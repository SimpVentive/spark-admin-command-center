-- Step 1: Assign admin role to ceo@simpventive.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('0fca4f40-2def-47b9-965b-0b458011b4fb', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 2: Fix organizational_units RLS - drop permissive policies
DROP POLICY IF EXISTS "Allow insert for organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Allow update for organizational units" ON public.organizational_units;
DROP POLICY IF EXISTS "Allow delete for organizational units" ON public.organizational_units;

-- Step 3: Create admin-only management policy
CREATE POLICY "Admins can manage organizational units"
ON public.organizational_units
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));