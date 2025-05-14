
import { useEffect } from 'react';
import BottomNav from './BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  fullHeight?: boolean;
}

const AppLayout = ({ children, hideNav = false, fullHeight = false }: AppLayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const { tier } = useSubscription();
  const { theme } = useTheme();

  // Preload user data and subscription info
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(`User authenticated: ${user.email}`);
      console.log(`Current subscription tier: ${tier}`);
      console.log(`Current theme: ${theme}`);
    }
  }, [isAuthenticated, user, tier, theme]);

  return (
    <div className={`bg-background transition-colors duration-300 ${fullHeight ? 'min-h-screen' : ''}`}>
      <main className={`pb-${hideNav ? '0' : '20'}`}>
        {children}
      </main>
      {!hideNav && isAuthenticated && <BottomNav />}
    </div>
  );
};

export default AppLayout;
