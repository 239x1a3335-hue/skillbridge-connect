import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe, ExternalLink, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ResumePortfolioSectionProps {
  resumeUrl?: string;
  portfolioUrl?: string;
  onUpdate: (data: { resumeUrl?: string; portfolioUrl?: string }) => void;
  readonly?: boolean;
}

const ResumePortfolioSection: React.FC<ResumePortfolioSectionProps> = ({
  resumeUrl = '',
  portfolioUrl = '',
  onUpdate,
  readonly = false,
}) => {
  const [resume, setResume] = useState(resumeUrl);
  const [portfolio, setPortfolio] = useState(portfolioUrl);
  const [hasChanges, setHasChanges] = useState(false);

  const handleResumeChange = (value: string) => {
    setResume(value);
    setHasChanges(true);
  };

  const handlePortfolioChange = (value: string) => {
    setPortfolio(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate({ resumeUrl: resume.trim(), portfolioUrl: portfolio.trim() });
    setHasChanges(false);
    toast.success('Links saved successfully');
  };

  if (readonly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Resume & Portfolio
        </h3>
        <div className="flex flex-wrap gap-3">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Resume
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">No resume link</span>
          )}
          {portfolioUrl ? (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-info/10 hover:bg-info/20 text-info rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              View Portfolio
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">No portfolio link</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Resume & Portfolio
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Resume Link
          </label>
          <input
            type="url"
            value={resume}
            onChange={(e) => handleResumeChange(e.target.value)}
            placeholder="https://drive.google.com/your-resume"
            className="input-field"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Link to your resume (Google Drive, Dropbox, or personal site)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Portfolio Link
          </label>
          <input
            type="url"
            value={portfolio}
            onChange={(e) => handlePortfolioChange(e.target.value)}
            placeholder="https://yourportfolio.com"
            className="input-field"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Link to your personal website or portfolio
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save Links
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumePortfolioSection;
