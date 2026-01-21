import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types';

const KNOWLEDGE_BASE = [
  {
    keywords: ['platform', 'what is', 'about'],
    answer:
      'This platform connects students and companies using skills instead of college names.\nIt focuses on fair, skill-first internship hiring.\nStudents, companies, and evaluators collaborate here.\nThe goal is equal opportunity for all.',
  },
  {
    keywords: ['signup', 'register', 'create account'],
    answer:
      'You can register using your email and password.\nDuring signup, you choose a role.\nYour profile is stored securely in Firebase.\nA welcome email is sent automatically.',
  },
  {
    keywords: ['login', 'signin'],
    answer:
      'Login using your registered email and password.\nYour session is securely restored.\nYou are redirected to your role-based dashboard.\nAll data loads in real time.',
  },
  {
    keywords: ['student', 'profile'],
    answer:
      'Student profiles are skill-focused.\nYou can add skills, projects, and certifications.\nA readiness score shows your preparation level.\nCollege name is hidden by default.',
  },
  {
    keywords: ['skill', 'skills'],
    answer:
      'Skills are the main evaluation factor.\nThey are matched against internship requirements.\nMore relevant skills improve match score.\nSkills can be edited anytime.',
  },
  {
    keywords: ['resume', 'cv'],
    answer:
      'Upload a clean and concise resume.\nHighlight projects and technical skills.\nAvoid unnecessary personal details.\nParsed data strengthens your profile.',
  },
  {
    keywords: ['internship', 'apply'],
    answer:
      'Internships are recommended based on skills.\nYou can apply with one click.\nApplication status updates in real time.\nEmails notify important changes.',
  },
  {
    keywords: ['application', 'status'],
    answer:
      'Application statuses include Applied, Selected, and Rejected.\nYou can track them from your dashboard.\nEach update is transparent.\nNotifications are sent automatically.',
  },
  {
    keywords: ['match', 'matching', 'score'],
    answer:
      'Match score is calculated using skills and experience.\nEvaluator feedback also contributes.\nScores are shown as percentages.\nEach score is explainable.',
  },
  {
    keywords: ['blind', 'college'],
    answer:
      'Blind hiring hides college and location details.\nRecruiters focus only on skills.\nThis removes bias from the process.\nIt ensures fair evaluation.',
  },
  {
    keywords: ['company', 'recruiter'],
    answer:
      'Companies can post internships easily.\nThey define required skills and difficulty.\nCandidates are shortlisted using match scores.\nRecruiters see only relevant profiles.',
  },
  {
    keywords: ['evaluator', 'mentor'],
    answer:
      'Evaluators review skills and projects anonymously.\nThey provide structured feedback.\nTheir input affects match scores.\nThis improves hiring accuracy.',
  },
  {
    keywords: ['email', 'notification'],
    answer:
      'The platform sends real emails.\nWelcome emails are sent after signup.\nSelection or rejection emails follow decisions.\nAll emails are automated.',
  },
  {
    keywords: ['chatbot', 'assistant'],
    answer:
      'I am a career guidance chatbot.\nI help with resumes, interviews, and platform usage.\nMy answers come from trained data only.\nIf data is missing, I say so clearly.',
  },
  {
    keywords: ['interview'],
    answer:
      'Prepare by understanding the role.\nPractice explaining your projects.\nReview common technical questions.\nConfidence and clarity are key.',
  },
  {
    keywords: ['career', 'roadmap', 'path'],
    answer:
      'A career roadmap defines long-term goals.\nIdentify skills needed for your target role.\nWork on projects step by step.\nRegular learning improves outcomes.',
  },
  {
    keywords: ['offline'],
    answer:
      'Some features work without internet.\nInternship listings can be viewed offline.\nCached chatbot data remains available.\nChanges sync when online.',
  },
  {
    keywords: ['security', 'safe', 'data'],
    answer:
      'User data is protected using Firebase security.\nAuthentication controls access.\nRole-based permissions are enforced.\nYour information is kept secure.',
  },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello 👋 I am your Career Assistant.\nI can help with internships, skills, resumes, interviews, and career planning.\nAsk me anything to get started.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const lower = input.toLowerCase();

      const match = KNOWLEDGE_BASE.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );

      const reply =
        match?.answer ||
        'The information is not available in the provided data.\nYou can ask about internships, skills, resumes, interviews, or platform usage.\nI answer only from verified knowledge.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <>
      <motion.button
        className="floating-chatbot w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed bottom-24 right-6 w-96 h-[500px] glass-card flex flex-col z-50">
            <div className="bg-primary text-primary-foreground p-4 flex justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span>Career Assistant</span>
              </div>
              <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[75%] bg-muted p-3 rounded-lg whitespace-pre-line text-sm">
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && <p className="text-sm">Typing…</p>}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 input-field"
                placeholder="Ask about skills, internships, interviews..."
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
