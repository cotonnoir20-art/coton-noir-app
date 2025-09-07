import React from 'react';
import { ArrowLeft, Sparkles, User, Target, Droplets, Heart, AlertCircle } from 'lucide-react';
import { CotonCard } from '@/components/ui/coton-card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useRoutineLimit } from '@/hooks/useRoutineLimit';
import { RoutinePaymentModal } from '@/components/ui/routine-payment-modal';
import { useState } from 'react';

interface DetailedRoutineScreenProps {
  onBack: () => void;
}

export function DetailedRoutineScreen({ onBack }: DetailedRoutineScreenProps) {
  const { state } = useApp();
  const { subscribed } = useSubscription();
  const { canGenerateFreeRoutine, remainingFreeRoutines, recordRoutineGeneration } = useRoutineLimit();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Vérifier si une routine a déjà été générée
  const hasGeneratedRoutine = state.detailedHairProfile.isCompleted;

  const handleGenerateRoutine = async () => {
    if (!canGenerateFreeRoutine && !hasGeneratedRoutine) {
      setShowPaymentModal(true);
      return;
    }
    
    // Si l'utilisateur a déjà une routine ou est premium, continuer normalement
    if (hasGeneratedRoutine && canGenerateFreeRoutine) {
      await recordRoutineGeneration('free');
    }
  };

  const handlePaymentSuccess = () => {
    recordRoutineGeneration('paid');
    setShowPaymentModal(false);
  };

  const generatePersonalizedRoutine = () => {
    const { hairType, porosity, objective, problems, needs } = state.detailedHairProfile;
    const routine = [];

    // Base routine selon le type de cheveux
    if (hairType === 'Crépus') {
      routine.push('Pre-poo avec huile de coco ou karité');
      routine.push('Shampoing doux sans sulfates');
      routine.push('Masque hydratant profond');
      routine.push('Leave-in conditioner');
      routine.push('Crème définissante');
      routine.push('Huile pour sceller l\'hydratation');
      routine.push('Gel pour définir les boucles');
    } else if (hairType === 'Bouclés') {
      routine.push('Co-wash ou shampoing doux');
      routine.push('Après-shampoing démêlant');
      routine.push('Masque nourrissant');
      routine.push('Crème de bouclage');
      routine.push('Mousse coiffante');
      routine.push('Sérum anti-frizz');
    } else if (hairType === 'Ondulés') {
      routine.push('Shampoing clarifiant');
      routine.push('Après-shampoing léger');
      routine.push('Masque hebdomadaire');
      routine.push('Spray texturant');
      routine.push('Mousse volumisante');
    }

    // Ajustements selon la porosité
    if (porosity === 'haute') {
      routine.push('Protéines légères hebdomadaires');
      routine.push('Soins scellants quotidiens');
    } else if (porosity === 'faible') {
      routine.push('Clarification régulière');
      routine.push('Produits légers sans accumulation');
    }

    // Ajustements selon les objectifs
    if (objective === 'hydratation') {
      routine.push('Bain d\'huiles bi-hebdomadaire');
      routine.push('Masque hydratant intensif');
    } else if (objective === 'définition') {
      routine.push('Technique du plopping');
      routine.push('Méthode LOC/LCO');
    } else if (objective === 'pousse') {
      routine.push('Massage du cuir chevelu');
      routine.push('Sérums stimulants');
    }

    return routine;
  };

  const personalizedRoutine = generatePersonalizedRoutine();

  const getRecommendationTip = () => {
    const { hairType, porosity, objective, problems } = state.detailedHairProfile;
    
    if (hairType === 'Crépus' && porosity === 'haute') {
      return "Tes cheveux crépus à haute porosité nécessitent une hydratation intensive et des protéines régulières. Privilégie des produits riches et scellants.";
    } else if (hairType === 'Bouclés' && objective === 'définition') {
      return "Pour définir tes boucles, utilise la méthode du 'scrunching' et évite de toucher tes cheveux en séchant.";
    } else if (hairType === 'Ondulés' && porosity === 'faible') {
      return "Tes cheveux ondulés à faible porosité bénéficient de produits légers et d'une clarification régulière pour éviter l'accumulation.";
    }
    
    return "Cette routine est personnalisée selon ton profil capillaire. Adapte-la selon tes besoins et les réactions de tes cheveux.";
  };

  const getFrequencyRecommendation = (step: string) => {
    if (step.toLowerCase().includes('masque')) return '1-2x/semaine';
    if (step.toLowerCase().includes('shampoing') || step.toLowerCase().includes('co-wash')) return '1-2x/semaine';
    if (step.toLowerCase().includes('leave-in') || step.toLowerCase().includes('hydrat')) return 'Quotidien';
    if (step.toLowerCase().includes('huile') && step.toLowerCase().includes('bain')) return '1x/semaine';
    if (step.toLowerCase().includes('massage')) return 'Quotidien';
    if (step.toLowerCase().includes('clarif')) return '1x/mois';
    if (step.toLowerCase().includes('protéine')) return '1x/semaine';
    return 'Selon besoin';
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-poppins font-bold text-xl">
          Ma Routine Complète
        </h1>
        <Sparkles className="text-coton-rose" size={24} />
      </div>

      {/* Limitation pour utilisateurs gratuits */}
      {!subscribed && !canGenerateFreeRoutine && (
        <CotonCard className="p-4 mb-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-poppins font-semibold text-amber-800 mb-2">
                Limite de routine atteinte
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                Tu as utilisé ta routine gratuite ce mois-ci. Pour générer une nouvelle routine personnalisée :
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Payer 4,99€
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPaymentModal(true)}
                  className="border-coton-rose text-coton-rose hover:bg-coton-rose/10"
                >
                  Devenir Premium
                </Button>
              </div>
            </div>
          </div>
        </CotonCard>
      )}

      {/* Info routines restantes pour utilisateurs gratuits */}
      {!subscribed && canGenerateFreeRoutine && (
        <CotonCard className="p-3 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="text-blue-600" size={16} />
            <span className="text-blue-700">
              <strong>{remainingFreeRoutines}</strong> routine gratuite restante ce mois-ci
            </span>
          </div>
        </CotonCard>
      )}

      {/* Profile Summary */}
      <CotonCard className="p-4 bg-gradient-to-r from-coton-rose/10 to-purple-50">
        <h3 className="font-poppins font-semibold mb-3 flex items-center gap-2">
          <User className="text-coton-rose" size={20} />
          Ton Profil Capillaire
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-roboto text-muted-foreground">Type:</span>
            <span className="px-2 py-1 bg-white/70 rounded-full text-sm font-medium">
              {state.detailedHairProfile.hairType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-roboto text-muted-foreground">Porosité:</span>
            <span className="px-2 py-1 bg-white/70 rounded-full text-sm font-medium">
              {state.detailedHairProfile.porosity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-roboto text-muted-foreground">Objectif:</span>
            <span className="px-2 py-1 bg-white/70 rounded-full text-sm font-medium">
              {state.detailedHairProfile.objective}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-roboto text-muted-foreground">Besoins:</span>
            <span className="px-2 py-1 bg-white/70 rounded-full text-sm font-medium">
              {state.detailedHairProfile.needs}
            </span>
          </div>
        </div>
      </CotonCard>

      {/* Complete Routine */}
      <div className="space-y-4">
        <h3 className="font-poppins font-semibold text-lg flex items-center gap-2">
          <Target className="text-green-500" size={20} />
          Routine Personnalisée Complète
        </h3>

        {personalizedRoutine.map((step, index) => (
          <CotonCard key={index} className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-coton-rose to-pink-400 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-poppins font-semibold text-base mb-1">
                  {step}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {getFrequencyRecommendation(step)}
                  </span>
                </div>
              </div>
            </div>
          </CotonCard>
        ))}
      </div>

      {/* Expert Tip */}
      <CotonCard className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">💡</span>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-amber-800 mb-2">
              Conseil Expert Personnalisé
            </h4>
            <p className="text-sm font-roboto text-amber-900 leading-relaxed">
              {getRecommendationTip()}
            </p>
          </div>
        </div>
      </CotonCard>


      {/* Application Schedule */}
      <CotonCard className="p-4">
        <h3 className="font-poppins font-semibold mb-3 flex items-center gap-2">
          <Heart className="text-red-500" size={20} />
          Planning Recommandé
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-roboto font-medium">Routine quotidienne</span>
            <span className="text-sm text-green-600">Hydratation + Coiffage</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-roboto font-medium">1-2x par semaine</span>
            <span className="text-sm text-blue-600">Lavage + Masque</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span className="font-roboto font-medium">1x par mois</span>
            <span className="text-sm text-purple-600">Clarification</span>
          </div>
        </div>
      </CotonCard>

      {/* Tips */}
      <CotonCard className="p-4 bg-coton-rose/5">
        <h3 className="font-poppins font-semibold mb-3 flex items-center gap-2">
          <Droplets className="text-blue-500" size={20} />
          Conseils d'Application
        </h3>
        <ul className="space-y-2 text-sm font-roboto">
          <li className="flex items-start gap-2">
            <span className="text-coton-rose">•</span>
            <span>Appliquez les produits sur cheveux humides pour une meilleure absorption</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-coton-rose">•</span>
            <span>Utilisez la technique du "praying hands" pour répartir uniformément</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-coton-rose">•</span>
            <span>Adapte les quantités selon la longueur et l'épaisseur de tes cheveux</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-coton-rose">•</span>
            <span>Écoute tes cheveux et ajuste la routine selon leurs réactions</span>
          </li>
        </ul>
      </CotonCard>

      {/* Disclaimer final */}
      <CotonCard className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
        <p className="text-xs font-roboto text-center text-gray-700">
          💡 <strong>Rappel :</strong> Cette routine personnalisée est générée automatiquement. Elle ne remplace pas l'expertise d'un professionnel des cheveux afro ou d'un dermatologue. En cas de problème capillaire persistant, consultez un spécialiste.
        </p>
      </CotonCard>

      {/* Modal de paiement */}
      <RoutinePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}