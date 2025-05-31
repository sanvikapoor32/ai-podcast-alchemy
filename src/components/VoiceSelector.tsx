
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Pause } from 'lucide-react';
import { AVAILABLE_VOICES, VoiceOptions } from '../types/podcast';

interface VoiceSelectorProps {
  voiceOptions: VoiceOptions;
  onVoiceOptionsChange: (options: VoiceOptions) => void;
  hostStyle: 'single' | 'multiple';
}

const VoiceSelector = ({ voiceOptions, onVoiceOptionsChange, hostStyle }: VoiceSelectorProps) => {
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

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
        <CardTitle className="text-lg text-purple-600">Voice Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Host Voice
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_VOICES.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  voiceOptions.host === voice.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onVoiceOptionsChange({ ...voiceOptions, host: voice.id })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{voice.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoicePreview(voice.id);
                    }}
                  >
                    {previewPlaying === voice.id ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-600">{voice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {hostStyle === 'multiple' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Guest Voice
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_VOICES.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    voiceOptions.guest === voice.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onVoiceOptionsChange({ ...voiceOptions, guest: voice.id })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{voice.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePreview(voice.id);
                      }}
                    >
                      {previewPlaying === voice.id ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">{voice.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speaking Speed: {voiceOptions.speed}x
            </label>
            <Slider
              value={[voiceOptions.speed]}
              onValueChange={([value]) => onVoiceOptionsChange({ ...voiceOptions, speed: value })}
              min={0.8}
              max={1.5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="background-music"
              checked={voiceOptions.backgroundMusic}
              onCheckedChange={(checked) => 
                onVoiceOptionsChange({ ...voiceOptions, backgroundMusic: !!checked })
              }
            />
            <label htmlFor="background-music" className="text-sm text-gray-700">
              Add subtle background music
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSelector;
