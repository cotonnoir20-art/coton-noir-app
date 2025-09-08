-- Fix critical security vulnerability: restrict subscribers UPDATE policy
-- Only allow users to update their own subscription records

DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE 
USING (
  user_id = auth.uid() OR 
  email = auth.email()
);