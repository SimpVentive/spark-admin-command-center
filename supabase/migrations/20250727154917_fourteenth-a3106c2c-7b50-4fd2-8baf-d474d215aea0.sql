-- Update RLS policies to restrict learning path creation to admins only
-- First drop the current policies that allow all authenticated users
DROP POLICY IF EXISTS "Authenticated users can create learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Authenticated users can update learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Authenticated users can create learning path modules" ON public.learning_path_modules;
DROP POLICY IF EXISTS "Authenticated users can update learning path modules" ON public.learning_path_modules;

-- Create user roles system for admin access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'app_role'
        AND n.nspname = 'public'
    ) THEN
        CREATE TYPE public.app_role AS ENUM (
            'admin',
            'moderator',
            'user',
            'training_manager'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user roles" ON public.user_roles;
CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Updated learning paths policies - only admins can create/update
DROP POLICY IF EXISTS "Admins can create learning paths" ON public.learning_paths;
CREATE POLICY "Admins can create learning paths" 
ON public.learning_paths 
FOR INSERT 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update learning paths" ON public.learning_paths;
CREATE POLICY "Admins can update learning paths" 
ON public.learning_paths 
FOR UPDATE 
USING (public.is_admin());

-- Updated learning path modules policies - only admins can create/update  
DROP POLICY IF EXISTS "Admins can create learning path modules" ON public.learning_path_modules;
CREATE POLICY "Admins can create learning path modules" 
ON public.learning_path_modules 
FOR INSERT 
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update learning path modules" ON public.learning_path_modules;
CREATE POLICY "Admins can update learning path modules" 
ON public.learning_path_modules 
FOR UPDATE 
USING (public.is_admin());

-- Add additional fields to learning_paths to match admin interface
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS required_experience_level TEXT;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS certification_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS assessment_enabled BOOLEAN DEFAULT false;