import React from 'react';
import { Home, Package, BookOpen, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'box', icon: Package, label: 'Box' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'tutorials', icon: Video, label: 'Tutos' },
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
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300",
                isActive 
                  ? "text-coton-black bg-coton-rose/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon size={20} className={cn(isActive && "text-coton-black")} />
              <span className={cn(
                "text-xs font-roboto",
                isActive ? "text-coton-black font-medium" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}