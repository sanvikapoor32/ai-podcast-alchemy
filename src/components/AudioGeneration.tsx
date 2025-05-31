
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Download, RefreshCw, Waveform } from 'lucide-react';
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
           index % 4 === 2); // Simple alternation for demo
        
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
    try {
      // Update segment to show it's generating
      const updatedSegments = audioSegments.map(s => 
        s.id === segment.id ? { ...s, generatingAudio: true, generationError: undefined } : s
      );
      onAudioSegmentsChange(updatedSegments);

      const encodedText = encodeURIComponent(segment.text);
      const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${segment.voice}&speed=${voiceOptions.speed}`;
      
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Audio generation failed');
      
      const audioBlob = await response.blob();
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      
      // Get duration (simplified)
      const audio = new Audio(audioObjectUrl);
      await new Promise((resolve) => {
        audio.onloadedmetadata = resolve;
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
      
    } catch (error) {
      console.error('Audio generation failed:', error);
      const errorSegments = audioSegments.map(s => 
        s.id === segment.id ? { 
          ...s, 
          generatingAudio: false, 
          generationError: 'Generation failed. Please try again.' 
        } : s
      );
      onAudioSegmentsChange(errorSegments);
    }
  };

  const generateAllAudio = async () => {
    setGeneratingAll(true);
    const segments = parseScriptIntoSegments(scriptContent);
    onAudioSegmentsChange(segments);

    for (let i = 0; i < segments.length; i++) {
      await generateAudioForSegment(segments[i]);
      // Small delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setGeneratingAll(false);
  };

  const downloadAllAudio = async () => {
    const audioSegmentsWithAudio = audioSegments.filter(s => s.audioBlob);
    if (audioSegmentsWithAudio.length === 0) return;

    // For now, download segments individually
    // In a full implementation, you'd combine them
    audioSegmentsWithAudio.forEach((segment, index) => {
      if (segment.audioBlob) {
        const url = URL.createObjectURL(segment.audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `podcast-segment-${index + 1}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const segments = audioSegments.length > 0 ? audioSegments : parseScriptIntoSegments(scriptContent);
  const generatedCount = segments.filter(s => s.audioUrl).length;
  const progressPercentage = segments.length > 0 ? (generatedCount / segments.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Waveform className="h-5 w-5" />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentAudio(segment.audioUrl!)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateAudioForSegment(segment)}
                        disabled={segment.generatingAudio}
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
