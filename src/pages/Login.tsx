
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  // If user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Login page - Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    try {
      await loginWithGoogle();
      console.log('Login successful, redirecting to:', from);
      // The useEffect above will handle the redirect
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Could not log in with Google. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-pod-green-50 to-white">
      <div className="w-16 h-16 rounded-full bg-pod-green-500 mb-6 flex items-center justify-center">
        <span className="text-2xl text-white">🎧</span>
      </div>
      
      <h1 className="text-3xl font-bold text-pod-green-900 mb-6">Welcome to OpenPod</h1>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-pod-green-100">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-pod-green-800">Sign in to continue</h2>
            <p className="text-sm text-gray-500 mt-1">Generate beautiful audio essays with just a prompt</p>
          </div>
          
          <Button
            onClick={handleGoogleLogin}
            disabled={isProcessing || isLoading}
            className="w-full py-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 relative"
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span>{isProcessing ? 'Signing in...' : 'Continue with Google'}</span>
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to OpenPod's{' '}
            <a href="#" className="text-pod-green-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-pod-green-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          variant="link"
          onClick={() => navigate('/')}
          className="text-pod-green-600"
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default Login;
