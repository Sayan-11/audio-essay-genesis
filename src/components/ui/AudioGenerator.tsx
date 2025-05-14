
import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { usePlayer, Audio } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import LengthSelector from '@/components/ui/LengthSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Suggestion prompts for the input
const PROMPT_SUGGESTIONS = [
  "Explain the history of jazz music",
  "Tell me about the rise of artificial intelligence",
  "Discuss the benefits of mindfulness meditation",
  "Explore the future of space travel",
  "Narrate a short mystery story"
];

// Available voices
const VOICES = [
  { id: 'sarah', name: 'Sarah - Female' },
  { id: 'roger', name: 'Roger - Male' },
  { id: 'aria', name: 'Aria - Female' },
  { id: 'george', name: 'George - Male' }
];

// Available ambient sounds
const AMBIENT_SOUNDS = [
  { id: 'none', name: 'None' },
  { id: 'rain', name: 'Gentle Rain' },
  { id: 'forest', name: 'Forest Ambiance' },
  { id: 'cafe', name: 'Café Background' },
  { id: 'waves', name: 'Ocean Waves' }
];

const AudioGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [length, setLength] = useState(3); // in minutes
  const [lengthOption, setLengthOption] = useState("short");
  const [voice, setVoice] = useState('sarah');
  const [ambient, setAmbient] = useState('none');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { canGenerateMoreAudio, audioGenerated, incrementAudioCount, limits, tier } = useSubscription();
  const { addAudio, playAudio } = usePlayer();
  
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle length option change
  const handleLengthChange = (option: string, minutes: number) => {
    setLengthOption(option);
    setLength(minutes);
  };

  // Setup typing animation for suggestions
  useEffect(() => {
    let currentIndex = 0;
    let currentSuggestion = '';
    let currentCharIndex = 0;
    
    const animateSuggestions = () => {
      if (prompt !== '') {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setSuggestion('');
        setIsTyping(false);
        return;
      }
      
      setIsTyping(true);
      
      if (currentCharIndex === 0) {
        currentSuggestion = PROMPT_SUGGESTIONS[currentIndex];
      }
      
      if (currentCharIndex < currentSuggestion.length) {
        setSuggestion(currentSuggestion.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      } else {
        // Pause at the end of each suggestion
        clearInterval(typingIntervalRef.current!);
        
        setTimeout(() => {
          // Clear the suggestion letter by letter
          typingIntervalRef.current = setInterval(() => {
            if (currentCharIndex > 0) {
              currentCharIndex--;
              setSuggestion(currentSuggestion.substring(0, currentCharIndex));
            } else {
              clearInterval(typingIntervalRef.current!);
              currentIndex = (currentIndex + 1) % PROMPT_SUGGESTIONS.length;
              // Start typing the next suggestion
              typingIntervalRef.current = setInterval(animateSuggestions, 80);
            }
          }, 30);
        }, 2000);
      }
    };
    
    typingIntervalRef.current = setInterval(animateSuggestions, 80);
    
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [prompt]);
  
  const handleGenerate = () => {
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "Empty prompt",
        description: "Please enter a prompt to generate audio.",
      });
      return;
    }
    
    if (!canGenerateMoreAudio) {
      toast({
        variant: "destructive",
        title: "Generation limit reached",
        description: `You've reached your monthly limit of ${limits.audioLimit} audio generations.`,
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Mock API call for generating audio
    setTimeout(() => {
      const generatedAudio: Audio = {
        id: `audio_${Date.now()}`,
        title: prompt,
        duration: length * 60, // Convert minutes to seconds
        created: new Date(),
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock URL
      };
      
      addAudio(generatedAudio);
      incrementAudioCount();
      
      toast({
        title: "Audio Generated",
        description: "Your audio essay has been successfully created.",
      });
      
      setIsGenerating(false);
      setPrompt('');
      
      // Start playing the audio
      playAudio(generatedAudio);
    }, 3000);
  };
  
  return (
    <div className="py-6">
      <div className="relative mb-6">
        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder=""
          className="w-full p-4 pr-12 text-lg rounded-xl border-2 border-pod-green-200 focus:border-pod-green-500 focus:ring-pod-green-500 focus:outline-none transition-colors bg-white dark:bg-pod-green-800 dark:border-pod-green-700 dark:text-white"
        />
        {isTyping && prompt === '' && (
          <div className="absolute left-4 top-4 text-lg prompt-suggestions pointer-events-none">
            {suggestion}
          </div>
        )}
        {!isTyping && prompt === '' && !suggestion && (
          <div className="absolute left-4 top-4 text-lg pointer-events-none text-gray-400 dark:text-gray-500">
            What would you like to hear about?
          </div>
        )}
      </div>
      
      <div className="space-y-6 mb-8">
        <LengthSelector 
          value={lengthOption} 
          onValueChange={handleLengthChange}
        />
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Voice</label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="w-full bg-white dark:bg-pod-green-800 border-pod-green-200 dark:border-pod-green-600">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-pod-green-800">
              {VOICES.map((voiceOption) => (
                <SelectItem key={voiceOption.id} value={voiceOption.id}>
                  {voiceOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ambient Sound</label>
          <Select value={ambient} onValueChange={setAmbient}>
            <SelectTrigger className="w-full bg-white dark:bg-pod-green-800 border-pod-green-200 dark:border-pod-green-600">
              <SelectValue placeholder="Select ambient sound" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-pod-green-800">
              {AMBIENT_SOUNDS.map((sound) => (
                <SelectItem key={sound.id} value={sound.id}>
                  {sound.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="fixed bottom-20 left-4 right-4 z-30">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !canGenerateMoreAudio || prompt === ''}
          className="w-full py-6 text-lg bg-pod-green-500 hover:bg-pod-green-600 shadow-lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Audio Essay'}
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {audioGenerated}/{limits.audioLimit} audios generated this month
      </div>
    </div>
  );
};

export default AudioGenerator;
