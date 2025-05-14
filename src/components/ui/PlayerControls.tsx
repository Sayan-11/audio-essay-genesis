
import { useRef, useState, useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Timer,
  VolumeX
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerControls = () => {
  const { 
    currentAudio, 
    isPlaying, 
    currentTime,
    duration,
    volume,
    sleepTimer,
    pauseAudio,
    resumeAudio,
    seekTo,
    setVolume,
    setSleepTimer
  } = usePlayer();
  
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);
  
  // Set up a more responsive progress bar
  useEffect(() => {
    if (isPlaying) {
      progressRef.current = currentTime;
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      progressInterval.current = setInterval(() => {
        progressRef.current += 0.1;
        updateProgressBar(progressRef.current);
      }, 100);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTime]);
  
  // Update visual progress without constant re-rendering
  const updateProgressBar = (time: number) => {
    if (!duration) return;
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const percentage = (time / duration) * 100;
      progressBar.style.width = `${percentage}%`;
    }
    
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
      currentTimeElement.textContent = formatTime(time);
    }
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };
  
  const handleSeek = (values: number[]) => {
    seekTo(values[0]);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };
  
  const handleSleepTimerChange = (value: string) => {
    if (value === 'off') {
      setSleepTimer(null);
    } else {
      setSleepTimer(parseInt(value));
    }
  };
  
  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <span id="current-time">{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="relative h-2 bg-pod-green-100 rounded-full mb-6">
        <div
          id="progress-bar"
          className="absolute h-full bg-pod-green-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        ></div>
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="absolute inset-0 opacity-0"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="text-pod-green-700 hover:text-pod-green-900 hover:bg-pod-green-50"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          >
            {localVolume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </Button>
          
          {showVolumeSlider && (
            <div className="absolute bottom-28 left-4 w-44 bg-white p-4 rounded-lg shadow-lg border border-pod-green-100 z-50">
              <Slider
                value={[localVolume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-pod-green-700 hover:text-pod-green-900 hover:bg-pod-green-50"
            onClick={() => {/* Skip back implementation */}}
          >
            <SkipBack size={24} />
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-pod-green-500 text-pod-green-500 hover:text-white hover:bg-pod-green-500"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="text-pod-green-700 hover:text-pod-green-900 hover:bg-pod-green-50"
            onClick={() => {/* Skip forward implementation */}}
          >
            <SkipForward size={24} />
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={`text-pod-green-700 hover:text-pod-green-900 hover:bg-pod-green-50 ${
                sleepTimer ? 'text-pod-green-500' : ''
              }`}
            >
              <Timer size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sleep Timer</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={sleepTimer ? sleepTimer.toString() : 'off'}
                onValueChange={handleSleepTimerChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timer duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
              {sleepTimer && (
                <p className="mt-4 text-center text-sm text-pod-green-700">
                  Player will stop after {sleepTimer} minutes
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlayerControls;
