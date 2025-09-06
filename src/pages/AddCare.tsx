import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddCareScreen } from '@/components/screens/AddCareScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const AddCare = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <AddCareScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default AddCare;