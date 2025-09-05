import React from 'react';
import { Button } from '@/components/ui/button';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSignupSuccess: () => void;
}

export function SignupScreen({ onNavigate, onSignupSuccess }: SignupScreenProps) {
  // This screen now just shows benefits preview and redirects to onboarding
  const handleGetStarted = () => {
    onSignupSuccess(); // This will trigger navigation to onboarding
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coton-beige via-coton-beige/90 to-coton-rose/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-coton-black mb-2">
            COTON NOIR
          </h1>
          <p className="text-lg font-poppins text-coton-black/80">
            Découvre tous les bénéfices de rejoindre notre communauté
          </p>
        </div>

        {/* Benefits Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 shadow-soft">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-xl font-poppins font-bold text-coton-black mb-4">
            Rejoins la famille Coton Noir
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto text-left">
                <span className="font-medium">Un hair journal personnalisé</span> pour suivre tes soins
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto text-left">
                <span className="font-medium">Des CotonCoins à gagner</span> à chaque soin enregistré
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto text-left">
                <span className="font-medium">Des réductions partenaires</span> exclusives
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="space-y-4">
          <Button
            onClick={handleGetStarted}
            className="w-full h-14 bg-gradient-to-r from-coton-rose to-pink-400 text-white font-poppins font-semibold text-lg hover:from-coton-rose/90 hover:to-pink-400/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Découvrir les bénéfices ✨
          </Button>
          
          <div className="text-center">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-coton-black font-medium hover:underline"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}