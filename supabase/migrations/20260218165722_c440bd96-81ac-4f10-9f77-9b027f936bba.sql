-- Fix: Restrict user_learning_analytics INSERT to own user_id
DROP POLICY IF EXISTS "System can insert analytics" ON public.user_learning_analytics;

CREATE POLICY "Users can insert their own analytics" 
ON public.user_learning_analytics
FOR INSERT 
WITH CHECK (auth.uid() = user_id);