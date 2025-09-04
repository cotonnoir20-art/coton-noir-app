import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Package, Users, Store, Video, Gift, Target, Sparkles, Check, Heart, Crown, Star, Sun, Zap, Music, Droplets, Diamond, TrendingUp, Calendar, Clock, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CoinAnimation, useCoinAnimation } from '@/components/ui/coin-animation';
import { BadgeNotification, BadgeDisplay, useBadgeSystem } from '@/components/ui/badge-system';
import { AIHairTip } from '@/components/ui/ai-hair-tip';
import { useApp, Badge as BadgeType, DailyChallenge } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { state, dispatch } = useApp();
  const [routineValidated, setRoutineValidated] = useState(false);

  // Système d'animations et badges
  const { shouldAnimate, amount, triggerCoinAnimation, resetAnimation } = useCoinAnimation();
  const { newBadge, isVisible: isBadgeVisible, showBadge, hideBadge } = useBadgeSystem();

  // Gestionnaire d'ajout de CotonCoins avec animation
  const handleAddCoins = (coinAmount: number) => {
    dispatch({ type: 'ADD_COINS', amount: coinAmount });
    dispatch({ type: 'TRIGGER_COIN_ANIMATION' });
    triggerCoinAnimation(coinAmount);
  };

  // Créer des badges automatiquement
  useEffect(() => {
    const checkAndAwardBadges = () => {
      const badges: BadgeType[] = [];

      // Badge premier soin
      if (state.journalEntries.length === 1 && !state.badges.find(b => b.id === 'first-care')) {
        badges.push({
          id: 'first-care',
          name: 'Première fois',
          description: 'Premier soin ajouté au journal',
          emoji: '✨',
          unlockedAt: new Date().toISOString(),
          category: 'routine'
        });
      }

      // Badge wash day
      if (state.washDayEntries.length === 1 && !state.badges.find(b => b.id === 'first-wash')) {
        badges.push({
          id: 'first-wash',
          name: 'Wash Day Master',
          description: 'Premier wash day enregistré',
          emoji: '💧',
          unlockedAt: new Date().toISOString(),
          category: 'wash'
        });
      }

      // Badge streak 7 jours
      if (state.streakData.current >= 7 && !state.badges.find(b => b.id === 'streak-7')) {
        badges.push({
          id: 'streak-7',
          name: 'Régularité',
          description: '7 jours consécutifs',
          emoji: '🔥',
          unlockedAt: new Date().toISOString(),
          category: 'streak'
        });
      }

      badges.forEach(badge => {
        dispatch({ type: 'ADD_BADGE', badge });
        setTimeout(() => showBadge(badge), 1000);
      });
    };

    checkAndAwardBadges();
  }, [state.journalEntries.length, state.washDayEntries.length, state.streakData.current, state.badges, dispatch, showBadge]);

  // Compléter un défi quotidien
  const handleCompleteChallenge = (challenge: DailyChallenge) => {
    if (challenge.completed) return;
    
    dispatch({ type: 'COMPLETE_DAILY_CHALLENGE', challengeId: challenge.id });
    handleAddCoins(challenge.reward);
    
    // Badge si premier défi
    if (state.dailyChallenges.filter(c => c.completed).length === 0) {
      const challengerBadge: BadgeType = {
        id: 'first-challenge',
        name: 'Défis Challenger',
        description: 'Premier défi quotidien complété',
        emoji: '🎯',
        unlockedAt: new Date().toISOString(),
        category: 'routine'
      };
      dispatch({ type: 'ADD_BADGE', badge: challengerBadge });
      setTimeout(() => showBadge(challengerBadge), 2000);
    }
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

  

  const handleValidateRoutine = () => {
    if (routineValidated) return;
    
    setRoutineValidated(true);
    handleAddCoins(10);
  };

  // Calculate stats
  const daysSinceLastCare = state.journalEntries.length > 0 ? Math.floor((Date.now() - new Date(state.journalEntries[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const boxProgress = Math.min(100, state.coins / 50 * 100);

  // Calculate monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const thisMonthCares = state.journalEntries.filter(entry => 
    entry.date.startsWith(currentMonth)
  ).length;
  
  const maskCount = state.journalEntries.filter(entry => 
    entry.title.toLowerCase().includes('masque') || 
    entry.note.toLowerCase().includes('masque')
  ).length;

  // Défis du jour
  const todaysChallenges = state.dailyChallenges.filter(
    c => c.date === new Date().toISOString().split('T')[0]
  );

  return <div className="pb-20 px-4 space-y-[10px] bg-[#fdf1e3] relative">
      {/* Animations */}
      <CoinAnimation 
        amount={amount} 
        trigger={shouldAnimate} 
        onComplete={resetAnimation}
      />
      
      <BadgeNotification 
        badge={newBadge} 
        isVisible={isBadgeVisible} 
        onClose={hideBadge}
      />

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

      {/* AI Hair Tip for users without profile */}
      {!state.detailedHairProfile.isCompleted && (
        <AIHairTip 
          tipType="general" 
          context="conseil général pour débuter dans les soins capillaires"
          variant="featured"
          showRefresh={true}
        />
      )}

      {/* Défis quotidiens */}
      {todaysChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 mt-[20px]"
        >
          <h3 className="font-poppins font-semibold text-lg flex items-center gap-2 mt-[16px]">
            <Trophy className="text-yellow-500" size={20} />
            Défis du jour
          </h3>
          
          {/* Défis non complétés (normaux) */}
          {todaysChallenges.filter(c => !c.completed).map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CotonCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold text-sm">
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="text-orange-600 font-bold text-sm">
                        +{challenge.reward} CC
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCompleteChallenge(challenge)}
                        className="text-xs hover-scale"
                      >
                        Valider
                      </Button>
                    </div>
                  </div>
                </div>
              </CotonCard>
            </motion.div>
          ))}
          
          {/* Défis complétés (version compacte) */}
          {todaysChallenges.filter(c => c.completed).length > 0 && (
            <motion.div
              initial={{ height: 'auto' }}
              animate={{ 
                height: 'auto',
                scale: 0.85,
                opacity: 0.7
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-2"
            >
              <CotonCard className="p-3 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check size={14} />
                    </div>
                    <span className="text-sm font-poppins font-medium text-green-700">
                      {todaysChallenges.filter(c => c.completed).length} défi{todaysChallenges.filter(c => c.completed).length > 1 ? 's' : ''} complété{todaysChallenges.filter(c => c.completed).length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <motion.span
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      ✅
                    </motion.span>
                    <span className="font-bold">
                      +{todaysChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0)} CC
                    </span>
                  </div>
                </div>
              </CotonCard>
            </motion.div>
          )}
        </motion.div>
      )}

      
      
      {/* Level & Goal Card */}
      <CotonCard className="p-6 space-y-4 mt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins font-semibold text-lg">Niveau & Objectif</h3>
          <div 
            className={(() => {
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
              return `${needData.classes} px-3 py-1 rounded-full text-sm font-roboto font-medium flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`;
            })()}
            onClick={onShowProfile}
          >
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
                <span className="font-poppins font-medium text-foreground">
                  {currentLevel.name} {currentLevel.emoji}
                </span>
              </>
            );
          })()}
        </div>
        
        <p className="text-sm font-roboto text-muted-foreground">
          Encore <span className="font-medium text-foreground">{(() => {
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
      
      {/* Mon suivi - Section fusionnée */}
      <div className="space-y-4">
        <h3 className="font-poppins font-semibold text-lg">Mon suivi</h3>
        <div className="grid grid-cols-2 gap-3">
          <CotonCard className="p-4 text-center">
            <div className="text-xl font-poppins font-bold text-coton-rose">
              {state.journalEntries.length}
            </div>
            <div className="text-xs text-muted-foreground">Soins total</div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-xl font-poppins font-bold text-blue-600">
              {thisMonthCares}
            </div>
            <div className="text-xs text-muted-foreground">Ce mois-ci</div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-xl font-poppins font-bold text-purple-600">
              {state.streakData.current}
            </div>
            <div className="text-xs text-muted-foreground">Jours streak</div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-xl font-poppins font-bold text-green-600">
              {daysSinceLastCare === 0 ? "Aujourd'hui" : `${daysSinceLastCare}j`}
            </div>
            <div className="text-xs text-muted-foreground">Dernier soin</div>
          </CotonCard>
        </div>
      </div>
      {state.detailedHairProfile.isCompleted && personalizedRoutine.length > 0 && (
        <div key={`routine-${state.detailedHairProfile.hairType}-${state.detailedHairProfile.porosity}-${state.detailedHairProfile.objective}-${state.detailedHairProfile.problems?.join(',')}-${state.detailedHairProfile.needs?.join(',')}`} className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Ma routine recommandée ✨</h3>
          
          <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50 space-y-4">
            {/* Profile Summary */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-coton-rose/20">
              <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                {state.detailedHairProfile.hairType}
              </span>
              {state.detailedHairProfile.porosity && (
                <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                  Porosité {state.detailedHairProfile.porosity}
                </span>
              )}
              {state.detailedHairProfile.objective && (
                <span className="px-3 py-1 bg-white/70 rounded-full text-sm font-roboto">
                  Objectif: {state.detailedHairProfile.objective}
                </span>
              )}
              {state.detailedHairProfile.problems && state.detailedHairProfile.problems.length > 0 && (
                state.detailedHairProfile.problems.map((problem, index) => (
                   <span 
                     key={`problem-${index}`} 
                     className="px-3 py-1 bg-red-100/70 rounded-full text-sm font-roboto text-red-700 cursor-pointer hover:bg-red-200/70 transition-colors" 
                     onClick={onShowProfile}
                   >
                    {problem}
                  </span>
                ))
              )}
              {state.detailedHairProfile.needs && state.detailedHairProfile.needs.length > 0 && (
                state.detailedHairProfile.needs.map((need, index) => (
                   <span 
                     key={`need-${index}`} 
                     className="px-3 py-1 bg-green-100/70 rounded-full text-sm font-roboto text-green-700 cursor-pointer hover:bg-green-200/70 transition-colors" 
                     onClick={onShowProfile}
                   >
                    {need}
                  </span>
                ))
              )}
            </div>
            
            {/* Routine Steps */}
            <div className="space-y-3">
              {personalizedRoutine.slice(0, 4).map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
                  <div className="w-8 h-8 rounded-full bg-coton-rose flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-roboto text-sm text-foreground">
                    {step}
                  </span>
                </div>
              ))}
              
              {personalizedRoutine.length > 4 && (
                <button
                  onClick={() => onNavigate('detailed-routine')}
                  className="w-full p-3 rounded-lg bg-coton-rose/20 border-2 border-dashed border-coton-rose hover:bg-coton-rose/30 transition-colors"
                >
                  <span className="font-roboto text-sm text-foreground font-semibold">
                    Voir la routine complète (+{personalizedRoutine.length - 4} étapes)
                  </span>
                </button>
              )}
            </div>
            
            {/* AI-Generated Hair Tip */}
            <div className="mt-3">
              <AIHairTip 
                tipType="routine" 
                context="routine personnalisée basée sur le profil capillaire"
                variant="default"
                showRefresh={true}
              />
            </div>
          </CotonCard>
        </div>
      )}
      
      
      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h3 className="font-poppins font-semibold text-lg">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-4">
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
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('box')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Package className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Box Digitale</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('partners')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Store className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Partenaires</span>
            </div>
          </CotonCard>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CotonCard className="p-6 cursor-pointer hover:shadow-soft transition-shadow" onClick={() => onNavigate('community')}>
            <div className="flex flex-col items-center text-center space-y-3">
              <Users className="text-coton-rose" size={32} />
              <span className="font-poppins font-medium">Communauté</span>
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
        
        {state.coins >= 50 ? <div className="text-center py-4">
            <p className="font-roboto text-muted-foreground">
              ✨ Box incluse - débloquez la maintenant !
            </p>
          </div> : <div className="space-y-3">
            <ProgressBar progress={boxProgress} variant="coins" showLabel label={`Box Digitale - ${state.coins}/50 CC`} />
            <Button variant="coin" size="sm" onClick={() => onNavigate('box')} disabled={state.coins < 50} className="w-full">
              {state.coins >= 50 ? 'Débloquer maintenant' : `Plus que ${50 - state.coins} CC`}
            </Button>
          </div>}
      </CotonCard>

      {/* Streak & Badges */}
      {(state.streakData.current > 0 || state.badges.length > 0) && (
        <CotonCard className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="space-y-3">
            {state.streakData.current > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                  <Flame className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold">
                    Streak de {state.streakData.current} jour{state.streakData.current > 1 ? 's' : ''} ! 🔥
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Meilleur: {state.streakData.best} jours
                  </p>
                </div>
              </div>
            )}
            
            {state.badges.length > 0 && (
              <div>
                <h4 className="font-poppins font-medium mb-2 text-sm">Tes badges:</h4>
                <BadgeDisplay badges={state.badges} />
              </div>
            )}
          </div>
        </CotonCard>
      )}
    </div>;
}