import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, GraduationCap, Building2, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast.error('Please select your role');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name, role);
      toast.success('Account created successfully! Check your email for a welcome message.');
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { 
      id: 'student' as UserRole, 
      label: 'Student', 
      icon: GraduationCap, 
      description: 'Find skill-matched internships',
      color: 'bg-student'
    },
    { 
      id: 'company' as UserRole, 
      label: 'Company', 
      icon: Building2, 
      description: 'Post internships & find talent',
      color: 'bg-company'
    },
    { 
      id: 'evaluator' as UserRole, 
      label: 'Evaluator', 
      icon: ClipboardCheck, 
      description: 'Assess candidates anonymously',
      color: 'bg-evaluator'
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-accent to-secondary items-center justify-center p-12">
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">SkillBridge</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Where Skills Meet Opportunity
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              A bias-free platform connecting talented students with industry internships based on skills, not college names.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold">✓</span>
                </div>
                <span>Skill-based matching algorithm</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold">✓</span>
                </div>
                <span>Anonymous evaluation process</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success font-bold">✓</span>
                </div>
                <span>AI-powered career guidance</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h2>
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === r.id
                      ? `border-primary bg-primary/5`
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${r.color} flex items-center justify-center mx-auto mb-2`}>
                    <r.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-medium text-sm text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
