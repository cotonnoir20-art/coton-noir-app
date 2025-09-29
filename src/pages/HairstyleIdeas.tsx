import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HairstyleIdeasScreen } from '@/components/screens/HairstyleIdeasScreen';
import { Layout } from '@/components/layout/Layout';

const HairstyleIdeas = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavigation={false} showFAB={false}>
      <HairstyleIdeasScreen onBack={() => navigate(-1)} />
    </Layout>
  );
};

export default HairstyleIdeas;