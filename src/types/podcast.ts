
export interface GenerationOptions {
  format: 'Solo Commentary' | 'Interview Style' | 'Educational' | 'Storytelling' | 'News Brief';
  duration: '5-10 mins' | '15-20 mins' | '30+ mins';
  tone: 'Professional' | 'Conversational' | 'Humorous' | 'Inspirational';
  hostStyle: 'single' | 'multiple';
  audience: 'General' | 'Business Professionals' | 'Students' | 'Tech Enthusiasts' | 'Creative Community';
  complexity: number; // 1-5 scale
  elements: string[];
}

export interface ScriptData {
  content: string;
  topic: string;
  options: GenerationOptions;
  generatedAt: Date;
}
