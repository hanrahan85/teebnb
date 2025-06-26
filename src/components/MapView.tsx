
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        
        // Initialize Google Maps API
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        // Create the map
        const googleMap = new google.maps.Map(mapRef.current!, {
          center: { lat: 56.3467, lng: -2.8175 }, // St. Andrews
          zoom: 10,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(googleMap);

        // Add golf course markers
        mockCourses.forEach(course => {
          const marker = new google.maps.Marker({
            position: { lat: course.latitude, lng: course.longitude },
            map: googleMap,
            title: course.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12V7a1 1 0 0 1 1-1h4l2-2h4a1 1 0 0 1 1 1v4"/>
                  <circle cx="12" cy="13" r="8"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          marker.addListener('click', () => {
            setSelectedCourse(course);
            setAccommodations(mockAccommodations); // Filter by distance in real implementation
          });
        });

        // Add accommodation markers
        mockAccommodations.forEach(accommodation => {
          const marker = new google.maps.Marker({
            position: { lat: accommodation.latitude, lng: accommodation.longitude },
            map: googleMap,
            title: accommodation.title,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          });
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">
            Please add your Google Maps API key to the environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Map */}
      <div className="flex-1">
        <div ref={mapRef} className="w-full h-full" />
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
