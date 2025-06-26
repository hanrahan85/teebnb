
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Bed, Users, Wifi, Car, Coffee, Heart } from "lucide-react";

interface AccommodationCardProps {
  accommodation: {
    id: string;
    title: string;
    property_type: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    max_guests: number;
    price_per_night: number;
    photos: string[];
    rating: number;
    review_count: number;
    amenities?: string[];
    distance_to_course?: number;
  };
  onClick?: () => void;
}

const AccommodationCard = ({ accommodation, onClick }: AccommodationCardProps) => {
  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Coffee': Coffee,
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={accommodation.photos[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'}
            alt={accommodation.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        {/* Property Type Badge */}
        <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-800">
          {accommodation.property_type}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {accommodation.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{accommodation.rating}</span>
            <span className="text-sm text-gray-500">({accommodation.review_count})</span>
          </div>
        </div>
        
        {accommodation.distance_to_course && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{accommodation.distance_to_course}km from golf course</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{accommodation.bedrooms} bedrooms</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {accommodation.max_guests} guests</span>
          </div>
        </div>
        
        {/* Amenities */}
        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="flex gap-2 mb-3">
            {accommodation.amenities.slice(0, 3).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
              return (
                <Badge key={index} variant="outline" className="text-xs">
                  {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                  {amenity}
                </Badge>
              );
            })}
            {accommodation.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{accommodation.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${accommodation.price_per_night}
            </span>
            <span className="text-gray-600"> / night</span>
          </div>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={(e) => {
              e.stopPropagation();
              // Handle booking action
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AccommodationCard;
