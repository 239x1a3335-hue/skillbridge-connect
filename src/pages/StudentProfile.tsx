import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Mail, 
  ArrowLeft,
  GraduationCap,
  Award
} from 'lucide-react';
import { database } from '@/lib/firebase';
import { Student, User as UserType } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import ProgressRing from '@/components/ProgressRing';
import ProjectsSection from '@/components/ProjectsSection';
import ResumePortfolioSection from '@/components/ResumePortfolioSection';
import { Button } from '@/components/ui/button';

const StudentProfile: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;

      try {
        const studentSnap = await get(ref(database, `students/${studentId}`));
        const userSnap = await get(ref(database, `users/${studentId}`));
        
        if (studentSnap.exists() && userSnap.exists()) {
          setStudent(studentSnap.val());
          setUser(userSnap.val());
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-40" />
                  <div className="h-4 bg-muted rounded w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student || !user) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The student profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = student.blindHiringEnabled ? 'Anonymous Candidate' : user.name;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Overview */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-semibold text-xl">{displayName}</h2>
              {!student.blindHiringEnabled && student.college && (
                <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <GraduationCap className="w-4 h-4" />
                  {student.college}
                </p>
              )}
              {student.location && (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {student.location}
                </p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 text-center"
            >
              <ProgressRing 
                progress={student.readinessScore || 0} 
                size={80}
                strokeWidth={8}
              />
              <h3 className="font-semibold mt-3">Skill Readiness</h3>
              <p className="text-sm text-muted-foreground">
                Based on skills & projects
              </p>
            </motion.div>

            {/* Resume & Portfolio */}
            <ResumePortfolioSection
              resumeUrl={student.resumeUrl}
              portfolioUrl={student.portfolioUrl}
              onUpdate={() => {}}
              readonly
            />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {student.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  About
                </h3>
                <p className="text-muted-foreground">{student.bio}</p>
              </motion.div>
            )}

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Skills
              </h3>
              {student.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No skills added yet.</p>
              )}
            </motion.div>

            {/* Projects */}
            <ProjectsSection
              projects={student.projects || []}
              onUpdateProjects={() => {}}
              readonly
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
