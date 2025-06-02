
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { ScriptData, GenerationOptions } from '../types/podcast';

interface CustomScriptInputProps {
  onScriptSubmit: (script: ScriptData) => void;
}

const CustomScriptInput = ({ onScriptSubmit }: CustomScriptInputProps) => {
  const [customScript, setCustomScript] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customScript.trim() && scriptTitle.trim()) {
      const scriptData: ScriptData = {
        content: customScript,
        topic: scriptTitle,
        options: {
          format: 'Solo Commentary',
          duration: '15-20 mins',
          tone: 'Conversational',
          hostStyle: 'single',
          audience: 'General',
          complexity: 3,
          elements: []
        } as GenerationOptions,
        generatedAt: new Date(),
        isCustomScript: true
      };
      onScriptSubmit(scriptData);
      setCustomScript('');
      setScriptTitle('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Add Your Own Script
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="script-title" className="block text-sm font-medium text-gray-700 mb-2">
              Script Title
            </label>
            <input
              id="script-title"
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              placeholder="Enter your podcast title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="custom-script" className="block text-sm font-medium text-gray-700 mb-2">
              Podcast Script
            </label>
            <Textarea
              id="custom-script"
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Paste or write your podcast script here..."
              className="min-h-[200px] resize-none"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!customScript.trim() || !scriptTitle.trim()}
          >
            Use This Script
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomScriptInput;
