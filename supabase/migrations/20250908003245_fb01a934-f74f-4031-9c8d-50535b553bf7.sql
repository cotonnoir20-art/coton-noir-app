-- Fix critical security vulnerability: restrict routine_generations INSERT policy
-- Only allow authenticated users to create records for themselves

DROP POLICY IF EXISTS "insert_generation" ON public.routine_generations;

CREATE POLICY "insert_own_generation" ON public.routine_generations
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND 
  email = auth.email()
);