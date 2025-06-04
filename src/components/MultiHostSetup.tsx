
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Users } from 'lucide-react';
import { AVAILABLE_VOICES, Host } from '../types/podcast';

interface MultiHostSetupProps {
  hosts: Host[];
  onHostsChange: (hosts: Host[]) => void;
}

const MultiHostSetup = ({ hosts, onHostsChange }: MultiHostSetupProps) => {
  const [numHosts, setNumHosts] = useState(hosts.length || 1);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  const handleNumHostsChange = (value: string) => {
    const num = parseInt(value);
    setNumHosts(num);
    
    const newHosts = Array.from({ length: num }, (_, index) => {
      const existingHost = hosts[index];
      return existingHost || {
        id: `host-${index + 1}`,
        name: `Host ${index + 1}`,
        voice: AVAILABLE_VOICES[index % AVAILABLE_VOICES.length].id
      };
    });
    
    onHostsChange(newHosts);
  };

  const updateHost = (index: number, field: keyof Host, value: string) => {
    const updatedHosts = [...hosts];
    updatedHosts[index] = { ...updatedHosts[index], [field]: value };
    onHostsChange(updatedHosts);
  };

  const playVoicePreview = async (voiceId: string) => {
    if (previewPlaying === voiceId) {
      setPreviewPlaying(null);
      return;
    }

    try {
      setPreviewPlaying(voiceId);
      const previewText = "Hi there! This is how I sound. I'm ready to narrate your podcast.";
      const encodedText = encodeURIComponent(previewText);
      const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voiceId}`;
      
      const audio = new Audio(audioUrl);
      audio.onended = () => setPreviewPlaying(null);
      audio.onerror = () => setPreviewPlaying(null);
      await audio.play();
    } catch (error) {
      console.error('Preview failed:', error);
      setPreviewPlaying(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Multi-Host Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Hosts
          </label>
          <Select value={numHosts.toString()} onValueChange={handleNumHostsChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select number of hosts" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1} Host{i === 0 ? '' : 's'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {hosts.map((host, index) => (
            <div key={host.id} className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium text-gray-800">Host {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Host Name
                  </label>
                  <Input
                    value={host.name}
                    onChange={(e) => updateHost(index, 'name', e.target.value)}
                    placeholder={`Host ${index + 1}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Voice
                  </label>
                  <div className="flex gap-2">
                    <Select 
                      value={host.voice} 
                      onValueChange={(value) => updateHost(index, 'voice', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_VOICES.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name} - {voice.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => playVoicePreview(host.voice)}
                      className="px-3"
                    >
                      {previewPlaying === host.voice ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiHostSetup;
