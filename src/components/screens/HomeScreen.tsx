import React, { useMemo } from 'react';
import { Plus, Package, Users, Store, Video, Gift, Target, Sparkles, Check, Heart, Crown, Star, Sun, Zap, Music, Droplets, Diamond, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useApp } from '@/contexts/AppContext';
interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onAddCare: () => void;
  onShowProfile: () => void;
}
export function HomeScreen({
  onNavigate,
  onAddCare,
  onShowProfile
}: HomeScreenProps) {
  const {
    state,
    dispatch
  } = useApp();

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

  const [routineValidated, setRoutineValidated] = React.useState(false);

  const handleValidateRoutine = () => {
    if (routineValidated) return;
    
    setRoutineValidated(true);
    dispatch({ type: 'ADD_COINS', amount: 10 });
  };

  // Calculate stats
  const thisMonthCares = state.journalEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
  }).length;
  const maskCount = state.journalEntries.filter(entry => entry.title.toLowerCase().includes('masque') || entry.note.toLowerCase().includes('masque')).length;
  const daysSinceLastCare = state.journalEntries.length > 0 ? Math.floor((Date.now() - new Date(state.journalEntries[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const boxProgress = state.premium ? 100 : Math.min(100, state.coins / 50 * 100);
  return <div className="pb-20 px-4 space-y-6 bg-[#fdf1e3]">
      {/* Hair Profile Reminder */}
      {!state.hairProfile.isCompleted && <CotonCard variant="premium" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-white mb-1">
                Personnalise ton expérience ✨
              </h3>
              <p className="text-white/90 text-sm font-roboto">
                Définis ton profil capillaire pour des conseils adaptés
              </p>
            </div>
            <Button variant="rose" size="sm" onClick={onShowProfile}>
              Compléter
            </Button>
          </div>
        </CotonCard>}
      
      {/* Premium Upsell (if not premium) */}
      {!state.premium && <CotonCard variant="premium" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-bold text-lg text-white mb-2">
                Premium Coton Noir
              </h3>
              <p className="text-white/90 text-sm font-roboto mb-1">
                Double tes CotonCoins, Box illimitée,
              </p>
              <p className="text-white/90 text-sm font-roboto">
                remises partenaires boostées.
              </p>
              <p className="text-white font-poppins font-medium text-lg mt-2">
                Dès 3,99€/mois
              </p>
            </div>
            <Button variant="rose" onClick={() => onNavigate('premium')} className="shrink-0">
              Découvrir
            </Button>
          </div>
        </CotonCard>}
      
      {/* Level & Goal Card */}
      <CotonCard className="p-6 space-y-4 mt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins font-semibold text-lg">Niveau & Objectif</h3>
          <div className={(() => {
            const needsMap = {
              'hydratation': { 
                text: 'Hydratation 💧', 
                classes: 'bg-blue-100 text-blue-600' 
              },
              'volume': { 
                text: 'Volume 🌸', 
                classes: 'bg-pink-100 text-pink-600' 
              },
              'definition': { 
                text: 'Définition ✨', 
                classes: 'bg-purple-100 text-purple-600' 
              },
              'croissance': { 
                text: 'Croissance 🌱', 
                classes: 'bg-green-100 text-green-600' 
              },
              'casse': { 
                text: 'Anti-casse 💪', 
                classes: 'bg-orange-100 text-orange-600' 
              },
              'brillance': { 
                text: 'Brillance 🌟', 
                classes: 'bg-yellow-100 text-yellow-600' 
              }
            };
            const primaryNeed = state.hairProfile.needs[0];
            const needData = primaryNeed ? needsMap[primaryNeed as keyof typeof needsMap] : needsMap['hydratation'];
            return `${needData.classes} px-3 py-1 rounded-full text-sm font-roboto font-medium flex items-center gap-1`;
          })()}>
            {(() => {
              const needsMap = {
                'hydratation': 'Hydratation 💧',
                'volume': 'Volume 🌸',
                'definition': 'Définition ✨',
                'croissance': 'Croissance 🌱',
                'casse': 'Anti-casse 💪',
                'brillance': 'Brillance 🌟'
              };
              const primaryNeed = state.hairProfile.needs[0];
              return primaryNeed ? needsMap[primaryNeed as keyof typeof needsMap] || 'Soin capillaire ✨' : 'Hydratation 💧';
            })()}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(() => {
            const currentCoins = state.coins;
            const levels = [
              { name: 'Baby Hair', min: 0, max: 500, emoji: '✨', color: '#F7B6D2', icon: Sparkles },
              { name: 'Curlie Cutie', min: 501, max: 1000, emoji: '💖', color: '#C9A7EB', icon: Heart },
              { name: 'Afro Queenie', min: 1001, max: 2500, emoji: '👑', color: '#FFD166', icon: Crown },
              { name: 'Glow Fro', min: 2501, max: 5000, emoji: '🌟', color: '#FEE440', icon: Sun },
              { name: 'Crown Vibes', min: 5001, max: 7500, emoji: '👑💕', color: '#FF6F91', icon: Crown },
              { name: 'Slay Braidy', min: 7501, max: 10000, emoji: '🧵🔥', color: '#06D6A0', icon: Zap },
              { name: 'Kinky Diva', min: 10001, max: 15000, emoji: '💃🏾', color: '#9B5DE5', icon: Music },
              { name: 'Twist & Shine', min: 15001, max: 20000, emoji: '💫', color: '#FF9770', icon: Star },
              { name: 'Wash Day Goddess', min: 20001, max: 30000, emoji: '🛁👸🏾', color: '#26547C', icon: Droplets },
              { name: 'Afrolicious Icon', min: 30001, max: Infinity, emoji: '🔥💎', color: '#FFD700', icon: Diamond }
            ];
            
            const currentLevel = levels.find(level => currentCoins >= level.min && currentCoins <= level.max) || levels[0];
            const IconComponent = currentLevel.icon;
            
            return (
              <>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: currentLevel.color }}
                  ></div>
                  <IconComponent 
                    size={16} 
                    style={{ color: currentLevel.color }}
                  />
                </div>
                <span className="font-poppins font-medium text-coton-black">
                  {currentLevel.name} {currentLevel.emoji}
                </span>
              </>
            );
          })()}
        </div>
        
        <p className="text-sm font-roboto text-muted-foreground">
          Encore <span className="font-medium text-coton-black">{(() => {
            const currentCoins = state.coins;
            const levelThresholds = [501, 1001, 2501, 5001, 7501, 10001, 15001, 20001, 30001];
            const nextThreshold = levelThresholds.find(threshold => threshold > currentCoins);
            
            if (!nextThreshold) {
              return 0; // Niveau maximum atteint
            }
            
            const coinsNeeded = nextThreshold - currentCoins;
            return coinsNeeded;
          })()} CotonCoins 🪙</span> avant ton prochain palier ! 🔥
        </p>
        
        <Button variant="hero" size="lg" onClick={onAddCare} className="w-full">
          <Plus size={20} />
          Ajouter un soin
        </Button>
      </CotonCard>
      
      {/* Personalized Routine Section */}
      {state.detailedHairProfile.isCompleted && personalizedRoutine.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Ma routine recommandée ✨</h3>
          
          <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50 space-y-4">
            {/* Profile Summary */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-coton-rose/20">
              <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                {state.detailedHairProfile.hairType}
              </span>
              <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                Porosité {state.detailedHairProfile.porosity}
              </span>
              <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                Objectif: {state.detailedHairProfile.objective}
              </span>
            </div>
            
            {/* Routine Steps */}
            <div className="space-y-3">
              {personalizedRoutine.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                  <div className="w-8 h-8 rounded-full bg-coton-rose flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-roboto text-sm text-coton-black">
                    {step}
                  </span>
                </div>
              ))}
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
      
      {/* Stats Section */}
      <div className="space-y-4">
        <h3 className="font-poppins font-semibold text-lg">Mon suivi</h3>
        <div className="grid grid-cols-3 gap-4">
          <CotonCard className="p-4 text-center">
            <div className="text-2xl font-poppins font-bold text-coton-black">
              {thisMonthCares}
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Soins ce mois-ci
            </div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-2xl font-poppins font-bold text-coton-black">
              {maskCount}
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Masques
            </div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-2xl font-poppins font-bold text-coton-black">
              {daysSinceLastCare}j
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Depuis le dernier soin
            </div>
          </CotonCard>
        </div>
      </div>
      
      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h3 className="font-poppins font-semibold text-lg">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-4">
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('box')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Package className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Box Digitale</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('community')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Users className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Communauté</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('partners')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Store className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Partenaires</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('wash-day-tracker')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Calendar className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Wash Day Tracker</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('growth-tracker')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <TrendingUp className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Calculateur de Pousse</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('tutorials')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Video className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Tutos</span>
            </div>
          </CotonCard>
        </div>
      </div>
      
      {/* Next Reward */}
      <CotonCard className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="text-coton-rose" size={24} />
          <h3 className="font-poppins font-semibold text-lg">Prochaine récompense</h3>
        </div>
        
        {state.premium ? <div className="text-center py-4">
            <p className="font-roboto text-muted-foreground">
              ✨ Box incluse avec Premium
            </p>
          </div> : <div className="space-y-3">
            <ProgressBar progress={boxProgress} variant="coins" showLabel label={`Box Digitale - ${state.coins}/50 CC`} />
            <Button variant="coin" size="sm" onClick={() => onNavigate('box')} disabled={state.coins < 50} className="w-full">
              {state.coins >= 50 ? 'Débloquer maintenant' : `Plus que ${50 - state.coins} CC`}
            </Button>
          </div>}
      </CotonCard>
    </div>;
}