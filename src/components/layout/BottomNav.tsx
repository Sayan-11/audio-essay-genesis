
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume, User, History } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';

// Define a more accurate Audio type that includes currentTime
interface AudioWithProgress {
  title: string;
  duration: number;
  currentTime: number;
}

const BottomNav = () => {
  const location = useLocation();
  const { currentAudio, isPlaying } = usePlayer();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  useEffect(() => {
    setShowMiniPlayer(!!currentAudio && location.pathname !== '/player');
  }, [currentAudio, location]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-pod-green-100 z-40">
      {/* Mini player */}
      {showMiniPlayer && (
        <Link to="/player" className="flex items-center p-3 bg-pod-green-50 text-pod-green-900">
          <div className="w-10 h-10 rounded-md bg-pod-green-200 flex-shrink-0 flex items-center justify-center">
            <Volume size={18} className="text-pod-green-700" />
          </div>
          <div className="ml-3 flex-1 truncate">
            <p className="font-medium truncate">{currentAudio?.title}</p>
            <div className="h-1 bg-pod-green-200 rounded-full mt-1">
              <div 
                className="h-full bg-pod-green-500 rounded-full" 
                style={{ 
                  width: `${currentAudio && 'currentTime' in currentAudio && 'duration' in currentAudio ? 
                    (currentAudio.duration > 0 ? (currentAudio.currentTime / currentAudio.duration) * 100 : 0) : 0}%` 
                }}
              ></div>
            </div>
          </div>
          <div className={`ml-2 w-2 h-2 rounded-full ${isPlaying ? 'bg-pod-green-500 animate-pulse' : 'bg-pod-green-300'}`}></div>
        </Link>
      )}

      {/* Navigation */}
      <div className="flex justify-around items-center h-16 px-4">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center p-2 ${location.pathname === '/dashboard' ? 'bottom-tab-active' : 'text-gray-500'}`}
        >
          <Volume size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link 
          to="/history" 
          className={`flex flex-col items-center p-2 ${location.pathname === '/history' ? 'bottom-tab-active' : 'text-gray-500'}`}
        >
          <History size={24} />
          <span className="text-xs mt-1">History</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${location.pathname === '/profile' ? 'bottom-tab-active' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
