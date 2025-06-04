
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Download, Volume2, Music, SkipBack, SkipForward } from 'lucide-react';
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
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const validSegments = audioSegments.filter(s => s.audioBlob);

  useEffect(() => {
    if (validSegments.length > 0) {
      generateMergedAudio();
    }
  }, [validSegments.length]);

  useEffect(() => {
    // Setup background music when file changes
    if (backgroundMusic && backgroundMusicFile && backgroundAudioRef.current) {
      const bgUrl = URL.createObjectURL(backgroundMusicFile);
      backgroundAudioRef.current.src = bgUrl;
      backgroundAudioRef.current.volume = backgroundVolume / 100;
      backgroundAudioRef.current.loop = true;
      
      return () => URL.revokeObjectURL(bgUrl);
    }
  }, [backgroundMusic, backgroundMusicFile, backgroundVolume]);

  // Update background music volume when it changes
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = backgroundVolume / 100;
    }
  }, [backgroundVolume]);

  const generateMergedAudio = async () => {
    if (validSegments.length === 0) return;

    setIsProcessing(true);
    try {
      console.log('Generating merged audio with', validSegments.length, 'segments');
      const mergedBlob = await mergeAudioSegments(validSegments);
      
      const url = URL.createObjectURL(mergedBlob);
      setMergedAudioUrl(url);
      
      // Create audio element to get duration
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        console.log('Merged audio duration:', audio.duration);
      };
      
      toast.success('Podcast merged successfully!');
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
      if (backgroundMusic && backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    } else {
      audioRef.current.play();
      if (backgroundMusic && backgroundMusicFile && backgroundAudioRef.current) {
        // Ensure background music is loaded and ready
        if (backgroundAudioRef.current.src) {
          backgroundAudioRef.current.currentTime = audioRef.current.currentTime;
          backgroundAudioRef.current.play().catch(console.error);
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Sync background music
      if (backgroundMusic && backgroundAudioRef.current && backgroundAudioRef.current.src) {
        const timeDiff = Math.abs(backgroundAudioRef.current.currentTime - audioRef.current.currentTime);
        if (timeDiff > 0.5) { // Resync if more than 0.5s difference
          backgroundAudioRef.current.currentTime = audioRef.current.currentTime;
        }
      }
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
      
      // Sync background music
      if (backgroundMusic && backgroundAudioRef.current && backgroundAudioRef.current.src) {
        backgroundAudioRef.current.currentTime = newTime[0];
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 15, duration);
      audioRef.current.currentTime = newTime;
      if (backgroundMusic && backgroundAudioRef.current && backgroundAudioRef.current.src) {
        backgroundAudioRef.current.currentTime = newTime;
      }
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 15, 0);
      audioRef.current.currentTime = newTime;
      if (backgroundMusic && backgroundAudioRef.current && backgroundAudioRef.current.src) {
        backgroundAudioRef.current.currentTime = newTime;
      }
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
    <Card className="shadow-lg border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="text-xl text-green-700 flex items-center gap-2">
          <Play className="h-6 w-6" />
          Podcast Player
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isProcessing ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Processing your podcast...</p>
            <p className="text-sm text-gray-500">Merging {validSegments.length} audio segments</p>
          </div>
        ) : mergedAudioUrl ? (
          <div className="space-y-6">
            <audio
              ref={audioRef}
              src={mergedAudioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setIsPlaying(false);
                if (backgroundMusic && backgroundAudioRef.current) {
                  backgroundAudioRef.current.pause();
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(audioRef.current.duration);
                  audioRef.current.volume = volume / 100;
                }
              }}
            />

            {backgroundMusic && backgroundMusicFile && (
              <audio
                ref={backgroundAudioRef}
                loop
                onLoadedData={() => {
                  if (backgroundAudioRef.current) {
                    backgroundAudioRef.current.volume = backgroundVolume / 100;
                  }
                }}
              />
            )}

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={skipBackward}
                variant="outline"
                size="lg"
                className="border-green-200 hover:border-green-400 hover:bg-green-50"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                onClick={togglePlayback}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                <span className="ml-2 font-semibold">
                  {isPlaying ? 'Pause' : 'Play'}
                </span>
              </Button>

              <Button
                onClick={skipForward}
                variant="outline"
                size="lg"
                className="border-green-200 hover:border-green-400 hover:bg-green-50"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

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
                onValueChange={handleSeek}
                max={duration}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{volume}%</span>
            </div>

            {/* Background Music Info */}
            {backgroundMusic && backgroundMusicFile && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Background Music Active</span>
                  <span className="text-sm text-blue-600">
                    (Volume: {backgroundVolume}%)
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  <p><strong>File:</strong> {backgroundMusicFile.name}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Music will play automatically when you start the podcast
                  </p>
                </div>
              </div>
            )}

            {/* Download Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Ready to download</p>
                <p>{validSegments.length} segments merged • {formatTime(duration)} duration</p>
              </div>
              
              <Button
                onClick={downloadMergedAudio}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Podcast
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No merged audio available</p>
              <p className="text-sm">Generate audio segments first</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MergedAudioPlayer;
