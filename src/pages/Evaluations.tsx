import React, { useState, useEffect } from 'react';
import { ref, onValue, update, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { ClipboardCheck, Eye, CheckCircle, Star, User } from 'lucide-react';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Application, Student, User as UserType, Internship } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Evaluations: React.FC = () => {
  const { currentUser, evaluatorData } = useAuth();
  const [applications, setApplications] = useState<(Application & { 
    student?: Student; 
    user?: UserType;
    internship?: Internship;
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const applicationsRef = ref(database, 'applications');
    onValue(applicationsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get applications that need evaluation (Applied or Under Review)
        const pending = Object.entries(data)
          .map(([id, value]) => ({ ...(value as Application), id }))
          .filter((app) => app.status === 'Applied' || app.status === 'Under Review');

        // Fetch related data
        const withData = await Promise.all(
          pending.map(async (app) => {
            const studentSnap = await get(ref(database, `students/${app.studentId}`));
            const userSnap = await get(ref(database, `users/${app.studentId}`));
            const internshipSnap = await get(ref(database, `internships/${app.internshipId}`));
            return {
              ...app,
              student: studentSnap.val(),
              user: userSnap.val(),
              internship: internshipSnap.val(),
            };
          })
        );

        setApplications(withData);
      }
      setLoading(false);
    });
  }, []);

  const handleEvaluate = async (appId: string) => {
    if (score === 0) {
      toast.error('Please provide a score');
      return;
    }

    try {
      await update(ref(database, `applications/${appId}`), {
        status: 'Evaluated',
        evaluatorScore: score,
        evaluatorNotes: notes,
      });

      // Update evaluator stats
      if (currentUser && evaluatorData) {
        await update(ref(database, `evaluators/${currentUser.uid}`), {
          evaluationsCompleted: (evaluatorData.evaluationsCompleted || 0) + 1,
        });
      }

      setEvaluatingId(null);
      setScore(0);
      setNotes('');
      toast.success('Evaluation submitted');
    } catch {
      toast.error('Failed to submit evaluation');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">Evaluations</h1>
          <p className="text-muted-foreground">
            Review and evaluate candidate applications anonymously
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-3xl font-bold text-primary">{applications.length}</p>
            <p className="text-sm text-muted-foreground">Pending Reviews</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-3xl font-bold text-success">{evaluatorData?.evaluationsCompleted || 0}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-3xl font-bold text-warning">{evaluatorData?.ratings || 0}</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </motion.div>
        </div>

        {/* Applications to evaluate */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {app.internship?.role || 'Unknown Role'}
                    </h3>
                    <p className="text-primary text-sm">
                      {app.internship?.companyName || 'Unknown Company'}
                    </p>
                  </div>
                  <span className="status-badge bg-info/10 text-info">
                    Needs Review
                  </span>
                </div>

                {/* Anonymous Candidate Info */}
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Anonymous Candidate</p>
                      <p className="text-xs text-muted-foreground">
                        College info hidden for unbiased evaluation
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {app.student?.skills && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.student.skills.map((skill) => (
                          <span key={skill} className="skill-tag text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {app.student?.bio && (
                    <div>
                      <p className="text-sm font-medium mb-1">Bio:</p>
                      <p className="text-sm text-muted-foreground">{app.student.bio}</p>
                    </div>
                  )}
                </div>

                {/* Evaluation Form */}
                {evaluatingId === app.id ? (
                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-medium mb-3">Your Evaluation</h4>
                    
                    {/* Score */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Score (1-10)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <button
                            key={n}
                            onClick={() => setScore(n)}
                            className={`w-10 h-10 rounded-lg border transition-all ${
                              score >= n 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Your feedback on the candidate's skills and fit..."
                        className="input-field min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => handleEvaluate(app.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Evaluation
                      </Button>
                      <Button variant="outline" onClick={() => setEvaluatingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setEvaluatingId(app.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Start Evaluation
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card"
          >
            <ClipboardCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              All caught up!
            </h3>
            <p className="text-muted-foreground">
              No applications pending evaluation right now
            </p>
          </motion.div>
        )}
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Evaluations;
