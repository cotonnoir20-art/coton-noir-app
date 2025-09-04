import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import heroImage from '@/assets/hero-image.jpg';

interface OnboardingSlide {
  emoji: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    emoji: '🧴',
    title: 'Ton Hair Journal, simple et motivant',
    description: 'Suis tes soins capillaires et découvre ce qui fonctionne vraiment pour tes cheveux'
  },
  {
    emoji: '✨',
    title: 'Gagne des CotonCoins',
    description: 'Chaque soin enregistré te fait gagner des points pour débloquer des récompenses'
  },
  {
    emoji: '🎁',
    title: 'Profite des offres partenaires',
    description: 'Utilise tes CotonCoins pour obtenir des réductions chez nos partenaires'
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };
  
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Coton Noir Hair Journal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="text-center space-y-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-coton-black' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {/* Slide content */}
          <CotonCard className="p-8 text-center space-y-4" variant="elevated">
            <div className="text-6xl">{slide.emoji}</div>
            <h2 className="text-2xl font-poppins font-bold text-foreground">
              {slide.title}
            </h2>
            <p className="text-base font-roboto text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          </CotonCard>
        </div>
        
        {/* Actions */}
        <div className="mt-8 mb-safe-area-inset-bottom">
           <Button
             variant="hero"
             size="lg"
             onClick={handleNext}
             className="w-full"
           >
             {isLastSlide ? 'Commencer' : 'Continuer'}
           </Button>
        </div>
      </div>
    </div>
  );
}