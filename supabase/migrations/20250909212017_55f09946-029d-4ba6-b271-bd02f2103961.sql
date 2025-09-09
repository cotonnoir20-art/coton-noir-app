-- Add missing RLS policies for UPDATE and DELETE operations on routine_generations table
-- This fixes the security vulnerability where users could potentially modify or delete payment records

-- Policy to allow users to update only their own routine generation records
CREATE POLICY "update_own_generation" 
ON public.routine_generations 
FOR UPDATE 
USING ((user_id = auth.uid()) AND (email = auth.email()));

-- Policy to allow users to delete only their own routine generation records  
CREATE POLICY "delete_own_generation"
ON public.routine_generations
FOR DELETE
USING ((user_id = auth.uid()) AND (email = auth.email()));