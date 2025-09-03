import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface HairProfileScreenProps {
  onBack: () => void;
}

const hairTypes = [
  { id: '3C', label: '3C - Boucles serrées', emoji: '🌀' },
  { id: '4A', label: '4A - Crépus souples', emoji: '🌸' },
  { id: '4B', label: '4B - Crépus moyens', emoji: '🔗' },
  { id: '4C', label: '4C - Crépus serrés', emoji: '✨' }
];

const porosityLevels = [
  { id: 'faible', label: 'Faible', description: 'Cheveux qui résistent à l\'eau', emoji: '🛡️' },
  { id: 'moyenne', label: 'Moyenne', description: 'Équilibre idéal', emoji: '⚖️' },
  { id: 'haute', label: 'Haute', description: 'Cheveux très poreux', emoji: '🧽' }
];

const objectives = [
  { id: 'hydratation', label: 'Hydratation', emoji: '💧' },
  { id: 'definition', label: 'Définition', emoji: '✨' },
  { id: 'pousse', label: 'Pousse', emoji: '🌱' },
  { id: 'reparation', label: 'Réparation', emoji: '💪' }
];

export function HairProfileScreen({ onBack }: HairProfileScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const [selectedHairType, setSelectedHairType] = useState(state.hairProfile.hairType);
  const [selectedPorosity, setSelectedPorosity] = useState<string>(state.hairProfile.porosity || '');
  const [selectedObjective, setSelectedObjective] = useState<string>(state.hairProfile.objectives[0] || '');


  const handleSave = () => {
    if (!selectedHairType || !selectedPorosity || !selectedObjective) {
      toast({
        title: "Profil incomplet",
        description: "Merci de remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    dispatch({
      type: 'UPDATE_HAIR_PROFILE',
      profile: {
        hairType: selectedHairType,
        porosity: selectedPorosity as 'faible' | 'moyenne' | 'haute',
        needs: [],
        objectives: [selectedObjective],
        isCompleted: true
      }
    });

    toast({
      title: "Profil enregistré ✨",
      description: "Ton profil capillaire a été mis à jour avec succès !"
    });

    onBack();
  };

  return (
    <div className="pb-20 px-4 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4 pb-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-poppins font-bold text-xl text-foreground">
          Mon Profil Capillaire
        </h1>
      </div>

      {/* Hero Illustration */}
      <CotonCard className="p-8 text-center bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="text-6xl mb-4">👩🏾‍🦱</div>
        <p className="font-roboto text-muted-foreground">
          Résoudre la galère quotidienne : je sais pas quoi faire à mes cheveux
        </p>
      </CotonCard>

      {/* Hair Type Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
            Type de cheveux
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Sélectionnez votre type de cheveux
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {hairTypes.map((type) => (
            <CotonCard
              key={type.id}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedHairType === type.id 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedHairType(type.id as any)}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{type.emoji}</div>
                <p className="font-roboto text-sm text-foreground">
                  {type.label}
                </p>
              </div>
            </CotonCard>
          ))}
        </div>
      </div>

      {/* Porosity Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
            Porosité
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Capacité d'absorption de vos cheveux
          </p>
        </div>
        
        <div className="space-y-3">
          {porosityLevels.map((level) => (
            <CotonCard
              key={level.id}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedPorosity === level.id 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedPorosity(level.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.emoji}</span>
                  <div>
                    <div className="font-roboto font-medium text-foreground">
                      {level.label}
                    </div>
                    <div className="font-roboto text-xs text-muted-foreground">
                      {level.description}
                    </div>
                  </div>
                </div>
                {selectedPorosity === level.id && (
                  <Check size={16} className="text-primary animate-scale-in" />
                )}
              </div>
            </CotonCard>
          ))}
        </div>
      </div>

      {/* Objective Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
            Objectif principal
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Votre priorité capillaire
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {objectives.map((objective) => (
            <CotonCard
              key={objective.id}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedObjective === objective.id 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedObjective(objective.id)}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{objective.emoji}</div>
                <p className="font-roboto text-sm text-foreground">
                  {objective.label}
                </p>
              </div>
            </CotonCard>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button 
          size="lg" 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          💾 Enregistrer
        </Button>
      </div>

      {/* Footer */}
      <CotonCard className="p-6 text-center bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="flex items-center justify-center gap-2 text-2xl mb-3">
          <span>🌿</span>
          <span>🧴</span>
          <span>✨</span>
        </div>
        <p className="font-roboto text-sm text-muted-foreground">
          Feedback visuel ✓ - Prête pour une routine personnalisée
        </p>
      </CotonCard>
    </div>
  );
}