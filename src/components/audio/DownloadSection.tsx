
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadSectionProps {
  segmentCount: number;
  duration: number;
  onDownload: () => void;
}

const DownloadSection = ({ segmentCount, duration, onDownload }: DownloadSectionProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        <p className="font-medium">Ready to download</p>
        <p>{segmentCount} segments merged • {formatTime(duration)} duration</p>
      </div>
      
      <Button
        onClick={onDownload}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
      >
        <Download className="h-4 w-4 mr-2" />
        Download Podcast
      </Button>
    </div>
  );
};

export default DownloadSection;
