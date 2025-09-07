-- Create table to track routine generations
CREATE TABLE public.routine_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  generation_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'paid', 'premium'
  amount INTEGER, -- Amount paid in cents (null for free)
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.routine_generations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "select_own_generations" ON public.routine_generations
  FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "insert_generation" ON public.routine_generations
  FOR INSERT
  WITH CHECK (true);

-- Create function to check monthly free routine limit
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
$$ LANGUAGE plpgsql SECURITY DEFINER;