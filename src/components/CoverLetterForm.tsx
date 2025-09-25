import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverLetterFormProps {
  onClose: () => void;
  onSave: (coverLetter: any) => void;
}

interface FormData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  apiKey: string;
}

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    jobTitle: 'Senior Software Engineer',
    companyName: 'TechCorp Solutions',
    jobDescription: 'We are looking for a Senior Software Engineer to join our dynamic team. The ideal candidate will have 5+ years of experience in React, TypeScript, and modern web development. You will be responsible for building scalable web applications and mentoring junior developers.',
    apiKey: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>(`Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at TechCorp Solutions. With over 6 years of experience in full-stack development and a proven track record of delivering high-quality web applications, I am excited about the opportunity to contribute to your dynamic team.

In my current role at InnovateTech, I have successfully led the development of several React-based applications, utilizing TypeScript to ensure code reliability and maintainability. My expertise in modern web development frameworks, coupled with my experience in mentoring junior developers, aligns perfectly with the requirements outlined in your job description.

Key highlights of my qualifications include:
• 6+ years of hands-on experience with React, TypeScript, and Node.js
• Led a team of 4 developers in building a customer-facing platform that increased user engagement by 40%
• Implemented CI/CD pipelines that reduced deployment time by 60%
• Mentored 8 junior developers, with 100% retention rate in the team

I am particularly drawn to TechCorp Solutions' commitment to innovation and technological excellence. Your recent work in developing scalable cloud solutions resonates with my passion for building robust, efficient systems that can handle enterprise-level demands.

I would welcome the opportunity to discuss how my technical expertise and leadership experience can contribute to your team's continued success. Thank you for considering my application.

Sincerely,
[Your Name]`);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const generateCoverLetter = async () => {
    if (!formData.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to generate the cover letter.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobTitle.trim() || !formData.companyName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the job title and company name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Write a professional cover letter for the following:
      
Job Title: ${formData.jobTitle}
Company: ${formData.companyName}
Job Description: ${formData.jobDescription}

Please write a compelling, professional cover letter that highlights relevant experience and skills for this position. Keep it concise and engaging.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer and career coach. Write compelling, personalized cover letters that highlight the candidate\'s strengths and match them to the job requirements.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const letter = data.choices[0]?.message?.content || '';
      setGeneratedLetter(letter);
      
      toast({
        title: "Cover Letter Generated!",
        description: "Your cover letter has been successfully generated.",
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedLetter.trim()) {
      toast({
        title: "No Content to Save",
        description: "Please generate a cover letter first.",
        variant: "destructive",
      });
      return;
    }

    const coverLetter = {
      id: Date.now().toString(),
      title: `${formData.jobTitle} at ${formData.companyName}`,
      companyName: formData.companyName,
      position: formData.jobTitle,
      content: generatedLetter,
      createdAt: new Date(),
      status: 'generated' as const,
      formData: formData,
    };

    onSave(coverLetter);
    toast({
      title: "Cover Letter Saved!",
      description: "Your cover letter has been saved successfully.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gradient-card shadow-card-hover max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">AI Cover Letter</h2>
              <p className="text-sm text-muted-foreground">AI-powered professional cover letter generation</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-3">Job Information</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Google Inc."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here to get a more tailored cover letter..."
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>


              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-3">API Configuration</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={formData.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Generated Cover Letter</Badge>
                <Button 
                  onClick={generateCoverLetter}
                  disabled={isGenerating}
                  variant="professional"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              
              <Card className="bg-muted/30 border-2 border-dashed border-border min-h-[400px] p-4">
                {generatedLetter ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-card-foreground leading-relaxed">
                      {generatedLetter}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Your generated cover letter will appear here</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!generatedLetter.trim()}
            variant="professional"
          >
            Save Cover Letter
          </Button>
        </div>
      </Card>
    </div>
  );
};