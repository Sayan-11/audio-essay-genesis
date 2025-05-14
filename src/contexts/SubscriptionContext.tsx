
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'standard' | 'premium' | null;

type SubscriptionLimits = {
  audioLimit: number;
  saveHistory: boolean;
}

type SubscriptionContextType = {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  audioGenerated: number;
  setTier: (tier: SubscriptionTier) => void;
  incrementAudioCount: () => void;
  canGenerateMoreAudio: boolean;
  isLoading: boolean;
};

const TIER_LIMITS: Record<string, SubscriptionLimits> = {
  'free': { audioLimit: 5, saveHistory: false },
  'standard': { audioLimit: 30, saveHistory: true },
  'premium': { audioLimit: 80, saveHistory: true },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>(null);
  const [audioGenerated, setAudioGenerated] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load subscription data when user changes
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from your backend
      const savedTier = localStorage.getItem('openpod_tier') as SubscriptionTier || 'free';
      const savedCount = parseInt(localStorage.getItem('openpod_audio_count') || '0');
      
      setTier(savedTier);
      setAudioGenerated(savedCount);
    } else {
      setTier(null);
      setAudioGenerated(0);
    }
    
    setIsLoading(false);
  }, [user]);

  // Save changes to localStorage
  useEffect(() => {
    if (tier) {
      localStorage.setItem('openpod_tier', tier);
      localStorage.setItem('openpod_audio_count', audioGenerated.toString());
    }
  }, [tier, audioGenerated]);

  const incrementAudioCount = () => {
    setAudioGenerated(prev => prev + 1);
  };

  const limits = tier ? TIER_LIMITS[tier] : { audioLimit: 0, saveHistory: false };
  
  const canGenerateMoreAudio = tier !== null && audioGenerated < limits.audioLimit;

  return (
    <SubscriptionContext.Provider 
      value={{ 
        tier, 
        limits, 
        audioGenerated, 
        setTier, 
        incrementAudioCount, 
        canGenerateMoreAudio,
        isLoading
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
