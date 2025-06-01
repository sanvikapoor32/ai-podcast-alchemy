
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioWaveform } from 'lucide-react';
import { AudioSegment, VoiceOptions } from '../types/podcast';
import AudioPlayer from './AudioPlayer';
import AudioGenerationControls from './AudioGenerationControls';
import AudioProgressTracker from './AudioProgressTracker';
import AudioSegmentsList from './AudioSegmentsList';
import { parseScriptIntoSegments, generateAudioForSegment, downloadAudio, downloadMergedAudio } from '../utils/audioUtils';
import { toast } from 'sonner';

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
  const [downloadingMerged, setDownloadingMerged] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  const handleGenerateAllAudio = async () => {
    setGeneratingAll(true);
    const segments = parseScriptIntoSegments(scriptContent, voiceOptions, hostStyle);
    onAudioSegmentsChange(segments);

    console.log('Starting batch audio generation for', segments.length, 'segments');

    for (let i = 0; i < segments.length; i++) {
      console.log(`Generating audio for segment ${i + 1}/${segments.length}`);
      await generateAudioForSegment(segments[i], voiceOptions, segments, onAudioSegmentsChange);
      // Add delay between generations to avoid rate limiting
      if (i < segments.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setGeneratingAll(false);
    console.log('Batch audio generation completed');
    toast.success('All audio segments generated successfully!');
  };

  const handleDownloadAllAudio = async () => {
    const audioSegmentsWithAudio = audioSegments.filter(s => s.audioBlob);
    console.log('Downloading', audioSegmentsWithAudio.length, 'audio segments');
    
    if (audioSegmentsWithAudio.length === 0) {
      console.warn('No audio segments available for download');
      toast.error('No audio segments available for download');
      return;
    }

    audioSegmentsWithAudio.forEach((segment, index) => {
      setTimeout(() => downloadAudio(segment, index), index * 500); // Stagger downloads
    });
    
    toast.success(`Started downloading ${audioSegmentsWithAudio.length} audio segments`);
  };

  const handleDownloadMergedAudio = async () => {
    const totalSegments = audioSegments.length || parseScriptIntoSegments(scriptContent, voiceOptions, hostStyle).length;
    const audioSegmentsWithAudio = audioSegments.filter(s => s.audioBlob);
    
    console.log('Attempting to download merged audio');
    console.log('Total segments:', totalSegments);
    console.log('Segments with audio blobs:', audioSegmentsWithAudio.length);
    
    if (audioSegmentsWithAudio.length === 0) {
      toast.error('No audio segments available for merging');
      return;
    }

    if (audioSegmentsWithAudio.length < totalSegments) {
      toast.error(`Please generate all audio segments first. Only ${audioSegmentsWithAudio.length} of ${totalSegments} segments have been generated.`);
      return;
    }

    setDownloadingMerged(true);
    
    try {
      await downloadMergedAudio(audioSegmentsWithAudio);
      toast.success('Merged audio downloaded successfully!');
    } catch (error) {
      console.error('Merged download failed:', error);
      toast.error('Failed to download merged audio. Try downloading individual segments instead.');
    } finally {
      setDownloadingMerged(false);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    console.log('Setting current audio to play:', audioUrl);
    setCurrentAudio(audioUrl);
  };

  const handleRegenerateSegment = (segment: AudioSegment) => {
    generateAudioForSegment(segment, voiceOptions, audioSegments, onAudioSegmentsChange);
  };

  const handleDownloadSegment = (segment: AudioSegment, index: number) => {
    downloadAudio(segment, index);
  };

  const segments = audioSegments.length > 0 ? audioSegments : parseScriptIntoSegments(scriptContent, voiceOptions, hostStyle);
  const generatedCount = segments.filter(s => s.audioBlob).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <AudioWaveform className="h-5 w-5" />
          Audio Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AudioGenerationControls
          onGenerateAll={handleGenerateAllAudio}
          onDownloadAll={handleDownloadAllAudio}
          onDownloadMerged={handleDownloadMergedAudio}
          generatingAll={generatingAll}
          generatedCount={generatedCount}
          scriptContent={scriptContent}
          downloadingMerged={downloadingMerged}
        />

        <AudioProgressTracker
          generatedCount={generatedCount}
          totalCount={segments.length}
        />

        {currentAudio && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Now Playing</h4>
            <AudioPlayer audioUrl={currentAudio} />
          </div>
        )}

        <AudioSegmentsList
          segments={segments}
          onPlayAudio={handlePlayAudio}
          onDownloadAudio={handleDownloadSegment}
          onRegenerateSegment={handleRegenerateSegment}
        />
      </CardContent>
    </Card>
  );
};

export default AudioGeneration;
