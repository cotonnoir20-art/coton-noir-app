import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HairProfileScreen } from '@/components/screens/HairProfileScreen';
import { Layout } from '@/components/layout/Layout';

const HairProfile = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavigation={false}>
      <HairProfileScreen onBack={() => navigate('/')} />
    </Layout>
  );
};

export default HairProfile;