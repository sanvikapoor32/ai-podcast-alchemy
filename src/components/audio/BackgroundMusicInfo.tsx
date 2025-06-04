
import React from 'react';
import { Music } from 'lucide-react';

interface BackgroundMusicInfoProps {
  backgroundMusicFile: File;
  backgroundVolume: number;
}

const BackgroundMusicInfo = ({ backgroundMusicFile, backgroundVolume }: BackgroundMusicInfoProps) => {
  return (
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
  );
};

export default BackgroundMusicInfo;
