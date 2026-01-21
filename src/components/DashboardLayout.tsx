import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  FileText, 
  User, 
  Building2, 
  ClipboardCheck,
  PlusCircle,
  Users,
  LogOut,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, logout } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/internships', icon: Search, label: 'Find Internships' },
    { path: '/applications', icon: FileText, label: 'My Applications' },
    { path: '/profile', icon: User, label: 'My Profile' },
  ];

  const companyLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/post-internship', icon: PlusCircle, label: 'Post Internship' },
    { path: '/manage-internships', icon: Briefcase, label: 'My Internships' },
    { path: '/candidates', icon: Users, label: 'Candidates' },
    { path: '/company-profile', icon: Building2, label: 'Company Profile' },
  ];

  const evaluatorLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/evaluations', icon: ClipboardCheck, label: 'Evaluations' },
    { path: '/evaluator-profile', icon: User, label: 'My Profile' },
  ];

  const getLinks = () => {
    switch (userData?.role) {
      case 'student':
        return studentLinks;
      case 'company':
        return companyLinks;
      case 'evaluator':
        return evaluatorLinks;
      default:
        return [];
    }
  };

  const getRoleColor = () => {
    switch (userData?.role) {
      case 'student':
        return 'bg-student';
      case 'company':
        return 'bg-company';
      case 'evaluator':
        return 'bg-evaluator';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-card border-r border-border p-6 flex flex-col fixed h-screen"
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-xl ${getRoleColor()} flex items-center justify-center`}>
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">SkillBridge</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {getLinks().map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full ${getRoleColor()} flex items-center justify-center text-white font-medium`}>
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{userData?.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{userData?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
