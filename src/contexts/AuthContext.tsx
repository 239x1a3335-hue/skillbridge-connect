import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get, onValue } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import { User, UserRole, Student, Company, Evaluator } from '@/types';
import { sendWelcomeEmail } from '@/lib/emailjs';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  studentData: Student | null;
  companyData: Company | null;
  evaluatorData: Evaluator | null;
  loading: boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateStudentProfile: (data: Partial<Student>) => Promise<void>;
  updateCompanyProfile: (data: Partial<Company>) => Promise<void>;
  updateEvaluatorProfile: (data: Partial<Evaluator>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [evaluatorData, setEvaluatorData] = useState<Evaluator | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: User = {
      uid: user.uid,
      email: email,
      name: name,
      role: role,
      createdAt: new Date().toISOString(),
    };

    await set(ref(database, `users/${user.uid}`), userProfile);

    // Initialize role-specific profile
    if (role === 'student') {
      const studentProfile: Student = {
        uid: user.uid,
        skills: [],
        projects: [],
        certifications: [],
        readinessScore: 0,
        profileCompletion: 10,
        blindHiringEnabled: true,
      };
      await set(ref(database, `students/${user.uid}`), studentProfile);
    } else if (role === 'company') {
      const companyProfile: Company = {
        uid: user.uid,
        companyName: name,
        verified: false,
        internshipsPosted: [],
      };
      await set(ref(database, `companies/${user.uid}`), companyProfile);
    } else if (role === 'evaluator') {
      const evaluatorProfile: Evaluator = {
        uid: user.uid,
        expertise: [],
        ratings: 0,
        evaluationsCompleted: 0,
      };
      await set(ref(database, `evaluators/${user.uid}`), evaluatorProfile);
    }

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to_email: email,
        user_name: name,
        user_email: email,
        platform_name: 'SkillBridge',
        dashboard_link: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    setStudentData(null);
    setCompanyData(null);
    setEvaluatorData(null);
  };

  const updateStudentProfile = async (data: Partial<Student>) => {
    if (!currentUser) return;
    const studentRef = ref(database, `students/${currentUser.uid}`);
    const snapshot = await get(studentRef);
    const currentData = snapshot.val() || {};
    await set(studentRef, { ...currentData, ...data });
  };

  const updateCompanyProfile = async (data: Partial<Company>) => {
    if (!currentUser) return;
    const companyRef = ref(database, `companies/${currentUser.uid}`);
    const snapshot = await get(companyRef);
    const currentData = snapshot.val() || {};
    await set(companyRef, { ...currentData, ...data });
  };

  const updateEvaluatorProfile = async (data: Partial<Evaluator>) => {
    if (!currentUser) return;
    const evaluatorRef = ref(database, `evaluators/${currentUser.uid}`);
    const snapshot = await get(evaluatorRef);
    const currentData = snapshot.val() || {};
    await set(evaluatorRef, { ...currentData, ...data });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Listen to user data
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData(data);
            
            // Load role-specific data
            if (data.role === 'student') {
              const studentRef = ref(database, `students/${user.uid}`);
              onValue(studentRef, (snap) => setStudentData(snap.val()));
            } else if (data.role === 'company') {
              const companyRef = ref(database, `companies/${user.uid}`);
              onValue(companyRef, (snap) => setCompanyData(snap.val()));
            } else if (data.role === 'evaluator') {
              const evaluatorRef = ref(database, `evaluators/${user.uid}`);
              onValue(evaluatorRef, (snap) => setEvaluatorData(snap.val()));
            }
          }
        });
      } else {
        setUserData(null);
        setStudentData(null);
        setCompanyData(null);
        setEvaluatorData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    studentData,
    companyData,
    evaluatorData,
    loading,
    signup,
    login,
    logout,
    updateStudentProfile,
    updateCompanyProfile,
    updateEvaluatorProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
