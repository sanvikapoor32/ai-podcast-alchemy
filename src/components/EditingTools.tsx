
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScriptData, GenerationOptions } from '../types/podcast';

interface EditingToolsProps {
  script: ScriptData;
  onRegenerateSection: (topic: string, options: GenerationOptions) => void;
}

const EditingTools = ({ script, onRegenerateSection }: EditingToolsProps) => {
  const handleRegenerateWithTone = (newTone: string) => {
    const newOptions = { ...script.options, tone: newTone as any };
    onRegenerateSection(script.topic, newOptions);
  };

  const handleRegenerateDuration = (newDuration: string) => {
    const newOptions = { ...script.options, duration: newDuration as any };
    onRegenerateSection(script.topic, newOptions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">Quick Adjustments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-600">Change Tone</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Professional', 'Conversational', 'Humorous', 'Inspirational'].map((tone) => (
              <Button
                key={tone}
                variant="outline"
                size="sm"
                onClick={() => handleRegenerateWithTone(tone)}
                className="text-xs"
                disabled={script.options.tone === tone}
              >
                {tone}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-600">Adjust Length</h4>
          <div className="space-y-2">
            {['5-10 mins', '15-20 mins', '30+ mins'].map((duration) => (
              <Button
                key={duration}
                variant="outline"
                size="sm"
                onClick={() => handleRegenerateDuration(duration)}
                className="w-full text-xs"
                disabled={script.options.duration === duration}
              >
                Make it {duration}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerateSection(script.topic, script.options)}
            className="w-full"
          >
            🔄 Regenerate Entire Script
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditingTools;
