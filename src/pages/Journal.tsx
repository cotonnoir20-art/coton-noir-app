import React from 'react';
import { JournalScreen } from '@/components/screens/JournalScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Journal = () => {
  return (
    <AppProvider>
      <Layout>
        <JournalScreen />
      </Layout>
    </AppProvider>
  );
};

export default Journal;