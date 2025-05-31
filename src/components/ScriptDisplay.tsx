
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScriptViewer from './ScriptViewer';
import EditingTools from './EditingTools';
import ExportOptions from './ExportOptions';
import { ScriptData, GenerationOptions } from '../types/podcast';

interface ScriptDisplayProps {
  script: ScriptData | null;
  isGenerating: boolean;
  onRegenerateSection: (topic: string, options: GenerationOptions) => void;
}

const ScriptDisplay = ({ script, isGenerating, onRegenerateSection }: ScriptDisplayProps) => {
  if (isGenerating) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Generating Your Script</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Creating your podcast script...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!script) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Your Script Will Appear Here</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Enter your podcast topic and preferences</p>
              <p className="text-sm text-gray-500">Click "Generate Podcast Script" to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-purple-600">Generated Script</CardTitle>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Topic: {script.topic}</span>
            <span>Generated: {script.generatedAt.toLocaleTimeString()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ScriptViewer script={script} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditingTools 
          script={script}
          onRegenerateSection={onRegenerateSection}
        />
        <ExportOptions script={script} />
      </div>
    </div>
  );
};

export default ScriptDisplay;
