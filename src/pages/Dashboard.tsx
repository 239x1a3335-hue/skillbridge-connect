import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, FileText, PlusCircle, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProgressRing from '@/components/ProgressRing';
import ChatBot from '@/components/ChatBot';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { userData, studentData, companyData, evaluatorData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center gap-4">
          <ProgressRing progress={studentData?.profileCompletion || 10} size={70} strokeWidth={8} />
          <div>
            <p className="text-2xl font-bold">{studentData?.profileCompletion || 10}%</p>
            <p className="text-sm text-muted-foreground">Profile Complete</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{studentData?.skills?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Skills Added</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
            <FileText className="w-7 h-7 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{studentData?.readinessScore || 0}%</p>
            <p className="text-sm text-muted-foreground">Skill Readiness</p>
          </div>
        </motion.div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/internships" className="glass-card-hover p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Find Internships</h3>
            <p className="text-sm text-muted-foreground">Discover skill-matched opportunities</p>
          </div>
        </Link>
        <Link to="/profile" className="glass-card-hover p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Complete Profile</h3>
            <p className="text-sm text-muted-foreground">Add skills to improve your match score</p>
          </div>
        </Link>
      </div>
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <Link to="/post-internship" className="glass-card-hover p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <PlusCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">Post Internship</h3>
          <p className="text-sm text-muted-foreground">Find skilled talent for your team</p>
        </div>
      </Link>
      <Link to="/candidates" className="glass-card-hover p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">View Candidates</h3>
          <p className="text-sm text-muted-foreground">Review applications with match scores</p>
        </div>
      </Link>
    </div>
  );

  const renderEvaluatorDashboard = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <p className="text-3xl font-bold text-primary">{evaluatorData?.evaluationsCompleted || 0}</p>
        <p className="text-muted-foreground">Evaluations Completed</p>
      </motion.div>
      <Link to="/evaluations" className="glass-card-hover p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-evaluator flex items-center justify-center">
          <ClipboardCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">Start Evaluating</h3>
          <p className="text-sm text-muted-foreground">Review candidates anonymously</p>
        </div>
      </Link>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">Welcome back, {userData.name}!</h1>
          <p className="text-muted-foreground capitalize">{userData.role} Dashboard</p>
        </div>
        {userData.role === 'student' && renderStudentDashboard()}
        {userData.role === 'company' && renderCompanyDashboard()}
        {userData.role === 'evaluator' && renderEvaluatorDashboard()}
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Dashboard;
