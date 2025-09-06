import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxScreen } from '@/components/screens/BoxScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Box = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'box-content':
        navigate('/box-content');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <AppProvider>
      <Layout>
        <BoxScreen onNavigate={handleNavigate} />
      </Layout>
    </AppProvider>
  );
};

export default Box;