
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (newVolume: number[]) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-4">
      <Volume2 className="h-5 w-5 text-gray-600" />
      <div className="flex-1">
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
      <span className="text-sm text-gray-600 w-12 text-right">{volume}%</span>
    </div>
  );
};

export default VolumeControl;
