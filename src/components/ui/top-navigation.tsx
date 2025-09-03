import React from 'react';
import { cn } from '@/lib/utils';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'routine', label: 'Routine' },
  { id: 'profile', label: 'Profil' },
  { id: 'community', label: 'Communauté' },
  { id: 'partners', label: 'Avantages' }
];

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-4 py-2 font-roboto text-sm transition-all duration-300",
              activeTab === tab.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-scale-in" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}