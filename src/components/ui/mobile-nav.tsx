import React from 'react';
import { Sparkles, Gift, Notebook, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Sparkles, label: 'Accueil' },
  { id: 'journal', icon: Notebook, label: 'Journal' },
  { id: 'box', icon: Gift, label: 'Box' },
  { id: 'tutorials', icon: Play, label: 'Tutos' },
  { id: 'profile', icon: User, label: 'Profil' },
];

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-soft z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 relative",
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
                  size={20} 
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-coton-rose drop-shadow-sm" : ""
                  )} 
                />
              </div>
              <span className={cn(
                "text-xs font-roboto transition-all duration-300",
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
    </nav>
  );
}