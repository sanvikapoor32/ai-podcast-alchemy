
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Upload, Music, X } from 'lucide-react';
import { toast } from 'sonner';

interface BackgroundMusicUploadProps {
  backgroundMusicFile?: File;
  backgroundVolume: number;
  onMusicFileChange: (file: File | undefined) => void;
  onVolumeChange: (volume: number) => void;
}

const BackgroundMusicUpload = ({ 
  backgroundMusicFile, 
  backgroundVolume, 
  onMusicFileChange, 
  onVolumeChange 
}: BackgroundMusicUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an MP3 or WAV file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    onMusicFileChange(file);
    toast.success('Background music uploaded successfully');
  };

  const removeFile = () => {
    onMusicFileChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-purple-600 flex items-center gap-2">
          <Music className="h-5 w-5" />
          Background Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Music File
          </label>
          
          {!backgroundMusicFile ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload background music
              </p>
              <p className="text-xs text-gray-500">
                MP3 or WAV files, max 50MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">{backgroundMusicFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(backgroundMusicFile.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={removeFile}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,audio/mp3,audio/mpeg,audio/wav,audio/x-wav"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Volume: {backgroundVolume}%
          </label>
          <Slider
            value={[backgroundVolume]}
            onValueChange={([value]) => onVolumeChange(value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Silent</span>
            <span>Loud</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundMusicUpload;
