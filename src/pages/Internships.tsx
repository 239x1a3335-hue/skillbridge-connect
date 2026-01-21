import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Internship, Application } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import InternshipCard from '@/components/InternshipCard';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Internships: React.FC = () => {
  const { currentUser, studentData } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  useEffect(() => {
    const internshipsRef = ref(database, 'internships');
    const unsubscribe = onValue(internshipsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const internshipList: Internship[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Internship),
          id,
        }));
        setInternships(internshipList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    
    const applicationsRef = ref(database, 'applications');
    const unsubscribe = onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appList: Application[] = Object.entries(data)
          .map(([id, value]) => ({ ...(value as Application), id }))
          .filter((app) => app.studentId === currentUser.uid);
        setApplications(appList);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const calculateMatchScore = (internship: Internship): { score: number; reasons: string[] } => {
    if (!studentData?.skills?.length) return { score: 0, reasons: [] };

    const studentSkills = studentData.skills.map(s => s.toLowerCase());
    const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(skill => 
      studentSkills.some(s => s.includes(skill) || skill.includes(s))
    );
    
    const skillScore = (matchedSkills.length / requiredSkills.length) * 70;
    const profileScore = (studentData.profileCompletion / 100) * 15;
    const readinessScore = (studentData.readinessScore / 100) * 15;
    
    const totalScore = Math.round(skillScore + profileScore + readinessScore);
    
    const reasons: string[] = [];
    if (matchedSkills.length > 0) {
      reasons.push(`${matchedSkills.length}/${requiredSkills.length} skills matched`);
    }
    if (studentData.projects?.length > 0) {
      reasons.push('Relevant project experience');
    }
    if (studentData.profileCompletion >= 80) {
      reasons.push('Complete profile boosts visibility');
    }

    return { score: Math.min(totalScore, 100), reasons };
  };

  const handleApply = async (internship: Internship) => {
    if (!currentUser) {
      toast.error('Please login to apply');
      return;
    }

    const { score, reasons } = calculateMatchScore(internship);
    
    const application: Omit<Application, 'id'> = {
      studentId: currentUser.uid,
      internshipId: internship.id,
      matchScore: score,
      matchReasons: reasons,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
    };

    try {
      const newAppRef = push(ref(database, 'applications'));
      await set(newAppRef, application);

      // Update internship applicants
      const internshipRef = ref(database, `internships/${internship.id}`);
      const snapshot = await get(internshipRef);
      const currentData = snapshot.val();
      const applicants = currentData.applicants || [];
      await set(internshipRef, {
        ...currentData,
        applicants: [...applicants, currentUser.uid],
      });

      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = 
      internship.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'All' || internship.type === filterType;
    const matchesDifficulty = filterDifficulty === 'All' || internship.difficulty === filterDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const sortedInternships = [...filteredInternships].sort((a, b) => {
    const scoreA = calculateMatchScore(a).score;
    const scoreB = calculateMatchScore(b).score;
    return scoreB - scoreA;
  });

  const isApplied = (internshipId: string) => 
    applications.some(app => app.internshipId === internshipId);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Find Internships</h1>
          <p className="text-muted-foreground">
            Discover opportunities matched to your skills
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by role, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field min-w-[140px]"
              >
                <option value="All">All Types</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="input-field min-w-[160px]"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-20 bg-muted rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded-full w-20" />
                  <div className="h-6 bg-muted rounded-full w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedInternships.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-4">
              {sortedInternships.length} internships found
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {sortedInternships.map((internship) => {
                const { score, reasons } = calculateMatchScore(internship);
                return (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    matchScore={score}
                    matchReasons={reasons}
                    onApply={() => handleApply(internship)}
                    applied={isApplied(internship.id)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No internships found
            </h3>
            <p className="text-muted-foreground">
              {internships.length === 0
                ? 'No internships have been posted yet. Check back soon!'
                : 'Try adjusting your search or filters'}
            </p>
          </motion.div>
        )}
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Internships;
