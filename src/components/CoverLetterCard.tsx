import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Edit, Trash2 } from "lucide-react";
interface CoverLetterCardProps {
  id: string;
  title: string;
  companyName: string;
  position: string;
  createdAt: Date;
  status: 'draft' | 'generated' | 'edited';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}
export const CoverLetterCard: React.FC<CoverLetterCardProps> = ({
  id,
  title,
  companyName,
  position,
  createdAt,
  status,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'generated':
        return 'bg-primary text-primary-foreground';
      case 'edited':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return <Card className="bg-gradient-card shadow-card hover:shadow-card-hover transition-smooth transform hover:-translate-y-1 cursor-pointer group p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          
          <div>
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <Badge className={getStatusColor(status)} variant="secondary">
              {status}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Company:</span> {companyName}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Position:</span> {position}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {createdAt.toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" size="sm" onClick={() => onView(id)} className="text-primary hover:text-primary-foreground hover:bg-primary">
          View
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)} className="opacity-0 group-hover:opacity-100 transition-smooth">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)} className="opacity-0 group-hover:opacity-100 transition-smooth text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>;
};