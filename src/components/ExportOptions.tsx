
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ScriptData } from '../types/podcast';

interface ExportOptionsProps {
  script: ScriptData;
}

const ExportOptions = ({ script }: ExportOptionsProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(script.content);
      toast.success('Script copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy script');
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([script.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-script-${script.topic.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Script downloaded!');
  };

  const emailScript = () => {
    const subject = encodeURIComponent(`Podcast Script: ${script.topic}`);
    const body = encodeURIComponent(script.content);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareScript = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Podcast Script: ${script.topic}`,
          text: script.content
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">Export & Share</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          📋 Copy to Clipboard
        </Button>

        <Button
          onClick={downloadAsText}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          💾 Download as Text File
        </Button>

        <Button
          onClick={emailScript}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          📧 Email Script
        </Button>

        <Button
          onClick={shareScript}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          🔗 Share Script
        </Button>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Generated with AI • Ready for your podcast
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
