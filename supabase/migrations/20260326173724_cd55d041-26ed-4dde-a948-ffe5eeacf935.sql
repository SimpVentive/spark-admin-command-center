
DROP POLICY IF EXISTS "Admins can upload content" ON storage.objects;
CREATE POLICY "Admins can upload content" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'content-uploads' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));

DROP POLICY IF EXISTS "Admins can update content" ON storage.objects;
CREATE POLICY "Admins can update content" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'content-uploads' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));

DROP POLICY IF EXISTS "Admins can delete content" ON storage.objects;
CREATE POLICY "Admins can delete content" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'content-uploads' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));
