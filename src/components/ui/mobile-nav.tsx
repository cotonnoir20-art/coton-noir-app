import React from 'react';
import { Sparkles, Gift, Notebook, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', icon: Sparkles, label: t('nav.home') },
    { id: 'journal', icon: Notebook, label: t('nav.journal') },
    { id: 'box', icon: Gift, label: t('nav.box') },
    { id: 'tutorials', icon: Play, label: t('nav.tutorials') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-premium z-50">
      <div className="container-responsive py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl transition-all duration-400 relative btn-touch min-w-0 transform-gpu",
                  isActive 
                    ? "text-coton-rose bg-gradient-to-t from-coton-rose/25 to-coton-rose/15 shadow-glow scale-[1.05]" 
                    : "text-muted-foreground hover:text-coton-rose hover:bg-coton-rose/10 hover:scale-[1.02]"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-all duration-400 backdrop-blur-sm",
                  isActive && "bg-coton-rose/25 ring-2 ring-coton-rose/40 shadow-glow"
                )}>
                  <Icon 
                    size={20} 
                    className={cn(
                      "sm:w-6 sm:h-6 transition-all duration-400",
                      isActive ? "text-coton-rose drop-shadow-md" : ""
                    )} 
                  />
                </div>
                <span className={cn(
                  "text-xs font-roboto transition-all duration-400 truncate max-w-[65px] sm:max-w-none font-medium",
                  isActive 
                    ? "text-coton-rose font-bold" 
                    : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1.5 h-1.5 bg-coton-rose rounded-full shadow-glow animate-glow" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}