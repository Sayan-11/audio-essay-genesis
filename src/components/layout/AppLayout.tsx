
import { useEffect } from 'react';
import BottomNav from './BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  fullHeight?: boolean;
}

const AppLayout = ({ children, hideNav = false, fullHeight = false }: AppLayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const { tier } = useSubscription();

  // Preload user data and subscription info
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(`User authenticated: ${user.email}`);
      console.log(`Current subscription tier: ${tier}`);
    }
  }, [isAuthenticated, user, tier]);

  return (
    <div className={`bg-background ${fullHeight ? 'min-h-screen' : ''}`}>
      <main className={`pb-${hideNav ? '0' : '20'}`}>
        {children}
      </main>
      {!hideNav && isAuthenticated && <BottomNav />}
    </div>
  );
};

export default AppLayout;
