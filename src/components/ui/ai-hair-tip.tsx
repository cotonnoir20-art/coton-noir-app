import React from 'react';
import { Sparkles, RefreshCw, Bot } from 'lucide-react';
import { Button } from './button';
import { CotonCard } from './coton-card';
import { useHairTips, TipType } from '@/hooks/useHairTips';
import { motion, AnimatePresence } from 'framer-motion';
interface AIHairTipProps {
  tipType?: TipType;
  context?: string;
  variant?: 'default' | 'compact' | 'featured';
  showRefresh?: boolean;
  className?: string;
}
export function AIHairTip({
  tipType = 'general',
  context,
  variant = 'default',
  showRefresh = true,
  className = ''
}: AIHairTipProps) {
  const {
    currentTip,
    generateTip,
    isLoading,
    error
  } = useHairTips();
  const handleRefresh = () => {
    generateTip(tipType, context);
  };
  if (variant === 'compact') {
    return <div className={`flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl border border-purple-200/60 shadow-card backdrop-blur-sm hover:shadow-elegant transition-all duration-400 ${className}`}>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-card animate-glow">
            <Bot size={18} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isLoading ? <motion.div key="loading" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw size={14} className="animate-spin" />
                Génération en cours...
              </motion.div> : <motion.p key="tip" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className="text-sm font-roboto text-coton-black leading-relaxed">
                {currentTip?.tip || "💡 Active ton profil capillaire pour recevoir des conseils personnalisés !"}
              </motion.p>}
          </AnimatePresence>
        </div>
        
        {showRefresh && !isLoading && <Button variant="ghost" size="icon" onClick={handleRefresh} className="w-8 h-8 flex-shrink-0 hover:bg-white/50">
            <RefreshCw size={16} className="hover:rotate-180 transition-transform duration-500" />
          </Button>}
      </div>;
  }
  if (variant === 'featured') {
    return <CotonCard className={`p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-purple-200/60 shadow-premium hover:shadow-glow ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-elegant animate-glow">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-xl text-coton-black">
                CotonTips
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Experte en cheveux afro
              </p>
            </div>
          </div>
          
          {showRefresh && <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="border-purple-200 hover:bg-white/50">
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} className="animate-glow" />}
              Nouveau conseil
            </Button>}
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? <motion.div key="loading" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="flex items-center gap-3 py-4">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{
              animationDelay: '0.1s'
            }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{
              animationDelay: '0.2s'
            }}></div>
              </div>
              <span className="text-purple-600 font-roboto">Analyse de ton profil...</span>
            </motion.div> : <motion.div key="tip" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="space-y-3">
              <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                <p className="font-roboto text-coton-black leading-relaxed">
                  {currentTip?.tip || "💡 Complete ton profil capillaire pour recevoir des CotonTips personnalisés !"}
                </p>
              </div>
              
              {currentTip && <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles size={12} />
                  Conseil {tipType} • Généré par IA • {new Date(currentTip.timestamp).toLocaleDateString('fr-FR')}
                </div>}
            </motion.div>}
        </AnimatePresence>
        
        {error && <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            ⚠️ {error}
          </div>}
      </CotonCard>;
  }

  // Default variant
  return <CotonCard className={`p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-poppins font-semibold text-sm text-coton-black">CotonTips

          </h4>
            {showRefresh && <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading} className="w-6 h-6 hover:bg-white/50">
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              </Button>}
          </div>
          
          <AnimatePresence mode="wait">
            {isLoading ? <motion.div key="loading" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="text-sm text-muted-foreground italic">
                Génération d'un conseil personnalisé...
              </motion.div> : <motion.p key="tip" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className="text-sm font-roboto text-coton-black leading-relaxed">
                {currentTip?.tip || "💡 Complete ton profil capillaire pour des conseils sur mesure !"}
              </motion.p>}
          </AnimatePresence>
        </div>
      </div>
    </CotonCard>;
}