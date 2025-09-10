import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReferralScreen } from '@/components/screens/ReferralScreen';
import { Layout } from '@/components/layout/Layout';

const Referral = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavigation={false} showFAB={false}>
      <ReferralScreen onBack={() => navigate(-1)} />
    </Layout>
  );
};

export default Referral;