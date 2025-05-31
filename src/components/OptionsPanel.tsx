
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { GenerationOptions } from '../types/podcast';

interface OptionsPanelProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
}

const OptionsPanel = ({ options, onChange }: OptionsPanelProps) => {
  const audiences = ['General', 'Business Professionals', 'Students', 'Tech Enthusiasts', 'Creative Community'];
  const availableElements = ['Opening Hook', 'Sponsor Segments', 'Q&A Section', 'Call-to-Action', 'Closing Summary'];

  const handleElementToggle = (element: string, checked: boolean) => {
    const newElements = checked 
      ? [...options.elements, element]
      : options.elements.filter(e => e !== element);
    
    onChange({ ...options, elements: newElements });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
          <Select 
            value={options.audience} 
            onValueChange={(audience: any) => onChange({ ...options, audience })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              {audiences.map((audience) => (
                <SelectItem key={audience} value={audience}>
                  {audience}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Complexity Level: {options.complexity}
          </Label>
          <Slider
            value={[options.complexity]}
            onValueChange={(value) => onChange({ ...options, complexity: value[0] })}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Include Elements</Label>
        <div className="grid grid-cols-2 gap-2">
          {availableElements.map((element) => (
            <div key={element} className="flex items-center space-x-2">
              <Checkbox
                id={element}
                checked={options.elements.includes(element)}
                onCheckedChange={(checked) => handleElementToggle(element, checked as boolean)}
              />
              <Label htmlFor={element} className="text-xs text-gray-600">
                {element}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;
