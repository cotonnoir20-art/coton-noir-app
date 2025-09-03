import React, { useMemo } from 'react';
import { Plus, Package, Users, Store, Video, Gift, Target, Sparkles, Check } from 'lucide-react';
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
    
    const { porosity, objective, problems, needs } = state.detailedHairProfile;
    let steps = [];
    
    // Base routine according to porosity
    if (porosity === 'faible') {
      steps = ['Pré-poo léger', 'Shampoing clarifiant doux', 'Masque protéiné léger', 'Leave-in fluide', 'Scellage avec huile légère'];
    } else if (porosity === 'moyenne') {
      steps = ['Pré-poo', 'Shampoing hydratant', 'Masque équilibré', 'Leave-in crémeux', 'Scellage mixte'];
    } else if (porosity === 'haute') {
      steps = ['Pré-poo nourrissant', 'Co-wash ou shampoing doux', 'Masque hydratant intensif', 'Leave-in riche', 'Scellage avec beurre'];
    }
    
    // Adapt based on problems
    if (problems.includes('secheresse')) {
      steps.splice(2, 1, 'Masque hydratant intensif');
    }
    if (problems.includes('casse')) {
      steps.splice(1, 0, 'Traitement protéiné');
    }
    if (problems.includes('cuir_chevelu')) {
      steps.unshift('Massage du cuir chevelu');
    }
    
    // Adapt based on needs
    if (needs.includes('definition')) {
      steps.push('Crème coiffante définition');
    }
    if (needs.includes('brillance')) {
      steps.push('Sérum brillance');
    }
    
    return steps.slice(0, 5); // Limit to 5 steps max
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
      <CotonCard className="p-6 space-y-4">
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
          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          <span className="font-poppins font-medium text-coton-black">Curlie Cutie</span>
        </div>
        
        <p className="text-sm font-roboto text-muted-foreground">
          Encore <span className="font-medium text-coton-black">2400 CotonCoins 🪙</span> avant ton prochain palier ! 🔥
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
            
            {/* Validation Button */}
            <div className="pt-4 border-t border-coton-rose/20">
              <Button 
                variant={routineValidated ? "outline" : "hero"} 
                size="sm" 
                onClick={handleValidateRoutine}
                disabled={routineValidated}
                className="w-full"
              >
                {routineValidated ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Routine validée ✓
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    ✅ Routine validée (+10 CC)
                  </>
                )}
              </Button>
              
              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                <p className="text-xs font-roboto text-center text-muted-foreground">
                  <strong>Gamification & progression :</strong> tes points débloquent des contenus exclusifs
                </p>
              </div>
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