import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { SignupScreen } from '@/components/screens/SignupScreen';
import { SignupFormScreen } from '@/components/screens/SignupFormScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { ForgotPasswordScreen } from '@/components/screens/ForgotPasswordScreen';
import { useAuth } from '@/hooks/useAuth';

type AuthScreen = 'login' | 'signup' | 'signup-form' | 'onboarding' | 'welcome' | 'forgot-password';

const Auth = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as AuthScreen);
  };

  const handleAuthSuccess = () => {
    // For signup, go to welcome screen
    setCurrentScreen('welcome');
  };

  const handleLoginSuccess = () => {
    // For login, go directly to home
    navigate('/');
  };

  const handleWelcomeComplete = () => {
    // After welcome, redirect to main app with profile onboarding flow
    navigate('/?flow=profile-onboarding');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'signup':
        // Show benefits preview first
        return (
          <SignupScreen
            onNavigate={handleNavigate}
            onSignupSuccess={handleAuthSuccess}
          />
        );
      case 'onboarding':
        // Show detailed onboarding slides
        return (
          <OnboardingScreen
            onComplete={() => setCurrentScreen('signup-form')}
          />
        );
      case 'signup-form':
        // Actual signup form
        return (
          <SignupFormScreen
            onNavigate={handleNavigate}
            onSignupSuccess={handleAuthSuccess}
          />
        );
      case 'welcome':
        // Welcome screen after signup
        return (
          <WelcomeScreen
            onContinue={handleWelcomeComplete}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );
    }
  };

  return renderScreen();
};

export default Auth;