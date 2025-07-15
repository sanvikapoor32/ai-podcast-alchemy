import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, AlertTriangle } from 'lucide-react';

interface ApiTokenInputProps {
  onTokenChange: (token: string) => void;
}

const ApiTokenInput: React.FC<ApiTokenInputProps> = ({ onTokenChange }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load token from localStorage on component mount
    const savedToken = localStorage.getItem('pollinations_token');
    if (savedToken) {
      setToken(savedToken);
      setIsValid(true);
      onTokenChange(savedToken);
    }
  }, [onTokenChange]);

  const handleTokenChange = (value: string) => {
    setToken(value);
    setIsValid(value.length > 0);
    
    if (value.length > 0) {
      localStorage.setItem('pollinations_token', value);
      onTokenChange(value);
    } else {
      localStorage.removeItem('pollinations_token');
      onTokenChange('');
    }
  };

  const clearToken = () => {
    setToken('');
    setIsValid(false);
    localStorage.removeItem('pollinations_token');
    onTokenChange('');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          API Token Configuration
        </CardTitle>
        <CardDescription>
          Enter your Pollinations AI API token to enable enhanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">API Token</Label>
          <div className="relative">
            <Input
              id="token"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="Enter your Pollinations API token"
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowToken(!showToken)}
                className="h-8 w-8 p-0"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {token && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearToken}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>

        {isValid && (
          <Alert className="bg-green-50 border-green-200">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Token saved successfully! Enhanced AI models are now available.
            </AlertDescription>
          </Alert>
        )}

        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Security Note:</strong> Your token is stored locally in your browser and never sent to our servers.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground">
          <p>Get your free API token from:</p>
          <a 
            href="https://text.pollinations.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://text.pollinations.ai/
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTokenInput;