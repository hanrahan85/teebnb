
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SearchFilters from "@/components/SearchFilters";
import MapView from "@/components/MapView";
import AccommodationCard from "@/components/AccommodationCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  LogOut, 
  LogIn, 
  Map, 
  Grid, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Trophy,
  Home,
  Plane
} from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  // Mock data - will be replaced with real Supabase data
  const featuredCourses = [
    {
      id: '1',
      name: 'Augusta National Golf Club',
      location: 'Georgia, USA',
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=250&fit=crop',
      accommodations: 24,
      upcoming_tournament: 'The Masters 2024'
    },
    {
      id: '2',
      name: 'St. Andrews Old Course',
      location: 'Scotland',
      image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop',
      accommodations: 18,
      upcoming_tournament: 'The Open Championship 2024'
    }
  ];

  const mockAccommodations = [
    {
      id: '1',
      title: 'Luxury Golf Villa near Augusta National',
      property_type: 'Villa',
      latitude: 33.5030,
      longitude: -82.0199,
      bedrooms: 5,
      max_guests: 10,
      price_per_night: 650,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'],
      rating: 4.9,
      review_count: 32,
      amenities: ['WiFi', 'Parking', 'Coffee'],
      distance_to_course: 2.1
    },
    {
      id: '2',
      title: 'Historic Golf Lodge - St. Andrews',
      property_type: 'Lodge',
      latitude: 56.3467,
      longitude: -2.8175,
      bedrooms: 3,
      max_guests: 6,
      price_per_night: 380,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'],
      rating: 4.7,
      review_count: 18,
      amenities: ['WiFi', 'Parking'],
      distance_to_course: 0.8
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  if (viewMode === 'map') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-emerald-600">TeeBnB</h1>
                <Badge variant="outline" className="ml-3">Golf Course Accommodations</Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2"
                >
                  <Grid className="h-4 w-4" />
                  Grid View
                </Button>
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <Button onClick={handleSignOut} variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => window.location.href = '/auth'} variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    List Your Property
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <SearchFilters />
        <MapView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-600">TeeBnB</h1>
              <Badge variant="outline" className="ml-3">Golf Course Accommodations</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Map View
              </Button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => window.location.href = '/list-property'} variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  List Your Property
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchFilters />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Stay Near World-Class Golf Courses</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Book unique accommodations near the world's top golf destinations globally. Perfect for tournaments, golf vacations, and course visits.
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-emerald-100">Golf Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-emerald-100">Accommodations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-emerald-100">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Golf Courses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Golf Destinations</h2>
            <p className="text-gray-600 text-lg">Discover accommodations near championship courses</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{course.name}</h3>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {course.location}
                    </p>
                  </div>
                  {course.upcoming_tournament && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      {course.upcoming_tournament}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{course.accommodations} accommodations nearby</span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Stays
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Accommodations</h2>
            <p className="text-gray-600 text-lg">Hand-picked stays near top golf courses</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockAccommodations.map(accommodation => (
              <AccommodationCard 
                key={accommodation.id} 
                accommodation={accommodation}
                onClick={() => console.log('Navigate to accommodation detail')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Host Golf Travelers?</h2>
          <p className="text-gray-600 text-lg mb-8">
            List your property near golf courses and earn extra income during tournaments and peak golf season.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.location.href = '/list-property'}
            >
              <Home className="h-5 w-5 mr-2" />
              Become a Host
            </Button>
            <Button size="lg" variant="outline">
              <Plane className="h-5 w-5 mr-2" />
              Plan Golf Trip
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
