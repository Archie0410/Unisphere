import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UniversityInfoPage from "./components/UniversityInfoPage";
import LoginPage from "./components/auth/LoginPage";
import HeroDashboard from "./components/dashboard/HeroDashboard";
import ProfileCreation from "./components/ProfileCreation";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem("heroUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("heroUser");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("heroUser", JSON.stringify(userData));
  };

  const handleProfileComplete = (userData: any) => {
    setUser(userData);
    localStorage.setItem("heroUser", JSON.stringify(userData));
  };

  const handleSkipProfile = () => {
    // Mark user as having skipped profile creation
    const updatedUser = { ...user, profileCompleted: false };
    setUser(updatedUser);
    localStorage.setItem("heroUser", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("heroUser");
    localStorage.removeItem("heroProfile");
    localStorage.removeItem("heroToken");
  };

  const handleNavigateToSection = (section: string) => {
    // Navigate to specific section in the main app using React Router
    // We'll use a simple approach that preserves user state
    const targetPath = section === "profile" ? '/?tab=profile' :
                      section === "universities" || section === "recommendations" ? '/?tab=recommendations' :
                      section === "career" ? '/?tab=career' :
                      section === "roadmap" ? '/?tab=roadmap' : '/';
    
    // Use window.location.href but ensure user state is preserved
    window.location.href = targetPath;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-300">Loading Hero Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!user ? (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          ) : !user.profileCompleted ? (
            <ProfileCreation 
              user={user} 
              onProfileComplete={handleProfileComplete}
              onSkip={handleSkipProfile}
            />
          ) : (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/university/:id" element={<UniversityInfoPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <HeroDashboard 
                    user={user} 
                    onLogout={handleLogout}
                    onNavigateToSection={handleNavigateToSection}
                  />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
