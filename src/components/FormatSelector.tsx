
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FormatSelectorProps {
  value: string;
  onChange: (value: any) => void;
  duration: string;
  onDurationChange: (value: any) => void;
  tone: string;
  onToneChange: (value: any) => void;
  hostStyle: string;
  onHostStyleChange: (value: any) => void;
}

const FormatSelector = ({ 
  value, 
  onChange, 
  duration, 
  onDurationChange, 
  tone, 
  onToneChange, 
  hostStyle, 
  onHostStyleChange 
}: FormatSelectorProps) => {
  const formats = ['Solo Commentary', 'Interview Style', 'Educational', 'Storytelling', 'News Brief'];
  const durations = ['5-10 mins', '15-20 mins', '30+ mins'];
  const tones = ['Professional', 'Conversational', 'Humorous', 'Inspirational'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Format</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Duration</Label>
          <Select value={duration} onValueChange={onDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((dur) => (
                <SelectItem key={dur} value={dur}>
                  {dur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Tone</Label>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => (
            <Button
              key={t}
              type="button"
              variant={tone === t ? "default" : "outline"}
              size="sm"
              onClick={() => onToneChange(t)}
              className="text-xs"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Host Style</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={hostStyle === 'single' ? "default" : "outline"}
            size="sm"
            onClick={() => onHostStyleChange('single')}
          >
            Single Host
          </Button>
          <Button
            type="button"
            variant={hostStyle === 'multiple' ? "default" : "outline"}
            size="sm"
            onClick={() => onHostStyleChange('multiple')}
          >
            Multiple Hosts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;
