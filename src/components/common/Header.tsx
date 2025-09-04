import React from 'react';
import { Moon, Sun, Coins, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onRewardsClick?: () => void;
}

export function Header({ onProfileClick, onHomeClick, onRewardsClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();

  return (
    <header className="bg-coton-black border-b border-white/10 px-4 py-3 sticky top-0 z-40 shadow-soft">
      <div className="flex items-center justify-between">
        {/* Logo / Home Button */}
        <button 
          onClick={onHomeClick}
          className="flex items-center hover:opacity-80 hover:bg-white/10 px-3 py-2 rounded-lg transition-all cursor-pointer group"
        >
          <h1 className="font-poppins font-bold text-xl text-white inline">
            Coton Noir <span className="text-sm text-white/70 font-roboto group-hover:text-white/90 transition-colors">Hair Journal</span>
          </h1>
        </button>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Profile button */}
          {onProfileClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              className={`h-10 w-10 text-white hover:bg-white/10 ${!state.hairProfile.isCompleted ? 'ring-2 ring-coton-rose animate-pulse' : ''}`}
            >
              <User size={18} className={!state.hairProfile.isCompleted ? 'text-coton-rose' : 'text-white'} />
            </Button>
          )}
          
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="h-10 w-10 text-white hover:bg-white/10"
          >
            {state.darkMode ? (
              <Sun size={18} className="text-white" />
            ) : (
              <Moon size={18} className="text-white" />
            )}
          </Button>
          
          {/* Coins */}
          <button 
            onClick={onRewardsClick}
            className="flex items-center gap-1 bg-gradient-to-r from-coton-rose to-pink-300 text-foreground px-3 py-1.5 rounded-pill shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <Coins size={16} />
            <span className="font-poppins font-medium text-sm">
              {state.coins}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}