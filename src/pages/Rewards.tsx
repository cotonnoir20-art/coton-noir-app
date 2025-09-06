import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RewardsScreen } from '@/components/screens/RewardsScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Rewards = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <RewardsScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default Rewards;