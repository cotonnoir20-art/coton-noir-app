import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Star, Sparkles, Target, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedOnboardingScreenProps {
  onComplete: () => void;
}

// Données pour l'onboarding
const hairTypes = [
  { id: '3C', name: 'Cheveux 3C', description: 'Boucles serrées, ressort visible' },
  { id: '4A', name: 'Cheveux 4A', description: 'Boucles crépues souples' },
  { id: '4B', name: 'Cheveux 4B', description: 'Boucles crépues en Z' },
  { id: '4C', name: 'Cheveux 4C', description: 'Boucles très serrées' },
  { id: 'LOCKS', name: 'Locks/Dreadlocks', description: 'Cheveux verrouillés naturellement' }
];

const porosityLevels = [
  { id: 'faible', name: 'Porosité faible', description: 'Difficile à hydrater, repousse l\'eau' },
  { id: 'moyenne', name: 'Porosité moyenne', description: 'Équilibre absorption/rétention' },
  { id: 'haute', name: 'Porosité haute', description: 'Absorbe vite, perd vite l\'hydratation' }
];

const objectives = [
  { id: 'pousse', name: 'Stimuler la pousse', emoji: '🌱' },
  { id: 'souplesse', name: 'Améliorer la souplesse', emoji: '💆🏾‍♀️' },
  { id: 'sante', name: 'Restaurer la santé capillaire', emoji: '💚' },
  { id: 'decoloration', name: 'Soins cheveux décolorés', emoji: '🌈' },
  { id: 'protection', name: 'Optimiser les coiffures protectrices', emoji: '🔒' },
  { id: 'routine_protective', name: 'Routine sous coiffure protectrice', emoji: '🧕🏾' }
];

const problems = [
  { id: 'secheresse', name: 'Sécheresse' },
  { id: 'casse', name: 'Casse' },
  { id: 'frisottis', name: 'Frisottis' },
  { id: 'demelage', name: 'Démêlage difficile' },
  { id: 'cuir_chevelu', name: 'Cuir chevelu sensible' },
  { id: 'chute', name: 'Chute de cheveux' }
];

const needs = [
  { id: 'hydratation', name: 'Hydratation intense' },
  { id: 'definition', name: 'Définition des boucles' },
  { id: 'brillance', name: 'Brillance' },
  { id: 'pousse', name: 'Stimuler la pousse' },
  { id: 'reparation', name: 'Réparation' },
  { id: 'protection', name: 'Protection' }
];

// Témoignages
const testimonials = [
  {
    step: 1,
    text: "Grâce à mon profil détaillé, j'ai enfin une routine qui marche !",
    author: "Sarah, 4C",
    rating: 5
  },
  {
    step: 3,
    text: "Les conseils personnalisés ont transformé mes cheveux en 2 mois.",
    author: "Amina, 4A",
    rating: 5
  }
];

export function EnhancedOnboardingScreen({ onComplete }: EnhancedOnboardingScreenProps) {
  const { dispatch } = useApp();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hairType: '',
    porosity: '',
    objective: '',
    selectedProblems: [] as string[],
    selectedNeeds: [] as string[]
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Sauvegarder le profil détaillé
    dispatch({
      type: 'UPDATE_DETAILED_HAIR_PROFILE',
      profile: {
        hairType: formData.hairType,
        porosity: formData.porosity,
        objective: formData.objective,
        problems: formData.selectedProblems,
        needs: formData.selectedNeeds,
        isCompleted: true
      }
    });

    // Bonus de completion
    dispatch({ type: 'ADD_COINS', amount: 200 });
    
    toast({
      title: "Profil complété ! 🎉 +200 CC",
      description: "Votre routine personnalisée vous attend !"
    });

    onComplete();
  };

  const toggleProblem = (problemId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProblems: prev.selectedProblems.includes(problemId)
        ? prev.selectedProblems.filter(p => p !== problemId)
        : [...prev.selectedProblems, problemId]
    }));
  };

  const toggleNeed = (needId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedNeeds: prev.selectedNeeds.includes(needId)
        ? prev.selectedNeeds.filter(n => n !== needId)
        : [...prev.selectedNeeds, needId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.hairType !== '';
      case 2: return formData.porosity !== '';
      case 3: return formData.objective !== '';
      case 4: return formData.selectedProblems.length > 0;
      case 5: return formData.selectedNeeds.length > 0;
      default: return false;
    }
  };

  const currentTestimonial = testimonials.find(t => t.step === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coton-rose/10 to-purple-50 px-4 py-6">
      {/* Header avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {currentStep > 1 && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h1 className="font-poppins font-bold text-xl text-coton-black">
              Profil Capillaire
            </h1>
            <p className="text-sm text-muted-foreground">
              Étape {currentStep} sur {totalSteps}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <Progress value={progress} className="mb-4" />
        
        {/* Récompenses à la completion */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
            <Gift className="text-yellow-600" size={16} />
            <span className="text-sm font-medium text-yellow-700">
              +200 CC à la completion !
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Étape 1: Type de cheveux */}
          {currentStep === 1 && (
            <CotonCard className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins font-bold text-lg mb-2">
                  Quel est votre type de cheveux ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Cette information nous aide à créer votre routine parfaite
                </p>
              </div>

              <div className="space-y-3">
                {hairTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, hairType: type.id }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.hairType === type.id
                        ? 'border-coton-rose bg-coton-rose/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-poppins font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      {formData.hairType === type.id && (
                        <Check className="text-coton-rose" size={20} />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </CotonCard>
          )}

          {/* Étape 2: Porosité */}
          {currentStep === 2 && (
            <CotonCard className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins font-bold text-lg mb-2">
                  Quelle est votre porosité ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Test simple: mouillez une mèche, observe la vitesse d'absorption
                </p>
              </div>

              <div className="space-y-3">
                {porosityLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, porosity: level.id }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.porosity === level.id
                        ? 'border-coton-rose bg-coton-rose/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-poppins font-semibold">{level.name}</h3>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {formData.porosity === level.id && (
                        <Check className="text-coton-rose" size={20} />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </CotonCard>
          )}

          {/* Étape 3: Objectif principal */}
          {currentStep === 3 && (
            <CotonCard className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins font-bold text-lg mb-2">
                  Quel est votre objectif principal ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choisissez votre priorité pour personnaliser votre routine
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {objectives.map((objective) => (
                  <motion.button
                    key={objective.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData(prev => ({ ...prev, objective: objective.id }))}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.objective === objective.id
                        ? 'border-coton-rose bg-coton-rose/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{objective.emoji}</div>
                    <h3 className="font-poppins font-semibold text-sm">{objective.name}</h3>
                  </motion.button>
                ))}
              </div>
            </CotonCard>
          )}

          {/* Étape 4: Problèmes */}
          {currentStep === 4 && (
            <CotonCard className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins font-bold text-lg mb-2">
                  Quels sont vos problèmes actuels ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez tous ceux qui vous concernent (plusieurs choix possibles)
                </p>
              </div>

              <div className="space-y-3">
                {problems.map((problem) => (
                  <motion.label
                    key={problem.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.selectedProblems.includes(problem.id)
                        ? 'border-coton-rose bg-coton-rose/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Checkbox
                      checked={formData.selectedProblems.includes(problem.id)}
                      onCheckedChange={() => toggleProblem(problem.id)}
                      className="mr-3"
                    />
                    <span className="font-roboto">{problem.name}</span>
                  </motion.label>
                ))}
              </div>
            </CotonCard>
          )}

          {/* Étape 5: Besoins */}
          {currentStep === 5 && (
            <CotonCard className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins font-bold text-lg mb-2">
                  De quoi vos cheveux ont-ils besoin ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez vos priorités (plusieurs choix possibles)
                </p>
              </div>

              <div className="space-y-3">
                {needs.map((need) => (
                  <motion.label
                    key={need.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.selectedNeeds.includes(need.id)
                        ? 'border-coton-rose bg-coton-rose/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Checkbox
                      checked={formData.selectedNeeds.includes(need.id)}
                      onCheckedChange={() => toggleNeed(need.id)}
                      className="mr-3"
                    />
                    <span className="font-roboto">{need.name}</span>
                  </motion.label>
                ))}
              </div>

              {/* Preview de ce qui va être généré */}
              {formData.selectedNeeds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <h3 className="font-poppins font-semibold mb-2 text-purple-700">
                    🎉 Voici ce que vous obtiendrez :
                  </h3>
                  <ul className="space-y-1 text-sm text-purple-600">
                    <li>✨ Routine personnalisée en 3-6 étapes</li>
                    <li>💡 CotonTips adaptés à votre profil</li>
                    <li>📈 Suivi de progression intelligent</li>
                    <li>🏆 Défis quotidiens personnalisés</li>
                    <li>🪙 +200 CotonCoins de bienvenue !</li>
                  </ul>
                </motion.div>
              )}
            </CotonCard>
          )}

          {/* Témoignage */}
          {currentTestimonial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CotonCard className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Star className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm italic text-yellow-800 mb-2">
                      "{currentTestimonial.text}"
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-yellow-700">
                        {currentTestimonial.author}
                      </span>
                      <div className="flex">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CotonCard>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Boutons de navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="text-sm text-muted-foreground">
            {currentStep}/{totalSteps}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-8"
          >
            {currentStep === totalSteps ? 'Créer ma routine' : 'Suivant'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}