-- Fix RLS policies for mooc_sync_logs to allow admins to insert logs
DROP POLICY IF EXISTS "Admins can create MOOC sync logs" ON public.mooc_sync_logs;
CREATE POLICY "Admins can create MOOC sync logs" ON public.mooc_sync_logs
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update MOOC sync logs" ON public.mooc_sync_logs;
CREATE POLICY "Admins can update MOOC sync logs" ON public.mooc_sync_logs
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));