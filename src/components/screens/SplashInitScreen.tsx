import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SplashInitScreenProps {
  onContinue: () => void;
}

export default function SplashInitScreen({ onContinue }: SplashInitScreenProps) {
  useEffect(() => {
    // Auto-advance after 3 seconds if user doesn't interact
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          delay: 0.2 
        }}
        className="mb-12"
      >
        <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png"
            alt="Coton Noir Logo"
            className="w-32 h-32 object-contain"
          />
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Bienvenue sur Coton Noir
        </h1>
        <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
          L'application dédiée aux soins capillaires des femmes noires en France
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="w-full max-w-sm"
      >
        <Button 
          onClick={onContinue}
          size="lg"
          className="w-full h-14 text-lg font-semibold"
        >
          Commencer l'aventure
        </Button>
      </motion.div>

      {/* Skip Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.8 }}
        className="text-sm text-white/60 mt-6 text-center"
      >
        Ou attendez 3 secondes pour continuer automatiquement
      </motion.p>
    </div>
  );
}