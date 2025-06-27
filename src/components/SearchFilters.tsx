import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin, Users, DollarSign, Home, Filter, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SearchFiltersProps {
  onSearchResults?: (results: any) => void;
}

const SearchFilters = ({ onSearchResults }: SearchFiltersProps) => {
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

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse'];

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
    'Oakmont Country Club, Pennsylvania',
    'TPC Sawgrass, Florida',
    'Bethpage Black, New York',
    'Whistling Straits, Wisconsin',
    'Torrey Pines, California',
    'Kiawah Island Ocean Course, South Carolina'
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

  const handleSearch = async () => {
    if (!filters.location.trim()) {
      toast({
        title: "Location Required",
        description: "Please select a golf course or location to search for accommodations.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const searchData = {
        location: filters.location,
        checkIn: checkInDate ? format(checkInDate, 'yyyy-MM-dd') : '',
        checkOut: checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : '',
        guests: filters.guests,
        filters: {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          propertyType: filters.propertyType,
          bedrooms: filters.bedrooms
        }
      };

      console.log('Searching with data:', searchData);

      const { data, error } = await supabase.functions.invoke('search-accommodations', {
        body: searchData
      });

      if (error) {
        throw error;
      }

      console.log('Search results:', data);

      if (data.success) {
        toast({
          title: "Search Complete",
          description: `Found ${data.accommodations.length} accommodations near ${data.searchLocation}`,
        });
        
        if (onSearchResults) {
          onSearchResults(data);
        }
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search for accommodations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg border-b border-neutral-200">
      {/* Main Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <Label htmlFor="location" className="text-sm font-medium text-neutral-700">Golf Course / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="location"
                placeholder="St. Andrews, Augusta..."
                className="pl-10 bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500"
                value={filters.location}
                onChange={handleLocationChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-neutral-50 cursor-pointer text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="text-neutral-700">{suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="checkin" className="text-sm font-medium text-neutral-700">Check In</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 bg-neutral-50 border-neutral-300 hover:bg-neutral-100",
                    !checkInDate && "text-neutral-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                  {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-neutral-200" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  className={cn("p-6 pointer-events-auto scale-125")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="checkout" className="text-sm font-medium text-neutral-700">Check Out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 bg-neutral-50 border-neutral-300 hover:bg-neutral-100",
                    !checkOutDate && "text-neutral-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                  {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-neutral-200" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => checkInDate ? date <= checkInDate : false}
                  initialFocus
                  className={cn("p-6 pointer-events-auto scale-125")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="guests" className="text-sm font-medium text-neutral-700">Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="16"
                placeholder="2"
                className="pl-10 bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500"
                value={filters.guests}
                onChange={(e) => setFilters({...filters, guests: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mt-4 p-4 bg-neutral-50 border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-neutral-700">Price Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="bg-white border-neutral-300 text-neutral-900 focus:border-emerald-500"
                  />
                  <Input
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="bg-white border-neutral-300 text-neutral-900 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-neutral-700">Property Type</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {propertyTypes.map(type => (
                    <Badge
                      key={type}
                      variant="outline"
                      className={cn(
                        "cursor-pointer border-neutral-300 hover:bg-neutral-100",
                        filters.propertyType === type 
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800" 
                          : "bg-white text-neutral-700"
                      )}
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
                <Label className="text-sm font-medium text-neutral-700">Bedrooms</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Any"
                  className="mt-1 bg-white border-neutral-300 text-neutral-900 focus:border-emerald-500"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                />
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50">
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
