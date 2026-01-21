import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { database } from '@/lib/firebase';
import { Internship, Student } from '@/types';
import { Link } from 'react-router-dom';

interface RecommendationsSectionProps {
  studentData: Student | null;
}

interface RecommendedInternship extends Internship {
  matchScore: number;
  matchedSkills: string[];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ studentData }) => {
  const [recommendations, setRecommendations] = useState<RecommendedInternship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentData?.skills?.length) {
      setLoading(false);
      return;
    }

    const internshipsRef = ref(database, 'internships');
    const unsubscribe = onValue(internshipsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const internshipList: Internship[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Internship),
          id,
        }));

        // Calculate match scores
        const studentSkills = studentData.skills.map(s => s.toLowerCase());
        
        const withScores: RecommendedInternship[] = internshipList.map(internship => {
          const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase());
          
          const matchedSkills = requiredSkills.filter(skill =>
            studentSkills.some(s => s.includes(skill) || skill.includes(s))
          );
          
          const skillScore = requiredSkills.length > 0 
            ? (matchedSkills.length / requiredSkills.length) * 70 
            : 0;
          const profileScore = (studentData.profileCompletion / 100) * 15;
          const projectScore = (studentData.projects?.length || 0) * 5;
          
          const totalScore = Math.min(Math.round(skillScore + profileScore + projectScore), 100);
          
          return {
            ...internship,
            matchScore: totalScore,
            matchedSkills: matchedSkills.map(s => 
              internship.requiredSkills.find(rs => rs.toLowerCase() === s) || s
            ),
          };
        });

        // Sort by match score and take top 3
        const topRecommendations = withScores
          .filter(i => i.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3);

        setRecommendations(topRecommendations);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentData]);

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!studentData?.skills?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recommended For You
        </h3>
        <div className="text-center py-6">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Add skills to your profile to get personalized recommendations!
          </p>
          <Link to="/profile" className="text-primary hover:underline text-sm mt-2 inline-block">
            Complete your profile →
          </Link>
        </div>
      </motion.div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recommended For You
        </h3>
        <div className="text-center py-6">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No matching internships found. Check back soon!
          </p>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recommended For You
        </h3>
        <Link 
          to="/internships" 
          className="text-sm text-primary hover:underline"
        >
          View all →
        </Link>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((internship, index) => (
          <motion.div
            key={internship.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-accent/20 rounded-xl hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {internship.role}
                  </h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    internship.matchScore >= 70 
                      ? 'bg-success/20 text-success' 
                      : internship.matchScore >= 40 
                        ? 'bg-warning/20 text-warning' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {internship.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {internship.companyName}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {internship.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {internship.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {internship.type}
                  </span>
                </div>
                {internship.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {internship.matchedSkills.slice(0, 3).map(skill => (
                      <span 
                        key={skill} 
                        className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {internship.matchedSkills.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{internship.matchedSkills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsSection;
