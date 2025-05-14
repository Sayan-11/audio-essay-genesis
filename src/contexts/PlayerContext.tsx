
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export type Audio = {
  id: string;
  title: string;
  duration: number;
  created: Date;
  url: string;
  coverImage?: string;
};

type PlayerContextType = {
  currentAudio: Audio | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioCollection: Audio[];
  sleepTimer: number | null;
  
  playAudio: (audio: Audio) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  addAudio: (audio: Audio) => void;
  setSleepTimer: (minutes: number | null) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState<Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [audioCollection, setAudioCollection] = useState<Audio[]>([]);
  const [sleepTimer, setSleepTimerState] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const timeUpdateHandler = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };
    
    const loadedDataHandler = () => {
      setDuration(audio.duration);
    };
    
    const endedHandler = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('loadeddata', loadedDataHandler);
    audio.addEventListener('ended', endedHandler);
    
    return () => {
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('loadeddata', loadedDataHandler);
      audio.removeEventListener('ended', endedHandler);
      audio.pause();
    };
  }, []);

  // Handle sleep timer
  useEffect(() => {
    if (sleepTimer === null) {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
        sleepTimerRef.current = null;
      }
      return;
    }
    
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }
    
    sleepTimerRef.current = setTimeout(() => {
      pauseAudio();
      setSleepTimerState(null);
    }, sleepTimer * 60 * 1000);
    
    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepTimer]);

  // Load saved audio collection
  useEffect(() => {
    const savedAudios = localStorage.getItem('openpod_audios');
    if (savedAudios) {
      try {
        const parsedAudios = JSON.parse(savedAudios);
        
        // Convert string dates back to Date objects
        const processedAudios = parsedAudios.map((audio: any) => ({
          ...audio,
          created: new Date(audio.created)
        }));
        
        setAudioCollection(processedAudios);
      } catch (error) {
        console.error('Error loading saved audios:', error);
      }
    }
  }, []);

  // Save audio collection when it changes
  useEffect(() => {
    if (audioCollection.length > 0) {
      localStorage.setItem('openpod_audios', JSON.stringify(audioCollection));
    }
  }, [audioCollection]);

  const playAudio = (audio: Audio) => {
    if (audioRef.current) {
      // If we're already playing something, pause it first
      if (currentAudio && isPlaying) {
        audioRef.current.pause();
      }
      
      // Set the new audio
      setCurrentAudio(audio);
      audioRef.current.src = audio.url;
      audioRef.current.volume = volume;
      
      // Play the audio
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && !isPlaying && currentAudio) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error resuming audio:', error);
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const addAudio = (audio: Audio) => {
    setAudioCollection(prev => [audio, ...prev]);
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerState(minutes);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentAudio,
        isPlaying,
        currentTime,
        duration,
        volume,
        audioCollection,
        sleepTimer,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekTo,
        setVolume,
        addAudio,
        setSleepTimer
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
