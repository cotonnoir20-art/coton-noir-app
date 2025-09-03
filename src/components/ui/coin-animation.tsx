import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles } from 'lucide-react';

interface CoinAnimationProps {
  amount: number;
  trigger: boolean;
  onComplete?: () => void;
}

export function CoinAnimation({ amount, trigger, onComplete }: CoinAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coins, setCoins] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      
      // Créer plusieurs pièces pour l'effet d'explosion
      const coinCount = Math.min(Math.max(Math.floor(amount / 10), 3), 8);
      const newCoins = Array.from({ length: coinCount }, (_, i) => ({
        id: i,
        delay: i * 0.1
      }));
      
      setCoins(newCoins);

      // Auto-hide après l'animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, amount, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Effet de fond avec étincelles */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Explosion d'étincelles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos(i * 30 * Math.PI / 180) * 60,
                  y: Math.sin(i * 30 * Math.PI / 180) * 60,
                  rotate: 360
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.2,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <Sparkles 
                  size={16} 
                  className="text-yellow-400" 
                />
              </motion.div>
            ))}

            {/* Pièces qui explosent */}
            {coins.map((coin) => (
              <motion.div
                key={`coin-${coin.id}`}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  x: (Math.random() - 0.5) * 200,
                  y: [0, -100, 20],
                  rotate: [0, 180, 360]
                }}
                exit={{ 
                  scale: 0,
                  opacity: 0,
                  y: 100
                }}
                transition={{ 
                  duration: 1.5,
                  delay: coin.delay,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="absolute"
              >
                <div className="relative">
                  <Coins 
                    size={32} 
                    className="text-yellow-500 drop-shadow-lg" 
                  />
                  {/* Effet de brillance */}
                  <motion.div
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: Infinity,
                      delay: coin.delay
                    }}
                    className="absolute inset-0 bg-yellow-300 rounded-full blur-sm opacity-50"
                  />
                </div>
              </motion.div>
            ))}

            {/* Texte de gain */}
            <motion.div
              initial={{ 
                scale: 0,
                y: 50,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.3, 1],
                y: [50, -20, 0],
                opacity: 1
              }}
              exit={{ 
                scale: 0,
                y: -50,
                opacity: 0
              }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
                type: "spring"
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-poppins font-bold text-lg shadow-xl relative z-10"
            >
              +{amount} CotonCoins! 🪙
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Composant pour déclencher l'animation depuis n'importe où
interface CoinBurstProps {
  onTrigger?: () => void;
}

export function useCoinAnimation() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [amount, setAmount] = useState(0);

  const triggerCoinAnimation = (coinAmount: number) => {
    setAmount(coinAmount);
    setShouldAnimate(true);
  };

  const resetAnimation = () => {
    setShouldAnimate(false);
  };

  return {
    shouldAnimate,
    amount,
    triggerCoinAnimation,
    resetAnimation
  };
}