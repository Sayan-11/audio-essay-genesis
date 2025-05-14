
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pod-green-50 to-white p-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-pod-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🔍</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-pod-green-900">404</h1>
        <p className="text-xl text-pod-green-700 mb-8">
          Oops! We can't find that page
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-pod-green-500 hover:bg-pod-green-600 w-full sm:w-auto"
          >
            Go to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-pod-green-300 text-pod-green-600 hover:bg-pod-green-50 w-full sm:w-auto sm:ml-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
