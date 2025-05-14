
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, SubscriptionTier } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const TIER_DETAILS: Record<string, { name: string, audioLimit: number, price: number }> = {
  'free': { name: 'Free', audioLimit: 5, price: 0 },
  'standard': { name: 'Standard', audioLimit: 30, price: 20 },
  'premium': { name: 'Premium', audioLimit: 80, price: 50 },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tier, audioGenerated } = useSubscription();
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
      <div className="p-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-pod-green-900">Profile</h1>
          <p className="text-pod-green-600">
            Manage your account and subscription
          </p>
        </header>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-pod-green-100 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL}
                      alt={user.displayName || 'User'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xl text-pod-green-700">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                <div className="ml-4">
                  <p className="font-medium text-lg">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {Object.entries(TIER_DETAILS).map(([key, details]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg border ${
                      tier === key 
                        ? 'border-pod-green-500 bg-pod-green-50 shadow-sm' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{details.name}</span>
                      {tier === key && (
                        <span className="text-xs bg-pod-green-500 text-white px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold">${details.price}</p>
                    <p className="text-sm text-gray-600 mt-1">{details.audioLimit} audios/month</p>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Usage this month</span>
                  <span className="text-sm font-medium">
                    {audioGenerated}/{TIER_DETAILS[tier || 'free'].audioLimit} audios
                  </span>
                </div>
                <div className="h-2 bg-pod-green-100 rounded-full overflow-hidden">
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
              className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
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
