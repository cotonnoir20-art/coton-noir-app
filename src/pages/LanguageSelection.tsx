import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSelectionScreen } from '@/components/screens/LanguageSelectionScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const LanguageSelection = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <LanguageSelectionScreen onBack={() => navigate('/profile')} />
      </Layout>
    </AppProvider>
  );
};

export default LanguageSelection;