import React from 'react';
import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coton-beige via-coton-beige/90 to-coton-rose/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-coton-rose to-pink-300 rounded-full flex items-center justify-center shadow-lg">
              <Heart size={40} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-yellow-800" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-poppins font-bold text-coton-black">
              Bienvenue !
            </h1>
            <h2 className="text-2xl font-poppins font-semibold text-coton-black/80">
              Tu fais maintenant partie de la famille Coton Noir
            </h2>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4 shadow-soft">
          <div className="flex items-center justify-center gap-2 text-coton-rose">
            <Users size={24} />
            <span className="font-poppins font-semibold text-lg">Félicitations !</span>
          </div>
          
          <p className="text-coton-black/70 font-roboto leading-relaxed">
            Tu viens de rejoindre une communauté de passionnées du soin capillaire naturel. 
            Ensemble, nous allons t'accompagner dans ton journey vers des cheveux en pleine santé.
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto">
                <span className="font-medium">Des routines personnalisées</span> adaptées à tes cheveux
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto">
                <span className="font-medium">Un suivi de croissance</span> pour voir tes progrès
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-coton-rose rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-coton-black/60 font-roboto">
                <span className="font-medium">Une communauté bienveillante</span> pour partager tes experiences
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="space-y-4">
          <Button
            onClick={onContinue}
            className="w-full h-14 bg-gradient-to-r from-coton-rose to-pink-400 text-white font-poppins font-semibold text-lg hover:from-coton-rose/90 hover:to-pink-400/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Commencer mon journey capillaire ✨
          </Button>
          
          <p className="text-xs text-coton-black/50 font-roboto">
            Quelques questions rapides t'attendent pour personnaliser ton expérience
          </p>
        </div>
      </div>
    </div>
  );
}