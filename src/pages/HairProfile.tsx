import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HairProfileScreen } from '@/components/screens/HairProfileScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const HairProfile = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false}>
        <HairProfileScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default HairProfile;