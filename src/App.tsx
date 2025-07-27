
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

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Force redeployment - v2.4 - 300% Larger Hero Logo
  console.log('App component rendering with updated navigation...');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/accommodation/:id" element={<AccommodationDetails />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/booking" element={<BookingFlow />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
