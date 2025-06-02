
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Download, Music } from 'lucide-react';
import { AudioSegment } from '../types/podcast';
import { mergeAudioSegments } from '../utils/audioUtils';
import { toast } from 'sonner';

interface MergedAudioPlayerProps {
  audioSegments: AudioSegment[];
  backgroundMusic: boolean;
}

const MergedAudioPlayer = ({ audioSegments, backgroundMusic }: MergedAudioPlayerProps) => {
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const validSegments = audioSegments.filter(s => s.audioBlob);

  const handleMergeAndPlay = async () => {
    if (validSegments.length === 0) {
      toast.error('No audio segments available to merge');
      return;
    }

    setIsLoading(true);
    try {
      const mergedBlob = await mergeAudioSegments(validSegments);
      const url = URL.createObjectURL(mergedBlob);
      setMergedAudioUrl(url);
      toast.success('Audio merged successfully!');
    } catch (error) {
      console.error('Failed to merge audio:', error);
      toast.error('Failed to merge audio segments');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = () => {
    if (mergedAudioUrl) {
      const a = document.createElement('a');
      a.href = mergedAudioUrl;
      a.download = `podcast-merged-${Date.now()}.wav`;
      a.click();
      toast.success('Download started!');
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (mergedAudioUrl) {
        URL.revokeObjectURL(mergedAudioUrl);
      }
    };
  }, [mergedAudioUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Music className="h-5 w-5" />
          Merged Podcast Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!mergedAudioUrl ? (
          <Button
            onClick={handleMergeAndPlay}
            disabled={validSegments.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? 'Merging Audio...' : `Merge & Play (${validSegments.length} segments)`}
          </Button>
        ) : (
          <>
            <audio
              ref={audioRef}
              src={mergedAudioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={togglePlayPause}
                  size="lg"
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="space-y-2">
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {backgroundMusic && (
                <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Music className="h-4 w-4" />
                  Background music enabled
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MergedAudioPlayer;
