import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { MobileNav } from '@/components/ui/mobile-nav';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Screens
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ProfileOnboardingScreen } from './screens/ProfileOnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AddCareScreen } from './screens/AddCareScreen';
import { BoxScreen } from './screens/BoxScreen';
import { BoxContentScreen } from './screens/BoxContentScreen';
import { JournalScreen } from './screens/JournalScreen';
import { PartnersScreen } from './screens/PartnersScreen';
import { TutorialsScreen } from './screens/TutorialsScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { HairProfileScreen } from './screens/HairProfileScreen';
import { GrowthTrackerScreen } from './screens/GrowthTrackerScreen';
import { WashDayTrackerScreen } from './screens/WashDayTrackerScreen';
import { FullJournalScreen } from './screens/FullJournalScreen';

type Screen =
  | 'onboarding'
  | 'profile-onboarding'
  | 'home'
  | 'add-care'
  | 'hair-profile'
  | 'growth-tracker'
  | 'wash-day-tracker'
  | 'box'
  | 'box-content'
  | 'journal'
  | 'full-journal'
  | 'tutorials'
  | 'partners'
  | 'community'
  | 'premium'
  | 'payment';

export default function CotonNoirApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [paymentPlanId, setPaymentPlanId] = useState<string>('');
  
  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('coton-noir-onboarding');
    const hasCompletedProfile = localStorage.getItem('coton-noir-profile-onboarding');
    
    if (hasCompletedOnboarding && hasCompletedProfile) {
      setCurrentScreen('home');
    } else if (hasCompletedOnboarding && !hasCompletedProfile) {
      setCurrentScreen('profile-onboarding');
    }

    // Listen for navigation events
    const handleNavigateEvent = (event: CustomEvent) => {
      handleNavigate(event.detail);
    };

    window.addEventListener('navigate', handleNavigateEvent as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigateEvent as EventListener);
    };
  }, []);
  
  const handleCompleteOnboarding = () => {
    localStorage.setItem('coton-noir-onboarding', 'true');
    setCurrentScreen('profile-onboarding');
  };

  const handleCompleteProfileOnboarding = () => {
    localStorage.setItem('coton-noir-profile-onboarding', 'true');
    setCurrentScreen('home');
  };
  
  const handleNavigate = (screen: Screen, data?: any) => {
    if (screen === 'payment' && data) {
      setPaymentPlanId(data);
    }
    setCurrentScreen(screen);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'box':
        setCurrentScreen('box');
        break;
      case 'journal':
        setCurrentScreen('journal');
        break;
      case 'tutorials':
        setCurrentScreen('tutorials');
        break;
    }
  };
  
  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };
  
  const shouldShowNavigation = () => {
    return !['onboarding', 'profile-onboarding', 'add-care', 'hair-profile', 'growth-tracker', 'wash-day-tracker', 'full-journal', 'premium', 'payment', 'box-content'].includes(currentScreen);
  };
  
  const shouldShowHeader = () => {
    return !['onboarding', 'profile-onboarding', 'add-care', 'hair-profile', 'growth-tracker', 'wash-day-tracker', 'full-journal', 'premium', 'payment', 'box-content'].includes(currentScreen);
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={handleCompleteOnboarding}
            onPremium={() => handleNavigate('premium')}
          />
        );

      case 'profile-onboarding':
        return (
          <ProfileOnboardingScreen
            onComplete={handleCompleteProfileOnboarding}
          />
        );
        
      case 'home':
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onAddCare={() => handleNavigate('add-care')}
            onShowProfile={() => handleNavigate('hair-profile')}
          />
        );
        
      case 'add-care':
        return (
          <AddCareScreen
            onBack={handleBackToHome}
          />
        );
        
      case 'hair-profile':
        return (
          <HairProfileScreen
            onBack={handleBackToHome}
          />
        );
        
      case 'growth-tracker':
        return (
          <GrowthTrackerScreen
            onBack={handleBackToHome}
          />
        );
        
      case 'wash-day-tracker':
        return (
          <WashDayTrackerScreen
            onBack={handleBackToHome}
          />
        );
        
      case 'box':
        return (
          <BoxScreen
            onNavigate={handleNavigate}
          />
        );
        
      case 'box-content':
        return (
          <BoxContentScreen
            onBack={() => handleNavigate('box')}
          />
        );
        
      case 'journal':
        return <JournalScreen />;

      case 'full-journal':
        return (
          <FullJournalScreen
            onBack={() => handleNavigate('journal')}
          />
        );
        
      case 'tutorials':
        return (
          <TutorialsScreen
            onNavigate={handleNavigate}
          />
        );
        
      case 'partners':
        return (
          <PartnersScreen
            onNavigate={handleNavigate}
          />
        );
        
      case 'community':
        return (
          <CommunityScreen
            onNavigate={handleNavigate}
          />
        );
        
      case 'premium':
        return (
          <PremiumScreen
            onBack={handleBackToHome}
            onPayment={(planId) => handleNavigate('payment', planId)}
          />
        );
        
      case 'payment':
        return (
          <PaymentScreen
            planId={paymentPlanId}
            onBack={() => handleNavigate('premium')}
            onSuccess={handleBackToHome}
          />
        );
        
      default:
        return (
          <HomeScreen 
            onNavigate={handleNavigate} 
            onAddCare={() => handleNavigate('add-care')} 
            onShowProfile={() => handleNavigate('hair-profile')}
          />
        );
    }
  };
  
  const shouldShowFAB = () => {
    return ['home', 'journal', 'box', 'tutorials', 'partners', 'community'].includes(currentScreen);
  };
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        {shouldShowHeader() && (
          <Header 
            onPremiumClick={() => handleNavigate('premium')}
            onProfileClick={() => handleNavigate('hair-profile')}
            onHomeClick={handleBackToHome}
          />
        )}
        
        {/* Main Content */}
        <main className={shouldShowHeader() ? 'pt-0' : ''}>
          {renderScreen()}
        </main>
        
        {/* Floating Action Button */}
        {shouldShowFAB() && (
          <div className="fixed bottom-20 right-4 z-40">
            {/* Add Care Button */}
            <Button
              size="icon"
              variant="hero"
              className="w-14 h-14 rounded-full shadow-lg"
              onClick={() => handleNavigate('add-care')}
            >
              <Plus size={24} />
            </Button>
          </div>
        )}
        
        {/* Mobile Navigation */}
        {shouldShowNavigation() && (
          <MobileNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>
    </AppProvider>
  );
}