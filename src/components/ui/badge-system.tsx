import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge as BadgeIcon, Star, Flame, Trophy, Crown, Heart } from 'lucide-react';
import { Badge } from '@/contexts/AppContext';
import { CotonCard } from './coton-card';

interface BadgeNotificationProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

export function BadgeNotification({ badge, isVisible, onClose }: BadgeNotificationProps) {
  if (!badge) return null;

  const categoryIcons = {
    routine: Star,
    wash: Flame,
    growth: Trophy,
    streak: Crown,
    premium: Heart
  };

  const categoryColors = {
    routine: 'from-purple-400 to-pink-500',
    wash: 'from-blue-400 to-cyan-500',
    growth: 'from-green-400 to-emerald-500',
    streak: 'from-yellow-400 to-orange-500',
    premium: 'from-rose-400 to-pink-500'
  };

  const IconComponent = categoryIcons[badge.category];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-4 right-4 z-50"
        >
          <CotonCard className="p-4 border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center gap-4">
              {/* Icône avec animation */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2
                }}
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${categoryColors[badge.category]} flex items-center justify-center shadow-lg`}
              >
                <span className="text-2xl">{badge.emoji}</span>
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BadgeIcon size={16} className="text-yellow-600" />
                  <span className="text-xs font-poppins font-medium text-yellow-700 uppercase tracking-wide">
                    Nouveau Badge !
                  </span>
                </div>
                <h3 className="font-poppins font-bold text-coton-black">
                  {badge.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
              </div>

              {/* Confettis */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    x: Math.cos(i * 45 * Math.PI / 180) * 30,
                    y: Math.sin(i * 45 * Math.PI / 180) * 30
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </CotonCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BadgeDisplayProps {
  badges: Badge[];
  maxVisible?: number;
}

export function BadgeDisplay({ badges, maxVisible = 3 }: BadgeDisplayProps) {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = Math.max(0, badges.length - maxVisible);

  if (badges.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BadgeIcon size={16} />
        <span className="text-sm">Aucun badge pour l'instant</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visibleBadges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full border border-yellow-200"
        >
          <span className="text-sm">{badge.emoji}</span>
          <span className="text-xs font-medium text-yellow-800">
            {badge.name}
          </span>
        </motion.div>
      ))}
      
      {remainingCount > 0 && (
        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
          <BadgeIcon size={12} />
          <span className="text-xs font-medium text-gray-600">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

// Hook pour gérer les badges
export function useBadgeSystem() {
  const [newBadge, setNewBadge] = React.useState<Badge | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const showBadge = (badge: Badge) => {
    setNewBadge(badge);
    setIsVisible(true);

    // Auto-hide après 4 secondes
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  };

  const hideBadge = () => {
    setIsVisible(false);
  };

  return {
    newBadge,
    isVisible,
    showBadge,
    hideBadge
  };
}