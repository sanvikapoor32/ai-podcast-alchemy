
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TopicInput = ({ value, onChange }: TopicInputProps) => {
  const characterCount = value.length;
  const isOptimalLength = characterCount >= 50 && characterCount <= 200;

  return (
    <div className="space-y-2">
      <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
        Podcast Topic
      </Label>
      <Textarea
        id="topic"
        placeholder="Technology trends in 2025, Interview with a startup founder, History of space exploration..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
        maxLength={300}
      />
      <div className="flex justify-between items-center text-xs">
        <span className={`${isOptimalLength ? 'text-green-600' : 'text-gray-500'}`}>
          Optimal length: 50-200 characters
        </span>
        <span className={`${characterCount > 250 ? 'text-red-500' : 'text-gray-500'}`}>
          {characterCount}/300
        </span>
      </div>
    </div>
  );
};

export default TopicInput;
