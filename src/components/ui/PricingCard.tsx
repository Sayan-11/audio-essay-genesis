
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  tier: 'free' | 'standard' | 'premium';
  popular?: boolean;
}

const PricingCard = ({ title, price, features, tier, popular = false }: PricingCardProps) => {
  const navigate = useNavigate();
  const { setTier } = useSubscription();
  const { isAuthenticated } = useAuth();
  
  const handleSelectPlan = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // If it's a free plan, just set it and go to dashboard
    if (tier === 'free') {
      setTier(tier);
      navigate('/dashboard');
      toast({
        title: "Free plan activated",
        description: "You've successfully activated the free plan."
      });
      return;
    }
    
    // Mock payment flow - in real app this would connect to Stripe
    // For demo, we'll just set the tier and navigate to dashboard
    setTimeout(() => {
      setTier(tier);
      navigate('/dashboard');
      toast({
        title: "Subscription active",
        description: `Your ${title} plan is now active.`
      });
    }, 1000);
  };
  
  return (
    <div 
      className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
        popular 
          ? 'border-2 border-pod-green-500 shadow-lg transform scale-105 bg-pod-green-50' 
          : 'border border-pod-green-200 bg-white'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-0 right-0 mx-auto w-32 text-center text-sm font-medium py-1 px-2 bg-pod-green-500 text-white rounded-full">
          Most Popular
        </span>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-pod-green-900">{title}</h3>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-4xl font-extrabold text-pod-green-700">${price}</span>
          <span className="ml-1 text-xl text-pod-green-500">/month</span>
        </div>
      </div>
      
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-pod-green-500" />
            </div>
            <p className="ml-3 text-sm text-gray-700">{feature}</p>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        <Button 
          onClick={handleSelectPlan}
          className={`w-full py-6 ${
            popular 
              ? 'bg-pod-green-600 hover:bg-pod-green-700' 
              : 'bg-pod-green-500 hover:bg-pod-green-600'
          }`}
        >
          {tier === 'free' ? 'Get Started' : 'Subscribe Now'}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
