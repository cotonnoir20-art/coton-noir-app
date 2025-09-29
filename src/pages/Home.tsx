import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'add-care':
        navigate('/add-care');
        break;
      case 'hair-profile':
        navigate('/hair-profile');
        break;
      case 'growth-tracker':
        navigate('/growth-tracker');
        break;
      case 'wash-day-tracker':
        navigate('/wash-day-tracker');
        break;
      case 'rewards':
        navigate('/rewards');
        break;
      case 'detailed-routine':
        navigate('/detailed-routine');
        break;
      case 'box':
        navigate('/box');
        break;
      case 'partners':
        navigate('/partners');
        break;
      case 'community':
        navigate('/community');
        break;
      case 'premium':
        navigate('/premium');
        break;
      case 'journal':
        navigate('/journal');
        break;
      case 'referral':
        navigate('/referral');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <AppProvider>
      <Layout>
        <HomeScreen
          onNavigate={handleNavigate}
          onAddCare={() => navigate('/add-care')}
          onShowProfile={() => navigate('/hair-profile')}
        />
      </Layout>
    </AppProvider>
  );
};

export default Home;