
import React, { useState } from 'react';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ScriptDisplay from '../components/ScriptDisplay';
import Footer from '../components/Footer';
import { ScriptData, GenerationOptions } from '../types/podcast';

const Index = () => {
  const [generatedScript, setGeneratedScript] = useState<ScriptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      setGeneratedScript({
        content: data,
        topic,
        options,
        generatedAt: new Date()
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the script');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
          />
          <ScriptDisplay 
            script={generatedScript}
            isGenerating={isGenerating}
            onRegenerateSection={handleGenerate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
