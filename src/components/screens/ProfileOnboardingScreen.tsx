import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';

interface ProfileOnboardingScreenProps {
  onComplete: () => void;
}

const hairTypes = [
  { value: '3C', label: 'Type 3C - Boucles serrées' },
  { value: '4A', label: 'Type 4A - Boucles très serrées' },
  { value: '4B', label: 'Type 4B - Cheveux crépus souples' },
  { value: '4C', label: 'Type 4C - Cheveux crépus serrés' }
];

const porosity = [
  { value: 'faible', label: 'Porosité faible' },
  { value: 'moyenne', label: 'Porosité moyenne' },
  { value: 'haute', label: 'Porosité haute' }
];

const objectives = [
  { value: 'hydratation', label: 'Hydratation' },
  { value: 'definition', label: 'Définition' },
  { value: 'pousse', label: 'Pousse' },
  { value: 'reparation', label: 'Réparation' }
];

const problems = [
  { id: 'secheresse', label: 'Sécheresse' },
  { id: 'casse', label: 'Casse' },
  { id: 'frisottis', label: 'Frisottis' },
  { id: 'demelage', label: 'Démêlage' },
  { id: 'cuir_chevelu', label: 'Cuir chevelu sensible' },
  { id: 'chute', label: 'Chute' }
];

const needs = [
  { id: 'hydratation', label: 'Hydratation' },
  { id: 'definition', label: 'Définition' },
  { id: 'brillance', label: 'Brillance' },
  { id: 'pousse', label: 'Pousse' },
  { id: 'reparation', label: 'Réparation' },
  { id: 'protection', label: 'Protection' }
];

export function ProfileOnboardingScreen({ onComplete }: ProfileOnboardingScreenProps) {
  const { dispatch } = useApp();
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedPorosity, setSelectedPorosity] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const toggleProblem = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const toggleNeed = (needId: string) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) 
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const isFormValid = () => {
    return selectedHairType && 
           selectedPorosity && 
           selectedObjective && 
           (selectedProblems.length > 0 || selectedNeeds.length > 0);
  };

  const handleContinue = () => {
    // Update the hair profile in context
    dispatch({
      type: 'UPDATE_DETAILED_HAIR_PROFILE',
      profile: {
        hairType: selectedHairType,
        porosity: selectedPorosity,
        objective: selectedObjective,
        problems: selectedProblems,
        needs: selectedNeeds,
        isCompleted: true
      }
    });
    
    onComplete();
  };

  return (
    <div className="min-h-screen bg-coton-beige px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-poppins font-bold text-2xl text-coton-black">
          Créons ton profil capillaire
        </h1>
        <p className="font-roboto text-muted-foreground">
          Quelques questions pour personnaliser ton expérience
        </p>
      </div>

      {/* Hero Illustration */}
      <CotonCard className="p-6 text-center bg-gradient-to-r from-coton-rose/20 to-purple-100">
        <div className="text-5xl mb-3">👩🏾‍🦱</div>
        <p className="font-roboto text-sm text-muted-foreground">
          Cette étape nous permet de te générer une routine sur mesure
        </p>
      </CotonCard>

      {/* Bloc 1: Profil capillaire */}
      <CotonCard className="p-6 space-y-4">
        <h2 className="font-poppins font-semibold text-lg text-coton-black">
          Mon profil capillaire
        </h2>
        
        <div className="space-y-4">
          {/* Type de cheveux */}
          <div className="space-y-2">
            <label className="font-roboto text-sm font-medium text-coton-black">
              Type de cheveux *
            </label>
            <Select value={selectedHairType} onValueChange={setSelectedHairType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionne ton type de cheveux" />
              </SelectTrigger>
              <SelectContent>
                {hairTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Porosité */}
          <div className="space-y-2">
            <label className="font-roboto text-sm font-medium text-coton-black">
              Porosité *
            </label>
            <Select value={selectedPorosity} onValueChange={setSelectedPorosity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionne ta porosité" />
              </SelectTrigger>
              <SelectContent>
                {porosity.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Objectif */}
          <div className="space-y-2">
            <label className="font-roboto text-sm font-medium text-coton-black">
              Objectif principal *
            </label>
            <Select value={selectedObjective} onValueChange={setSelectedObjective}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionne ton objectif principal" />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((obj) => (
                  <SelectItem key={obj.value} value={obj.value}>
                    {obj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CotonCard>

      {/* Bloc 2: Problématiques capillaires */}
      <CotonCard className="p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="font-poppins font-semibold text-lg text-coton-black">
            Mes problématiques capillaires
          </h2>
          <p className="font-roboto text-sm text-muted-foreground">
            Sélectionne toutes les problématiques qui te concernent
          </p>
        </div>
        
        <div className="space-y-3">
          {problems.map((problem) => (
            <div key={problem.id} className="flex items-center space-x-3">
              <Checkbox 
                id={problem.id}
                checked={selectedProblems.includes(problem.id)}
                onCheckedChange={() => toggleProblem(problem.id)}
              />
              <label 
                htmlFor={problem.id}
                className="font-roboto text-sm text-coton-black cursor-pointer"
              >
                {problem.label}
              </label>
            </div>
          ))}
        </div>
      </CotonCard>

      {/* Bloc 3: Besoins capillaires */}
      <CotonCard className="p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="font-poppins font-semibold text-lg text-coton-black">
            Mes besoins capillaires
          </h2>
          <p className="font-roboto text-sm text-muted-foreground">
            Sélectionne tous les besoins qui t'intéressent
          </p>
        </div>
        
        <div className="space-y-3">
          {needs.map((need) => (
            <div key={need.id} className="flex items-center space-x-3">
              <Checkbox 
                id={need.id}
                checked={selectedNeeds.includes(need.id)}
                onCheckedChange={() => toggleNeed(need.id)}
              />
              <label 
                htmlFor={need.id}
                className="font-roboto text-sm text-coton-black cursor-pointer"
              >
                {need.label}
              </label>
            </div>
          ))}
        </div>
      </CotonCard>

      {/* Message d'aide */}
      <CotonCard className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
        <p className="font-roboto text-sm text-center text-muted-foreground">
          <strong>💡 Astuce :</strong> cette étape nous permet de te générer une routine sur mesure.
        </p>
      </CotonCard>

      {/* Bouton CTA */}
      <div className="pb-6">
        <Button
          variant="hero"
          size="lg"
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="w-full"
        >
          Continuer → Créer mon compte
        </Button>
      </div>
    </div>
  );
}