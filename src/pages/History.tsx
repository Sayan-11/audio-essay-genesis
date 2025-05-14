
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { usePlayer, Audio } from '@/contexts/PlayerContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import AudioCard from '@/components/ui/AudioCard';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const History = () => {
  const navigate = useNavigate();
  const { audioCollection } = usePlayer();
  const { tier, limits } = useSubscription();
  const [audiosByDate, setAudiosByDate] = useState<Record<string, Audio[]>>({});

  useEffect(() => {
    // Check if the user is allowed to access history
    if (!limits.saveHistory) {
      navigate('/dashboard');
      return;
    }
    
    // Group audios by date
    const groupedAudios: Record<string, Audio[]> = {};
    
    audioCollection.forEach((audio) => {
      const dateKey = format(new Date(audio.created), 'yyyy-MM-dd');
      
      if (!groupedAudios[dateKey]) {
        groupedAudios[dateKey] = [];
      }
      
      groupedAudios[dateKey].push(audio);
    });
    
    setAudiosByDate(groupedAudios);
  }, [audioCollection, limits.saveHistory, navigate]);

  return (
    <AppLayout>
      <div className="p-6 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-pod-green-900">History</h1>
          <p className="text-pod-green-600">
            Your previously generated audio essays
          </p>
        </header>
        
        {Object.keys(audiosByDate).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(audiosByDate).map(([date, audios]) => (
              <div key={date}>
                <h2 className="text-sm font-medium text-gray-500 mb-3">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </h2>
                <div className="space-y-3">
                  {audios.map((audio) => (
                    <AudioCard key={audio.id} audio={audio} showDetails={true} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-pod-green-100 flex items-center justify-center mb-4">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No history yet</h3>
            <p className="text-gray-500 text-center">
              Generate your first audio essay to see it here
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
