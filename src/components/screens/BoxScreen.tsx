import React from 'react';
import { Package, Crown, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface BoxScreenProps {
  onNavigate: (screen: string) => void;
}

export function BoxScreen({ onNavigate }: BoxScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const canUnlock = state.coins >= 50;
  const progress = Math.min(100, (state.coins / 50) * 100);
  
  const handleUnlockBox = () => {
    if (canUnlock) {
      dispatch({ type: 'SPEND_COINS', amount: 50 });
      dispatch({ type: 'SET_BOX_UNLOCKED', unlocked: true });
      
      toast({
        title: "Box Digitale débloquée ! 🎉",
        description: "Vous avez maintenant accès aux fichiers exclusifs",
      });
    }
  };
  
  if (state.premium) {
    return (
      <div className="p-4 pb-20">
        <CotonCard variant="elevated" className="p-8 text-center space-y-6">
          <div className="text-6xl">🎁</div>
          <div className="space-y-3">
            <h2 className="text-2xl font-poppins font-bold text-success">
              Box Digitale Débloquée
            </h2>
            <p className="font-roboto text-muted-foreground">
              Vos fichiers exclusifs sont disponibles dans votre Journal sous l'onglet "Achats"
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="font-poppins font-semibold text-success mb-2">
                Contenu inclus :
              </h4>
              <ul className="text-sm font-roboto text-success space-y-1">
                <li>• Guide du cheveu crépu (PDF)</li>
                <li>• 10 recettes de masques maison</li>
                <li>• Planning de soins personnalisé</li>
                <li>• Liste des ingrédients à éviter</li>
              </ul>
            </div>
          </div>
          
          <Button
            variant="hero"
            onClick={() => onNavigate('box-content')}
            className="w-full"
          >
            Voir mes fichiers
          </Button>
        </CotonCard>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Premium Required Card */}
      <CotonCard className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Package className="text-coton-rose" size={32} />
          <div>
            <h2 className="font-poppins font-bold text-xl">Box Digitale</h2>
            <p className="font-roboto text-muted-foreground text-sm">
              Fichiers exclusifs et ressources premium
            </p>
          </div>
        </div>
        
        <div className="text-center space-y-4 py-6">
          <div className="text-4xl">🔒</div>
          <div className="space-y-2">
            <h3 className="font-poppins font-semibold text-lg text-coton-black">
              Accès Premium Requis
            </h3>
            <p className="font-roboto text-muted-foreground text-sm">
              La Box Digitale est exclusivement réservée aux membres Premium
            </p>
          </div>
          
          <Button
            variant="outline"
            disabled={true}
            className="w-full opacity-60 cursor-not-allowed"
          >
            🔒 Premium requis pour voir les fichiers
          </Button>
        </div>
      </CotonCard>
      
      {/* Premium Alternative */}
      <CotonCard variant="premium" className="p-6">
        <div className="flex items-start gap-4">
          <Crown className="text-white mt-1" size={24} />
          <div className="flex-1">
            <h3 className="font-poppins font-bold text-white text-lg mb-2">
              Ou Premium
            </h3>
            <p className="text-white/90 font-roboto text-sm mb-4">
              Accès immédiat et illimité à toutes les Box Digitales + avantages exclusifs
            </p>
            <Button
              variant="rose"
              onClick={() => onNavigate('premium')}
            >
              Découvrir Premium
            </Button>
          </div>
        </div>
      </CotonCard>
      
      {/* Preview Content */}
      <CotonCard className="p-6 space-y-4">
        <h3 className="font-poppins font-semibold text-lg">
          Aperçu du contenu
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="text-2xl">📖</div>
            <div>
              <div className="font-poppins font-medium">Guide du cheveu crépu</div>
              <div className="text-sm text-muted-foreground font-roboto">PDF - 25 pages</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="text-2xl">🥥</div>
            <div>
              <div className="font-poppins font-medium">10 recettes de masques</div>
              <div className="text-sm text-muted-foreground font-roboto">Ingrédients naturels</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="text-2xl">📅</div>
            <div>
              <div className="font-poppins font-medium">Planning personnalisé</div>
              <div className="text-sm text-muted-foreground font-roboto">Adapté à votre type</div>
            </div>
          </div>
        </div>
      </CotonCard>
    </div>
  );
}