
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface AudioGenerationControlsProps {
  onGenerateAll: () => void;
  onDownloadAll: () => void;
  generatingAll: boolean;
  generatedCount: number;
  scriptContent: string;
}

const AudioGenerationControls = ({
  onGenerateAll,
  onDownloadAll,
  generatingAll,
  generatedCount,
  scriptContent
}: AudioGenerationControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={onGenerateAll}
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
        onClick={onDownloadAll}
        disabled={generatedCount === 0}
        className="flex-1 sm:flex-none"
      >
        <Download className="h-4 w-4 mr-2" />
        Download All ({generatedCount})
      </Button>
    </div>
  );
};

export default AudioGenerationControls;
