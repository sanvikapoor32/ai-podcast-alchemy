import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, Zap, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Podcast Script Generator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your ideas into engaging podcast scripts with the power of AI. Create professional-quality content in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI-Powered Scripts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Generate compelling podcast scripts using advanced AI technology tailored to your topic and audience.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Multi-Host Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Create dynamic conversations with multiple hosts, each with their own unique voice and personality.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Instant Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Convert your scripts to high-quality audio with realistic text-to-speech voices in seconds.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Free to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access all features completely free. No hidden costs, no subscription required.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              We believe that everyone has a story to tell and knowledge to share. Our AI-powered podcast script generator democratizes content creation, 
              making it easy for anyone to create professional-quality podcast content without the need for expensive equipment or extensive experience.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you're a seasoned podcaster looking to streamline your workflow, an educator creating audio content, or someone with a great idea 
              but no script-writing experience, our tool is designed to help you bring your vision to life.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">AI-generated scripts on any topic</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">Multiple voice options</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">Custom script input</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">Background music integration</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">Multi-host conversations</span>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">✓</Badge>
                <span className="text-muted-foreground">Audio export options</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default About;