export type UserRole = 'student' | 'company' | 'evaluator';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Student {
  uid: string;
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  readinessScore: number;
  profileCompletion: number;
  blindHiringEnabled: boolean;
  bio?: string;
  college?: string;
  location?: string;
  resumeUrl?: string;
  videoIntroUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  verificationUrl?: string;
}

export interface Company {
  uid: string;
  companyName: string;
  verified: boolean;
  internshipsPosted: string[];
  industry?: string;
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
}

export interface Evaluator {
  uid: string;
  expertise: string[];
  ratings: number;
  evaluationsCompleted: number;
  bio?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  description: string;
  requiredSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend?: string;
  applicants: string[];
  createdAt: string;
  location?: string;
  deadline?: string;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  matchScore: number;
  matchReasons: string[];
  status: 'Applied' | 'Under Review' | 'Evaluated' | 'Selected' | 'Rejected';
  appliedAt: string;
  evaluatorNotes?: string;
  evaluatorScore?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
