import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TutorialsScreen } from '@/components/screens/TutorialsScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Tutorials = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return (
    <AppProvider>
      <Layout>
        <TutorialsScreen onNavigate={handleNavigate} />
      </Layout>
    </AppProvider>
  );
};

export default Tutorials;