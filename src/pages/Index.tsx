
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Index page - User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(209,250,229,0.5) 0%, rgba(16,185,129,0.1) 100%)'
        }}
      >
        <div className="w-24 h-24 rounded-full bg-pod-green-500 mb-6 animate-float flex items-center justify-center">
          <span className="text-3xl text-white">🎧</span>
        </div>
        
        <h1 className="text-4xl font-bold text-pod-green-900 mb-4 animate-fade-in">OpenPod</h1>
        <p className="text-xl text-pod-green-800 mb-8 max-w-md animate-slide-up">
          Transform your ideas into beautiful audio essays with ambient background music
        </p>
        
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <Button 
            onClick={() => navigate('/login')}
            className="py-6 text-lg bg-pod-green-600 hover:bg-pod-green-700 transition-all"
          >
            Get Started
          </Button>
          
          <Button 
            onClick={() => navigate('/pricing')}
            variant="outline"
            className="py-6 text-lg border-pod-green-500 text-pod-green-600 hover:bg-pod-green-50"
          >
            View Pricing
          </Button>
        </div>
      </div>
      
      <footer className="py-6 text-center text-pod-green-700 bg-white">
        <p>&copy; {new Date().getFullYear()} OpenPod. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
