
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload } from 'lucide-react';
import { ScriptData, GenerationOptions, Host } from '../types/podcast';
import { toast } from 'sonner';

interface EnhancedCustomScriptInputProps {
  onScriptSubmit: (script: ScriptData) => void;
  hosts: Host[];
}

const EnhancedCustomScriptInput = ({ onScriptSubmit, hosts }: EnhancedCustomScriptInputProps) => {
  const [customScript, setCustomScript] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          hostStyle: hosts.length > 1 ? 'multiple' : 'single',
          audience: 'General',
          complexity: 3,
          elements: []
        } as GenerationOptions,
        generatedAt: new Date(),
        isCustomScript: true,
        hosts
      };
      onScriptSubmit(scriptData);
      setCustomScript('');
      setScriptTitle('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.docx')) {
      toast.error('Please upload a TXT or DOCX file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCustomScript(content);
      if (!scriptTitle) {
        setScriptTitle(file.name.replace(/\.(txt|docx)$/, ''));
      }
      toast.success('Script uploaded successfully');
    };
    reader.readAsText(file);
  };

  const addHostTag = (hostName: string) => {
    const tag = `[${hostName}] `;
    const textarea = document.getElementById('custom-script') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = customScript.substring(0, start) + tag + customScript.substring(end);
      setCustomScript(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  const highlightedScript = customScript.replace(
    /\[([^\]]+)\]/g, 
    '<span style="background-color: #e0e7ff; color: #3730a3; font-weight: 500;">[$1]</span>'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Enhanced Script Input
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="script-title" className="block text-sm font-medium text-gray-700 mb-2">
              Podcast Title
            </label>
            <Input
              id="script-title"
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              placeholder="Enter your podcast title..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Script File
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload TXT/DOCX
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Speed
              </label>
              <Select value={speechSpeed.toString()} onValueChange={(value) => setSpeechSpeed(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                  <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                  <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                  <SelectItem value="2.0">2.0x (Very Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hosts.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Host Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {hosts.map((host) => (
                  <Button
                    key={host.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addHostTag(host.name)}
                  >
                    Add [{host.name}]
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click to add host tags to your script. Example: [Host 1] Welcome to the show!
              </p>
            </div>
          )}
          
          <div>
            <label htmlFor="custom-script" className="block text-sm font-medium text-gray-700 mb-2">
              Podcast Script
            </label>
            <Textarea
              id="custom-script"
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Paste or write your podcast script here... Use [Host Name] tags to assign lines to specific hosts."
              className="min-h-[300px] resize-none font-mono"
              required
            />
            {hosts.length > 1 && customScript && (
              <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
                <p className="text-gray-600 mb-2">Preview with host highlighting:</p>
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightedScript }}
                />
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!customScript.trim() || !scriptTitle.trim()}
          >
            Generate Podcast with This Script
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedCustomScriptInput;
