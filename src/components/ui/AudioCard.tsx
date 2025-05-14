
import { useState } from 'react';
import { format } from 'date-fns';
import { Audio, usePlayer } from '@/contexts/PlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume, Play, Pause } from 'lucide-react';

interface AudioCardProps {
  audio: Audio;
  showDetails?: boolean;
}

const AudioCard = ({ audio, showDetails = false }: AudioCardProps) => {
  const { currentAudio, isPlaying, playAudio, pauseAudio, resumeAudio } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  
  const isCurrentlyPlaying = currentAudio?.id === audio.id && isPlaying;
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = () => {
    if (currentAudio?.id === audio.id) {
      if (isPlaying) {
        pauseAudio();
      } else {
        resumeAudio();
      }
    } else {
      playAudio(audio);
    }
  };
  
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-md' : ''
      } ${currentAudio?.id === audio.id ? 'border-pod-green-500' : 'border-border'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div 
            className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${
              isCurrentlyPlaying ? 'bg-pod-green-500' : 'bg-pod-green-100'
            }`}
          >
            {audio.coverImage ? (
              <img 
                src={audio.coverImage} 
                alt={audio.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <Volume 
                size={20} 
                className={isCurrentlyPlaying ? 'text-white animate-pulse' : 'text-pod-green-700'}
              />
            )}
          </div>
          
          <div className="ml-4 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{audio.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span>{formatDuration(audio.duration)}</span>
              {showDetails && (
                <span className="ml-2 text-gray-400">•</span>
              )}
              {showDetails && (
                <span className="ml-2">{format(audio.created, 'MMM d, yyyy')}</span>
              )}
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePlayPause}
            className={`mr-2 ${isCurrentlyPlaying ? 'text-pod-green-500' : 'text-gray-700'}`}
          >
            {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioCard;
