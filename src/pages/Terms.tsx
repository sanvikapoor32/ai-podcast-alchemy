import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using the Podcast Script Generator service, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to these Terms of Service, 
                you should not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our service provides:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• AI-powered podcast script generation</li>
                <li>• Text-to-speech audio conversion</li>
                <li>• Multi-host voice options</li>
                <li>• Background music integration</li>
                <li>• Audio file download capabilities</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                The service is provided free of charge and on an "as-is" basis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                When using our service, you agree to:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Use the service for lawful purposes only</li>
                <li>• Not generate content that is harmful, offensive, or illegal</li>
                <li>• Not attempt to reverse engineer or exploit the service</li>
                <li>• Respect intellectual property rights</li>
                <li>• Not overload our systems with excessive requests</li>
                <li>• Take responsibility for the content you generate</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Your Content</h4>
                  <p className="text-muted-foreground">
                    You retain ownership of the topics you input and the scripts generated based on your input. 
                    You are responsible for ensuring your input does not infringe on others' rights.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Generated Content</h4>
                  <p className="text-muted-foreground">
                    The AI-generated scripts and audio are provided to you for your use. However, since they are 
                    AI-generated, we cannot guarantee their originality or freedom from third-party claims.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Service Components</h4>
                  <p className="text-muted-foreground">
                    The underlying technology, algorithms, and service interface remain our intellectual property.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You may not use our service to:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Create content that promotes hate speech, violence, or discrimination</li>
                <li>• Generate misleading or false information</li>
                <li>• Infringe on copyrights, trademarks, or other intellectual property</li>
                <li>• Create spam or automated content</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Attempt to hack, disrupt, or damage the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li>• We strive to maintain service availability but cannot guarantee 100% uptime</li>
                <li>• The service may be temporarily unavailable for maintenance or updates</li>
                <li>• We reserve the right to modify or discontinue features with notice</li>
                <li>• Third-party service dependencies may affect availability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The service is provided "as is" without warranties of any kind, either express or implied. 
                We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. 
                The quality and accuracy of AI-generated content may vary.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
                from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2">
                <li>• You may stop using the service at any time</li>
                <li>• We may terminate or suspend access for violations of these terms</li>
                <li>• We may discontinue the service with reasonable notice</li>
                <li>• Upon termination, these terms shall remain in effect as applicable</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be posted on this page 
                with an updated date. Your continued use of the service after such changes constitutes 
                acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
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

export default Terms;