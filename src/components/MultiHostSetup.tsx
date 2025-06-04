
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Users, User, Trash2 } from 'lucide-react';
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

  const removeHost = (index: number) => {
    if (hosts.length > 1) {
      const updatedHosts = hosts.filter((_, i) => i !== index);
      onHostsChange(updatedHosts);
      setNumHosts(updatedHosts.length);
    }
  };

  const addHost = () => {
    if (hosts.length < 10) {
      const newHost: Host = {
        id: `host-${hosts.length + 1}`,
        name: `Host ${hosts.length + 1}`,
        voice: AVAILABLE_VOICES[hosts.length % AVAILABLE_VOICES.length].id
      };
      onHostsChange([...hosts, newHost]);
      setNumHosts(hosts.length + 1);
    }
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

  const getVoiceInfo = (voiceId: string) => {
    return AVAILABLE_VOICES.find(v => v.id === voiceId) || AVAILABLE_VOICES[0];
  };

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Multi-Host Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Hosts
          </label>
          <div className="flex items-center gap-3">
            <Select value={numHosts.toString()} onValueChange={handleNumHostsChange}>
              <SelectTrigger className="w-48 border-blue-200 focus:border-blue-400">
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
            
            {hosts.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addHost}
                className="border-green-200 hover:border-green-400 hover:bg-green-50"
              >
                <Users className="h-4 w-4 mr-1" />
                Add Host
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {hosts.map((host, index) => (
            <div key={host.id} className="p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">Host {index + 1}</h4>
                </div>
                
                {hosts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHost(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Host Name
                  </label>
                  <Input
                    value={host.name}
                    onChange={(e) => updateHost(index, 'name', e.target.value)}
                    placeholder={`Host ${index + 1}`}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Voice & Preview
                  </label>
                  <div className="flex gap-2">
                    <Select 
                      value={host.voice} 
                      onValueChange={(value) => updateHost(index, 'voice', value)}
                    >
                      <SelectTrigger className="flex-1 border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_VOICES.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{voice.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{voice.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => playVoicePreview(host.voice)}
                      className="px-3 border-green-200 hover:border-green-400 hover:bg-green-50"
                      disabled={previewPlaying === host.voice}
                    >
                      {previewPlaying === host.voice ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-600">
                    <span className="font-medium">{getVoiceInfo(host.voice).name}</span>
                    <span className="mx-1">•</span>
                    <span>{getVoiceInfo(host.voice).description}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hosts.length > 1 && (
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h5 className="font-medium text-indigo-800 mb-2">Multi-Host Tips:</h5>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Use [Host Name] tags in your script to assign lines to specific hosts</li>
              <li>• Or use "Host Name:" format at the beginning of lines</li>
              <li>• Each host will use their assigned voice for audio generation</li>
              <li>• Preview voices to find the perfect combination for your podcast</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiHostSetup;
