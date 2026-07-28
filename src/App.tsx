import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdsProvider } from "@/context/AdsContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { useState } from "react";
import Index from "./pages/Index";
import PromoteAd from "./pages/PromoteAd";
import AdminLocations from "./pages/AdminLocations";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdDetail from "./pages/AdDetail";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "ADMIN") return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppContent = () => {
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ad/:id" element={<AdDetail />} />
        <Route
          path="/ad/:id/edit"
          element={
            <ProtectedRoute>
              <PromoteAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promote"
          element={
            <ProtectedRoute>
              <PromoteAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute adminOnly>
              <AdminLocations />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FeedbackDialog />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <AdsProvider>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AdsProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
