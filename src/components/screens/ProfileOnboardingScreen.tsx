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
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [selectedNeed, setSelectedNeed] = useState<string>('');
  
  // IA States
  const [aiRoutinePreview, setAiRoutinePreview] = useState<string[]>([]);
  const [aiCotonTips, setAiCotonTips] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const selectProblem = (problemId: string) => {
    setSelectedProblem(prev => prev === problemId ? '' : problemId);
  };

  const selectNeed = (needId: string) => {
    setSelectedNeed(prev => prev === needId ? '' : needId);
  };

  // Generate AI tips based on current profile
  const generateAITips = async () => {
    // Don't generate if we don't have minimum info
    if (!selectedHairType && !selectedPorosity && !selectedObjective && !selectedProblem && !selectedNeed) {
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
        problems: selectedProblem ? [selectedProblem] : [],
        needs: selectedNeed ? [selectedNeed] : []
      });

      const { data, error } = await supabase.functions.invoke('generate-realtime-tips', {
        body: {
          hairType: selectedHairType,
          porosity: selectedPorosity,
          objective: selectedObjective,
          problems: selectedProblem ? [selectedProblem] : [],
          needs: selectedNeed ? [selectedNeed] : []
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
  }, [selectedHairType, selectedPorosity, selectedObjective, selectedProblem, selectedNeed]);

  const isFormValid = () => {
    return selectedHairType && 
           selectedPorosity && 
           selectedObjective && 
           (selectedProblem || selectedNeed);
  };

  const handleContinue = () => {
    // Update the hair profile in context
    dispatch({
      type: 'UPDATE_DETAILED_HAIR_PROFILE',
      profile: {
        hairType: selectedHairType,
        porosity: selectedPorosity,
        objective: selectedObjective,
        problems: selectedProblem ? [selectedProblem] : [],
        needs: selectedNeed ? [selectedNeed] : [],
        isCompleted: true
      }
    });
    
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-poppins font-bold text-2xl text-foreground">
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
        <h2 className="font-poppins font-semibold text-lg text-white">
          Mon profil capillaire
        </h2>
        
        <div className="space-y-4">
          {/* Type de cheveux */}
          <div className="space-y-2">
            <label className="font-roboto text-sm font-medium text-foreground">
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
            <label className="font-roboto text-sm font-medium text-foreground">
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
            <label className="font-roboto text-sm font-medium text-foreground">
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
          <h2 className="font-poppins font-semibold text-lg text-foreground">
            Mes problématiques capillaires
          </h2>
          <p className="font-roboto text-sm text-muted-foreground">
            Sélectionne une problématique principale qui te concerne
          </p>
        </div>
        
        <div className="space-y-3">
          {problems.map((problem) => (
            <div key={problem.id} className="flex items-center space-x-3">
              <Checkbox 
                id={problem.id}
                checked={selectedProblem === problem.id}
                onCheckedChange={() => selectProblem(problem.id)}
              />
              <label 
                htmlFor={problem.id}
                className="font-roboto text-sm text-foreground cursor-pointer"
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
          <h2 className="font-poppins font-semibold text-lg text-foreground">
            Mes besoins capillaires
          </h2>
          <p className="font-roboto text-sm text-muted-foreground">
            Sélectionne un besoin principal qui t'intéresse
          </p>
        </div>
        
        <div className="space-y-3">
          {needs.map((need) => (
            <div key={need.id} className="flex items-center space-x-3">
              <Checkbox 
                id={need.id}
                checked={selectedNeed === need.id}
                onCheckedChange={() => selectNeed(need.id)}
              />
              <label 
                htmlFor={need.id}
                className="font-roboto text-sm text-foreground cursor-pointer"
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
            <h3 className="font-poppins font-semibold text-lg text-foreground">
              {isGeneratingAI ? "Génération de ta routine Black Cotton, notre Bot capillaire..." : "Ta routine personnalisée par Black Cotton, notre Bot capillaire ✨"}
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
                <span className={`font-roboto text-sm ${isGeneratingAI ? 'text-gray-500' : 'text-foreground'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          {/* Disclaimer professionnel */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
            <p className="text-xs font-roboto text-center text-orange-800">
              ⚠️ <strong>Important :</strong> Ces conseils IA ne remplacent pas les conseils d'un professionnel de santé ou d'un spécialiste des cheveux afro
            </p>
          </div>
        </CotonCard>
      )}

      {/* AI CotonTips - shows when AI has generated tips */}
      {(aiCotonTips || isGeneratingAI) && (
        <CotonCard className="p-6 space-y-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50">
            {isGeneratingAI && <Loader2 className="animate-spin text-green-600" size={16} />}
            <Lightbulb className="text-green-600" size={20} />
            <h3 className="font-poppins font-semibold text-lg text-green-800">
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
            <>
              {/* Disclaimer professionnel pour CotonTips */}
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                <p className="text-xs font-roboto text-center text-orange-800">
                  ⚠️ Ces conseils ne remplacent pas l'avis d'un professionnel des cheveux afro
                </p>
              </div>
            </>
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