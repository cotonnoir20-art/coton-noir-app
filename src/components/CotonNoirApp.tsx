import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { MobileNav } from '@/components/ui/mobile-nav';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// Screens
import SplashInitScreen from './screens/SplashInitScreen';
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
import { HairProfileScreen } from './screens/HairProfileScreen';
import { GrowthTrackerScreen } from './screens/GrowthTrackerScreen';
import { WashDayTrackerScreen } from './screens/WashDayTrackerScreen';
import { FullJournalScreen } from './screens/FullJournalScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { DetailedRoutineScreen } from './screens/DetailedRoutineScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LanguageSelectionScreen } from './screens/LanguageSelectionScreen';

type Screen =
  | 'splash-init'
  | 'welcome'
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
  | 'rewards'
  | 'detailed-routine'
  | 'tutorials'
  | 'partners'
  | 'community'
  | 'profile'
  | 'language-selection';

export default function CotonNoirApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash-init');
  const [activeTab, setActiveTab] = useState('home');
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, loading, navigate]);

  // Check if user has completed onboarding and handle flow parameter
  useEffect(() => {
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const flow = urlParams.get('flow');
    
    const hasCompletedOnboarding = localStorage.getItem('coton-noir-onboarding');
    const hasCompletedProfile = localStorage.getItem('coton-noir-profile-onboarding');
    
    if (flow === 'onboarding') {
      // New user coming from signup - show welcome screen first
      setCurrentScreen('welcome');
      // Clear the flow parameter
      window.history.replaceState({}, '', window.location.pathname);
    } else if (hasCompletedOnboarding && hasCompletedProfile) {
      // User has completed both onboarding steps - go to home
      setCurrentScreen('home');
    } else if (hasCompletedOnboarding && !hasCompletedProfile) {
      // User completed onboarding but not profile setup
      setCurrentScreen('profile-onboarding');
    } else if (!hasCompletedOnboarding) {
      // User hasn't completed onboarding yet - start from splash
      setCurrentScreen('splash-init');
    } else {
      // Fallback to home for any edge case
      setCurrentScreen('home');
    }

    // Listen for navigation events
    const handleNavigateEvent = (event: CustomEvent) => {
      handleNavigate(event.detail);
    };

    window.addEventListener('navigate', handleNavigateEvent as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigateEvent as EventListener);
    };
  }, [user]); // Added user as dependency so it re-runs when user changes
  
  const handleCompleteOnboarding = () => {
    localStorage.setItem('coton-noir-onboarding', 'true');
    setCurrentScreen('profile-onboarding');
  };

  const handleCompleteProfileOnboarding = () => {
    localStorage.setItem('coton-noir-profile-onboarding', 'true');
    setCurrentScreen('home');
  };
  
  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'journal':
        setCurrentScreen('journal');
        break;
      case 'box':
        setCurrentScreen('box');
        break;
      case 'tutorials':
        setCurrentScreen('tutorials');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
      default:
        setCurrentScreen('home');
        break;
    }
  };
  
  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };
  
  const shouldShowNavigation = () => {
    return !['splash-init', 'welcome', 'onboarding', 'profile-onboarding', 'add-care', 'hair-profile', 'growth-tracker', 'wash-day-tracker', 'full-journal', 'rewards', 'detailed-routine', 'box-content', 'profile', 'language-selection'].includes(currentScreen);
  };
  
  const shouldShowHeader = () => {
    return !['splash-init', 'welcome', 'onboarding', 'profile-onboarding', 'add-care', 'hair-profile', 'growth-tracker', 'wash-day-tracker', 'full-journal', 'rewards', 'detailed-routine', 'box-content', 'profile', 'language-selection'].includes(currentScreen);
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash-init':
        return (
          <SplashInitScreen
            onContinue={() => handleNavigate('onboarding')}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            onContinue={() => handleNavigate('splash-init')}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={handleCompleteOnboarding}
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

      case 'rewards':
        return (
          <RewardsScreen
            onBack={handleBackToHome}
          />
        );

      case 'detailed-routine':
        return (
          <DetailedRoutineScreen
            onBack={handleBackToHome}
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
        
      
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={handleNavigate}
          />
        );

      case 'language-selection':
        return (
          <LanguageSelectionScreen
            onBack={() => handleNavigate('profile')}
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
  
  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-4">
            COTON NOIR
          </h1>
          <div className="animate-pulse text-muted-foreground">
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        {shouldShowHeader() && (
          <Header 
            onProfileClick={() => handleNavigate('hair-profile')}
            onHomeClick={handleBackToHome}
            onRewardsClick={() => handleNavigate('rewards')}
          />
        )}
        
        {/* Main Content - Mobile-first responsive */}
        <main className={`${shouldShowHeader() ? 'pt-0' : ''} ${shouldShowNavigation() ? 'pb-20' : 'pb-4'}`}>
          {renderScreen()}
        </main>
        
        {/* Floating Action Button - Mobile-first responsive */}
        {shouldShowFAB() && (
          <div className="fixed bottom-20 sm:bottom-24 right-4 z-40">
            {/* Add Care Button */}
            <Button
              size="icon"
              variant="hero"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg btn-touch"
              onClick={() => handleNavigate('add-care')}
            >
              <Plus size={20} className="sm:w-6 sm:h-6" />
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