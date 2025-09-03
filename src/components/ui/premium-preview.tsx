import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Star, Zap, Gift, Clock, Users } from 'lucide-react';
import { Button } from './button';
import { CotonCard } from './coton-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PremiumFeatureProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  isLocked?: boolean;
  children?: React.ReactNode;
}

export function PremiumFeature({ 
  icon: Icon, 
  title, 
  description, 
  isLocked = true, 
  children 
}: PremiumFeatureProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <CotonCard className={`p-4 transition-all duration-200 ${
        isLocked 
          ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' 
          : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isLocked ? 'bg-gray-200' : 'bg-gradient-to-r from-purple-400 to-pink-500'
          }`}>
            <Icon size={20} className={isLocked ? 'text-gray-500' : 'text-white'} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-poppins font-semibold ${
                isLocked ? 'text-gray-600' : 'text-coton-black'
              }`}>
                {title}
              </h3>
              {isLocked && <Lock size={14} className="text-gray-400" />}
            </div>
            <p className={`text-sm ${isLocked ? 'text-gray-500' : 'text-muted-foreground'}`}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Contenu preview */}
        {children && (
          <div className={`mt-3 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            {children}
          </div>
        )}
        
        {/* Overlay de verrouillage */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center"
          >
            <div className="text-center">
              <Crown className="mx-auto mb-2 text-purple-500" size={24} />
              <p className="text-sm font-medium text-purple-700">
                Premium requis
              </p>
            </div>
          </motion.div>
        )}
      </CotonCard>
    </motion.div>
  );
}

interface PremiumWaitlistProps {
  onJoin?: () => void;
}

export function PremiumWaitlist({ onJoin }: PremiumWaitlistProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinWaitlist = () => {
    if (state.premiumWaitlist.isOnWaitlist) return;

    dispatch({ type: 'JOIN_PREMIUM_WAITLIST' });
    
    toast({
      title: "Bienvenue sur la liste d'attente ! 🎉",
      description: `Position #${state.premiumWaitlist.totalWaitlist + 1} • Nous vous notifierons bientôt !`
    });
    
    setShowDialog(false);
    onJoin?.();
  };

  const waitlistData = state.premiumWaitlist;

  return (
    <CotonCard className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="text-purple-500" size={32} />
          <h2 className="font-poppins font-bold text-xl text-purple-700">
            Coton Noir Premium
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-poppins font-bold text-purple-600">
              {waitlistData.totalWaitlist}
            </div>
            <div className="text-sm text-purple-500">sur la liste</div>
          </div>
          <div>
            <div className="text-2xl font-poppins font-bold text-pink-600">
              2x
            </div>
            <div className="text-sm text-pink-500">CotonCoins</div>
          </div>
        </div>

        {waitlistData.isOnWaitlist ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Star size={20} />
              <span className="font-medium">Sur la liste d'attente !</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Position #{waitlistData.position || waitlistData.totalWaitlist}
            </p>
            <div className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm">
              Nous vous notifierons dès que c'est prêt ! 🎉
            </div>
          </div>
        ) : (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Users size={20} />
                Rejoindre la liste d'attente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">
                  <Crown className="mx-auto mb-2 text-purple-500" size={32} />
                  Rejoindre Coton Noir Premium
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h3 className="font-poppins font-semibold mb-3">Ce qui vous attend :</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="text-yellow-500" size={16} />
                      Double CotonCoins sur toutes vos actions
                    </li>
                    <li className="flex items-center gap-2">
                      <Gift className="text-purple-500" size={16} />
                      Box digitale illimitée avec produits exclusifs
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="text-pink-500" size={16} />
                      Routines personnalisées avec IA avancée
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="text-blue-500" size={16} />
                      Accès prioritaire aux nouvelles fonctionnalités
                    </li>
                  </ul>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-3xl font-poppins font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dès 3,99€/mois
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Offre de lancement • Prix normal : 7,99€/mois
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="text-amber-600" size={16} />
                    <span className="font-medium text-amber-700">Offre limitée</span>
                  </div>
                  <p className="text-sm text-amber-600">
                    Plus que 48h pour profiter du prix de lancement !
                  </p>
                </div>

                <Button 
                  onClick={handleJoinWaitlist}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Rejoindre maintenant ({waitlistData.totalWaitlist} déjà inscrits)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CotonCard>
  );
}

// Composant pour afficher une fonctionnalité premium verrouillée
interface LockedFeatureProps {
  title: string;
  description: string;
  ctaText?: string;
  onUnlock?: () => void;
}

export function LockedFeature({ 
  title, 
  description, 
  ctaText = "Débloquer avec Premium",
  onUnlock 
}: LockedFeatureProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <CotonCard className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 relative">
        <div className="text-center space-y-3">
          <Lock className="mx-auto text-gray-400" size={32} />
          <div>
            <h3 className="font-poppins font-semibold text-gray-600 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onUnlock}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Crown size={16} />
            {ctaText}
          </Button>
        </div>

        {/* Effet de brillance */}
        <motion.div
          animate={{
            x: [-100, 200],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
        />
      </CotonCard>
    </motion.div>
  );
}