import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WashDayTrackerScreen } from '@/components/screens/WashDayTrackerScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const WashDayTracker = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <WashDayTrackerScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default WashDayTracker;