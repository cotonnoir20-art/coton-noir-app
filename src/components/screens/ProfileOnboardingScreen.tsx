import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  
  // IA States
  const [aiRoutinePreview, setAiRoutinePreview] = useState<string[]>([]);
  const [aiCotonTips, setAiCotonTips] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  // Generate AI tips based on current profile
  const generateAITips = async () => {
    // Don't generate if we don't have minimum info
    if (!selectedHairType && !selectedPorosity && !selectedObjective && selectedProblems.length === 0 && selectedNeeds.length === 0) {
      setAiRoutinePreview([]);
      setAiCotonTips('');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);

    try {
      console.log('Generating AI tips with profile:', {
        hairType: selectedHairType,
        porosity: selectedPorosity,
        objective: selectedObjective,
        problems: selectedProblems,
        needs: selectedNeeds
      });

      const { data, error } = await supabase.functions.invoke('generate-realtime-tips', {
        body: {
          hairType: selectedHairType,
          porosity: selectedPorosity,
          objective: selectedObjective,
          problems: selectedProblems,
          needs: selectedNeeds
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI response received:', data);

      if (data) {
        setAiRoutinePreview(data.routinePreview || []);
        setAiCotonTips(data.cotonTips || '');
      }
    } catch (error) {
      console.error('Error generating AI tips:', error);
      setAiError('Erreur lors de la génération des conseils IA');
      // Set fallback content
      setAiRoutinePreview(['Analyse de ton profil...', 'Génération en cours...']);
      setAiCotonTips('💡 Complète ton profil pour des conseils personnalisés !');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Trigger AI generation when profile changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      generateAITips();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeout);
  }, [selectedHairType, selectedPorosity, selectedObjective, selectedProblems, selectedNeeds]);

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

      {/* AI Routine Preview - shows when AI has generated content */}
      {(aiRoutinePreview.length > 0 || isGeneratingAI) && (
        <CotonCard className="p-6 space-y-4 bg-gradient-to-r from-coton-rose/10 to-purple-50">
          <div className="flex items-center gap-2">
            {isGeneratingAI && <Loader2 className="animate-spin text-coton-rose" size={16} />}
            <Sparkles className="text-coton-rose" size={16} />
            <h3 className="font-poppins font-semibold text-lg text-coton-black">
              {isGeneratingAI ? 'Génération de ta routine IA...' : 'Ta routine personnalisée par IA ✨'}
            </h3>
          </div>
          
          {aiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-roboto">
                {aiError}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {aiRoutinePreview.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  isGeneratingAI ? 'bg-gray-400' : 'bg-coton-rose'
                }`}>
                  {isGeneratingAI ? <Loader2 className="animate-spin" size={12} /> : index + 1}
                </div>
                <span className={`font-roboto text-sm ${isGeneratingAI ? 'text-gray-500' : 'text-coton-black'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-xs font-roboto text-center text-muted-foreground">
              {isGeneratingAI ? 'L\'IA analyse ton profil...' : 'Cette routine s\'adapte en temps réel à tes choix grâce à l\'IA'}
            </p>
          </div>
        </CotonCard>
      )}

      {/* AI CotonTips - shows when AI has generated tips */}
      {(aiCotonTips || isGeneratingAI) && (
        <CotonCard className="p-6 space-y-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex items-center gap-2">
            {isGeneratingAI && <Loader2 className="animate-spin text-amber-500" size={16} />}
            <Lightbulb className="text-amber-500" size={20} />
            <h3 className="font-poppins font-semibold text-lg text-amber-800">
              {isGeneratingAI ? 'Génération CotonTips IA...' : 'CotonTips IA'}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/70 border-l-4 border-amber-300">
              <p className={`font-roboto text-sm ${isGeneratingAI ? 'text-amber-600' : 'text-amber-900'}`}>
                {aiCotonTips || 'Génération du conseil personnalisé en cours...'}
              </p>
            </div>
          </div>
          
          {!isGeneratingAI && aiCotonTips && (
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <p className="text-xs font-roboto text-center text-green-700">
                ✨ Conseil généré par intelligence artificielle
              </p>
            </div>
          )}
        </CotonCard>
      )}

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