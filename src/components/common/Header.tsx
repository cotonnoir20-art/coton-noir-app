import React from 'react';
import { Moon, Sun, Crown, Coins, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface HeaderProps {
  onPremiumClick?: () => void;
  onProfileClick?: () => void;
}

export function Header({ onPremiumClick, onProfileClick }: HeaderProps) {
  const { state, dispatch } = useApp();

  return (
    <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40 shadow-soft">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h1 className="font-poppins font-bold text-xl text-foreground">
            Coton Noir
          </h1>
          <span className="text-sm text-muted-foreground font-roboto">
            Hair Journal
          </span>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Profile button */}
          {onProfileClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              className={`h-10 w-10 ${!state.hairProfile.isCompleted ? 'ring-2 ring-coton-rose animate-pulse' : ''}`}
            >
              <User size={18} className={!state.hairProfile.isCompleted ? 'text-coton-rose' : ''} />
            </Button>
          )}
          
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="h-10 w-10"
          >
            {state.darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </Button>
          
          {/* Premium status */}
          {state.premium ? (
            <div className="flex items-center gap-1 bg-gradient-hero text-white px-3 py-1.5 rounded-pill">
              <Crown size={16} />
              <span className="text-sm font-poppins font-medium">Premium</span>
            </div>
          ) : (
            <Button 
              variant="pill" 
              size="pill"
              onClick={onPremiumClick}
            >
              Premium
            </Button>
          )}
          
          {/* Coins */}
          <div className="flex items-center gap-1 bg-coton-rose text-coton-black px-3 py-1.5 rounded-pill">
            <Coins size={16} />
            <span className="font-poppins font-medium text-sm">
              {state.coins}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}