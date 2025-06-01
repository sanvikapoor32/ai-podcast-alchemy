
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AudioProgressTrackerProps {
  generatedCount: number;
  totalCount: number;
}

const AudioProgressTracker = ({ generatedCount, totalCount }: AudioProgressTrackerProps) => {
  if (totalCount === 0) return null;

  const progressPercentage = (generatedCount / totalCount) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress: {generatedCount} of {totalCount} segments</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} className="w-full" />
    </div>
  );
};

export default AudioProgressTracker;
