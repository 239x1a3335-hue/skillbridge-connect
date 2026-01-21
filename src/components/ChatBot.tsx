import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Assistant. I can help you with resume guidance, interview preparation, career roadmaps, and skill gap analysis. How can I assist you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
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

    // Simulate AI response (in production, this would call a RAG API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        resume: 'For a strong resume, focus on: 1) Clear formatting with consistent fonts, 2) Quantifiable achievements, 3) Relevant skills matching job descriptions, 4) Action verbs to describe experience. Would you like specific advice for your industry?',
        interview: 'Great interview preparation tips: 1) Research the company thoroughly, 2) Practice STAR method for behavioral questions, 3) Prepare questions to ask the interviewer, 4) Review common technical questions for your field. What specific interview type are you preparing for?',
        skills: 'To identify skill gaps, I recommend: 1) Compare your current skills with job postings in your target role, 2) Take skill assessments on platforms like LinkedIn Learning, 3) Seek feedback from mentors, 4) Review industry certifications that could boost your profile.',
        career: 'Building a career roadmap involves: 1) Define your 5-year goal, 2) Identify required skills and experiences, 3) Set quarterly milestones, 4) Build a network in your target industry. What career path interests you?',
      };

      const lowerInput = input.toLowerCase();
      let response = 'I understand you\'re asking about career guidance. Could you be more specific? I can help with resume tips, interview preparation, skill development, or career planning.';

      if (lowerInput.includes('resume') || lowerInput.includes('cv')) {
        response = responses.resume;
      } else if (lowerInput.includes('interview')) {
        response = responses.interview;
      } else if (lowerInput.includes('skill')) {
        response = responses.skills;
      } else if (lowerInput.includes('career') || lowerInput.includes('path') || lowerInput.includes('roadmap')) {
        response = responses.career;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="floating-chatbot w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] glass-card flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Career Assistant</h3>
                  <p className="text-xs opacity-80">AI-powered guidance</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}>
                    {message.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    message.role === 'assistant' 
                      ? 'bg-muted text-foreground rounded-tl-none' 
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about careers, skills, interviews..."
                  className="input-field flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
