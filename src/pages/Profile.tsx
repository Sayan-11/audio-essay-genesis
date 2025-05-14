
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, SubscriptionTier } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Moon, Sun } from 'lucide-react';

const TIER_DETAILS: Record<string, { name: string, audioLimit: number, price: number }> = {
  'free': { name: 'Free', audioLimit: 5, price: 0 },
  'standard': { name: 'Standard', audioLimit: 30, price: 20 },
  'premium': { name: 'Premium', audioLimit: 80, price: 50 },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tier, audioGenerated } = useSubscription();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Could not log out. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <AppLayout>
      <div className="p-4 pb-24 max-w-md mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-pod-green-800 dark:text-pod-green-300">Profile</h1>
          <p className="text-pod-green-600 dark:text-pod-green-400">
            Manage your account and subscription
          </p>
        </header>
        
        <div className="space-y-5">
          <Card className="dark:bg-pod-green-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Account Information</CardTitle>
              <CardDescription className="dark:text-gray-300">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-pod-green-100 dark:bg-pod-green-700 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL}
                      alt={user.displayName || 'User'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xl text-pod-green-700 dark:text-pod-green-200">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                <div className="ml-4">
                  <p className="font-medium text-lg dark:text-white">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300">{user?.email}</p>
                </div>
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 mr-2 text-pod-green-400" />
                  ) : (
                    <Sun className="h-5 w-5 mr-2 text-pod-green-500" />
                  )}
                  <span className="font-medium dark:text-white">Dark Mode</span>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-pod-green-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Subscription</CardTitle>
              <CardDescription className="dark:text-gray-300">Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {Object.entries(TIER_DETAILS).map(([key, details]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg border ${
                      tier === key 
                        ? 'border-pod-green-500 bg-pod-green-50 dark:bg-pod-green-700/40 dark:border-pod-green-400 shadow-sm' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium dark:text-white">{details.name}</span>
                      {tier === key && (
                        <span className="text-xs bg-pod-green-500 text-white px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold dark:text-white">${details.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{details.audioLimit} audios/month</p>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm dark:text-gray-300">Usage this month</span>
                  <span className="text-sm font-medium dark:text-white">
                    {audioGenerated}/{TIER_DETAILS[tier || 'free'].audioLimit} audios
                  </span>
                </div>
                <div className="h-2 bg-pod-green-100 dark:bg-pod-green-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pod-green-500 rounded-full"
                    style={{ 
                      width: `${(audioGenerated / TIER_DETAILS[tier || 'free'].audioLimit) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {tier !== 'premium' && (
                <Button 
                  onClick={handleUpgrade} 
                  className="w-full mt-4"
                >
                  Upgrade Plan
                </Button>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
