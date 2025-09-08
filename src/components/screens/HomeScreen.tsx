import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Package, Users, Store, Video, Gift, Target, Sparkles, Check, Heart, Crown, Star, Sun, Zap, Music, Droplets, Diamond, TrendingUp, Calendar, Clock, Trophy, Flame, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CoinAnimation, useCoinAnimation } from '@/components/ui/coin-animation';
import { BadgeNotification, BadgeDisplay, useBadgeSystem } from '@/components/ui/badge-system';
import { AIHairTip } from '@/components/ui/ai-hair-tip';
import { PremiumBadge, PremiumFeature } from '@/components/ui/premium-badge';
import { useApp, Badge as BadgeType, DailyChallenge } from '@/contexts/AppContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
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
  const {
    state,
    dispatch
  } = useApp();
  const { subscribed, subscriptionTier } = useSubscription();
  const [routineValidated, setRoutineValidated] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(true);
  const [personalizedRoutine, setPersonalizedRoutine] = useState<string[]>([]);
  const [prioritySteps, setPrioritySteps] = useState<number[]>([]);
  const [routineTip, setRoutineTip] = useState<string>('');
  const [routineLoading, setRoutineLoading] = useState(false);
  const [aiTipsCount, setAiTipsCount] = useState(0);
  
  const isPremium = subscriptionTier === 'premium';

  // Système d'animations et badges
  const {
    shouldAnimate,
    amount,
    triggerCoinAnimation,
    resetAnimation
  } = useCoinAnimation();
  const {
    newBadge,
    isVisible: isBadgeVisible,
    showBadge,
    hideBadge
  } = useBadgeSystem();

  // Gestionnaire d'ajout de CotonCoins avec animation
  const handleAddCoins = (coinAmount: number) => {
    dispatch({
      type: 'ADD_COINS',
      amount: coinAmount
    });
    dispatch({
      type: 'TRIGGER_COIN_ANIMATION'
    });
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
        dispatch({
          type: 'ADD_BADGE',
          badge
        });
        setTimeout(() => showBadge(badge), 1000);
      });
    };
    checkAndAwardBadges();
  }, [state.journalEntries.length, state.washDayEntries.length, state.streakData.current, state.badges, dispatch, showBadge]);

  // Compléter un défi quotidien
  const handleCompleteChallenge = (challenge: DailyChallenge) => {
    if (challenge.completed) return;
    dispatch({
      type: 'COMPLETE_DAILY_CHALLENGE',
      challengeId: challenge.id
    });
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
      dispatch({
        type: 'ADD_BADGE',
        badge: challengerBadge
      });
      setTimeout(() => showBadge(challengerBadge), 2000);
    }
  };

  // Générer la routine personnalisée avec système hybride (API + fallback local)
  useEffect(() => {
    if (!state.detailedHairProfile.isCompleted) {
      setPersonalizedRoutine([]);
      setPrioritySteps([]);
      setRoutineTip('');
      return;
    }

    const generateRoutine = async () => {
      setRoutineLoading(true);
      try {
        // Tentative avec l'API OpenAI d'abord
        const { data, error } = await supabase.functions.invoke('generate-personalized-routine', {
          body: { profile: state.detailedHairProfile }
        });

        if (error) throw error;

        setPersonalizedRoutine(data.steps || []);
        setPrioritySteps(data.prioritySteps || []);
        setRoutineTip(data.tip || '');
      } catch (error) {
        console.log('API indisponible, utilisation du système local intelligent:', error);
        
        // SYSTÈME DE FALLBACK LOCAL INTELLIGENT
        // Priorité ABSOLUE aux données du profil capillaire détaillé
        const profile = state.detailedHairProfile;
        const { hairType, porosity, objective, problems = [], needs = [] } = profile;
        
        let steps: string[] = [];
        let priorityIndices: number[] = [];
        let tip = '';

        // Génération basée sur le type ET la porosité (données prioritaires du profil)
        if (hairType === '3C') {
          if (porosity === 'faible') {
            steps = ['Pré-poo aux huiles légères (jojoba, argan)', 'Shampoing sans sulfates doux', 'Masque hydratant léger', 'Leave-in crémeux léger', 'Gel définition pour boucles'];
          } else if (porosity === 'moyenne') {
            steps = ['Pré-poo nourrissant (avocat, coco)', 'Co-wash hydratant', 'Masque protéines/hydratation alterné', 'Crème leave-in équilibrée', 'Gel ou mousse définition'];
          } else { // haute
            steps = ['Pré-poo riche (beurre de karité)', 'Co-wash crémeux', 'Masque hydratant intensif', 'Crème riche nourrissante', 'Gel épais ou crème coiffante'];
          }
        } else if (hairType === '4A') {
          if (porosity === 'faible') {
            steps = ['Pré-poo léger ciblé', 'Shampoing clarifiant doux', 'Masque équilibré protéines/hydratation', 'Leave-in fluide pénétrant', 'Crème définition légère'];
          } else if (porosity === 'moyenne') {
            steps = ['Pré-poo aux beurres végétaux', 'Shampoing hydratant sans sulfates', 'Masque nourrissant profond', 'Leave-in crémeux riche', 'Beurre de karité + huile'];
          } else { // haute
            steps = ['Pré-poo ultra-riche overnight', 'Co-wash ou shampoing très doux', 'Masque réparateur intensif', 'Crème très épaisse', 'Scellage beurre + huile lourde'];
          }
        } else if (hairType === '4B') {
          if (porosity === 'faible') {
            steps = ['Massage stimulant cuir chevelu', 'Shampoing hydratant pénétrant', 'Masque protéiné léger', 'Leave-in riche mais fluide', 'Huile scellante légère'];
          } else if (porosity === 'moyenne') {
            steps = ['Pré-poo nourrissant 30min', 'Co-wash crémeux hydratant', 'Masque hydratant profond', 'Crème leave-in épaisse', 'Beurre de karité pur'];
          } else { // haute
            steps = ['Bain d\'huiles chaud 1h', 'Co-wash uniquement', 'Masque ultra-nourrissant', 'Crème très riche', 'Scellage beurre épais'];
          }
        } else if (hairType === '4C') {
          if (porosity === 'faible') {
            steps = ['Pré-poo prolongé avec chaleur', 'Shampoing très doux rare', 'Masque protéiné doux mensuel', 'Crème leave-in riche pénétrante', 'Huile + beurre léger'];
          } else if (porosity === 'moyenne') {
            steps = ['Bain d\'huiles chaud prolongé', 'Co-wash exclusivement', 'Masque réparateur bi-hebdomadaire', 'Crème très épaisse', 'Méthode LOC complète'];
          } else { // haute
            steps = ['Pré-poo overnight système', 'Co-wash ultra-doux', 'Masque ultra-hydratant quotidien', 'Crème la plus riche', 'Méthode LCO renforcée'];
          }
        } else if (hairType === 'LOCKS') {
          // Routine spécifique aux locks/dreadlocks
          if (porosity === 'faible') {
            steps = ['Nettoyage cuir chevelu eau tiède', 'Shampoing résidu-free dilué', 'Rinçage abondant locks', 'Huile légère cuir chevelu', 'Séchage complet obligatoire'];
          } else if (porosity === 'moyenne') {
            steps = ['Pré-nettoyage cuir chevelu', 'Shampoing clarifiant doux', 'Rinçage méticuleux', 'Huile nourrissante légère', 'Séchage air libre complet'];
          } else { // haute
            steps = ['Nettoyage en profondeur', 'Shampoing sans résidus', 'Double rinçage locks', 'Traitement cuir chevelu', 'Séchage intégral essentiel'];
          }
        }

        // ADAPTATION PRIORITAIRE selon l'objectif du profil
        if (objective === 'pousse') {
          steps.unshift('Massage stimulant cuir chevelu 5min');
          steps.push('Traitement fortifiant pointes');
          steps.push('Huile de ricin sur cuir chevelu 2x/semaine');
          priorityIndices.push(0, steps.length - 2, steps.length - 1);
          tip = 'Stimulation pousse : Masse quotidiennement ton cuir chevelu avec des huiles stimulantes et protège tes pointes fragiles pour maximiser la rétention de longueur.';
        } else if (objective === 'souplesse') {
          steps[2] = 'Masque assouplissant à base de miel';
          steps.push('Leave-in assouplissant sans rinçage');
          steps.push('Technique étirement doux sur cheveux humides');
          priorityIndices.push(2, steps.length - 2, steps.length - 1);
          tip = 'Améliorer la souplesse : Les masques à base de miel et glycérine aident à assouplir tes cheveux ' + hairType + '. Évite la manipulation excessive.';
        } else if (objective === 'sante') {
          steps.splice(1, 0, 'Clarification mensuelle douce');
          steps[3] = 'Masque équilibré protéines/hydratation';
          steps.push('Protection UV quotidienne');
          steps.push('Traitement réparateur pointes');
          priorityIndices.push(1, 3, steps.length - 2, steps.length - 1);
          tip = 'Santé capillaire globale : Équilibrez protéines et hydratation, protégez du soleil et réparez les dommages pour des cheveux sains et forts.';
        } else if (objective === 'decoloration') {
          steps.splice(1, 0, 'Traitement protéiné reconstructeur');
          steps[3] = 'Masque réparateur pigments';
          steps.push('Soin anti-casse décoloration');
          steps.push('Protection couleur UV');
          priorityIndices.push(1, 3, steps.length - 2, steps.length - 1);
          tip = 'Soins décoloration : Reconstruis la structure avec des protéines, maintiens l\'hydratation et protège tes pigments du soleil.';
        } else if (objective === 'protection') {
          steps.unshift('Préparation coiffure protectrice');
          steps.push('Hydratation intensive avant tressage');
          steps.push('Huile protectrice sur longueurs');
          steps.push('Nettoyage cuir chevelu sous coiffure');
          priorityIndices.push(0, steps.length - 3, steps.length - 2, steps.length - 1);
          tip = 'Coiffures protectrices : Hydratez intensément avant le tressage, protégez les longueurs et maintenez la propreté du cuir chevelu sous la coiffure.';
        } else if (objective === 'routine_protective') {
          steps.unshift('Nettoyage cuir chevelu sous coiffure');
          steps.splice(1, 0, 'Shampoing clarifiant doux dilué');
          steps.push('Hydratation racines accessibles');
          steps.push('Huile nourrissante cuir chevelu');
          steps.push('Surveillance état coiffure');
          priorityIndices.push(0, 1, steps.length - 3, steps.length - 2, steps.length - 1);
          tip = 'Routine sous protective styles : Maintiens l\'hygiène du cuir chevelu, hydrate les zones accessibles et surveille l\'état de ta coiffure pour éviter les dommages.';
        }

        // ADAPTATIONS selon les problèmes spécifiques (PRIORITÉ MAXIMALE)
        problems.forEach((problem, index) => {
          switch(problem) {
            case 'secheresse':
              steps[2] = 'Masque hydratant ultra-nourrissant';
              steps.push('Brumisateur hydratant quotidien');
              priorityIndices.push(2);
              break;
            case 'casse':
              steps.splice(1, 0, 'Traitement protéiné anti-casse');
              steps.push('Soin réparateur pointes');
              priorityIndices.push(1, steps.length - 1);
              break;
            case 'frisottis':
              steps.push('Sérum anti-frisottis sans rinçage');
              steps[3] = 'Leave-in lissant anti-frisottis';
              priorityIndices.push(3, steps.length - 1);
              break;
            case 'demelage':
              steps.splice(1, 0, 'Conditioner démêlant professionnel');
              steps.push('Huile démêlante avant coiffage');
              priorityIndices.push(1);
              break;
            case 'cuir_chevelu':
              steps.unshift('Massage apaisant cuir chevelu');
              steps[1] = 'Shampoing apaisant sans sulfates';
              priorityIndices.push(0, 1);
              break;
            case 'chute':
              steps.unshift('Massage anti-chute stimulant');
              steps.push('Sérum fortifiant cuir chevelu');
              priorityIndices.push(0, steps.length - 1);
              break;
          }
        });

        // Tip personnalisé selon les problèmes prioritaires
        if (problems.length > 0) {
          const mainProblem = problems[0];
          const problemTips = {
            'secheresse': `Hydratation priority : Avec votre porosité ${porosity}, sceller l'hydratation est crucial. Utilisez des produits riches et évitez les sulfates.`,
            'casse': `Protection maximale : Vos cheveux ${hairType} sont fragiles. Dormez avec une taie en satin et manipulez délicatement.`,
            'frisottis': `Contrôle frisottis : Pour vos cheveux ${hairType}, gardez-les toujours hydratés et évitez les frottements.`,
            'demelage': `Démêlage facilité : Sur cheveux ${hairType}, démêlez toujours sur cheveux humides avec beaucoup de conditioner.`,
            'cuir_chevelu': `Cuir chevelu sain : Massez régulièrement et utilisez des produits doux adaptés à votre sensibilité.`,
            'chute': `Anti-chute actif : Stimulez la circulation et renforcez avec des soins protéinés doux mais réguliers.`
          };
          tip = problemTips[mainProblem as keyof typeof problemTips] || tip;
        }

        // Limiter à 6 étapes max et garder les priorités
        if (steps.length > 6) {
          steps = steps.slice(0, 6);
          priorityIndices = priorityIndices.filter(i => i < 6);
        }

        setPersonalizedRoutine(steps);
        setPrioritySteps(priorityIndices);
        setRoutineTip(tip || `Routine adaptée à tes cheveux ${hairType} avec porosité ${porosity}. Reste consistante dans ta routine !`);
      } finally {
        setRoutineLoading(false);
      }
    };

    generateRoutine();
  }, [
    state.detailedHairProfile.isCompleted,
    state.detailedHairProfile.hairType,
    state.detailedHairProfile.porosity,
    state.detailedHairProfile.objective,
    JSON.stringify(state.detailedHairProfile.problems),
    JSON.stringify(state.detailedHairProfile.needs)
  ]);

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
  const thisMonthCares = state.journalEntries.filter(entry => entry.date.startsWith(currentMonth)).length;
  const maskCount = state.journalEntries.filter(entry => entry.title.toLowerCase().includes('masque') || entry.note.toLowerCase().includes('masque')).length;

  // Défis du jour
  const todaysChallenges = state.dailyChallenges.filter(c => c.date === new Date().toISOString().split('T')[0]);
  return <div className="pb-20 px-4 space-y-6 relative mb-px">
      {/* Animations */}
      <CoinAnimation amount={amount} trigger={shouldAnimate} onComplete={resetAnimation} />
      
      <BadgeNotification badge={newBadge} isVisible={isBadgeVisible} onClose={hideBadge} />

      {/* Hair Profile Reminder */}
      {!state.hairProfile.isCompleted && <CotonCard variant="premium" className="p-4">
          <div className="flex items-center justify-between animate-slide-up">
            <div>
              <h3 className="font-poppins font-bold text-white mb-2 text-lg">
                Personnalise ton expérience ✨
              </h3>
              <p className="text-white/95 text-sm font-roboto font-medium">
                Définis ton profil capillaire pour des conseils adaptés
              </p>
            </div>
            <Button variant="black" size="sm" onClick={onShowProfile} className="hover:scale-[1.05] shadow-card">
              Compléter
            </Button>
          </div>
        </CotonCard>}

      {/* Section de salutation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6"
      >
        <CotonCard className="p-4 bg-gradient-to-r from-coton-beige-light/80 to-white/90 border-0 shadow-card">
          <h2 className="text-xl font-poppins font-bold text-foreground">
            Hello {state.userProfile?.name || 'Belle'}! 👋
          </h2>
          <p className="text-sm text-muted-foreground font-roboto mt-1">
            Prête pour une belle journée capillaire ?
          </p>
        </CotonCard>
      </motion.div>

      {/* Défis quotidiens - Encart dépliable */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6"
      >
        <CotonCard className="overflow-hidden shadow-elegant hover:shadow-premium transition-all duration-400">
          {/* Header cliquable */}
          <button
            onClick={() => setChallengesExpanded(!challengesExpanded)}
            className="w-full p-5 flex items-center justify-between hover:bg-muted/60 transition-all duration-300 hover:scale-[1.01] transform-gpu"
          >
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500 animate-glow" size={22} />
              <div className="text-left">
                <h3 className="font-poppins font-bold text-lg">Défis du jour</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {todaysChallenges.filter(c => !c.completed).length} en cours • {todaysChallenges.filter(c => c.completed).length} validés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {todaysChallenges.filter(c => c.completed).length > 0 && (
                <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded-full">
                  +{todaysChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0)} CC
                </span>
              )}
              {challengesExpanded ? (
                <ChevronDown size={20} className="text-muted-foreground transition-transform duration-300" />
              ) : (
                <ChevronRight size={20} className="text-muted-foreground transition-transform duration-300" />
              )}
            </div>
          </button>

          {/* Contenu dépliable */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              challengesExpanded 
                ? 'max-h-[1000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Défis en cours */}
              {todaysChallenges.filter(c => !c.completed).length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-poppins font-medium text-sm text-orange-600 flex items-center gap-1">
                    <Target size={14} />
                    En cours
                  </h4>
                  {todaysChallenges.filter(c => !c.completed).map((challenge, index) => (
                    <motion.div 
                      key={challenge.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 shadow-card hover:shadow-elegant transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-poppins font-bold text-base text-orange-900">
                            {challenge.title}
                          </h5>
                          <p className="text-sm text-orange-700 mt-1 font-medium">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-orange-600 font-bold text-base mb-2 bg-orange-100 px-2 py-1 rounded-full">
                            +{challenge.reward} CC
                          </div>
                          <Button 
                            size="sm" 
                            variant="black" 
                            onClick={() => handleCompleteChallenge(challenge)} 
                            className="text-xs hover:scale-[1.05] shadow-card"
                          >
                            Valider
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Défis validés */}
              {todaysChallenges.filter(c => c.completed).length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-poppins font-medium text-sm text-green-600 flex items-center gap-1">
                    <Check size={14} />
                    Validés aujourd'hui
                  </h4>
                  {todaysChallenges.filter(c => c.completed).map((challenge, index) => (
                    <div 
                      key={challenge.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white flex items-center justify-center shadow-card">
                            <Check size={14} />
                          </div>
                          <div>
                            <h5 className="font-poppins font-bold text-base text-green-900">
                              {challenge.title}
                            </h5>
                            <p className="text-sm text-green-700 font-medium">
                              Complété • +{challenge.reward} CC
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message si aucun défi */}
              {todaysChallenges.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3 animate-glow">🎯</div>
                  <p className="text-base text-muted-foreground font-roboto font-medium">
                    Aucun défi disponible aujourd'hui
                  </p>
                </div>
              )}
            </div>
          </div>
        </CotonCard>
      </motion.div>

      
      
      {/* Level & Goal Card */}
      <CotonCard className="p-6 space-y-5 mt-5 shadow-premium hover:shadow-glow transition-all duration-400">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins font-bold text-xl">Niveau & Objectif</h3>
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
          return `${needData.classes} px-4 py-2 rounded-full text-sm font-roboto font-bold flex items-center gap-1 cursor-pointer hover:scale-[1.05] transition-all duration-300 shadow-card`;
        })()} onClick={onShowProfile}>
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
          const levels = [{
            name: 'Baby Hair',
            min: 0,
            max: 500,
            emoji: '✨',
            color: '#F7B6D2',
            icon: Sparkles
          }, {
            name: 'Curlie Cutie',
            min: 501,
            max: 1000,
            emoji: '💖',
            color: '#C9A7EB',
            icon: Heart
          }, {
            name: 'Afro Queenie',
            min: 1001,
            max: 2500,
            emoji: '👑',
            color: '#FFD166',
            icon: Crown
          }, {
            name: 'Glow Fro',
            min: 2501,
            max: 5000,
            emoji: '🌟',
            color: '#FEE440',
            icon: Sun
          }, {
            name: 'Crown Vibes',
            min: 5001,
            max: 7500,
            emoji: '👑💕',
            color: '#FF6F91',
            icon: Crown
          }, {
            name: 'Slay Braidy',
            min: 7501,
            max: 10000,
            emoji: '🧵🔥',
            color: '#06D6A0',
            icon: Zap
          }, {
            name: 'Kinky Diva',
            min: 10001,
            max: 15000,
            emoji: '💃🏾',
            color: '#9B5DE5',
            icon: Music
          }, {
            name: 'Twist & Shine',
            min: 15001,
            max: 20000,
            emoji: '💫',
            color: '#FF9770',
            icon: Star
          }, {
            name: 'Wash Day Goddess',
            min: 20001,
            max: 30000,
            emoji: '🛁👸🏾',
            color: '#26547C',
            icon: Droplets
          }, {
            name: 'Afrolicious Icon',
            min: 30001,
            max: Infinity,
            emoji: '🔥💎',
            color: '#FFD700',
            icon: Diamond
          }];
          const currentLevel = levels.find(level => currentCoins >= level.min && currentCoins <= level.max) || levels[0];
          const IconComponent = currentLevel.icon;
          return <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: currentLevel.color
              }}></div>
                  <IconComponent size={16} style={{
                color: currentLevel.color
              }} />
                </div>
                <span className="font-poppins font-medium text-foreground">
                  {currentLevel.name} {currentLevel.emoji}
                </span>
              </>;
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
        
        <Button variant="black" size="lg" onClick={onAddCare} className="w-full">
          <Plus size={22} className="animate-glow" />
          Ajouter un soin
        </Button>
      </CotonCard>
      
      {/* Mon suivi - Section fusionnée */}
      <div className="space-y-4">
        <h3 className="font-poppins font-bold text-xl">Mon suivi</h3>
        <div className="grid grid-cols-2 gap-4">
          <CotonCard className="p-5 text-center hover-lift shadow-card">
            <div className="text-2xl font-poppins font-bold text-coton-rose mb-1">
              {state.journalEntries.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Soins total</div>
          </CotonCard>
          
          <CotonCard className="p-5 text-center hover-lift shadow-card">
            <div className="text-2xl font-poppins font-bold text-blue-600 mb-1">
              {thisMonthCares}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Ce mois-ci</div>
          </CotonCard>
          
          <CotonCard className="p-5 text-center hover-lift shadow-card">
            <div className="text-2xl font-poppins font-bold text-purple-600 mb-1">
              {state.streakData.current}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Jours streak</div>
          </CotonCard>
          
          <CotonCard className="p-5 text-center hover-lift shadow-card">
            <div className="text-2xl font-poppins font-bold text-green-600 mb-1">
              {daysSinceLastCare === 0 ? "Aujourd'hui" : `${daysSinceLastCare}j`}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Dernier soin</div>
          </CotonCard>
        </div>
      </div>
      {state.detailedHairProfile.isCompleted && (
        <div key={`routine-${state.detailedHairProfile.hairType}-${state.detailedHairProfile.porosity}-${state.detailedHairProfile.objective}-${state.detailedHairProfile.problems?.join(',')}-${state.detailedHairProfile.needs?.join(',')}`} className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg">Ma routine recommandée ✨</h3>
          
          <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50 space-y-4">
            {/* Profile Summary avec indicateur de synchronisation */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-coton-rose/20 mt-[5px]">
                {/* Type de cheveux - Priorité au profil détaillé, fallback sur l'onboarding */}
                {(state.detailedHairProfile.hairType || 
                  (state.hairProfile.hairType && !state.detailedHairProfile.isCompleted)) && (
                  <span className="px-3 py-1 bg-coton-rose/20 border border-coton-rose/30 rounded-full text-sm font-roboto font-semibold text-foreground">
                    {state.detailedHairProfile.hairType || 
                     (state.hairProfile.hairType === 'crepu' ? '4C' :
                      state.hairProfile.hairType === 'boucle' ? '3C' :
                      state.hairProfile.hairType === 'locks' ? 'LOCKS' :
                      state.hairProfile.hairType === 'transition' ? '4A' : 
                      state.hairProfile.hairType)}
                  </span>
                )}
                {state.detailedHairProfile.porosity && (
                  <span className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-sm font-roboto text-blue-800">
                    Porosité {state.detailedHairProfile.porosity}
                  </span>
                )}
                {state.detailedHairProfile.problems && state.detailedHairProfile.problems.length > 0 && state.detailedHairProfile.problems.map((problem, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 border border-orange-300 rounded-full text-sm font-roboto text-orange-800">
                    ⚠️ {problem}
                  </span>
                ))}
                {state.detailedHairProfile.needs && state.detailedHairProfile.needs.length > 0 && state.detailedHairProfile.needs.map((need, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 border border-purple-300 rounded-full text-sm font-roboto text-purple-800">
                    ✨ {need}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Loading State */}
            {routineLoading && (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto text-coton-rose mb-3" size={32} />
                <p className="text-sm text-muted-foreground font-roboto">
                  Génération de ta routine personnalisée...
                </p>
              </div>
            )}

            {/* Routine Steps with Priority Indicators */}
            {!routineLoading && personalizedRoutine.length > 0 && (
              <div className="space-y-3">
                {personalizedRoutine.slice(0, 4).map((step, index) => {
                  // Determine if this step is marked as priority by the API
                  const isHighPriority = prioritySteps.includes(index);

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
                        <span className={`font-roboto text-sm ${isHighPriority ? 'font-semibold text-red-900' : 'text-foreground'}`}>
                          {step}
                        </span>
                        {isHighPriority && (
                          <div className="text-xs text-red-700 mt-1 font-medium">
                            ⚡ Étape prioritaire personnalisée pour toi
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
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
            )}
            
            {/* CotonTips - Using API generated tip */}
            {!routineLoading && routineTip && (
              <div className="mt-3 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💡</span>
                  </div>
                  <h4 className="font-poppins font-semibold text-amber-800 text-sm">CotonTips IA</h4>
                </div>
                <p className="text-xs font-roboto text-amber-900 leading-relaxed">
                  {routineTip}
                </p>
              </div>
            )}
          </CotonCard>
        </div>
      )}
      
      
      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h3 className="font-poppins font-bold text-xl">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-4">
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('wash-day-tracker')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Calendar className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Wash Day Tracker</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('growth-tracker')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <TrendingUp className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Calculateur de Pousse</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('box')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Package className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Box Digitale</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('partners')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Store className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Partenaires</span>
            </div>
          </CotonCard>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('community')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Communauté</span>
            </div>
          </CotonCard>
          
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-card hover:shadow-premium transition-all duration-400" onClick={() => onNavigate('tutorials')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Video className="text-coton-rose animate-glow" size={36} />
              <span className="font-poppins font-semibold text-base">Tutos</span>
            </div>
          </CotonCard>
        </div>
        
        {/* Premium Button */}
        <div className="mt-4">
          <CotonCard className="p-6 cursor-pointer hover-lift shadow-premium hover:shadow-glow transition-all duration-400 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300/60" onClick={() => onNavigate('premium')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <Crown className="text-amber-500 animate-glow" size={40} />
              <span className="font-poppins font-bold text-lg text-amber-700">Premium</span>
              <span className="text-sm text-amber-600 font-medium">Offre premium arrive bientôt</span>
            </div>
          </CotonCard>
        </div>
      </div>
      
      {/* Next Reward */}
      {(() => {
        const levels = [
          { name: 'Baby Hair', min: 0, max: 500, reward: 'Badge de bienvenue', emoji: '✨' },
          { name: 'Curlie Cutie', min: 501, max: 1000, reward: '50 CC + -5% partenaire', emoji: '💖' },
          { name: 'Afro Queenie', min: 1001, max: 2500, reward: '1 Ebook premium', emoji: '👑' },
          { name: 'Glow Fro', min: 2501, max: 5000, reward: '100 CC + -10% partenaire', emoji: '🌟' },
          { name: 'Crown Vibes', min: 5001, max: 7500, reward: 'Box digitale exclusive', emoji: '👑💕' },
          { name: 'Slay Braidy', min: 7501, max: 10000, reward: '150 CC + -15% partenaire', emoji: '🧵🔥' },
          { name: 'Kinky Diva', min: 10001, max: 15000, reward: 'Produit partenaire offert', emoji: '💃🏾' },
          { name: 'Twist & Shine', min: 15001, max: 20000, reward: '200 CC + accès premium', emoji: '💫' },
          { name: 'Wash Day Goddess', min: 20001, max: 30000, reward: 'Box physique échantillons + -20% partenaire', emoji: '🛁👸🏾' },
          { name: 'Afrolicious Icon', min: 30001, max: Infinity, reward: 'Box physique échantillons + -50% partenaire + badge', emoji: '🔥💎' }
        ];

        const nextLevel = levels.find(level => state.coins < level.min) || levels[levels.length - 1];
        const progress = nextLevel.min === Infinity ? 100 : Math.min((state.coins / nextLevel.min) * 100, 100);
        const remaining = nextLevel.min === Infinity ? 0 : Math.max(nextLevel.min - state.coins, 0);

        return (
          <CotonCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="text-coton-rose" size={24} />
              <h3 className="font-poppins font-semibold text-lg">Prochaine récompense</h3>
            </div>
            
            {nextLevel.min === Infinity ? (
              <div className="text-center py-4">
                <p className="font-roboto text-lg font-semibold text-coton-rose mb-2">
                  {nextLevel.emoji} Niveau maximum atteint !
                </p>
                <p className="font-roboto text-muted-foreground">
                  Tu es une {nextLevel.name} - Félicitations ! 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-roboto font-medium text-foreground">
                    {nextLevel.emoji} {nextLevel.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {state.coins}/{nextLevel.min} CC
                  </span>
                </div>
                <ProgressBar 
                  progress={progress} 
                  variant="coins" 
                  showLabel 
                  label={`${remaining} CC restants`} 
                />
                <div className="bg-coton-rose/10 rounded-lg p-3">
                  <p className="font-roboto text-sm font-medium text-coton-rose mb-1">
                    Récompense à débloquer :
                  </p>
                  <p className="font-roboto text-sm text-foreground">
                    {nextLevel.reward}
                  </p>
                </div>
              </div>
            )}
          </CotonCard>
        );
      })()}

      {/* Streak & Badges */}
      {(state.streakData.current > 0 || state.badges.length > 0) && <CotonCard className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="space-y-3">
            {state.streakData.current > 0 && <div className="flex items-center gap-3">
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
              </div>}
            
            {state.badges.length > 0 && <div>
                <h4 className="font-poppins font-medium mb-2 text-sm">Tes badges:</h4>
                <BadgeDisplay badges={state.badges} />
              </div>}
          </div>
        </CotonCard>}
    </div>;
}