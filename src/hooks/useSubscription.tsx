import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: 'free' | 'premium';
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscribed: false,
  subscriptionTier: 'free',
  subscriptionEnd: null,
  loading: true,
  checkSubscription: async () => {},
  createCheckout: async () => {},
  openCustomerPortal: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscribed(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        // Handle configuration errors gracefully
        if (error.message?.includes('Stripe configuration missing')) {
          console.warn('Stripe not configured, defaulting to free tier');
          setSubscribed(false);
          setSubscriptionTier('free');
          setSubscriptionEnd(null);
          return;
        }
        throw error;
      }

      if (data) {
        // Handle case where function returns error in data but no error object
        if (data.error && data.error.includes('Stripe configuration missing')) {
          console.warn('Stripe not configured, defaulting to free tier');
          setSubscribed(false);
          setSubscriptionTier('free');
          setSubscriptionEnd(null);
          return;
        }
        
        setSubscribed(data.subscribed || false);
        setSubscriptionTier(data.subscription_tier || 'free');
        setSubscriptionEnd(data.subscription_end || null);
      } else {
        // Fallback to free tier if no data returned
        setSubscribed(false);
        setSubscriptionTier('free');
        setSubscriptionEnd(null);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
      
      // Handle FunctionsHttpError specifically for non-2xx responses
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        if (errorMessage.includes('Stripe configuration missing') || 
            errorMessage.includes('Edge Function returned a non-2xx status code')) {
          console.warn('Stripe configuration issue, defaulting to free tier');
          setSubscribed(false);
          setSubscriptionTier('free');
          setSubscriptionEnd(null);
          setLoading(false);
          return;
        }
      }
      
      // Always fallback to free tier on any error
      setSubscribed(false);
      setSubscriptionTier('free');
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    try {
      if (!user || !session) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour vous abonner.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      if (!user || !session) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour gérer votre abonnement.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open customer portal in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail client. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Check subscription when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  // Auto-refresh subscription status every 30 seconds when user is authenticated
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  return (
    <SubscriptionContext.Provider 
      value={{
        subscribed,
        subscriptionTier,
        subscriptionEnd,
        loading,
        checkSubscription,
        createCheckout,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};