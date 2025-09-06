import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FullJournalScreen } from '@/components/screens/FullJournalScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const FullJournal = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout showNavigation={false} showFAB={false}>
        <FullJournalScreen onBack={() => navigate('/journal')} />
      </Layout>
    </AppProvider>
  );
};

export default FullJournal;