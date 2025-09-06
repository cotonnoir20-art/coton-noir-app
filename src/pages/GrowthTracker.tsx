import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowthTrackerScreen } from '@/components/screens/GrowthTrackerScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const GrowthTracker = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <GrowthTrackerScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default GrowthTracker;