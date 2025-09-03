import React from 'react';
import { Moon, Sun, Crown, Coins, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onPremiumClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onRewardsClick?: () => void;
}

export function Header({ onPremiumClick, onProfileClick, onHomeClick, onRewardsClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Coton Noir !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-coton-black border-b border-white/10 px-4 py-3 sticky top-0 z-40 shadow-soft">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <h1 className="font-poppins font-bold text-xl text-white">
            Coton Noir
          </h1>
          <span className="text-sm text-white/70 font-roboto">
            Hair Journal
          </span>
        </button>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Logout button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 text-white hover:bg-white/10"
            title="Se déconnecter"
          >
            <LogOut size={18} className="text-white" />
          </Button>

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
          
          {/* Premium status */}
          {state.premium ? (
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1.5 rounded-pill shadow-lg">
              <Crown size={16} />
              <span className="text-sm font-poppins font-medium">Premium</span>
            </div>
          ) : (
            <Button 
              variant="outline"
              size="sm"
              onClick={onPremiumClick}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Premium
            </Button>
          )}
          
          {/* Coins */}
          <button 
            onClick={onRewardsClick}
            className="flex items-center gap-1 bg-gradient-to-r from-coton-rose to-pink-300 text-coton-black px-3 py-1.5 rounded-pill shadow-lg hover:scale-105 transition-transform cursor-pointer"
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