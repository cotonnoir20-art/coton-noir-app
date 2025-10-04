import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscountCodesScreen } from '@/components/screens/DiscountCodesScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const DiscountCodes = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout>
        <DiscountCodesScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default DiscountCodes;
