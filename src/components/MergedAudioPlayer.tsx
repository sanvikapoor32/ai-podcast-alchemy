
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { AudioSegment } from '../types/podcast';
import { mergeAudioSegments } from '../utils/audioUtils';
import { toast } from 'sonner';
import AudioControls from './audio/AudioControls';
import AudioProgressBar from './audio/AudioProgressBar';
import VolumeControl from './audio/VolumeControl';
import BackgroundMusicInfo from './audio/BackgroundMusicInfo';
import DownloadSection from './audio/DownloadSection';

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

            <AudioControls
              isPlaying={isPlaying}
              onTogglePlayback={togglePlayback}
              onSkipForward={skipForward}
              onSkipBackward={skipBackward}
            />

            <AudioProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />

            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />

            {backgroundMusic && backgroundMusicFile && (
              <BackgroundMusicInfo
                backgroundMusicFile={backgroundMusicFile}
                backgroundVolume={backgroundVolume}
              />
            )}

            <DownloadSection
              segmentCount={validSegments.length}
              duration={duration}
              onDownload={downloadMergedAudio}
            />
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
