
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeOff } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

const AudioPlayer = ({ audioUrl, onTimeUpdate, className = '' }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Waveform placeholder - simplified for now */}
      <div className="h-16 bg-gradient-to-r from-purple-100 to-orange-100 rounded mb-4 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-200"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-gray-600">
            {duration > 0 ? 'Audio Waveform' : 'Loading...'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(-10)}
            disabled={!duration}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            disabled={!audioUrl}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => skipTime(10)}
            disabled={!duration}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 w-32">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeOff className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
