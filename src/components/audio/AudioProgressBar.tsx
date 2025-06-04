
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface AudioProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (newTime: number[]) => void;
}

const AudioProgressBar = ({ currentTime, duration, onSeek }: AudioProgressBarProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Time Display */}
      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-500">
          / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Playback Progress
        </label>
        <Slider
          value={[currentTime]}
          onValueChange={onSeek}
          max={duration}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </>
  );
};

export default AudioProgressBar;
