
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Users, Wand2, AlertCircle } from 'lucide-react';
import { ScriptData, GenerationOptions, Host } from '../types/podcast';
import { detectHostsFromScript } from '../utils/audioUtils';
import { toast } from 'sonner';

interface EnhancedCustomScriptInputProps {
  onScriptSubmit: (script: ScriptData) => void;
  hosts: Host[];
}

const EnhancedCustomScriptInput = ({ onScriptSubmit, hosts }: EnhancedCustomScriptInputProps) => {
  const [customScript, setCustomScript] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [detectedHosts, setDetectedHosts] = useState<string[]>([]);
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
        hosts,
        voiceOptions: {
          host: hosts[0]?.voice || 'alloy',
          speed: speechSpeed,
          backgroundMusic: false,
          backgroundVolume: 50,
          hosts
        }
      };
      onScriptSubmit(scriptData);
      setCustomScript('');
      setScriptTitle('');
      setDetectedHosts([]);
      toast.success('Script processed successfully!');
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

  const handleAutoDetectHosts = () => {
    if (!customScript.trim()) {
      toast.error('Please enter a script first');
      return;
    }
    
    const detected = detectHostsFromScript(customScript);
    setDetectedHosts(detected);
    
    if (detected.length > 0) {
      toast.success(`Detected ${detected.length} host(s): ${detected.join(', ')}`);
    } else {
      toast.info('No hosts detected. Try using [Host Name] or Host Name: format');
    }
  };

  useEffect(() => {
    if (customScript.trim()) {
      const detected = detectHostsFromScript(customScript);
      setDetectedHosts(detected);
    }
  }, [customScript]);

  const highlightedScript = customScript.replace(
    /\[([^\]]+)\]/g, 
    '<span style="background-color: #dbeafe; color: #1e40af; font-weight: 600; padding: 2px 4px; border-radius: 4px;">[$1]</span>'
  ).replace(
    /^([^:\n]+):/gm,
    '<span style="background-color: #fef3c7; color: #92400e; font-weight: 600; padding: 2px 4px; border-radius: 4px;">$1:</span>'
  );

  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Enhanced Script Input
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="script-title" className="block text-sm font-semibold text-gray-700 mb-2">
              Podcast Title
            </label>
            <Input
              id="script-title"
              type="text"
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
              placeholder="Enter your podcast title..."
              className="border-purple-200 focus:border-purple-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Script File
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-purple-200 hover:border-purple-400 hover:bg-purple-50"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Speech Speed
              </label>
              <Select value={speechSpeed.toString()} onValueChange={(value) => setSpeechSpeed(parseFloat(value))}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Host Detection & Tagging
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetectHosts}
                className="border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Auto-Detect
              </Button>
            </div>
            
            {detectedHosts.length > 0 && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Detected Hosts ({detectedHosts.length}):
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detectedHosts.map((hostName, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                    >
                      {hostName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hosts.length > 1 && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-2">
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
                      className="border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                    >
                      Add [{host.name}]
                    </Button>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">
                      Tip: Use [Host Name] or Host Name: to assign lines to specific hosts
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="custom-script" className="block text-sm font-semibold text-gray-700 mb-2">
              Podcast Script
            </label>
            <Textarea
              id="custom-script"
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder={hosts.length > 1 
                ? "Enter your script here...\n\nExample:\n[Host 1] Welcome to our show!\n[Host 2] Today we're discussing AI.\n\nOr use:\nHost 1: Welcome to our show!\nHost 2: Today we're discussing AI."
                : "Enter your podcast script here..."
              }
              className="min-h-[300px] resize-none font-mono border-purple-200 focus:border-purple-400"
              required
            />
            
            {hosts.length > 1 && customScript && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview with host highlighting:</p>
                <div 
                  className="whitespace-pre-wrap text-sm leading-relaxed max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: highlightedScript }}
                />
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            disabled={!customScript.trim() || !scriptTitle.trim()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Podcast with This Script
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedCustomScriptInput;
