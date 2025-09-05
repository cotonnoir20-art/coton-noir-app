import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileOnboardingScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function ProfileOnboardingScreen({ onComplete, onSkip }: ProfileOnboardingScreenProps) {
  const { dispatch } = useApp();
  const { toast } = useToast();

  const handleComplete = () => {
    // Award 100 CotonCoins for completing profile setup
    dispatch({ type: 'ADD_COINS', amount: 100 });
    
    // Set as completed in localStorage
    localStorage.setItem('hasCompletedProfileOnboarding', 'true');
    
    toast({
      title: "Profil complété ! 🎉",
      description: "Tu as gagné 100 CotonCoins de bienvenue"
    });
    
    onComplete();
  };

  const handleSkip = () => {
    // Mark as skipped but not completed
    localStorage.setItem('hasSkippedProfileOnboarding', 'true');
    
    toast({
      title: "Profil sauté",
      description: "Tu pourras configurer ton profil plus tard"
    });
    
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl font-poppins font-bold text-foreground">
          Créons ton profil capillaire
        </h1>
        <p className="text-muted-foreground font-roboto">
          Cette étape nous permet de personnaliser ton expérience
        </p>
        <div className="text-5xl">👩🏾‍🦱</div>
      </div>

      {/* Quick profile setup */}
      <CotonCard className="p-6 space-y-6 flex-1" variant="elevated">
        <div className="space-y-4">
          <h2 className="font-poppins font-semibold text-lg text-foreground">
            Configuration rapide
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-coton-rose/10 to-purple-50 rounded-lg">
              <h3 className="font-poppins font-medium text-foreground mb-2">
                ✨ Profil complet = 100 CotonCoins
              </h3>
              <p className="text-sm text-muted-foreground">
                Configure ton profil maintenant pour débloquer des conseils personnalisés et gagner tes premiers CotonCoins !
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-poppins font-medium text-foreground mb-2">
                🚀 Configuration rapide
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Type de cheveux (3C, 4A, 4B, 4C, Locks)</li>
                <li>• Porosité de tes cheveux</li>
                <li>• Ton objectif principal</li>
                <li>• Tes problématiques capillaires</li>
              </ul>
            </div>
          </div>
        </div>
      </CotonCard>

      {/* Actions */}
      <div className="space-y-3 mt-8">
        <Button
          variant="hero"
          size="lg"
          onClick={handleComplete}
          className="w-full"
        >
          Configurer mon profil (+ 100 CC)
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleSkip}
          className="w-full"
        >
          Passer pour le moment
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Tu pourras configurer ton profil plus tard depuis les paramètres
        </p>
      </div>
    </div>
  );
}