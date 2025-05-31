
import React, { useState } from 'react';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ScriptDisplay from '../components/ScriptDisplay';
import VoiceSelector from '../components/VoiceSelector';
import AudioGeneration from '../components/AudioGeneration';
import Footer from '../components/Footer';
import { ScriptData, GenerationOptions, VoiceOptions, AudioSegment } from '../types/podcast';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<ScriptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceOptions, setVoiceOptions] = useState<VoiceOptions>({
    host: 'alloy',
    guest: 'nova',
    speed: 1.0,
    backgroundMusic: false
  });
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([]);

  const handleGenerate = async (topic: string, options: GenerationOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Generate a ${options.duration} ${options.format} podcast script about: ${topic}. 
                     Tone: ${options.tone}. 
                     Include: ${options.elements.join(', ')}.
                     Target audience: ${options.audience}.
                     Complexity: ${options.complexity}.
                     ${options.hostStyle === 'multiple' ? 'Include dialogue between multiple hosts.' : 'Single host format.'}`;

      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: prompt
          }],
          model: 'openai',
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.text();
      
      const scriptData: ScriptData = {
        content: data,
        topic,
        options,
        generatedAt: new Date(),
        voiceOptions,
        audioSegments: []
      };
      
      setGeneratedScript(scriptData);
      setAudioSegments([]); // Reset audio segments for new script
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the script');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceOptionsChange = (newVoiceOptions: VoiceOptions) => {
    setVoiceOptions(newVoiceOptions);
    if (generatedScript) {
      setGeneratedScript({
        ...generatedScript,
        voiceOptions: newVoiceOptions
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input and Voice Selection */}
          <div className="space-y-6">
            <InputSection 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
            />
            
            {generatedScript && (
              <VoiceSelector
                voiceOptions={voiceOptions}
                onVoiceOptionsChange={handleVoiceOptionsChange}
                hostStyle={generatedScript.options.hostStyle}
              />
            )}
          </div>

          {/* Right Column - Script Display and Audio */}
          <div className="space-y-6">
            <ScriptDisplay 
              script={generatedScript}
              isGenerating={isGenerating}
              onRegenerateSection={handleGenerate}
            />
            
            {generatedScript && (
              <AudioGeneration
                scriptContent={generatedScript.content}
                voiceOptions={voiceOptions}
                audioSegments={audioSegments}
                onAudioSegmentsChange={setAudioSegments}
                hostStyle={generatedScript.options.hostStyle}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
