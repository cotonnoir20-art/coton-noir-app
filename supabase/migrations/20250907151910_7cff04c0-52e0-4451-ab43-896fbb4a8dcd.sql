-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.check_monthly_routine_limit(user_email TEXT)
RETURNS INTEGER AS $$
DECLARE
  free_routines_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO free_routines_count
  FROM public.routine_generations
  WHERE email = user_email
    AND generation_type = 'free'
    AND created_at >= date_trunc('month', CURRENT_DATE);
    
  RETURN free_routines_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;