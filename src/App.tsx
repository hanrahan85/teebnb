
import React from 'react';
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

const queryClient = new QueryClient();

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
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
