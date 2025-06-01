
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
         trimmedLine.toLowerCase().includes('neha:') ||
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
      .replace(/Ravi:/gi, '')
      .replace(/Neha:/gi, '')
      .replace(/Host \d+ \([^)]+\):/gi, '')
      .replace(/Host \d+ \([^)]+\):/gi, '')
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

export const mergeAudioSegments = async (segments: AudioSegment[]): Promise<Blob> => {
  console.log('Starting audio merge for', segments.length, 'segments');
  
  // Filter segments that have audio blobs
  const validSegments = segments.filter(s => s.audioBlob && s.audioBlob.size > 0);
  console.log('Valid segments for merging:', validSegments.length);
  
  if (validSegments.length === 0) {
    throw new Error('No valid audio segments to merge');
  }

  if (validSegments.length === 1) {
    console.log('Only one segment, returning as-is');
    return validSegments[0].audioBlob!;
  }

  try {
    // Create audio context for merging
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffers: AudioBuffer[] = [];

    // Load all audio segments into AudioBuffers
    for (const segment of validSegments) {
      console.log('Loading segment for merge:', segment.id);
      const arrayBuffer = await segment.audioBlob!.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      audioBuffers.push(audioBuffer);
    }

    // Calculate total duration
    const totalDuration = audioBuffers.reduce((sum, buffer) => sum + buffer.duration, 0);
    const sampleRate = audioBuffers[0].sampleRate;
    const numberOfChannels = audioBuffers[0].numberOfChannels;

    console.log(`Merging audio: ${totalDuration}s total, ${sampleRate}Hz, ${numberOfChannels} channels`);

    // Create merged buffer
    const mergedBuffer = audioContext.createBuffer(
      numberOfChannels,
      Math.ceil(totalDuration * sampleRate),
      sampleRate
    );

    // Copy audio data
    let offset = 0;
    for (const buffer of audioBuffers) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        mergedBuffer.getChannelData(channel).set(channelData, offset);
      }
      offset += buffer.length;
    }

    // Convert back to blob
    const mergedBlob = await audioBufferToBlob(mergedBuffer);
    console.log('Audio merge completed, final size:', mergedBlob.size);
    
    return mergedBlob;
    
  } catch (error) {
    console.error('Audio merge failed:', error);
    throw new Error(`Failed to merge audio segments: ${error.message}`);
  }
};

// Helper function to convert AudioBuffer to Blob
const audioBufferToBlob = async (audioBuffer: AudioBuffer): Promise<Blob> => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = audioBuffer.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
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
    a.style.display = 'none';
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

export const downloadMergedAudio = async (segments: AudioSegment[]): Promise<void> => {
  try {
    console.log('Starting merged audio download');
    console.log('Total segments received:', segments.length);
    console.log('Segments with audioBlob:', segments.filter(s => s.audioBlob).length);
    
    const mergedBlob = await mergeAudioSegments(segments);
    
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-full-${Date.now()}.wav`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    console.log('Merged audio download completed');
  } catch (error) {
    console.error('Merged download failed:', error);
    throw error;
  }
};
