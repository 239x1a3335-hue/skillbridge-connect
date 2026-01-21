import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save, User, MapPin, Link as LinkIcon, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProgressRing from '@/components/ProgressRing';
import ProjectsSection from '@/components/ProjectsSection';
import ResumePortfolioSection from '@/components/ResumePortfolioSection';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Project } from '@/types';

const Profile: React.FC = () => {
  const { userData, studentData, updateStudentProfile } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [bio, setBio] = useState(studentData?.bio || '');
  const [college, setCollege] = useState(studentData?.college || '');
  const [location, setLocation] = useState(studentData?.location || '');
  const [blindHiring, setBlindHiring] = useState(studentData?.blindHiringEnabled ?? true);
  const [saving, setSaving] = useState(false);

  const skills = studentData?.skills || [];

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }
    
    const updatedSkills = [...skills, newSkill.trim()];
    updateStudentProfile({ skills: updatedSkills });
    setNewSkill('');
    toast.success('Skill added');
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    updateStudentProfile({ skills: updatedSkills });
    toast.success('Skill removed');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate profile completion
      let completion = 10; // Base
      if (bio) completion += 15;
      if (college) completion += 10;
      if (location) completion += 10;
      if (skills.length > 0) completion += Math.min(skills.length * 5, 25);
      if (studentData?.projects?.length) completion += 15;
      if (studentData?.resumeUrl) completion += 5;
      if (studentData?.portfolioUrl) completion += 5;
      if (studentData?.certifications?.length) completion += 5;
      
      await updateStudentProfile({
        bio,
        college,
        location,
        blindHiringEnabled: blindHiring,
        profileCompletion: Math.min(completion, 100),
        readinessScore: Math.min(skills.length * 10 + (studentData?.projects?.length || 0) * 15, 100),
      });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleProjectsUpdate = (projects: Project[]) => {
    updateStudentProfile({ projects });
  };

  const handleResumePortfolioUpdate = (data: { resumeUrl?: string; portfolioUrl?: string }) => {
    updateStudentProfile(data);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">My Profile</h1>
          <p className="text-muted-foreground">
            Build your skill portfolio to attract the right opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center"
            >
              <ProgressRing 
                progress={studentData?.profileCompletion || 10} 
                size={100}
                strokeWidth={10}
              />
              <h3 className="font-semibold mt-4">Profile Completion</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your profile to improve visibility
              </p>
            </motion.div>

            {/* Skill Readiness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 text-center"
            >
              <ProgressRing 
                progress={studentData?.readinessScore || 0} 
                size={100}
                strokeWidth={10}
              />
              <h3 className="font-semibold mt-4">Skill Readiness</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on skills and projects
              </p>
            </motion.div>

            {/* Blind Hiring Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Blind Hiring</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hide college info from recruiters
                  </p>
                </div>
                <Switch 
                  checked={blindHiring} 
                  onCheckedChange={setBlindHiring}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={userData?.name || ''}
                    disabled
                    className="input-field bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="input-field bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">College</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Your college/university"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Skills</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill (e.g., React, Python)"
                  className="input-field flex-1"
                />
                <Button onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="skill-tag flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet. Add skills to improve your match score!
                  </p>
                )}
              </div>
            </motion.div>

            {/* Projects Section */}
            <ProjectsSection 
              projects={studentData?.projects || []}
              onUpdateProjects={handleProjectsUpdate}
            />

            {/* Resume & Portfolio Section */}
            <ResumePortfolioSection
              resumeUrl={studentData?.resumeUrl}
              portfolioUrl={studentData?.portfolioUrl}
              onUpdate={handleResumePortfolioUpdate}
            />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="px-8">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Profile
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Profile;
