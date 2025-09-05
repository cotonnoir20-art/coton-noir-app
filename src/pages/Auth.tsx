import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { SignupScreen } from '@/components/screens/SignupScreen';
import { SignupFormScreen } from '@/components/screens/SignupFormScreen';
import { ForgotPasswordScreen } from '@/components/screens/ForgotPasswordScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { useAuth } from '@/hooks/useAuth';

type AuthScreen = 'login' | 'signup' | 'onboarding' | 'signup-form' | 'forgot-password';

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
    // For actual signup (signup-form), redirect to welcome flow
    navigate('/?flow=welcome');
  };

  const handleLoginSuccess = () => {
    // For login, go directly to home
    navigate('/');
  };

  const handleOnboardingComplete = () => {
    // After onboarding benefits, show signup form
    setCurrentScreen('signup-form');
  };

  const handleBenefitsStart = () => {
    // From signup preview to onboarding benefits
    setCurrentScreen('onboarding');
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
        return (
          <SignupScreen
            onNavigate={handleNavigate}
            onSignupSuccess={handleBenefitsStart}
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
          />
        );
      case 'signup-form':
        return (
          <SignupFormScreen
            onNavigate={handleNavigate}
            onSignupSuccess={handleAuthSuccess}
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
            onLoginSuccess={handleAuthSuccess}
          />
        );
    }
  };

  return renderScreen();
};

export default Auth;