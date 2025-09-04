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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-soft z-50">
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
                  "flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-300 relative btn-touch min-w-0",
                  isActive 
                    ? "text-coton-rose bg-gradient-to-t from-coton-rose/20 to-coton-rose/10 shadow-soft" 
                    : "text-muted-foreground hover:text-coton-rose hover:bg-coton-rose/5"
                )}
              >
                <div className={cn(
                  "p-1 rounded-full transition-all duration-300",
                  isActive && "bg-coton-rose/20 ring-2 ring-coton-rose/30"
                )}>
                  <Icon 
                    size={18} 
                    className={cn(
                      "sm:w-5 sm:h-5 transition-all duration-300",
                      isActive ? "text-coton-rose drop-shadow-sm" : ""
                    )} 
                  />
                </div>
                <span className={cn(
                  "text-xs font-roboto transition-all duration-300 truncate max-w-[60px] sm:max-w-none",
                  isActive 
                    ? "text-coton-rose font-semibold" 
                    : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-coton-rose rounded-full shadow-sm animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}