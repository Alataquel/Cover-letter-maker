import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Sparkles } from "lucide-react";
import { CoverLetterCard } from './CoverLetterCard';
import { CoverLetterForm } from './CoverLetterForm';

interface CoverLetter {
  id: string;
  title: string;
  companyName: string;
  position: string;
  content: string;
  createdAt: Date;
  status: 'draft' | 'generated' | 'edited';
  formData?: any;
}

export const Dashboard: React.FC = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([
    {
      id: '1',
      title: 'Software Engineer at TechCorp',
      companyName: 'TechCorp',
      position: 'Software Engineer',
      content: 'Sample cover letter content...',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      status: 'generated',
    },
    {
      id: '2',
      title: 'Product Manager at StartupXYZ',
      companyName: 'StartupXYZ',
      position: 'Product Manager',
      content: 'Sample cover letter content...',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      status: 'draft',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredCoverLetters = coverLetters.filter(letter => 
    letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCoverLetter = (newCoverLetter: CoverLetter) => {
    setCoverLetters(prev => [newCoverLetter, ...prev]);
  };

  const handleEditCoverLetter = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit cover letter:', id);
  };

  const handleDeleteCoverLetter = (id: string) => {
    setCoverLetters(prev => prev.filter(letter => letter.id !== id));
  };

  const handleViewCoverLetter = (id: string) => {
    // TODO: Implement view functionality
    console.log('View cover letter:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">AI Cover Letter</h1>
                <p className="text-muted-foreground">AI-powered professional cover letters</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              variant="professional"
              size="lg"
              className="shadow-button hover:shadow-card-hover transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Create New Letter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{coverLetters.length}</p>
                <p className="text-sm text-muted-foreground">Total Cover Letters</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-card shadow-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent">
                <Sparkles className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {coverLetters.filter(l => l.status === 'generated').length}
                </p>
                <p className="text-sm text-muted-foreground">AI Generated</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {coverLetters.filter(l => l.status === 'draft').length}
                </p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cover letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cover Letters Grid */}
        {filteredCoverLetters.length === 0 ? (
          <Card className="bg-gradient-card shadow-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {searchQuery ? 'No cover letters found' : 'No cover letters yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first AI-powered cover letter to get started'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowForm(true)}
                  variant="professional"
                  className="shadow-button"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Cover Letter
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoverLetters.map(letter => (
              <CoverLetterCard
                key={letter.id}
                {...letter}
                onEdit={handleEditCoverLetter}
                onDelete={handleDeleteCoverLetter}
                onView={handleViewCoverLetter}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cover Letter Form Modal */}
      {showForm && (
        <CoverLetterForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveCoverLetter}
        />
      )}
    </div>
  );
};