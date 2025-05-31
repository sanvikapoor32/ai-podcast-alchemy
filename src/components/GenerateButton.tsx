
import React from 'react';
import { Button } from '@/components/ui/button';

interface GenerateButtonProps {
  isGenerating: boolean;
  disabled: boolean;
}

const GenerateButton = ({ isGenerating, disabled }: GenerateButtonProps) => {
  const loadingMessages = [
    "Crafting your script...",
    "Adding finishing touches...",
    "Almost ready!"
  ];
  
  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="space-y-3">
      <Button
        type="submit"
        disabled={disabled || isGenerating}
        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg"
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Generating Script...</span>
          </div>
        ) : (
          "Generate Podcast Script"
        )}
      </Button>
      
      {isGenerating && (
        <div className="text-center">
          <p className="text-sm text-gray-600 animate-pulse">
            {loadingMessages[currentMessage]}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;
