import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from './useSubscription';

export function useRoutineLimit() {
  const [freeRoutinesUsed, setFreeRoutinesUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  
  const FREE_LIMIT = 1; // 1 routine gratuite par mois

  const checkRoutineLimit = async () => {
    if (!user?.email) {
      setFreeRoutinesUsed(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Call the database function to check monthly limit
      const { data, error } = await supabase.rpc('check_monthly_routine_limit', {
        user_email: user.email
      });

      if (error) {
        console.error('Error checking routine limit:', error);
        setFreeRoutinesUsed(0);
      } else {
        setFreeRoutinesUsed(data || 0);
      }
    } catch (error) {
      console.error('Failed to check routine limit:', error);
      setFreeRoutinesUsed(0);
    } finally {
      setLoading(false);
    }
  };

  const recordRoutineGeneration = async (type: 'free' | 'paid' | 'premium', stripeSessionId?: string) => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.from('routine_generations').insert({
        user_id: user.id,
        email: user.email,
        generation_type: type,
        amount: type === 'paid' ? 499 : null, // 4.99€ in cents
        stripe_session_id: stripeSessionId || null
      });

      if (error) {
        console.error('Error recording routine generation:', error);
      } else {
        // Refresh the count
        checkRoutineLimit();
      }
    } catch (error) {
      console.error('Failed to record routine generation:', error);
    }
  };

  const canGenerateFreeRoutine = () => {
    if (subscribed) return true; // Premium users have unlimited routines
    return freeRoutinesUsed < FREE_LIMIT;
  };

  const remainingFreeRoutines = () => {
    if (subscribed) return Infinity;
    return Math.max(0, FREE_LIMIT - freeRoutinesUsed);
  };

  useEffect(() => {
    checkRoutineLimit();
  }, [user]);

  return {
    freeRoutinesUsed,
    loading,
    canGenerateFreeRoutine: canGenerateFreeRoutine(),
    remainingFreeRoutines: remainingFreeRoutines(),
    checkRoutineLimit,
    recordRoutineGeneration
  };
}