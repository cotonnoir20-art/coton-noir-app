-- Fix security vulnerability: restrict subscription insert policy
-- Only allow authenticated users to create their own subscription records

DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

CREATE POLICY "insert_own_subscription" ON public.subscribers
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND 
  email = auth.email()
);