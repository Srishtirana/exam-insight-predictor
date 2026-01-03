import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // Using HashRouter for GitHub Pages
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import PYQBank from "./pages/PYQBank";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            {/* Using HashRouter for GitHub Pages compatibility */}
            <HashRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/pyq-bank" element={<PYQBank />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('App render error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Exam Insight Predictor</h1>
          <p className="text-gray-600">An error occurred. Please try again.</p>
          <div className="mt-8">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
