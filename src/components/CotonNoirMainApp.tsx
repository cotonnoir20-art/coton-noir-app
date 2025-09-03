import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { TopNavigation } from '@/components/ui/top-navigation';
import { CotonCoinsDisplay } from '@/components/ui/coton-coins-display';
import { Button } from '@/components/ui/button';

// Screens
import { RoutineScreen } from './screens/RoutineScreen';
import { HairProfileScreen } from './screens/HairProfileScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { PartnersScreen } from './screens/PartnersScreen';

type Tab = 'routine' | 'profile' | 'community' | 'partners';

export default function CotonNoirMainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('routine');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
  };
  
  const renderScreen = () => {
    switch (activeTab) {
      case 'routine':
        return <RoutineScreen />;
      case 'profile':
        return <HairProfileScreen onBack={() => setActiveTab('routine')} />;
      case 'community':
        return <CommunityScreen onNavigate={() => {}} />;
      case 'partners':
        return <PartnersScreen onNavigate={() => {}} />;
      default:
        return <RoutineScreen />;
    }
  };
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {/* Header with CotonCoins */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-poppins font-bold text-xl text-foreground">
              Coton Noir
            </h1>
            <CotonCoinsDisplay />
          </div>
          <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        {/* Main Content */}
        <main>
          {renderScreen()}
        </main>
        
        {/* Premium CTA Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-secondary/90 to-primary/90 backdrop-blur-sm p-4 border-t border-border">
          <Button 
            className="w-full bg-secondary hover:bg-secondary/90 text-black font-poppins font-semibold"
            size="lg"
          >
            Passer en Premium
          </Button>
        </div>
      </div>
    </AppProvider>
  );
}