import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Download, Volume2 } from 'lucide-react';
import { AudioSegment } from '../types/podcast';
import { mergeAudioSegments } from '../utils/audioUtils';
import { toast } from 'sonner';

interface MergedAudioPlayerProps {
  audioSegments: AudioSegment[];
  backgroundMusic: boolean;
  backgroundMusicFile?: File;
  backgroundVolume?: number;
}

const MergedAudioPlayer = ({ 
  audioSegments, 
  backgroundMusic, 
  backgroundMusicFile,
  backgroundVolume = 50
}: MergedAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const validSegments = audioSegments.filter(s => s.audioBlob);

  useEffect(() => {
    if (validSegments.length > 0) {
      generateMergedAudio();
    }
  }, [validSegments.length, backgroundMusic, backgroundMusicFile, backgroundVolume]);

  const generateMergedAudio = async () => {
    if (validSegments.length === 0) return;

    setIsProcessing(true);
    try {
      const mergedBlob = await mergeAudioSegments(validSegments);
      
      // If background music is enabled and file is provided, we would mix it here
      // For now, we'll use the merged speech audio
      const url = URL.createObjectURL(mergedBlob);
      setMergedAudioUrl(url);
      
      // Create audio element to get duration
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
    } catch (error) {
      console.error('Failed to generate merged audio:', error);
      toast.error('Failed to merge audio segments');
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !mergedAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const downloadMergedAudio = () => {
    if (!mergedAudioUrl) return;

    const a = document.createElement('a');
    a.href = mergedAudioUrl;
    a.download = `podcast-merged-${Date.now()}.wav`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Download started!');
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (validSegments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Play className="h-5 w-5" />
          Merged Podcast Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Processing audio...</p>
          </div>
        ) : mergedAudioUrl ? (
          <>
            <audio
              ref={audioRef}
              src={mergedAudioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(audioRef.current.duration);
                  audioRef.current.volume = volume / 100;
                }
              }}
            />

            <div className="flex items-center justify-between">
              <Button
                onClick={togglePlayback}
                size="lg"
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <Button
                onClick={downloadMergedAudio}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playback Progress
              </label>
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <Volume2 className="h-4 w-4 text-gray-600" />
              <div className="flex-1">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-12">{volume}%</span>
            </div>

            {backgroundMusic && backgroundMusicFile && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Background music: {backgroundMusicFile.name} ({backgroundVolume}% volume)
                </p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Merged {validSegments.length} audio segments into one track
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">No merged audio available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MergedAudioPlayer;
