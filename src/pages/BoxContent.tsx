import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxContentScreen } from '@/components/screens/BoxContentScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const BoxContent = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <BoxContentScreen onBack={() => navigate('/box')} />
      </Layout>
    </AppProvider>
  );
};

export default BoxContent;