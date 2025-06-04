
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

const AudioControls = ({ 
  isPlaying, 
  onTogglePlayback, 
  onSkipForward, 
  onSkipBackward 
}: AudioControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        onClick={onSkipBackward}
        variant="outline"
        size="lg"
        className="border-green-200 hover:border-green-400 hover:bg-green-50"
      >
        <SkipBack className="h-5 w-5" />
      </Button>

      <Button
        onClick={onTogglePlayback}
        size="lg"
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
      >
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        <span className="ml-2 font-semibold">
          {isPlaying ? 'Pause' : 'Play'}
        </span>
      </Button>

      <Button
        onClick={onSkipForward}
        variant="outline"
        size="lg"
        className="border-green-200 hover:border-green-400 hover:bg-green-50"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AudioControls;
