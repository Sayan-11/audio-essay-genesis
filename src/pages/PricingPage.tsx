
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PricingCard from '@/components/ui/PricingCard';
import { Button } from '@/components/ui/button';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Free plan features
  const freePlanFeatures = [
    "5 audio essays per month",
    "Standard quality audio",
    "Basic voices selection",
    "Listen once policy"
  ];

  // Standard plan features
  const standardPlanFeatures = [
    "30 audio essays per month",
    "High quality audio",
    "Full voice selection",
    "Save and re-listen to all audios",
    "Background ambient sounds"
  ];

  // Premium plan features
  const premiumPlanFeatures = [
    "80 audio essays per month",
    "Ultra high quality audio",
    "Premium exclusive voices",
    "Save and re-listen to all audios",
    "All ambient sound options",
    "Priority support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pod-green-50 to-white">
      <header className="py-6 px-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pod-green-500 flex items-center justify-center mr-2">
              <span className="text-lg text-white">🎧</span>
            </div>
            <span className="font-bold text-xl text-pod-green-900">OpenPod</span>
          </div>
          
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-pod-green-500 text-pod-green-600 hover:bg-pod-green-50"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>
      
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-pod-green-900 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-pod-green-700 max-w-2xl mx-auto">
              Flexible options to fit your audio essay creation needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative">
            <PricingCard
              title="Free"
              price={0}
              features={freePlanFeatures}
              tier="free"
            />
            
            <PricingCard
              title="Standard"
              price={20}
              features={standardPlanFeatures}
              tier="standard"
              popular={true}
            />
            
            <PricingCard
              title="Premium"
              price={50}
              features={premiumPlanFeatures}
              tier="premium"
            />
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">
              All plans include our core audio essay generation technology
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="link"
              className="text-pod-green-600"
            >
              Back to home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
