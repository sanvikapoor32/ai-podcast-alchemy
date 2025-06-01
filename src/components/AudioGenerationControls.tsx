
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, FileAudio } from 'lucide-react';

interface AudioGenerationControlsProps {
  onGenerateAll: () => void;
  onDownloadAll: () => void;
  onDownloadMerged: () => void;
  generatingAll: boolean;
  generatedCount: number;
  scriptContent: string;
  downloadingMerged: boolean;
}

const AudioGenerationControls = ({
  onGenerateAll,
  onDownloadAll,
  onDownloadMerged,
  generatingAll,
  generatedCount,
  scriptContent,
  downloadingMerged
}: AudioGenerationControlsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onGenerateAll}
        disabled={generatingAll || !scriptContent}
        className="w-full"
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
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onDownloadAll}
          disabled={generatedCount === 0}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Segments ({generatedCount})
        </Button>
        
        <Button
          variant="outline"
          onClick={onDownloadMerged}
          disabled={generatedCount === 0 || downloadingMerged}
          className="flex-1"
        >
          {downloadingMerged ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <FileAudio className="h-4 w-4 mr-2" />
              Download Merged Audio
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioGenerationControls;
