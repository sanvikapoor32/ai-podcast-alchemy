
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TopicInput from './TopicInput';
import FormatSelector from './FormatSelector';
import OptionsPanel from './OptionsPanel';
import GenerateButton from './GenerateButton';
import { GenerationOptions } from '../types/podcast';

interface InputSectionProps {
  onGenerate: (topic: string, options: GenerationOptions) => void;
  isGenerating: boolean;
  error: string | null;
}

const InputSection = ({ onGenerate, isGenerating, error }: InputSectionProps) => {
  const [topic, setTopic] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    format: 'Solo Commentary',
    duration: '15-20 mins',
    tone: 'Conversational',
    hostStyle: 'single',
    audience: 'General',
    complexity: 3,
    elements: ['Opening Hook', 'Call-to-Action']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, options);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-purple-600">Create Your Podcast Script</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TopicInput 
              value={topic}
              onChange={setTopic}
            />
            
            <FormatSelector 
              value={options.format}
              onChange={(format) => setOptions({ ...options, format })}
              duration={options.duration}
              onDurationChange={(duration) => setOptions({ ...options, duration })}
              tone={options.tone}
              onToneChange={(tone) => setOptions({ ...options, tone })}
              hostStyle={options.hostStyle}
              onHostStyleChange={(hostStyle) => setOptions({ ...options, hostStyle })}
            />
            
            <OptionsPanel 
              options={options}
              onChange={setOptions}
            />
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <GenerateButton 
              isGenerating={isGenerating}
              disabled={!topic.trim()}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputSection;
