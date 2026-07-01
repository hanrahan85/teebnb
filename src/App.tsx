
import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./components/HomePage";
import Auth from "./pages/Auth";
import ListProperty from "./pages/ListProperty";
import SearchResults from "./pages/SearchResults";
import AccommodationDetails from "./pages/AccommodationDetails";
import PropertyDetail from "./pages/PropertyDetail";
import BookingFlow from "./pages/BookingFlow";
import HostDashboard from "./pages/HostDashboard";

// Lazy load new pages
const Trips = lazy(() => import("./pages/Trips"));
const Profile = lazy(() => import("./pages/Profile"));
const Inbox = lazy(() => import("./pages/Inbox"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '4px solid #EDEBE1',
        borderTopColor: '#15794C',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/booking" element={<BookingFlow />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/dashboard" element={<HostDashboard />} />
              <Route path="/accommodation/:id" element={<AccommodationDetails />} />
              <Route
                path="/trips"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Trips />
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Profile />
                  </Suspense>
                }
              />
              <Route
                path="/inbox"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Inbox />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
