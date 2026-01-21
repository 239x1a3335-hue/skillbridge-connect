import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Application, Internship } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import ChatBot from '@/components/ChatBot';

const Applications: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<(Application & { internship?: Internship })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const applicationsRef = ref(database, 'applications');
    const internshipsRef = ref(database, 'internships');

    const unsubscribe = onValue(applicationsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onValue(internshipsRef, (intSnapshot) => {
          const internshipsData = intSnapshot.val() || {};
          
          const appList = Object.entries(data)
            .map(([id, value]) => {
              const app = value as Application;
              const internship = internshipsData[app.internshipId];
              return { ...app, id, internship };
            })
            .filter((app) => app.studentId === currentUser.uid)
            .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
          
          setApplications(appList);
          setLoading(false);
        });
      } else {
        setApplications([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Clock className="w-5 h-5 text-info" />;
      case 'Under Review':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'Evaluated':
        return <AlertCircle className="w-5 h-5 text-primary" />;
      case 'Selected':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Under Review':
        return 'status-pending';
      case 'Selected':
        return 'status-selected';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your internship applications
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </div>
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
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(app.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {app.internship?.role || 'Unknown Role'}
                        </h3>
                        <p className="text-primary text-sm">
                          {app.internship?.companyName || 'Unknown Company'}
                        </p>
                      </div>
                      <span className={`status-badge ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      <span>Match Score: {app.matchScore}%</span>
                    </div>

                    {app.matchReasons && app.matchReasons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.matchReasons.map((reason, i) => (
                          <span key={i} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.evaluatorNotes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Evaluator Feedback:</p>
                        <p className="text-sm text-foreground">{app.evaluatorNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card"
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No applications yet
            </h3>
            <p className="text-muted-foreground">
              Start exploring internships and apply to opportunities that match your skills!
            </p>
          </motion.div>
        )}
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Applications;
