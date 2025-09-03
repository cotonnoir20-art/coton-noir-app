import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { MobileNav } from '@/components/ui/mobile-nav';

// Screens
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AddCareScreen } from './screens/AddCareScreen';
import { BoxScreen } from './screens/BoxScreen';
import { JournalScreen } from './screens/JournalScreen';
import { PartnersScreen } from './screens/PartnersScreen';
import { TutorialsScreen } from './screens/TutorialsScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { HairProfileScreen } from './screens/HairProfileScreen';

type Screen = 
  | 'onboarding'
  | 'home'
  | 'add-care'
  | 'hair-profile'
  | 'box'
  | 'journal'
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
    if (hasCompletedOnboarding) {
      setCurrentScreen('home');
    }
  }, []);
  
  const handleCompleteOnboarding = () => {
    localStorage.setItem('coton-noir-onboarding', 'true');
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
    return !['onboarding', 'add-care', 'hair-profile', 'premium', 'payment'].includes(currentScreen);
  };
  
  const shouldShowHeader = () => {
    return !['onboarding', 'add-care', 'hair-profile', 'premium', 'payment'].includes(currentScreen);
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
        
      case 'box':
        return (
          <BoxScreen
            onNavigate={handleNavigate}
          />
        );
        
      case 'journal':
        return <JournalScreen />;
        
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
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        {shouldShowHeader() && (
          <Header 
            onPremiumClick={() => handleNavigate('premium')}
            onProfileClick={() => handleNavigate('hair-profile')}
          />
        )}
        
        {/* Main Content */}
        <main className={shouldShowHeader() ? 'pt-0' : ''}>
          {renderScreen()}
        </main>
        
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