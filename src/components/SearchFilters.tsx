
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

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse'];
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full bg-white shadow-lg">
      {/* Main Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="location" className="text-sm font-medium">Golf Course / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="St. Andrews, Augusta..."
                className="pl-10"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
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
