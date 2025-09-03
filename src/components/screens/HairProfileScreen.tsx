import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
interface HairProfileScreenProps {
  onBack: () => void;
}
const hairTypes = [{
  id: 'crepu',
  label: 'Cheveux crépus serrés',
  emoji: '🌀'
}, {
  id: 'boucle',
  label: 'Cheveux bouclés',
  emoji: '🌸'
}, {
  id: 'locks',
  label: 'Locks',
  emoji: '🔗'
}, {
  id: 'transition',
  label: 'Transition capillaire',
  emoji: '✨'
}];
const needs = [{
  id: 'hydratation',
  label: 'Hydratation',
  emoji: '💧'
}, {
  id: 'volume',
  label: 'Volume',
  emoji: '🌸'
}, {
  id: 'definition',
  label: 'Définition des boucles',
  emoji: '✨'
}, {
  id: 'croissance',
  label: 'Croissance',
  emoji: '🌱'
}, {
  id: 'casse',
  label: 'Réduction de casse',
  emoji: '💪'
}, {
  id: 'brillance',
  label: 'Brillance',
  emoji: '🌟'
}];
const objectives = ['Retrouver mes boucles naturelles', 'Protéger mes cheveux sous coiffure', 'Réparer après décoloration', 'Construire une routine simple et efficace'];
export function HairProfileScreen({
  onBack
}: HairProfileScreenProps) {
  const {
    state,
    dispatch
  } = useApp();
  const {
    toast
  } = useToast();
  const [selectedHairType, setSelectedHairType] = useState(state.hairProfile.hairType);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(state.hairProfile.needs);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(state.hairProfile.objectives);
  const [routineValidated, setRoutineValidated] = useState(false);
  const toggleNeed = (needId: string) => {
    setSelectedNeeds(prev => prev.includes(needId) ? prev.filter(id => id !== needId) : [...prev, needId]);
  };
  const toggleObjective = (objective: string) => {
    setSelectedObjectives(prev => prev.includes(objective) ? prev.filter(obj => obj !== objective) : [...prev, objective]);
  };

  // Generate personalized routine based on profile
  const personalizedRoutine = useMemo(() => {
    const baseSteps = ['Pré-poo', 'Shampoing hydratant', 'Masque', 'Leave-in', 'Scellage'];
    if (!selectedHairType) return baseSteps;
    const routineSteps = [...baseSteps];

    // Adapt based on hair type
    if (selectedHairType === 'crepu') {
      routineSteps.splice(1, 0, 'Démêlage en douceur');
    }
    if (selectedHairType === 'locks') {
      routineSteps[1] = 'Shampoing clarifiant doux';
    }

    // Adapt based on needs
    if (selectedNeeds.includes('hydratation')) {
      routineSteps.splice(-1, 0, 'Brumisateur hydratant');
    }
    if (selectedNeeds.includes('definition')) {
      routineSteps.splice(-1, 0, 'Crème coiffante');
    }
    if (selectedNeeds.includes('croissance')) {
      routineSteps.unshift('Massage du cuir chevelu');
    }
    return routineSteps;
  }, [selectedHairType, selectedNeeds]);
  const handleValidateRoutine = () => {
    if (!selectedHairType) {
      toast({
        title: "Profil incomplet",
        description: "Complète ton profil pour valider ta routine",
        variant: "destructive"
      });
      return;
    }
    setRoutineValidated(true);
    dispatch({
      type: 'ADD_COINS',
      amount: 10
    });
    toast({
      title: "Routine validée ! +10 CotonCoins ✨",
      description: "Tu as gagné 10 CotonCoins pour avoir validé ta routine personnalisée !"
    });
  };
  const handleSave = () => {
    if (!selectedHairType) {
      toast({
        title: "Type de cheveux requis",
        description: "Merci de sélectionner ton type de cheveux",
        variant: "destructive"
      });
      return;
    }
    dispatch({
      type: 'UPDATE_HAIR_PROFILE',
      profile: {
        hairType: selectedHairType,
        needs: selectedNeeds,
        objectives: selectedObjectives,
        isCompleted: true
      }
    });
    toast({
      title: "Profil enregistré ✨",
      description: "Ton profil capillaire a été mis à jour avec succès !"
    });
    onBack();
  };
  return <div className="pb-20 px-4 space-y-6 bg-coton-beige min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4 pb-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-poppins font-bold text-xl text-coton-black">
          Mon Profil Capillaire
        </h1>
      </div>

      {/* Hero Illustration */}
      <CotonCard className="p-8 text-center bg-gradient-to-r from-coton-rose/20 to-purple-100">
        <div className="text-6xl mb-4">👩🏾‍🦱</div>
        <p className="font-roboto text-muted-foreground">
          Personnalisons ton expérience pour des conseils adaptés à tes besoins
        </p>
      </CotonCard>

      {/* Hair Type Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
            Mon type de cheveux
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Choisis la texture qui se rapproche le plus de tes cheveux
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {hairTypes.map(type => <CotonCard key={type.id} className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedHairType === type.id ? 'ring-2 ring-coton-rose bg-coton-rose/10' : 'hover:shadow-soft'}`} onClick={() => setSelectedHairType(type.id as any)}>
              <div className="text-center space-y-2">
                <div className="text-3xl">{type.emoji}</div>
                <p className="font-roboto text-sm text-coton-black">
                  {type.label}
                </p>
              </div>
            </CotonCard>)}
        </div>
      </div>

      {/* Needs Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
            Mes besoins
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Sélectionne tes priorités (plusieurs choix possibles)
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {needs.map(need => <CotonCard key={need.id} className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedNeeds.includes(need.id) ? 'ring-2 ring-coton-rose bg-coton-rose/10' : 'hover:shadow-soft'}`} onClick={() => toggleNeed(need.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{need.emoji}</span>
                  <span className="font-roboto text-sm text-coton-black">
                    {need.label}
                  </span>
                </div>
                {selectedNeeds.includes(need.id) && <Check size={16} className="text-coton-rose animate-scale-in" />}
              </div>
            </CotonCard>)}
        </div>
      </div>

      {/* Objectives Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
            Mes objectifs capillaires
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Quels sont tes objectifs principaux ?
          </p>
        </div>
        
        <div className="space-y-6 py-0 mx-[8px] my-0 px-0">
          {objectives.map((objective, index) => <CotonCard key={index} className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedObjectives.includes(objective) ? 'ring-2 ring-coton-rose bg-coton-rose/10' : 'hover:shadow-soft'}`} onClick={() => toggleObjective(objective)}>
              <div className="flex items-center justify-between">
                <span className="font-roboto text-sm text-coton-black">
                  {objective}
                </span>
                {selectedObjectives.includes(objective) && <Check size={16} className="text-coton-rose animate-scale-in" />}
              </div>
            </CotonCard>)}
        </div>
      </div>

      {/* Personalized Routine Section */}
      {selectedHairType && <div className="space-y-4">
          <div>
            <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
              Ma routine personnalisée ✨
            </h3>
            <p className="text-sm font-roboto text-muted-foreground mb-4">
              Routine adaptée à ton profil capillaire
            </p>
          </div>
          
          <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50">
            <div className="space-y-3">
              {personalizedRoutine.map((step, index) => <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                  <div className="w-8 h-8 rounded-full bg-coton-rose flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-roboto text-sm text-coton-black">
                    {step}
                  </span>
                </div>)}
            </div>
            
            <div className="mt-6 pt-4 border-t border-coton-rose/20">
              <Button variant={routineValidated ? "outline" : "hero"} size="sm" onClick={handleValidateRoutine} disabled={routineValidated} className="w-full">
                {routineValidated ? <>
                    <Check size={16} className="mr-2" />
                    Routine validée ✓
                  </> : <>
                    <Sparkles size={16} className="mr-2" />
                    ✅ Routine validée (+10 CC)
                  </>}
              </Button>
              
              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                <p className="text-xs font-roboto text-center text-muted-foreground">
                  <strong>Gamification & progression :</strong> tes points débloquent des contenus exclusifs
                </p>
              </div>
            </div>
          </CotonCard>
        </div>}

      {/* Save Button */}
      <div className="pt-4">
        <Button variant="hero" size="lg" onClick={handleSave} className="w-full">
          Enregistrer mon profil ✨
        </Button>
      </div>

      {/* Footer */}
      <CotonCard className="p-6 text-center bg-gradient-to-r from-purple-50 to-coton-rose/10">
        <div className="flex items-center justify-center gap-2 text-2xl mb-3">
          <span>🌿</span>
          <span>🧴</span>
          <span>✨</span>
        </div>
        <p className="font-roboto text-sm text-muted-foreground">
          Prête pour une routine capillaire alignée à tes vrais besoins 💕
        </p>
      </CotonCard>
    </div>;
}