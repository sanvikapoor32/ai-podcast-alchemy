import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground">
                We collect minimal information to provide our podcast script generation service:
              </p>
              <ul className="text-muted-foreground mt-4 space-y-2">
                <li>• <strong>Content Data:</strong> Topics and scripts you generate for processing</li>
                <li>• <strong>Usage Data:</strong> Basic analytics to improve our service</li>
                <li>• <strong>Technical Data:</strong> Browser type, IP address, and device information</li>
                <li>• <strong>Audio Files:</strong> Temporary audio files created during generation (automatically deleted)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li>• Generate podcast scripts based on your topics</li>
                <li>• Convert scripts to audio using text-to-speech technology</li>
                <li>• Improve our AI models and service quality</li>
                <li>• Provide technical support when needed</li>
                <li>• Monitor for abuse and ensure service security</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We take data security seriously:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Scripts and audio are processed in real-time and not permanently stored</li>
                <li>• All data transmission is encrypted using HTTPS</li>
                <li>• We use secure third-party services for AI processing</li>
                <li>• Audio files are automatically deleted after generation</li>
                <li>• No personal accounts or user data retention</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use the following third-party services:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Pollinations AI:</strong> For script generation</li>
                <li>• <strong>Text-to-Speech APIs:</strong> For audio conversion</li>
                <li>• <strong>Web Analytics:</strong> For service improvement (anonymized)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Since we don't store personal data permanently, you have the following rights:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Your generated content is not stored after session ends</li>
                <li>• You can clear your browser data to remove any local storage</li>
                <li>• You can contact us to address any privacy concerns</li>
                <li>• You can stop using the service at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may use minimal cookies and local storage for:
              </p>
              <ul className="text-muted-foreground mt-4 space-y-2">
                <li>• Saving your preferences during your session</li>
                <li>• Improving website functionality</li>
                <li>• Basic analytics (anonymized)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. Any changes will be posted on this page 
                with an updated date. Continued use of the service after changes constitutes acceptance of the new policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-primary font-medium mt-2">
                omniaiprompt@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;