
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { usePlayer } from '@/contexts/PlayerContext';
import AudioGenerator from '@/components/ui/AudioGenerator';
import AudioCard from '@/components/ui/AudioCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tier, limits } = useSubscription();
  const { audioCollection } = usePlayer();
  const [recentAudios, setRecentAudios] = useState([]);

  // Get the 3 most recent audios for the quick access section
  useEffect(() => {
    setRecentAudios(audioCollection.slice(0, 3));
  }, [audioCollection]);

  return (
    <AppLayout>
      <div className="p-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-pod-green-900">Create Audio Essay</h1>
          <p className="text-pod-green-600">
            Enter a prompt to generate an audio essay
          </p>
        </header>
        
        <AudioGenerator />
        
        {recentAudios.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pod-green-800">Recent Audios</h2>
              {limits.saveHistory && (
                <button 
                  onClick={() => navigate('/history')}
                  className="text-sm text-pod-green-600"
                >
                  View all
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {recentAudios.map((audio) => (
                <AudioCard key={audio.id} audio={audio} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12 p-4 bg-pod-green-50 rounded-lg border border-pod-green-100">
          <h3 className="font-medium text-pod-green-900 mb-2">Your Plan: {tier?.charAt(0).toUpperCase() + tier?.slice(1)}</h3>
          <div className="flex items-center">
            <div className="h-2 flex-1 bg-pod-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pod-green-500 rounded-full" 
                style={{ width: `${(limits?.audioLimit ? audioCollection.length / limits.audioLimit * 100 : 0)}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm text-pod-green-700">
              {audioCollection.length}/{limits?.audioLimit} audios
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
