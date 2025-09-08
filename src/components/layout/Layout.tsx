import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { MobileNav } from '@/components/ui/mobile-nav';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  showFAB?: boolean;
}

export function Layout({ children, showHeader = true, showNavigation = true, showFAB = true }: LayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to auth if user is not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, loading, navigate]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/journal') return 'journal';
    if (path === '/box') return 'box';
    if (path === '/tutorials') return 'tutorials';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'journal':
        navigate('/journal');
        break;
      case 'box':
        navigate('/box');
        break;
      case 'tutorials':
        navigate('/tutorials');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
        break;
    }
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-4">
            COTON NOIR
          </h1>
          <div className="animate-pulse text-muted-foreground">
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {showHeader && <Header />}
      
      {/* Main Content - Mobile-first responsive */}
      <main className={`${showHeader ? 'pt-0' : ''} ${showNavigation ? 'pb-20' : 'pb-4'}`}>
        {children}
      </main>
      
      {/* Floating Action Button - Mobile-first responsive */}
      {showFAB && (
        <div className="fixed bottom-24 sm:bottom-28 right-4 z-40">
          <Button
            size="icon"
            variant="black"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-premium hover:shadow-glow btn-touch animate-scale-in"
            onClick={() => navigate('/add-care')}
          >
            <Plus size={22} className="sm:w-7 sm:h-7" />
          </Button>
        </div>
      )}
      
      {/* Mobile Navigation */}
      {showNavigation && (
        <MobileNav
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}