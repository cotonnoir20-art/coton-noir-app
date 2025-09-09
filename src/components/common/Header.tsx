import React from 'react';
import { Moon, Sun, Coins, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onRewardsClick?: () => void;
}

export function Header({ onProfileClick, onHomeClick, onRewardsClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Accueil' },
    { path: '/journal', label: 'Journal' },
    { path: '/box', label: 'Box' },
    { path: '/tutorials', label: 'Tutoriels' },
    { path: '/community', label: 'Communauté' },
  ];

  return (
    <header className="bg-coton-black border-b border-white/20 px-4 py-4 sticky top-0 z-40 shadow-premium backdrop-blur-md">
      <div className="container-responsive">
        <div className="flex items-center justify-between">
          {/* Logo / Home Button - Mobile-first responsive */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center hover:opacity-90 hover:bg-white/15 px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer group hover:scale-[1.02] transform-gpu"
          >
            <h1 className="font-poppins font-bold text-xl sm:text-2xl text-white inline">
              <span className="block sm:inline">Coton Noir</span>
              <span className="hidden sm:inline text-sm sm:text-base text-white/80 font-roboto group-hover:text-white/95 transition-colors ml-2">
                Hair Journal
              </span>
            </h1>
          </button>
          
          {/* Navigation Menu - Hidden on mobile, visible on desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`text-white hover:bg-white/15 hover:scale-[1.05] transition-all rounded-xl ${
                  location.pathname === item.path 
                    ? 'bg-white/15 text-coton-rose font-semibold shadow-glow' 
                    : 'text-white/85'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
          
          {/* Right side actions - Mobile-first responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profile button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/hair-profile')}
              className={`h-10 w-10 sm:h-12 sm:w-12 text-white hover:bg-white/15 hover:scale-[1.1] btn-touch rounded-xl ${!state.hairProfile.isCompleted ? 'ring-2 ring-coton-rose animate-glow' : ''}`}
            >
              <User size={18} className={`sm:w-[20px] sm:h-[20px] ${!state.hairProfile.isCompleted ? 'text-coton-rose' : 'text-white'}`} />
            </Button>
            
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="h-10 w-10 sm:h-12 sm:w-12 text-white hover:bg-white/15 hover:scale-[1.1] btn-touch rounded-xl"
            >
              {state.darkMode ? (
                <Sun size={18} className="sm:w-[20px] sm:h-[20px] text-white" />
              ) : (
                <Moon size={18} className="sm:w-[20px] sm:h-[20px] text-white" />
              )}
            </Button>
            
            {/* Coins - Mobile-first responsive */}
            <button 
              onClick={() => navigate('/rewards')}
              className="flex items-center gap-1.5 bg-coton-rose text-black px-3 sm:px-4 py-2 rounded-pill shadow-elegant hover:scale-110 hover:shadow-glow transition-all cursor-pointer btn-touch font-semibold"
            >
              <Coins size={16} className="sm:w-5 sm:h-5" />
              <span className="font-poppins font-bold text-sm sm:text-base">
                {state.coins}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}