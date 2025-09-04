import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { AIHairTip } from '@/components/ui/ai-hair-tip';
import { HairAnalyzer } from '@/components/ui/hair-analyzer';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
interface HairProfileScreenProps {
  onBack: () => void;
}
const hairTypes = [{
  id: '3C',
  label: 'Type 3C - Bouclés serrés',
  emoji: '🌀',
  description: 'Boucles en spirale serrées, texture épaisse'
}, {
  id: '4A',
  label: 'Type 4A - Crépus souples',
  emoji: '🌸',
  description: 'Boucles crépues souples, pattern visible'
}, {
  id: '4B',
  label: 'Type 4B - Crépus moyens',
  emoji: '⚡',
  description: 'Pattern en Z, texture dense et cotonneuse'
}, {
  id: '4C',
  label: 'Type 4C - Crépus serrés',
  emoji: '✨',
  description: 'Pattern très serré, maximum de rétrécissement'
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
  const [selectedNeeds, setSelectedNeeds] = useState<string>(state.hairProfile.needs[0] || '');
  const [selectedObjectives, setSelectedObjectives] = useState<string>(state.hairProfile.objectives[0] || '');
  const toggleNeed = (needId: string) => {
    setSelectedNeeds(prev => prev === needId ? '' : needId);
  };
  const toggleObjective = (objective: string) => {
    setSelectedObjectives(prev => prev === objective ? '' : objective);
  };

  // Generate personalized routine based on detailed profile
  const personalizedRoutine = useMemo(() => {
    if (!state.detailedHairProfile.isCompleted) return [];
    
    const { hairType, porosity, objective, problems, needs } = state.detailedHairProfile;
    let steps = [];
    
    // Base routine according to hair type AND porosity
    if (hairType === '3C') {
      if (porosity === 'faible') {
        steps = ['Pré-poo aux huiles légères', 'Shampoing sans sulfates', 'Masque hydratant léger', 'Leave-in crémeux', 'Gel définition pour boucles'];
      } else if (porosity === 'moyenne') {
        steps = ['Pré-poo nourrissant', 'Co-wash hydratant', 'Masque protéines/hydratation', 'Crème leave-in', 'Gel ou mousse définition'];
      } else {
        steps = ['Pré-poo riche en huiles', 'Co-wash crémeux', 'Masque hydratant intensif', 'Crème riche', 'Gel épais ou crème coiffante'];
      }
    } else if (hairType === '4A') {
      if (porosity === 'faible') {
        steps = ['Pré-poo léger', 'Shampoing clarifiant doux', 'Masque équilibré', 'Leave-in fluide', 'Crème définition légère'];
      } else if (porosity === 'moyenne') {
        steps = ['Pré-poo aux beurres', 'Shampoing hydratant', 'Masque nourrissant', 'Leave-in crémeux', 'Beurre de karité + huile'];
      } else {
        steps = ['Pré-poo riche', 'Co-wash ou shampoing doux', 'Masque réparateur intensif', 'Crème épaisse', 'Scellage beurre + huile'];
      }
    } else if (hairType === '4B') {
      if (porosity === 'faible') {
        steps = ['Massage cuir chevelu', 'Shampoing hydratant', 'Masque protéiné léger', 'Leave-in riche', 'Huile scellante'];
      } else if (porosity === 'moyenne') {
        steps = ['Pré-poo nourrissant', 'Co-wash crémeux', 'Masque hydratant profond', 'Crème leave-in épaisse', 'Beurre de karité'];
      } else {
        steps = ['Bain d\'huiles', 'Co-wash uniquement', 'Masque ultra-nourrissant', 'Crème très riche', 'Scellage beurre épais'];
      }
    } else if (hairType === '4C') {
      if (porosity === 'faible') {
        steps = ['Pré-poo prolongé', 'Shampoing très doux', 'Masque protéiné doux', 'Crème leave-in riche', 'Huile + beurre léger'];
      } else if (porosity === 'moyenne') {
        steps = ['Bain d\'huiles chaud', 'Co-wash exclusivement', 'Masque réparateur', 'Crème épaisse', 'Méthode LOC (leave-in + huile + crème)'];
      } else {
        steps = ['Pré-poo overnight', 'Co-wash doux', 'Masque ultra-hydratant', 'Crème très épaisse', 'Méthode LCO (leave-in + crème + huile)'];
      }
    }
    
    // Adapt based on objective
    if (objective === 'hydratation') {
      steps.splice(2, 1, 'Double masque hydratant');
      if (!steps.some(s => s.includes('hydrat'))) {
        steps.push('Spray hydratant quotidien');
      }
    } else if (objective === 'definition') {
      steps.push('Technique plopping après application');
      steps = steps.map(s => s.includes('Gel') ? 'Gel définition forte tenue' : s);
    } else if (objective === 'pousse') {
      steps.unshift('Massage stimulant cuir chevelu');
      if (!steps.some(s => s.includes('protéin'))) {
        steps.splice(-1, 0, 'Traitement fortifiant');
      }
    } else if (objective === 'reparation') {
      steps.splice(1, 0, 'Traitement protéiné réparateur');
      steps = steps.map(s => s.includes('Masque') ? 'Masque réparateur intensif' : s);
    }
    
    // Adapt based on problems
    if (problems.includes('secheresse')) {
      steps = steps.map(s => s.includes('Masque') ? 'Masque hydratant ultra-nourrissant' : s);
      steps.push('Brumisateur hydratant quotidien');
    }
    if (problems.includes('casse')) {
      steps.splice(1, 0, 'Traitement protéiné fortifiant');
      steps.push('Soin anti-casse sur pointes');
    }
    if (problems.includes('frisottis')) {
      steps.push('Sérum anti-frisottis sans rinçage');
      steps = steps.map(s => s.includes('Leave-in') ? 'Leave-in lissant anti-frisottis' : s);
    }
    if (problems.includes('demelage')) {
      steps.splice(1, 0, 'Conditioner démêlant');
      steps.push('Huile démêlante avant coiffage');
    }
    if (problems.includes('cuir_chevelu')) {
      steps.unshift('Massage apaisant cuir chevelu');
      steps.splice(1, 0, 'Shampoing apaisant sans sulfates');
    }
    if (problems.includes('chute')) {
      steps.unshift('Massage anti-chute stimulant');
      steps.push('Sérum fortifiant cuir chevelu');
    }
    
    // Adapt based on specific needs
    if (needs.includes('hydratation')) {
      if (!steps.some(s => s.includes('hydrat'))) {
        steps.splice(-1, 0, 'Masque hydratant hebdomadaire');
      }
    }
    if (needs.includes('definition')) {
      steps.push('Crème définition + gel fixation');
      steps.push('Technique scrunching');
    }
    if (needs.includes('brillance')) {
      steps.push('Sérum brillance finition');
      steps.push('Rinçage eau froide final');
    }
    if (needs.includes('pousse')) {
      if (!steps.some(s => s.includes('Massage'))) {
        steps.unshift('Massage stimulant 5min');
      }
      steps.push('Soin fortifiant pointes');
    }
    if (needs.includes('reparation')) {
      steps.splice(2, 0, 'Masque protéines/hydratation alterné');
    }
    if (needs.includes('protection')) {
      steps.push('Protection thermique si chaleur');
      steps.push('Satin/soie pour dormir');
    }
    
    return steps.slice(0, 6); // Allow up to 6 steps for comprehensive care
  }, [state.detailedHairProfile]);
  const handleSave = () => {
    if (!selectedHairType) {
      toast({
        title: "Type de cheveux requis",
        description: "Merci de sélectionner ton type de cheveux",
        variant: "destructive"
      });
      return;
    }
    
    const wasCompleted = state.hairProfile.isCompleted;
    
    dispatch({
      type: 'UPDATE_HAIR_PROFILE',
      profile: {
        hairType: selectedHairType,
        needs: selectedNeeds ? [selectedNeeds] : [],
        objectives: selectedObjectives ? [selectedObjectives] : [],
        isCompleted: true
      }
    });
    
    // Toujours donner 5 CC pour sauvegarder le profil
    dispatch({
      type: 'ADD_COINS',
      amount: 5
    });
    
    if (!wasCompleted) {
      toast({
        title: "Profil complété ! ✨ +5 CC",
        description: "Ton profil capillaire a été enregistré avec succès !"
      });
    } else {
      toast({
        title: "Profil mis à jour ! ✨ +5 CC",
        description: "Tes modifications ont été sauvegardées !"
      });
    }
    
    onBack();
  };
  return (
    <div className="pb-20 px-4 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4 pb-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="font-poppins font-bold text-xl text-coton-black">
            Mon Profil Capillaire
          </h1>
        </div>
        <HairAnalyzer 
          analysisType="hair_profile"
          className="text-xs px-3 py-2"
          onAnalysisComplete={(analysis) => {
            if (analysis.hairTypeDetected && analysis.hairTypeDetected !== selectedHairType) {
              toast({
                title: "IA suggère un ajustement",
                description: `Type détecté: ${analysis.hairTypeDetected}. Voulez-vous l'appliquer?`,
              });
            }
          }}
        />
      </div>

      {/* Levels Section */}
      <div className="space-y-4">
        <h2 className="font-poppins font-bold text-xl text-coton-black text-center">
          Les 10 Niveaux Coton Noir
        </h2>
        
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {/* Level 1 - Baby Hair */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#F7B6D2' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Baby Hair</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Le tout début, la base mignonne</p>
              <div className="text-xs font-roboto text-white/90">
                <p>0 - 500 CC</p>
                <p>Badge de bienvenue</p>
              </div>
            </div>
          </div>

          {/* Level 2 - Curlie Cutie */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#C9A7EB' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💖</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Curlie Cutie</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Les premières boucles assumées</p>
              <div className="text-xs font-roboto text-white/90">
                <p>501 - 1 000 CC</p>
                <p>50 CC + -5% partenaire</p>
              </div>
            </div>
          </div>

          {/* Level 3 - Afro Queenie */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#FFD166' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Afro Queenie</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Petite reine de son afro</p>
              <div className="text-xs font-roboto text-white/90">
                <p>1 001 - 2 500 CC</p>
                <p>1 Ebook premium</p>
              </div>
            </div>
          </div>

          {/* Level 4 - Glow Fro */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#FEE440' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌟</span>
                <h3 className="font-poppins font-semibold text-gray-800 text-sm">Glow Fro</h3>
              </div>
              <p className="text-xs font-roboto text-gray-700">Afro qui brille</p>
              <div className="text-xs font-roboto text-gray-700">
                <p>2 501 - 5 000 CC</p>
                <p>100 CC + -10% partenaire</p>
              </div>
            </div>
          </div>

          {/* Level 5 - Crown Vibes */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#FF6F91' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑💕</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Crown Vibes</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Chevelure couronne</p>
              <div className="text-xs font-roboto text-white/90">
                <p>5 001 - 7 500 CC</p>
                <p>Box digitale exclusive</p>
              </div>
            </div>
          </div>

          {/* Level 6 - Slay Braidy */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#06D6A0' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧵🔥</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Slay Braidy</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Maîtrise coiffures protectrices</p>
              <div className="text-xs font-roboto text-white/90">
                <p>7 501 - 10 000 CC</p>
                <p>150 CC + -15% partenaire</p>
              </div>
            </div>
          </div>

          {/* Level 7 - Kinky Diva */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#9B5DE5' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💃🏾</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Kinky Diva</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Personnalité capillaire affirmée</p>
              <div className="text-xs font-roboto text-white/90">
                <p>10 001 - 15 000 CC</p>
                <p>Produit partenaire offert</p>
              </div>
            </div>
          </div>

          {/* Level 8 - Twist & Shine */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#FF9770' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💫</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Twist & Shine</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">L'art du twist-out</p>
              <div className="text-xs font-roboto text-white/90">
                <p>15 001 - 20 000 CC</p>
                <p>200 CC + accès premium</p>
              </div>
            </div>
          </div>

          {/* Level 9 - Wash Day Goddess */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ backgroundColor: '#26547C' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛁👸🏾</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Wash Day Goddess</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Maîtrise totale rituel</p>
              <div className="text-xs font-roboto text-white/90">
                <p>20 001 - 30 000 CC</p>
                <p>Box physique échantillons + -20% partenaire</p>
              </div>
            </div>
          </div>

          {/* Level 10 - Afrolicious Icon */}
          <div className="min-w-[200px] p-3 rounded-lg transition-all duration-300" style={{ background: 'linear-gradient(135deg, #000000, #FFD700)' }}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥💎</span>
                <h3 className="font-poppins font-semibold text-white text-sm">Afrolicious Icon</h3>
              </div>
              <p className="text-xs font-roboto text-white/90">Icône inspirante, afro star</p>
              <div className="text-xs font-roboto text-white/90">
                <p>30 001+ CC</p>
                <p>Box physique échantillons + -50% partenaire + badge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Type Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
            Mon type de cheveux
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Choisis ton type selon la classification André Walker (3C à 4C)
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hairTypes.map(type => <CotonCard key={type.id} className={`p-5 cursor-pointer transition-all hover:scale-[1.02] border-2 ${selectedHairType === type.id ? 'ring-2 ring-coton-rose bg-coton-rose/10 border-coton-rose' : 'hover:shadow-soft border-transparent'}`} onClick={() => setSelectedHairType(type.id as any)}>
              <div className="text-center space-y-3">
                <div className="text-3xl">{type.emoji}</div>
                <div className="space-y-1">
                  <p className="font-poppins font-semibold text-sm text-coton-black">
                    {type.label}
                  </p>
                   <p className="font-roboto text-xs text-muted-foreground leading-tight">
                     {type.description}
                   </p>
                 </div>
               </div>
             </CotonCard>)}
         </div>
         
         {/* AI Tip based on selected hair type */}
         {selectedHairType && (
           <div className="mt-4">
             <AIHairTip 
               tipType="styling" 
               context={`conseils spécifiques pour cheveux ${selectedHairType}`}
               variant="compact"
               showRefresh={true}
             />
           </div>
         )}
       </div>

      {/* Needs Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-coton-black mb-2">
            Mes besoins
          </h3>
          <p className="text-sm font-roboto text-muted-foreground mb-4">
            Sélectionne ton besoin prioritaire (un seul choix possible)
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {needs.map(need => <CotonCard key={need.id} className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedNeeds === need.id ? 'ring-2 ring-coton-rose bg-coton-rose/10' : 'hover:shadow-soft'}`} onClick={() => toggleNeed(need.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{need.emoji}</span>
                  <span className="font-roboto text-sm text-coton-black">
                    {need.label}
                  </span>
                </div>
                {selectedNeeds === need.id && <Check size={16} className="text-coton-rose animate-scale-in" />}
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
            Quel est ton objectif principal ? (un seul choix possible)
          </p>
        </div>
        
        <div className="space-y-4 py-0 mx-0 my-0 px-0">
          {objectives.map((objective, index) => <CotonCard key={index} className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${selectedObjectives === objective ? 'ring-2 ring-coton-rose bg-coton-rose/10' : 'hover:shadow-soft'}`} onClick={() => toggleObjective(objective)}>
              <div className="flex items-center justify-between">
                <span className="font-roboto text-sm text-coton-black">
                  {objective}
                </span>
                {selectedObjectives === objective && <Check size={16} className="text-coton-rose animate-scale-in" />}
              </div>
            </CotonCard>)}
        </div>
      </div>

      {/* Personalized Routine Section */}
      {state.detailedHairProfile.isCompleted && personalizedRoutine.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Ma routine personnalisée ✨</h3>
          
          {/* Priority Problems Alert */}
          {state.detailedHairProfile.problems.length > 0 && (
            <CotonCard className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <h4 className="font-poppins font-semibold text-red-800 text-sm">Problématiques prioritaires</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.detailedHairProfile.problems.map((problem, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 border border-red-300 rounded-full text-xs font-roboto text-red-800">
                    {problem === 'secheresse' ? '💧 Sécheresse' :
                     problem === 'casse' ? '💔 Casse' :
                     problem === 'frisottis' ? '🌀 Frisottis' :
                     problem === 'demelage' ? '🪢 Démêlage difficile' :
                     problem === 'cuir_chevelu' ? '🔴 Cuir chevelu irrité' :
                     problem === 'chute' ? '🍂 Chute' : problem}
                  </span>
                ))}
              </div>
            </CotonCard>
          )}

          <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50 space-y-4">
            {/* Profile Summary */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-coton-rose/20">
                <span className="px-3 py-1 bg-coton-rose/20 border border-coton-rose/30 rounded-full text-sm font-roboto font-semibold text-coton-black">
                  {state.detailedHairProfile.hairType}
                </span>
                <span className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-sm font-roboto text-blue-800">
                  Porosité {state.detailedHairProfile.porosity}
                </span>
                <span className="px-3 py-1 bg-green-100 border border-green-300 rounded-full text-sm font-roboto text-green-800">
                  🎯 {state.detailedHairProfile.objective}
                </span>
              </div>
              
              {/* Needs Section */}
              {state.detailedHairProfile.needs.length > 0 && (
                <div>
                  <p className="text-xs font-roboto text-gray-600 mb-2">Besoins spécifiques :</p>
                  <div className="flex flex-wrap gap-2">
                    {state.detailedHairProfile.needs.map((need, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 border border-purple-300 rounded-full text-xs font-roboto text-purple-800">
                        {need === 'hydratation' ? '💧 Hydratation' :
                         need === 'definition' ? '💫 Définition' :
                         need === 'brillance' ? '✨ Brillance' :
                         need === 'pousse' ? '🌱 Pousse' :
                         need === 'reparation' ? '🔧 Réparation' :
                         need === 'protection' ? '🛡️ Protection' : need}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Routine Steps with Priority Indicators */}
            <div className="space-y-3">
              <h4 className="font-poppins font-semibold text-coton-black text-sm flex items-center gap-2">
                <span>📋</span> Ta routine adaptée
              </h4>
              {personalizedRoutine.map((step, index) => {
                // Determine priority based on step content and user problems
                const isHighPriority = state.detailedHairProfile.problems.some(problem =>
                  (problem === 'secheresse' && step.toLowerCase().includes('hydrat')) ||
                  (problem === 'casse' && step.toLowerCase().includes('protéin')) ||
                  (problem === 'frisottis' && step.toLowerCase().includes('anti-frisottis')) ||
                  (problem === 'demelage' && step.toLowerCase().includes('démêl')) ||
                  (problem === 'cuir_chevelu' && step.toLowerCase().includes('cuir chevelu')) ||
                  (problem === 'chute' && step.toLowerCase().includes('anti-chute'))
                );

                return (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isHighPriority 
                      ? 'bg-gradient-to-r from-coton-rose/20 to-red-50 border border-red-200' 
                      : 'bg-white/60 border border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isHighPriority ? 'bg-red-500' : 'bg-coton-rose'
                    }`}>
                      {isHighPriority ? '!' : index + 1}
                    </div>
                    <div className="flex-1">
                      <span className={`font-roboto text-sm ${isHighPriority ? 'font-semibold text-red-900' : 'text-coton-black'}`}>
                        {step}
                      </span>
                      {isHighPriority && (
                        <div className="text-xs text-red-700 mt-1 font-medium">
                          ⚡ Action prioritaire pour tes problématiques
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-3 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💡</span>
                  </div>
                  <h4 className="font-poppins font-semibold text-amber-800 text-sm">CotonTips</h4>
                </div>
                <p className="text-xs font-roboto text-amber-900 leading-relaxed">
                  {(() => {
                    const { hairType, porosity, objective, problems, needs } = state.detailedHairProfile;
                    
                    // Priority tips based on problems
                    if (problems.includes('secheresse')) {
                      return "Astuce hydratation : Scelle toujours tes cheveux avec une huile ou un beurre après ton leave-in pour maintenir l'hydratation plus longtemps 💧";
                    }
                    if (problems.includes('casse')) {
                      return "Astuce anti-casse : Dors avec une taie d'oreiller en satin ou soie pour réduire les frictions et protéger tes cheveux 🛡️";
                    }
                    if (problems.includes('demelage')) {
                      return "Astuce démêlage : Démêle toujours sur cheveux humides avec un conditioner et commence par les pointes vers les racines ✨";
                    }
                    if (problems.includes('frisottis')) {
                      return "Astuce anti-frisottis : Évite de toucher tes cheveux une fois qu'ils sèchent et utilise un diffuseur à basse température 🌀";
                    }
                    
                    // Tips based on hair type + porosity combination
                    if (hairType === '4C' && porosity === 'haute') {
                      return "Spécial 4C porosité haute : Privilégie la méthode LCO (Leave-in + Crème + Huile) pour une hydratation optimale 🔥";
                    }
                    if (hairType === '3C' && porosity === 'faible') {
                      return "Spécial 3C porosité faible : Utilise des produits légers et évite les protéines trop souvent pour ne pas alourdir tes boucles 🌸";
                    }
                    
                    // Tips based on objective
                    if (objective === 'pousse') {
                      return "Astuce pousse : Masse ton cuir chevelu 5 min par jour avec une huile stimulante comme l'huile de ricin 🌱";
                    }
                    if (objective === 'definition') {
                      return "Astuce définition : Applique tes produits coiffants sur cheveux trempés et utilise la technique du 'praying hands' 🙏";
                    }
                    if (objective === 'hydratation') {
                      return "Astuce hydratation : Bois au moins 1,5L d'eau par jour - l'hydratation vient aussi de l'intérieur ! 💦";
                    }
                    
                    // Default tip
                    return "Astuce générale : La régularité est clé ! Mieux vaut une routine simple faite constamment qu'une routine complexe abandonnée 🎯";
                  })()}
                </p>
              </div>
          </CotonCard>
        </div>
      )}

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
    </div>
  );
}