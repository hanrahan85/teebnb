
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Car, Coffee, Trophy, ExternalLink } from "lucide-react";

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

interface SearchResultsProps {
  results: {
    accommodations: Accommodation[];
    searchLocation: string;
    searchDates: {
      checkIn: string;
      checkOut: string;
    };
    guests: number;
  };
}

const SearchResults = ({ results }: SearchResultsProps) => {
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
  );
};

export default SearchResults;
