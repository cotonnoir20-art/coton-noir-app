import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function CotonCoinsDisplay() {
  const { state } = useApp();
  
  return (
    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
      <Sparkles className="text-primary" size={16} />
      <span className="font-poppins font-semibold text-foreground">
        {state.coins} CotonCoins
      </span>
    </div>
  );
}