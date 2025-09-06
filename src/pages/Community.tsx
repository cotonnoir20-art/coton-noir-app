import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityScreen } from '@/components/screens/CommunityScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Community = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <AppProvider>
      <Layout>
        <CommunityScreen onNavigate={handleNavigate} />
      </Layout>
    </AppProvider>
  );
};

export default Community;