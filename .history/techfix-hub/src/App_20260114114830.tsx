import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Membership from "./pages/Membership";
import UserLogin from "./pages/UserLogin";
import BookingSummary from "./pages/BookingSummary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: { name: string; phone: string }) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              currentUser ? <Navigate to="/" /> : <UserLogin onLogin={handleLogin} />
            } />
            <Route path="/" element={<Index currentUser={currentUser} />} />
            <Route path="/services" element={<Services currentUser={currentUser} />} />
            <Route path="/profile" element={
              currentUser ? 
                <Profile currentUser={currentUser} onLogout={handleLogout} /> : 
                <Navigate to="/login" />
            } />
            <Route path="/bookings" element={
              currentUser ? 
                <BookingSummary /> : 
                <Navigate to="/login" />
            } />
            <Route path="/membership" element={<Membership currentUser={currentUser} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;