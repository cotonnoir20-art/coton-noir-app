import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesScreen } from '@/components/screens/FavoritesScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Favorites = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Layout>
        <FavoritesScreen onBack={() => navigate('/')} />
      </Layout>
    </AppProvider>
  );
};

export default Favorites;
