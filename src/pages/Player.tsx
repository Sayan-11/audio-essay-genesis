
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { usePlayer } from '@/contexts/PlayerContext';
import PlayerControls from '@/components/ui/PlayerControls';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Player = () => {
  const navigate = useNavigate();
  const { currentAudio, isPlaying } = usePlayer();
  const [waveform, setWaveform] = useState<number[]>([]);
  
  // Generate a random waveform for visualization
  useEffect(() => {
    if (currentAudio) {
      const generateWaveform = () => {
        const bars = 70;
        const amplitudes = Array.from({ length: bars }, () => 
          Math.random() * 0.5 + 0.2 + (isPlaying ? Math.random() * 0.2 : 0)
        );
        setWaveform(amplitudes);
      };
      
      generateWaveform();
      const interval = setInterval(generateWaveform, 500);
      
      return () => clearInterval(interval);
    }
  }, [currentAudio, isPlaying]);

  if (!currentAudio) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-pod-green-100 flex items-center justify-center mb-4">
            <span className="text-xl">🎵</span>
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No audio playing</h2>
          <p className="text-gray-500 text-center mb-6">
            Generate an audio essay to start listening
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-pod-green-50 to-white">
        <header className="p-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-pod-green-700"
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-pod-green-900 ml-2">Now Playing</h1>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-48 h-48 rounded-xl bg-pod-green-400 shadow-lg mb-8 flex items-center justify-center">
            <span className="text-5xl">🎧</span>
          </div>
          
          <h2 className="text-xl font-bold text-pod-green-900 mb-2 text-center">
            {currentAudio.title}
          </h2>
          <p className="text-pod-green-600 text-center mb-12">
            OpenPod Audio Essay
          </p>
          
          <div className="w-full h-24 mb-12 flex items-center justify-center">
            <div className="w-full flex items-end justify-center space-x-1">
              {waveform.map((height, i) => (
                <div
                  key={i}
                  className={`w-1 bg-pod-green-500 rounded-full transition-all duration-200 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    height: `${height * 100}%`,
                    opacity: isPlaying ? 0.7 + Math.random() * 0.3 : 0.4
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 pb-12">
          <PlayerControls />
        </div>
      </div>
    </AppLayout>
  );
};

export default Player;
