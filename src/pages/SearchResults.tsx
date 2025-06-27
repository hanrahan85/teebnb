
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Wifi, Car, Coffee, Trophy, ExternalLink, ArrowLeft, User, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface Accommodation {
  name: string;
  type: string;
  pricePerNight: string;
  distanceToGolf: string;
  rating: string;
  amenities: string[];
  golfFeatures: string[];
  availability: string;
  bookingInfo: string;
}

interface SearchResultsData {
  accommodations: Accommodation[];
  searchLocation: string;
  searchDates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
}

const SearchResults = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const results = location.state?.results as SearchResultsData;

  const handleSignOut = async () => {
    await signOut();
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">No search results found</h2>
          <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-4 w-4" />;
    if (amenityLower.includes('coffee') || amenityLower.includes('breakfast')) return <Coffee className="h-4 w-4" />;
    if (amenityLower.includes('golf')) return <Trophy className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-600">TeeBnB</h1>
              <Badge variant="outline" className="ml-3 border-neutral-300 bg-neutral-50 text-neutral-700">Golf Course Accommodations</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/auth')} variant="outline" size="sm" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                  <LogIn className="h-4 w-4 mr-2" />
                  List Your Property
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Search Results for {results.searchLocation}
          </h2>
          <p className="text-neutral-600">
            {results.accommodations.length} accommodations found for {results.guests} guests
            {results.searchDates.checkIn && results.searchDates.checkOut && (
              <span> • {results.searchDates.checkIn} to {results.searchDates.checkOut}</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.accommodations.map((accommodation, index) => (
            <Card key={index} className="bg-white border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {accommodation.name}
                    </h3>
                    <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                      {accommodation.type}
                    </Badge>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getAvailabilityColor(accommodation.availability))}
                  >
                    {accommodation.availability}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="h-4 w-4" />
                    <span>{accommodation.distanceToGolf} from course</span>
                  </div>
                  
                  {accommodation.rating !== 'N/A' && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span>{accommodation.rating}</span>
                    </div>
                  )}

                  <div className="text-lg font-semibold text-emerald-600">
                    {accommodation.pricePerNight}
                  </div>
                </div>

                {accommodation.golfFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Golf Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {accommodation.golfFeatures.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-emerald-50 border-emerald-300 text-emerald-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {accommodation.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    if (accommodation.bookingInfo.startsWith('http')) {
                      window.open(accommodation.bookingInfo, '_blank');
                    } else {
                      navigator.clipboard.writeText(accommodation.bookingInfo);
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
