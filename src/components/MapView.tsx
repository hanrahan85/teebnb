
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Bed, Users } from "lucide-react";

interface GolfCourse {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  ranking: number;
}

interface Accommodation {
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
}

const MapView = () => {
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  // Mock data for now - will replace with real data from Supabase
  const mockCourses: GolfCourse[] = [
    {
      id: '1',
      name: 'St. Andrews Old Course',
      location: 'Scotland',
      latitude: 56.3467,
      longitude: -2.8175,
      ranking: 4
    },
    {
      id: '2',
      name: 'Augusta National Golf Club',
      location: 'Georgia, USA',
      latitude: 33.5030,
      longitude: -82.0199,
      ranking: 3
    }
  ];

  const mockAccommodations: Accommodation[] = [
    {
      id: '1',
      title: 'Luxury Golf Villa near St. Andrews',
      property_type: 'Villa',
      latitude: 56.3500,
      longitude: -2.8200,
      bedrooms: 4,
      max_guests: 8,
      price_per_night: 450,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'],
      rating: 4.8,
      review_count: 24
    },
    {
      id: '2',
      title: 'Cozy Golf Cottage',
      property_type: 'House',
      latitude: 56.3400,
      longitude: -2.8100,
      bedrooms: 2,
      max_guests: 4,
      price_per_night: 180,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'],
      rating: 4.6,
      review_count: 12
    }
  ];

  // Auto-select first course and show accommodations
  React.useEffect(() => {
    if (mockCourses.length > 0) {
      setSelectedCourse(mockCourses[0]);
      setAccommodations(mockAccommodations);
    }
  }, []);

  return (
    <div className="h-screen flex">
      {/* Beautiful Mansion Image */}
      <div className="flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=1080&fit=crop&auto=format&q=90"
          alt="Luxury mansion overlooking championship golf course"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold mb-2">Luxury Golf Estate</h2>
          <p className="text-xl opacity-90">Championship Course Views</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white overflow-y-auto border-l">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Golf Course Accommodations</h2>
          
          {selectedCourse && (
            <Card className="p-4 mb-6 bg-emerald-50 border-emerald-200">
              <h3 className="font-semibold text-emerald-800">{selectedCourse.name}</h3>
              <p className="text-emerald-600 text-sm">{selectedCourse.location}</p>
              <p className="text-emerald-600 text-sm">Ranking: #{selectedCourse.ranking}</p>
            </Card>
          )}

          <div className="space-y-4">
            {accommodations.map(accommodation => (
              <Card key={accommodation.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={accommodation.photos[0]}
                    alt={accommodation.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {accommodation.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{accommodation.rating}</span>
                      <span className="text-sm text-gray-500">({accommodation.review_count})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{accommodation.property_type}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{accommodation.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{accommodation.max_guests} guests</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold">${accommodation.price_per_night}</span>
                      <span className="text-gray-600"> / night</span>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
