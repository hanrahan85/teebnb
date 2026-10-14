
import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "./components/HomePage";

// Every page except the homepage is loaded on demand, so a phone opening
// teebnb.com only downloads the code for the homepage.
const NotFound = lazy(() => import("./pages/NotFound"));
const HostDashboard = lazy(() => import("./pages/HostDashboard"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const AccommodationDetails = lazy(() => import("./pages/AccommodationDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ListProperty = lazy(() => import("./pages/ListProperty"));
const Auth = lazy(() => import("./pages/Auth"));
const Destinations = lazy(() => import("./pages/Destinations"));
const Trips = lazy(() => import("./pages/Trips"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const ManageBooking = lazy(() => import("./pages/ManageBooking"));
const AdminReview = lazy(() => import("./pages/AdminReview"));
const Inbox = lazy(() => import("./pages/Inbox"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Support = lazy(() => import("./pages/Support"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Blog = lazy(() => import("./pages/Blog"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const RyderCup2027 = lazy(() => import("./pages/RyderCup2027"));

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
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/booking" element={<BookingFlow />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/dashboard" element={<HostDashboard />} />
              <Route path="/accommodation/:id" element={<AccommodationDetails />} />
              <Route path="/destinations" element={<Suspense fallback={<LoadingFallback />}><Destinations /></Suspense>} />
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
                path="/settings"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Settings />
                  </Suspense>
                }
              />
              <Route
                path="/manage-booking"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ManageBooking />
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminReview />
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
              <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><About /></Suspense>} />
              <Route path="/faq" element={<Suspense fallback={<LoadingFallback />}><FAQ /></Suspense>} />
              <Route path="/support" element={<Suspense fallback={<LoadingFallback />}><Support /></Suspense>} />
              <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><Privacy /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={<LoadingFallback />}><Terms /></Suspense>} />
              <Route path="/blog" element={<Suspense fallback={<LoadingFallback />}><Blog /></Suspense>} />
              <Route path="/how-it-works" element={<Suspense fallback={<LoadingFallback />}><HowItWorks /></Suspense>} />
              <Route path="/ryder-cup-2027" element={<RyderCup2027 />} />
              <Route path="/adare-2027" element={<RyderCup2027 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
