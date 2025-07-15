import React, { useState } from 'react';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ScriptDisplay from '../components/ScriptDisplay';
import VoiceSelector from '../components/VoiceSelector';
import AudioGeneration from '../components/AudioGeneration';
import Footer from '../components/Footer';
import { ScriptData, GenerationOptions, VoiceOptions, AudioSegment, Host } from '../types/podcast';
import MergedAudioPlayer from '../components/MergedAudioPlayer';
import MultiHostSetup from '../components/MultiHostSetup';
import EnhancedCustomScriptInput from '../components/EnhancedCustomScriptInput';
import BackgroundMusicUpload from '../components/BackgroundMusicUpload';
import ApiTokenInput from '../components/ApiTokenInput';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<ScriptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hosts, setHosts] = useState<Host[]>([
    { id: 'host-1', name: 'Host 1', voice: 'alloy' }
  ]);
  const [voiceOptions, setVoiceOptions] = useState<VoiceOptions>({
    host: 'alloy',
    guest: 'nova',
    speed: 1.0,
    backgroundMusic: false,
    backgroundVolume: 50,
    hosts
  });
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([]);
  const [apiToken, setApiToken] = useState<string>('');

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


      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let url = 'https://text.pollinations.ai/';
      
      if (apiToken) {
        url = `https://text.pollinations.ai/openai?token=${apiToken}`;
        headers['Authorization'] = `Bearer ${apiToken}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
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

  const handleCustomScript = (scriptData: ScriptData) => {
    const updatedScriptData = {
      ...scriptData,
      hosts,
      voiceOptions: {
        ...voiceOptions,
        hosts,
        speed: scriptData.voiceOptions?.speed || voiceOptions.speed
      }
    };
    setGeneratedScript(updatedScriptData);
    setAudioSegments([]);
    setError(null);
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

  const handleHostsChange = (newHosts: Host[]) => {
    setHosts(newHosts);
    const updatedVoiceOptions = {
      ...voiceOptions,
      hosts: newHosts,
      hostStyle: newHosts.length > 1 ? 'multiple' : 'single'
    };
    setVoiceOptions(updatedVoiceOptions);
    
    if (generatedScript) {
      setGeneratedScript({
        ...generatedScript,
        hosts: newHosts,
        voiceOptions: updatedVoiceOptions,
        options: {
          ...generatedScript.options,
          hostStyle: newHosts.length > 1 ? 'multiple' : 'single'
        }
      });
    }
  };

  const handleBackgroundMusicChange = (file: File | undefined) => {
    setVoiceOptions(prev => ({
      ...prev,
      backgroundMusicFile: file,
      backgroundMusic: !!file
    }));
  };

  const handleBackgroundVolumeChange = (volume: number) => {
    setVoiceOptions(prev => ({
      ...prev,
      backgroundVolume: volume
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Create Amazing Podcasts with{' '}
            <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate engaging podcast scripts instantly, convert them to natural-sounding audio, 
            and create professional podcasts with multiple hosts - all completely free!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              100% Free
            </div>
            <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              AI-Powered
            </div>
            <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Multi-Host Support
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Input and Configuration */}
          <div className="space-y-8">
            <ApiTokenInput onTokenChange={setApiToken} />
            
            <InputSection 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
            />
            
            <MultiHostSetup
              hosts={hosts}
              onHostsChange={handleHostsChange}
            />
            
            <EnhancedCustomScriptInput 
              onScriptSubmit={handleCustomScript}
              hosts={hosts}
            />
            
            <BackgroundMusicUpload
              backgroundMusicFile={voiceOptions.backgroundMusicFile}
              backgroundVolume={voiceOptions.backgroundVolume}
              onMusicFileChange={handleBackgroundMusicChange}
              onVolumeChange={handleBackgroundVolumeChange}
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
          <div className="space-y-8">
            <ScriptDisplay 
              script={generatedScript}
              isGenerating={isGenerating}
              onRegenerateSection={handleGenerate}
            />
            
            {generatedScript && (
              <>
                <AudioGeneration
                  scriptContent={generatedScript.content}
                  voiceOptions={voiceOptions}
                  audioSegments={audioSegments}
                  onAudioSegmentsChange={setAudioSegments}
                  hostStyle={generatedScript.options.hostStyle}
                />
                
                {audioSegments.filter(s => s.audioBlob).length > 0 && (
                  <MergedAudioPlayer
                    audioSegments={audioSegments}
                    backgroundMusic={voiceOptions.backgroundMusic}
                    backgroundMusicFile={voiceOptions.backgroundMusicFile}
                    backgroundVolume={voiceOptions.backgroundVolume}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
