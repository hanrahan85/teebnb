
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Home, Filter } from "lucide-react";

const SearchFilters = () => {
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: ''
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse'];
  const [showFilters, setShowFilters] = useState(false);

  const golfCourseSuggestions = [
    'Augusta National Golf Club, Georgia',
    'St. Andrews Old Course, Scotland',
    'Pebble Beach Golf Links, California',
    'Royal County Down, Northern Ireland',
    'Shinnecock Hills Golf Club, New York',
    'Cypress Point Club, California',
    'Royal Melbourne Golf Club, Australia',
    'Muirfield Golf Links, Scotland',
    'Pine Valley Golf Club, New Jersey',
    'Oakmont Country Club, Pennsylvania'
  ];

  const filteredSuggestions = golfCourseSuggestions.filter(course =>
    course.toLowerCase().includes(filters.location.toLowerCase())
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, location: e.target.value});
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilters({...filters, location: suggestion});
    setShowSuggestions(false);
  };

  return (
    <div className="w-full bg-white shadow-lg">
      {/* Main Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <Label htmlFor="location" className="text-sm font-medium">Golf Course / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="St. Andrews, Augusta..."
                className="pl-10"
                value={filters.location}
                onChange={handleLocationChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && filters.location && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="checkin" className="text-sm font-medium">Check In</Label>
            <Input
              id="checkin"
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="checkout" className="text-sm font-medium">Check Out</Label>
            <Input
              id="checkout"
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="guests" className="text-sm font-medium">Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="16"
                placeholder="2"
                className="pl-10"
                value={filters.guests}
                onChange={(e) => setFilters({...filters, guests: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Search
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mt-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <Input
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Property Type</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {propertyTypes.map(type => (
                    <Badge
                      key={type}
                      variant={filters.propertyType === type ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFilters({
                        ...filters,
                        propertyType: filters.propertyType === type ? '' : type
                      })}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Bedrooms</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Any"
                  className="mt-1"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                />
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
