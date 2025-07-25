
export interface GenerationOptions {
  format: 'Solo Commentary' | 'Interview Style' | 'Educational' | 'Storytelling' | 'News Brief';
  duration: '5-10 mins' | '15-20 mins' | '30+ mins';
  tone: 'Professional' | 'Conversational' | 'Humorous' | 'Inspirational';
  hostStyle: 'single' | 'multiple';
  audience: 'General' | 'Business Professionals' | 'Students' | 'Tech Enthusiasts' | 'Creative Community';
  complexity: number; // 1-5 scale
  elements: string[];
}

export interface Host {
  id: string;
  name: string;
  voice: string;
}

export interface VoiceOptions {
  host: string;
  guest?: string;
  speed: number;
  backgroundMusic: boolean;
  backgroundVolume: number;
  backgroundMusicFile?: File;
  hosts?: Host[];
}

export interface AudioSegment {
  id: string;
  text: string;
  audioUrl?: string;
  audioBlob?: Blob;
  duration?: number;
  voice: string;
  hostName?: string;
  generatingAudio: boolean;
  generationError?: string;
}

export interface ScriptData {
  content: string;
  topic: string;
  options: GenerationOptions;
  generatedAt: Date;
  audioSegments?: AudioSegment[];
  voiceOptions?: VoiceOptions;
  isCustomScript?: boolean;
  hosts?: Host[];
}

export const AVAILABLE_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Professional Male' },
  { id: 'echo', name: 'Echo', description: 'Energetic Female' },
  { id: 'fable', name: 'Fable', description: 'Calm Male' },
  { id: 'nova', name: 'Nova', description: 'Friendly Female' },
  { id: 'onyx', name: 'Onyx', description: 'Deep Male' },
  { id: 'shimmer', name: 'Shimmer', description: 'Warm Female' },
  { id: 'coral', name: 'Coral', description: 'Vibrant Female' },
  { id: 'verse', name: 'Verse', description: 'Narrative Male' },
  { id: 'ballad', name: 'Ballad', description: 'Musical Female' },
  { id: 'ash', name: 'Ash', description: 'Smooth Male' },
  { id: 'sage', name: 'Sage', description: 'Wise Female' },
  { id: 'amuch', name: 'Amuch', description: 'Dynamic Male' },
  { id: 'dan', name: 'Dan', description: 'Clear Male' }
] as const;
