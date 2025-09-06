import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Profile = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'language-selection':
        navigate('/language-selection');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <AppProvider>
      <Layout>
        <ProfileScreen onNavigate={handleNavigate} />
      </Layout>
    </AppProvider>
  );
};

export default Profile;