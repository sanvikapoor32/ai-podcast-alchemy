import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "Is the Podcast Script Generator really free?",
      answer: "Yes! Our service is completely free to use. There are no hidden costs, subscription fees, or premium tiers. You can generate unlimited podcast scripts and convert them to audio without any charges."
    },
    {
      question: "How does the AI script generation work?",
      answer: "Our AI uses advanced language models to create podcast scripts based on your topic and preferences. Simply enter your topic, select your desired format, tone, and duration, and our AI will generate a comprehensive script tailored to your needs."
    },
    {
      question: "Can I customize the voices for different hosts?",
      answer: "Absolutely! Our multi-host feature allows you to assign different voices to each host in your podcast. You can choose from various voice options and even adjust the speaking speed to match your preferences."
    },
    {
      question: "What audio formats are supported for download?",
      answer: "Generated audio can be downloaded in high-quality formats suitable for podcast distribution. The audio includes your script content and any background music you've added."
    },
    {
      question: "Can I upload my own script instead of generating one?",
      answer: "Yes! While our AI can generate scripts for you, you can also upload your own custom script. The system will automatically detect different speakers and assign appropriate voices to each host."
    },
    {
      question: "How do I add background music to my podcast?",
      answer: "You can upload your own background music file through the Background Music Upload section. You can also adjust the volume level to ensure it complements your spoken content perfectly."
    },
    {
      question: "What types of podcast formats are available?",
      answer: "We support various formats including interviews, solo shows, educational content, storytelling, news updates, and casual conversations. Each format is optimized for its specific style and audience."
    },
    {
      question: "How long can the generated scripts be?",
      answer: "You can choose from different duration options ranging from short 5-minute segments to longer 30+ minute episodes. The AI will adjust the content depth and detail based on your selected duration."
    },
    {
      question: "Can I edit the generated script before converting to audio?",
      answer: "Yes! After the script is generated, you can review and edit it as needed. Make any changes you want before proceeding to the audio conversion step."
    },
    {
      question: "Are there any usage limits?",
      answer: "Currently, there are no strict usage limits. However, we ask users to be reasonable with their usage to ensure the service remains available for everyone. If you need high-volume usage, please contact us."
    },
    {
      question: "Can I use the generated content commercially?",
      answer: "Yes, you can use the generated scripts and audio for commercial purposes, including monetized podcasts, educational content, and business presentations. However, please ensure you comply with any applicable laws and platform requirements."
    },
    {
      question: "What happens to my data and generated content?",
      answer: "Your privacy is important to us. Generated scripts and audio are not permanently stored on our servers. Data is processed temporarily for generation purposes and then removed. Please refer to our Privacy Policy for detailed information."
    },
    {
      question: "How accurate and natural do the voices sound?",
      answer: "Our text-to-speech technology uses advanced AI to create natural-sounding voices. While they are very realistic, they are still AI-generated. The quality continues to improve as the technology advances."
    },
    {
      question: "Can I regenerate specific sections of a script?",
      answer: "Yes! If you're not satisfied with a particular section of your generated script, you can regenerate specific parts while keeping the rest of the content intact."
    },
    {
      question: "What should I do if I encounter technical issues?",
      answer: "If you experience any technical issues, please contact us at omniaiprompt@gmail.com. Include details about the problem you're experiencing, and we'll help resolve it as quickly as possible."
    },
    {
      question: "Are there any content restrictions?",
      answer: "We ask that you don't generate content that is harmful, illegal, or violates our Terms of Service. This includes hate speech, misinformation, or content that infringes on others' rights. Please use the service responsibly."
    },
    {
      question: "Can I collaborate with others on podcast scripts?",
      answer: "Currently, the service is designed for individual use. However, you can easily share generated scripts with collaborators for review and feedback before finalizing your podcast."
    },
    {
      question: "How often is the service updated with new features?",
      answer: "We regularly update our service with new features and improvements based on user feedback. Follow our updates or contact us to suggest new features you'd like to see."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our podcast script generator
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a 
              href="mailto:omniaiprompt@gmail.com"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Contact us at omniaiprompt@gmail.com
            </a>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;