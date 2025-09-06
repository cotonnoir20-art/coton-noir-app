import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailedRoutineScreen } from '@/components/screens/DetailedRoutineScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const DetailedRoutine = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <DetailedRoutineScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default DetailedRoutine;