-- Create enum for audit action types
CREATE TYPE public.audit_action AS ENUM (
  'INSERT', 'UPDATE', 'DELETE', 'SELECT', 
  'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 
  'PASSWORD_CHANGE', 'PERMISSION_CHANGE',
  'SIGNATURE', 'EXPORT', 'IMPORT'
);

-- Create immutable audit trail table (CFR 21 Part 11 compliant)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Timestamp in UTC (immutable)
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- User identification (never null for accountability)
  user_id uuid NOT NULL,
  user_email text,
  user_full_name text,
  
  -- Action details
  action audit_action NOT NULL,
  action_description text,
  
  -- Affected record details
  table_name text,
  record_id uuid,
  
  -- Before/after values (JSONB for flexibility)
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  
  -- Request context
  ip_address inet,
  user_agent text,
  session_id text,
  
  -- Additional metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Integrity hash (for tamper detection)
  integrity_hash text NOT NULL DEFAULT '',
  
  -- Ensure created_at cannot be modified by making it a generated column concept
  -- We'll enforce immutability through RLS
  CONSTRAINT audit_logs_created_at_check CHECK (created_at <= now() + interval '1 second')
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can INSERT audit logs
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Only admins can view all audit logs
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can view their own audit logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- CRITICAL: NO UPDATE policy - audit logs are immutable
-- CRITICAL: NO DELETE policy - audit logs cannot be deleted

-- Create function to generate integrity hash
CREATE OR REPLACE FUNCTION public.generate_audit_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate hash from key audit fields for tamper detection
  NEW.integrity_hash := encode(
    sha256(
      (
        NEW.id::text || 
        NEW.created_at::text || 
        NEW.user_id::text || 
        NEW.action::text || 
        COALESCE(NEW.table_name, '') || 
        COALESCE(NEW.record_id::text, '') ||
        COALESCE(NEW.old_values::text, '') ||
        COALESCE(NEW.new_values::text, '')
      )::bytea
    ),
    'hex'
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate integrity hash on insert
DROP TRIGGER IF EXISTS audit_logs_generate_hash ON public.audit_logs;
CREATE TRIGGER audit_logs_generate_hash
BEFORE INSERT ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.generate_audit_hash();

-- Create function to prevent any modifications to audit logs
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be modified or deleted (CFR 21 Part 11 compliance)';
END;
$$;

-- Trigger to prevent UPDATE
DROP TRIGGER IF EXISTS audit_logs_prevent_update ON public.audit_logs;
CREATE TRIGGER audit_logs_prevent_update
BEFORE UPDATE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_audit_modification();

-- Trigger to prevent DELETE
DROP TRIGGER IF EXISTS audit_logs_prevent_delete ON public.audit_logs;
CREATE TRIGGER audit_logs_prevent_delete
BEFORE DELETE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_audit_modification();

-- Create helper function to log audit events easily
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action audit_action,
  p_action_description text DEFAULT NULL,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_changed_fields text[] DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_user_full_name text;
  v_audit_id uuid;
BEGIN
  -- Get current user info
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to log audit events';
  END IF;
  
  -- Get user details from profiles
  SELECT email, full_name INTO v_user_email, v_user_full_name
  FROM public.profiles
  WHERE id = v_user_id;
  
  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    user_email,
    user_full_name,
    action,
    action_description,
    table_name,
    record_id,
    old_values,
    new_values,
    changed_fields,
    metadata
  ) VALUES (
    v_user_id,
    v_user_email,
    v_user_full_name,
    p_action,
    p_action_description,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_changed_fields,
    p_metadata
  )
  RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$;