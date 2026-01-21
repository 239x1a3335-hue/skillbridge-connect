import React, { useState, useEffect } from 'react';
import { ref, onValue, update, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { Users, Eye, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Internship, Application, Student, User } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import ChatBot from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { sendStatusEmail } from '@/lib/emailjs';
import { toast } from 'sonner';

const Candidates: React.FC = () => {
  const { currentUser, companyData } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<(Application & { student?: Student; user?: User })[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const internshipsRef = ref(database, 'internships');
    onValue(internshipsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, value]) => ({ ...(value as Internship), id }))
          .filter((i) => i.companyId === currentUser.uid);
        setInternships(list);
        if (list.length > 0 && !selectedInternship) {
          setSelectedInternship(list[0].id);
        }
      }
      setLoading(false);
    });
  }, [currentUser, selectedInternship]);

  useEffect(() => {
    if (!selectedInternship) return;

    const applicationsRef = ref(database, 'applications');
    onValue(applicationsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filtered = Object.entries(data)
          .map(([id, value]) => ({ ...(value as Application), id }))
          .filter((app) => app.internshipId === selectedInternship);

        // Fetch student data for each application
        const withStudentData = await Promise.all(
          filtered.map(async (app) => {
            const studentSnap = await get(ref(database, `students/${app.studentId}`));
            const userSnap = await get(ref(database, `users/${app.studentId}`));
            return {
              ...app,
              student: studentSnap.val(),
              user: userSnap.val(),
            };
          })
        );

        setApplications(withStudentData);
      } else {
        setApplications([]);
      }
    });
  }, [selectedInternship]);

  const handleStatusChange = async (appId: string, status: 'Selected' | 'Rejected', app: Application & { student?: Student; user?: User }) => {
    try {
      await update(ref(database, `applications/${appId}`), { status });

      // Send email notification
      if (app.user?.email && app.user?.name) {
        const internship = internships.find(i => i.id === app.internshipId);
        await sendStatusEmail({
          to_email: app.user.email,
          user_name: app.user.name,
          user_email: app.user.email,
          platform_name: 'SkillBridge',
          company_name: companyData?.companyName || 'Company',
          internship_role: internship?.role || 'Internship',
          application_id: appId,
          application_status: status,
          status_message: status === 'Selected' 
            ? 'Congratulations! You have been selected for this internship. The company will reach out to you shortly with next steps.'
            : 'Thank you for your interest. Unfortunately, your application was not selected at this time. We encourage you to keep improving your skills and apply again.',
          dashboard_link: `${window.location.origin}/applications`,
        });
      }

      toast.success(`Application ${status.toLowerCase()}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const selectedInternshipData = internships.find(i => i.id === selectedInternship);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title">Candidates</h1>
          <p className="text-muted-foreground">
            Review and manage applications for your internships
          </p>
        </div>

        {internships.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card"
          >
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No internships posted
            </h3>
            <p className="text-muted-foreground">
              Post an internship to start receiving applications
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Internship List */}
            <div className="glass-card p-4 h-fit">
              <h3 className="font-semibold mb-4">Your Internships</h3>
              <div className="space-y-2">
                {internships.map((internship) => (
                  <button
                    key={internship.id}
                    onClick={() => setSelectedInternship(internship.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedInternship === internship.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{internship.role}</p>
                    <p className="text-xs opacity-70">
                      {internship.applicants?.length || 0} applicants
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="md:col-span-3">
              {selectedInternshipData && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{selectedInternshipData.role}</h2>
                  <p className="text-muted-foreground text-sm">
                    {applications.length} applications
                  </p>
                </div>
              )}

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {app.user?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {app.student?.blindHiringEnabled ? 'Anonymous Candidate' : app.user?.name}
                              </h3>
                              {!app.student?.blindHiringEnabled && app.student?.college && (
                                <p className="text-sm text-muted-foreground">{app.student.college}</p>
                              )}
                            </div>
                          </div>

                          {/* Match Score */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Match Score:</span>
                              <span className={`font-semibold ${
                                app.matchScore >= 70 ? 'text-success' :
                                app.matchScore >= 40 ? 'text-warning' : 'text-destructive'
                              }`}>
                                {app.matchScore}%
                              </span>
                            </div>
                            <span className={`status-badge ${
                              app.status === 'Selected' ? 'status-selected' :
                              app.status === 'Rejected' ? 'status-rejected' : 'status-applied'
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          {/* Skills */}
                          {app.student?.skills && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {app.student.skills.slice(0, 6).map((skill) => (
                                <span key={skill} className="skill-tag text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Match Reasons */}
                          {app.matchReasons && app.matchReasons.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {app.matchReasons.join(' • ')}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {app.status === 'Applied' || app.status === 'Under Review' || app.status === 'Evaluated' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(app.id, 'Selected', app)}
                              className="bg-success hover:bg-success/90"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Select
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(app.id, 'Rejected', app)}
                              className="text-destructive hover:bg-destructive hover:text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No applications yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </DashboardLayout>
  );
};

export default Candidates;
