import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, CheckCircle, Users, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatBot from '@/components/ChatBot';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">SkillBridge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Skill-First Internship Platform
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Skills Define You,<br />
              <span className="text-primary">Not Your College</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with industry internships based on your abilities. We remove bias and focus on what matters — your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 h-14">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  I'm a Recruiter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Why SkillBridge?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Skill-Based Matching', desc: 'AI matches you with internships based on your verified skills, not college tier.' },
              { icon: Shield, title: 'Blind Hiring', desc: 'Your college stays hidden. Recruiters see only your abilities and potential.' },
              { icon: Users, title: 'Fair Evaluation', desc: 'Expert evaluators assess candidates anonymously for unbiased selection.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to showcase your skills?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of students getting matched with their dream internships.</p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">Create Free Account</Button>
          </Link>
        </div>
      </section>

      <ChatBot />
    </div>
  );
};

export default Index;
