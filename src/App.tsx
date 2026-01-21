import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Internships from "./pages/Internships";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import PostInternship from "./pages/PostInternship";
import Candidates from "./pages/Candidates";
import Evaluations from "./pages/Evaluations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/internships" element={<ProtectedRoute allowedRoles={['student']}><Internships /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute allowedRoles={['student']}><Applications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>} />
            <Route path="/post-internship" element={<ProtectedRoute allowedRoles={['company']}><PostInternship /></ProtectedRoute>} />
            <Route path="/manage-internships" element={<ProtectedRoute allowedRoles={['company']}><Candidates /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute allowedRoles={['company']}><Candidates /></ProtectedRoute>} />
            <Route path="/company-profile" element={<ProtectedRoute allowedRoles={['company']}><Dashboard /></ProtectedRoute>} />
            <Route path="/evaluations" element={<ProtectedRoute allowedRoles={['evaluator']}><Evaluations /></ProtectedRoute>} />
            <Route path="/evaluator-profile" element={<ProtectedRoute allowedRoles={['evaluator']}><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
