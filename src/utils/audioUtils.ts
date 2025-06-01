
import { AudioSegment, VoiceOptions } from '../types/podcast';

export const parseScriptIntoSegments = (content: string, voiceOptions: VoiceOptions, hostStyle: 'single' | 'multiple'): AudioSegment[] => {
  const lines = content.split('\n').filter(line => line.trim());
  const segments: AudioSegment[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('[') && !trimmedLine.startsWith('(')) {
      const isGuestLine = hostStyle === 'multiple' && 
        (trimmedLine.toLowerCase().includes('guest:') || 
         trimmedLine.toLowerCase().includes('interviewer:') ||
         index % 4 === 2);
      
      segments.push({
        id: `segment-${index}`,
        text: trimmedLine,
        voice: isGuestLine ? (voiceOptions.guest || voiceOptions.host) : voiceOptions.host,
        generatingAudio: false
      });
    }
  });
  
  return segments;
};

export const generateAudioForSegment = async (
  segment: AudioSegment,
  voiceOptions: VoiceOptions,
  audioSegments: AudioSegment[],
  onAudioSegmentsChange: (segments: AudioSegment[]) => void
): Promise<void> => {
  console.log('Starting audio generation for segment:', segment.id);
  
  try {
    // Update segment to show it's generating
    const updatedSegments = audioSegments.map(s => 
      s.id === segment.id ? { ...s, generatingAudio: true, generationError: undefined } : s
    );
    onAudioSegmentsChange(updatedSegments);

    // Clean the text for better audio generation
    const cleanText = segment.text
      .replace(/Host:/gi, '')
      .replace(/Guest:/gi, '')
      .replace(/Interviewer:/gi, '')
      .trim();

    console.log('Generating audio for text:', cleanText);
    console.log('Using voice:', segment.voice);

    const encodedText = encodeURIComponent(cleanText);
    const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${segment.voice}&speed=${voiceOptions.speed || 1.0}`;
    
    console.log('Audio API URL:', audioUrl);
    
    const response = await fetch(audioUrl, {
      method: 'GET',
      headers: {
        'Accept': 'audio/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const audioBlob = await response.blob();
    console.log('Audio blob received, size:', audioBlob.size, 'type:', audioBlob.type);
    
    if (audioBlob.size === 0) {
      throw new Error('Empty audio file received');
    }
    
    const audioObjectUrl = URL.createObjectURL(audioBlob);
    console.log('Audio object URL created:', audioObjectUrl);
    
    // Test if audio can be loaded
    const audio = new Audio();
    
    await new Promise((resolve, reject) => {
      audio.onloadedmetadata = () => {
        console.log('Audio loaded successfully, duration:', audio.duration);
        resolve(audio.duration);
      };
      audio.onerror = (e) => {
        console.error('Audio load error:', e);
        reject(new Error('Failed to load generated audio'));
      };
      audio.src = audioObjectUrl;
    });
    
    // Update segment with generated audio
    const finalSegments = audioSegments.map(s => 
      s.id === segment.id ? { 
        ...s, 
        audioUrl: audioObjectUrl, 
        audioBlob, 
        duration: audio.duration,
        generatingAudio: false 
      } : s
    );
    onAudioSegmentsChange(finalSegments);
    
    console.log('Audio generation completed for segment:', segment.id);
    
  } catch (error) {
    console.error('Audio generation failed for segment:', segment.id, error);
    const errorSegments = audioSegments.map(s => 
      s.id === segment.id ? { 
        ...s, 
        generatingAudio: false, 
        generationError: `Generation failed: ${error.message}` 
      } : s
    );
    onAudioSegmentsChange(errorSegments);
  }
};

export const downloadAudio = (segment: AudioSegment, index: number): void => {
  if (!segment.audioBlob) {
    console.error('No audio blob available for segment:', segment.id);
    return;
  }

  try {
    const url = URL.createObjectURL(segment.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-segment-${index + 1}-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    console.log('Download initiated for segment:', segment.id);
  } catch (error) {
    console.error('Download failed for segment:', segment.id, error);
  }
};
