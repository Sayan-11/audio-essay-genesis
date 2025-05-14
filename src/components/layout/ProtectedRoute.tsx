
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // For debugging
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      isLoading, 
      path: location.pathname,
      sessionExists: localStorage.getItem('openpod_user') !== null
    });
  }, [isAuthenticated, isLoading, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-pod-green-300 mb-4"></div>
          <div className="h-4 w-24 bg-pod-green-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Check localStorage as a backup in case context isn't updated
  const hasLocalStorageUser = localStorage.getItem('openpod_user') !== null;
  
  if (!isAuthenticated && !hasLocalStorageUser) {
    // Store the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
