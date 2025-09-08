import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Crown, Sparkles, CreditCard, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoutinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function RoutinePaymentModal({ isOpen, onClose, onPaymentSuccess }: RoutinePaymentModalProps) {
  const { createCheckout } = useSubscription();
  const { toast } = useToast();

  const handleOneTimePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-routine-payment');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onClose();
      }
    } catch (error) {
      console.error('Error creating routine payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleSubscription = async () => {
    await createCheckout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-coton-rose" size={24} />
              <span>Générer une nouvelle routine</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground mb-4">
            Tu as déjà utilisé ta routine gratuite ce mois-ci. Choisis une option pour continuer :
          </div>

          {/* Option paiement unique */}
          <CotonCard className="p-4 border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-start gap-3 mb-4">
              <CreditCard className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-poppins font-semibold text-blue-900 mb-1">
                  Paiement unique
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  Une routine personnalisée supplémentaire
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-900">4,99€</span>
                  <span className="text-sm text-blue-600">une fois</span>
                </div>
              </div>
            </div>
            
            <ul className="space-y-1 text-sm text-blue-700 mb-4">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Routine complètement personnalisée</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Conseils d'expert inclus</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span>Accès immédiat</span>
              </li>
            </ul>

            <Button 
              onClick={handleOneTimePayment}
              variant="black"
              className="w-full"
            >
              Payer 4,99€
            </Button>
          </CotonCard>

          {/* Option abonnement premium */}
          <CotonCard className="p-4 border-2 border-coton-rose bg-gradient-to-r from-coton-rose/10 to-purple-50">
            <div className="flex items-start gap-3 mb-4">
              <Crown className="text-coton-rose mt-1" size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-poppins font-semibold text-coton-rose">
                    Premium
                  </h3>
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                    Le plus populaire
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-2">
                  Routines illimitées + fonctionnalités avancées
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-coton-rose">9,99€</span>
                  <span className="text-sm text-purple-600">/mois</span>
                </div>
              </div>
            </div>
            
            <ul className="space-y-1 text-sm text-purple-700 mb-4">
              <li className="flex items-center gap-2">
                <span className="text-coton-rose">✓</span>
                <span>Routines personnalisées illimitées</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coton-rose">✓</span>
                <span>IA avancée avec analyse photo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coton-rose">✓</span>
                <span>Suivi détaillé et analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coton-rose">✓</span>
                <span>Communauté VIP</span>
              </li>
            </ul>

            <Button 
              onClick={handleSubscription}
              variant="black"
              className="w-full"
            >
              <Crown size={16} className="mr-2" />
              Devenir Premium
            </Button>
          </CotonCard>

          <div className="text-center">
            <Button variant="black" onClick={onClose} className="text-sm">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}