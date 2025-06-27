
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Wifi, Car, Coffee, Trophy, ExternalLink, ArrowLeft, User, LogOut, LogIn, Calendar, Users, DollarSign, Phone, Mail, Clock } from "lucide-react";
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

const AccommodationDetails = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const accommodation = location.state?.accommodation as Accommodation;
  const searchData = location.state?.searchData;

  const handleSignOut = async () => {
    await signOut();
  };

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Accommodation not found</h2>
          <Button onClick={() => navigate('/search-results')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
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
                onClick={() => navigate('/search-results')}
                className="flex items-center gap-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Results
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{accommodation.name}</h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <Badge variant="outline" className="border-neutral-300 text-neutral-700">
                      {accommodation.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{accommodation.distanceToGolf} from golf course</span>
                    </div>
                    {accommodation.rating !== 'N/A' && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>{accommodation.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("text-sm px-3 py-1", getAvailabilityColor(accommodation.availability))}
                >
                  {accommodation.availability}
                </Badge>
              </div>
            </div>

            {/* Golf Features */}
            {accommodation.golfFeatures.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                  Golf Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accommodation.golfFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Trophy className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Amenities */}
            {accommodation.amenities.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accommodation.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      {getAmenityIcon(amenity) || <div className="h-4 w-4" />}
                      <span className="text-neutral-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Booking Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Booking Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock className="h-4 w-4" />
                  <span>Availability: {accommodation.availability}</span>
                </div>
                {searchData?.checkIn && searchData?.checkOut && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="h-4 w-4" />
                    <span>Your dates: {searchData.checkIn} to {searchData.checkOut}</span>
                  </div>
                )}
                {searchData?.guests && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Users className="h-4 w-4" />
                    <span>Guests: {searchData.guests}</span>
                  </div>
                )}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">Contact Information:</p>
                  <p className="text-neutral-700">{accommodation.bookingInfo}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {accommodation.pricePerNight}
                </div>
                <p className="text-neutral-600">per night</p>
              </div>

              {searchData && (
                <div className="space-y-4 mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="font-medium text-neutral-900">Your Search</h3>
                  {searchData.checkIn && searchData.checkOut && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Dates:</span>
                      <span className="text-neutral-900">{searchData.checkIn} - {searchData.checkOut}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Guests:</span>
                    <span className="text-neutral-900">{searchData.guests}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Location:</span>
                    <span className="text-neutral-900 text-right">{searchData.location}</span>
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
                Book Now
              </Button>

              <p className="text-xs text-neutral-500 text-center mt-3">
                You'll be redirected to the booking platform
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
