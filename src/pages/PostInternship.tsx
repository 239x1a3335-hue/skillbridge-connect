import React, { useState, useEffect } from 'react';
import { ref, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Internship } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PostInternship: React.FC = () => {
  const { currentUser, companyData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    requiredSkills: [] as string[],
    difficulty: 'Beginner' as Internship['difficulty'],
    type: 'Remote' as Internship['type'],
    duration: '',
    location: '',
    stipend: '',
    deadline: '',
  });

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.requiredSkills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }
    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !companyData) {
      toast.error('Please complete your company profile first');
      return;
    }

    if (formData.requiredSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    setLoading(true);
    try {
      const internship: Omit<Internship, 'id'> = {
        ...formData,
        companyId: currentUser.uid,
        companyName: companyData.companyName,
        applicants: [],
        createdAt: new Date().toISOString(),
      };

      const newRef = push(ref(database, 'internships'));
      await set(newRef, internship);
      
      toast.success('Internship posted successfully!');
      navigate('/manage-internships');
    } catch {
      toast.error('Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">Post New Internship</h1>
          <p className="text-muted-foreground">
            Find skilled candidates for your team
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-6"
        >
          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Role Title *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Frontend Developer Intern"
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what the intern will learn..."
              className="input-field min-h-[150px] resize-none"
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Required Skills *</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g., React)"
                className="input-field flex-1"
              />
              <Button type="button" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill) => (
                <span key={skill} className="skill-tag flex items-center gap-2">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Type & Difficulty */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Work Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Internship['type'] }))}
                className="input-field"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as Internship['difficulty'] }))}
                className="input-field"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Duration & Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 3 months"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Bangalore, India"
                className="input-field"
              />
            </div>
          </div>

          {/* Stipend & Deadline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Stipend
              </label>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => setFormData(prev => ({ ...prev, stipend: e.target.value }))}
                placeholder="e.g., ₹15,000/month"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                'Post Internship'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </motion.form>
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default PostInternship;
