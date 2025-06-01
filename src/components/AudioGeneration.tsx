
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Download, RefreshCw, AudioWaveform } from 'lucide-react';
import { AudioSegment, VoiceOptions } from '../types/podcast';
import AudioPlayer from './AudioPlayer';

interface AudioGenerationProps {
  scriptContent: string;
  voiceOptions: VoiceOptions;
  audioSegments: AudioSegment[];
  onAudioSegmentsChange: (segments: AudioSegment[]) => void;
  hostStyle: 'single' | 'multiple';
}

const AudioGeneration = ({ 
  scriptContent, 
  voiceOptions, 
  audioSegments, 
  onAudioSegmentsChange,
  hostStyle 
}: AudioGenerationProps) => {
  const [generatingAll, setGeneratingAll] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  const parseScriptIntoSegments = (content: string): AudioSegment[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const segments: AudioSegment[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('[') && !trimmedLine.startsWith('(')) {
        const isGuestLine = hostStyle === 'multiple' && 
          (trimmedLine.toLowerCase().includes('guest:') || 
           trimmedLine.toLowerCase().includes('interviewer:') ||
           index % 4 === 2);
        
        segments.push({
          id: `segment-${index}`,
          text: trimmedLine,
          voice: isGuestLine ? (voiceOptions.guest || voiceOptions.host) : voiceOptions.host,
          generatingAudio: false
        });
      }
    });
    
    return segments;
  };

  const generateAudioForSegment = async (segment: AudioSegment) => {
    console.log('Starting audio generation for segment:', segment.id);
    
    try {
      // Update segment to show it's generating
      const updatedSegments = audioSegments.map(s => 
        s.id === segment.id ? { ...s, generatingAudio: true, generationError: undefined } : s
      );
      onAudioSegmentsChange(updatedSegments);

      // Clean the text for better audio generation
      const cleanText = segment.text
        .replace(/Host:/gi, '')
        .replace(/Guest:/gi, '')
        .replace(/Interviewer:/gi, '')
        .trim();

      console.log('Generating audio for text:', cleanText);
      console.log('Using voice:', segment.voice);

      const encodedText = encodeURIComponent(cleanText);
      const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${segment.voice}&speed=${voiceOptions.speed || 1.0}`;
      
      console.log('Audio API URL:', audioUrl);
      
      const response = await fetch(audioUrl, {
        method: 'GET',
        headers: {
          'Accept': 'audio/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      console.log('Audio blob received, size:', audioBlob.size, 'type:', audioBlob.type);
      
      if (audioBlob.size === 0) {
        throw new Error('Empty audio file received');
      }
      
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      console.log('Audio object URL created:', audioObjectUrl);
      
      // Test if audio can be loaded
      const audio = new Audio();
      
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          console.log('Audio loaded successfully, duration:', audio.duration);
          resolve(audio.duration);
        };
        audio.onerror = (e) => {
          console.error('Audio load error:', e);
          reject(new Error('Failed to load generated audio'));
        };
        audio.src = audioObjectUrl;
      });
      
      // Update segment with generated audio
      const finalSegments = audioSegments.map(s => 
        s.id === segment.id ? { 
          ...s, 
          audioUrl: audioObjectUrl, 
          audioBlob, 
          duration: audio.duration,
          generatingAudio: false 
        } : s
      );
      onAudioSegmentsChange(finalSegments);
      
      console.log('Audio generation completed for segment:', segment.id);
      
    } catch (error) {
      console.error('Audio generation failed for segment:', segment.id, error);
      const errorSegments = audioSegments.map(s => 
        s.id === segment.id ? { 
          ...s, 
          generatingAudio: false, 
          generationError: `Generation failed: ${error.message}` 
        } : s
      );
      onAudioSegmentsChange(errorSegments);
    }
  };

  const generateAllAudio = async () => {
    setGeneratingAll(true);
    const segments = parseScriptIntoSegments(scriptContent);
    onAudioSegmentsChange(segments);

    console.log('Starting batch audio generation for', segments.length, 'segments');

    for (let i = 0; i < segments.length; i++) {
      console.log(`Generating audio for segment ${i + 1}/${segments.length}`);
      await generateAudioForSegment(segments[i]);
      // Add delay between generations to avoid rate limiting
      if (i < segments.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setGeneratingAll(false);
    console.log('Batch audio generation completed');
  };

  const downloadAudio = (segment: AudioSegment, index: number) => {
    if (!segment.audioBlob) {
      console.error('No audio blob available for segment:', segment.id);
      return;
    }

    try {
      const url = URL.createObjectURL(segment.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `podcast-segment-${index + 1}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log('Download initiated for segment:', segment.id);
    } catch (error) {
      console.error('Download failed for segment:', segment.id, error);
    }
  };

  const downloadAllAudio = async () => {
    const audioSegmentsWithAudio = audioSegments.filter(s => s.audioBlob);
    console.log('Downloading', audioSegmentsWithAudio.length, 'audio segments');
    
    if (audioSegmentsWithAudio.length === 0) {
      console.warn('No audio segments available for download');
      return;
    }

    audioSegmentsWithAudio.forEach((segment, index) => {
      setTimeout(() => downloadAudio(segment, index), index * 500); // Stagger downloads
    });
  };

  const playAudio = (audioUrl: string) => {
    console.log('Setting current audio to play:', audioUrl);
    setCurrentAudio(audioUrl);
  };

  const segments = audioSegments.length > 0 ? audioSegments : parseScriptIntoSegments(scriptContent);
  const generatedCount = segments.filter(s => s.audioUrl).length;
  const progressPercentage = segments.length > 0 ? (generatedCount / segments.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <AudioWaveform className="h-5 w-5" />
          Audio Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generation Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={generateAllAudio}
            disabled={generatingAll || !scriptContent}
            className="flex-1"
          >
            {generatingAll ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating Audio...
              </>
            ) : (
              'Generate Full Audio'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadAllAudio}
            disabled={generatedCount === 0}
            className="flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Download All ({generatedCount})
          </Button>
        </div>

        {/* Progress */}
        {segments.length > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {generatedCount} of {segments.length} segments</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        )}

        {/* Current Audio Player */}
        {currentAudio && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Now Playing</h4>
            <AudioPlayer audioUrl={currentAudio} />
          </div>
        )}

        {/* Segments List */}
        {segments.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Audio Segments</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Segment {index + 1} ({segment.voice})
                    </span>
                    <div className="flex items-center gap-2">
                      {segment.generatingAudio && (
                        <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
                      )}
                      {segment.audioUrl && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(segment.audioUrl!)}
                            title="Play audio"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadAudio(segment, index)}
                            title="Download audio"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateAudioForSegment(segment)}
                        disabled={segment.generatingAudio}
                        title="Regenerate audio"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {segment.text}
                  </p>
                  
                  {segment.generationError && (
                    <p className="text-sm text-red-600 mt-1">
                      {segment.generationError}
                    </p>
                  )}
                  
                  {segment.duration && (
                    <p className="text-xs text-gray-500 mt-1">
                      Duration: {Math.round(segment.duration)}s
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioGeneration;
