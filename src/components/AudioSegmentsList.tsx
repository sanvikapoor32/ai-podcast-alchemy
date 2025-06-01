
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Download, RefreshCw } from 'lucide-react';
import { AudioSegment } from '../types/podcast';

interface AudioSegmentsListProps {
  segments: AudioSegment[];
  onPlayAudio: (audioUrl: string) => void;
  onDownloadAudio: (segment: AudioSegment, index: number) => void;
  onRegenerateSegment: (segment: AudioSegment) => void;
}

const AudioSegmentsList = ({
  segments,
  onPlayAudio,
  onDownloadAudio,
  onRegenerateSegment
}: AudioSegmentsListProps) => {
  if (segments.length === 0) return null;

  return (
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
                      onClick={() => onPlayAudio(segment.audioUrl!)}
                      title="Play audio"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadAudio(segment, index)}
                      title="Download audio"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerateSegment(segment)}
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
  );
};

export default AudioSegmentsList;
