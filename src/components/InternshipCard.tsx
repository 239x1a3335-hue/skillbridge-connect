import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, DollarSign, Users } from 'lucide-react';
import { Internship } from '@/types';
import { Button } from '@/components/ui/button';

interface InternshipCardProps {
  internship: Internship;
  matchScore?: number;
  matchReasons?: string[];
  onApply?: () => void;
  onView?: () => void;
  showApply?: boolean;
  applied?: boolean;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  matchScore,
  matchReasons,
  onApply,
  onView,
  showApply = true,
  applied = false,
}) => {
  const getDifficultyColor = () => {
    switch (internship.difficulty) {
      case 'Beginner':
        return 'bg-success/10 text-success';
      case 'Intermediate':
        return 'bg-warning/10 text-warning';
      case 'Advanced':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      className="glass-card-hover p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
            {internship.role}
          </h3>
          <p className="text-primary font-medium">{internship.companyName}</p>
        </div>
        {matchScore !== undefined && (
          <div className="flex flex-col items-center">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${matchScore}%, hsl(var(--muted)) ${matchScore}%)`,
              }}
            >
              <div className="w-11 h-11 rounded-full bg-card flex items-center justify-center">
                <span className="text-foreground text-sm font-bold">{matchScore}%</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Match</span>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {internship.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`status-badge ${getDifficultyColor()}`}>
          {internship.difficulty}
        </span>
        <span className="status-badge bg-accent text-accent-foreground">
          {internship.type}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {internship.requiredSkills.slice(0, 4).map((skill) => (
          <span key={skill} className="skill-tag text-xs">
            {skill}
          </span>
        ))}
        {internship.requiredSkills.length > 4 && (
          <span className="skill-tag text-xs">
            +{internship.requiredSkills.length - 4} more
          </span>
        )}
      </div>

      {/* Match Reasons */}
      {matchReasons && matchReasons.length > 0 && (
        <div className="bg-success/5 border border-success/20 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-success mb-1">Why this matches:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {matchReasons.slice(0, 2).map((reason, i) => (
              <li key={i}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
        {internship.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {internship.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {internship.duration}
        </span>
        {internship.stipend && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {internship.stipend}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {internship.applicants?.length || 0} applicants
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {showApply && (
          <Button 
            onClick={onApply} 
            className="flex-1"
            disabled={applied}
          >
            {applied ? 'Applied' : 'Apply Now'}
          </Button>
        )}
        <Button variant="outline" onClick={onView}>
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default InternshipCard;
