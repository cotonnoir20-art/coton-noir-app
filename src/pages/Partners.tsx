import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnersScreen } from '@/components/screens/PartnersScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Partners = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <AppProvider>
      <Layout>
        <PartnersScreen onNavigate={handleNavigate} />
      </Layout>
    </AppProvider>
  );
};

export default Partners;