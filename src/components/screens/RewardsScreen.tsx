import React from 'react';
import { ArrowLeft, Coins, Gift, Star, Trophy, Target, Calendar, Flame, Crown } from 'lucide-react';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';

interface RewardsScreenProps {
  onBack: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  const { state } = useApp();

  const rewardCategories = [
    {
      title: "Soins capillaires",
      icon: <Target className="text-blue-500" size={24} />,
      rewards: [
        { action: "Ajouter un soin", coins: 5, frequency: "Par soin" },
        { action: "Compléter le profil cheveux", coins: 10, frequency: "Une fois" },
        { action: "Première routine complète", coins: 15, frequency: "Une fois" },
      ]
    },
    {
      title: "Engagement quotidien",
      icon: <Calendar className="text-green-500" size={24} />,
      rewards: [
        { action: "Connexion quotidienne", coins: 2, frequency: "Par jour" },
        { action: "Compléter un défi", coins: 10, frequency: "Par défi" },
        { action: "Streak de 7 jours", coins: 25, frequency: "Par semaine" },
        { action: "Streak de 30 jours", coins: 100, frequency: "Par mois" },
      ]
    },
    {
      title: "Milestones & Achievements",
      icon: <Trophy className="text-yellow-500" size={24} />,
      rewards: [
        { action: "10 soins enregistrés", coins: 20, frequency: "Une fois" },
        { action: "30 soins enregistrés", coins: 50, frequency: "Une fois" },
        { action: "100 soins enregistrés", coins: 150, frequency: "Une fois" },
        { action: "Première review produit", coins: 15, frequency: "Une fois" },
      ]
    }
  ];

  const redeemOptions = [
    {
      title: "Box Digitale",
      description: "Accès à une sélection exclusive de produits partenaires",
      cost: 50,
      icon: <Gift className="text-purple-500" size={32} />,
      available: state.coins >= 50
    },
    {
      title: "Consultation personnalisée",
      description: "Session 1-on-1 avec un expert capillaire",
      cost: 150,
      icon: <Star className="text-orange-500" size={32} />,
      available: state.coins >= 150
    },
    {
      title: "Accès Premium (1 mois)",
      description: "Toutes les fonctionnalités premium débloquées",
      cost: 200,
      icon: <Crown className="text-yellow-500" size={32} />,
      available: state.coins >= 200
    }
  ];

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
          Système de Récompenses
        </h1>
      </div>

      {/* Current Balance */}
      <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-pink-100">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Coins className="text-coton-rose" size={32} />
            <span className="text-3xl font-poppins font-bold text-coton-black">
              {state.coins}
            </span>
          </div>
          <p className="text-muted-foreground font-roboto">
            Coton Coins disponibles
          </p>
        </div>
      </CotonCard>

      {/* Levels Section */}
      <div className="space-y-4">
        <h2 className="font-poppins font-bold text-xl text-foreground text-center">
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

      {/* How to Earn */}
      <div className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          Comment gagner des Coton Coins
        </h2>

        {rewardCategories.map((category, index) => (
          <CotonCard key={index} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              {category.icon}
              <h3 className="font-poppins font-semibold">
                {category.title}
              </h3>
            </div>
            
            <div className="space-y-2">
              {category.rewards.map((reward, rewardIndex) => (
                <div key={rewardIndex} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="font-roboto text-sm font-medium">
                      {reward.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reward.frequency}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-coton-rose/20 text-coton-black px-2 py-1 rounded-pill">
                    <Coins size={12} />
                    <span className="text-sm font-bold">
                      +{reward.coins}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CotonCard>
        ))}
      </div>

      {/* How to Spend */}
      <div className="space-y-4">
        <h2 className="font-poppins font-semibold text-lg flex items-center gap-2">
          <Gift className="text-purple-500" size={20} />
          Récompenses disponibles
        </h2>

        {redeemOptions.map((option, index) => (
          <CotonCard key={index} className={`p-4 ${option.available ? 'border-green-200 bg-green-50/30' : 'opacity-60'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {option.icon}
                <div>
                  <h3 className="font-poppins font-semibold text-base">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-pill text-sm font-bold ${
                  option.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Coins size={14} />
                  {option.cost}
                </div>
                {option.available && (
                  <p className="text-xs text-green-600 mt-1">
                    Disponible !
                  </p>
                )}
              </div>
            </div>
          </CotonCard>
        ))}
      </div>

      {/* Tips */}
      <CotonCard className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <h3 className="font-poppins font-semibold text-blue-800 flex items-center gap-2">
            💡 Conseils pour maximiser tes gains
          </h3>
          <ul className="text-sm text-blue-700 space-y-1 font-roboto">
            <li>• Connecte-toi chaque jour pour le bonus quotidien</li>
            <li>• Complète tes défis pour des récompenses bonus</li>
            <li>• Maintiens ton streak pour des récompenses progressives</li>
            <li>• Ajoute régulièrement tes soins pour accumuler des points</li>
          </ul>
        </div>
      </CotonCard>
    </div>
  );
}