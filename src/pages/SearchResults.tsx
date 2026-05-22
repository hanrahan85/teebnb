import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Wifi, Car, Coffee, Trophy, BedDouble, Bath, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface Listing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  cover_image: string | null;
  distance_to_course: number | null;
  distance_unit: string | null;
  nearby_golf_courses: string[] | null;
  amenities: unknown;
  host_name: string;
  instant_booking: boolean | null;
  status: string | null;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    location?: string;
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
  } | null;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = state?.location || '';
  const guests = state?.guests || 1;
  const checkIn = state?.checkIn ? new Date(state.checkIn) : null;
  const checkOut = state?.checkOut ? new Date(state.checkOut) : null;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('property_listings')
          .select('*')
          .eq('status', 'active')
          .gte('max_guests', guests);

        if (searchLocation.trim()) {
          query = query.ilike('full_address', `%${searchLocation.trim()}%`);
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setListings((data as unknown as Listing[]) || []);
      } catch (err: unknown) {
        setError((err as Error).message || 'Something went wrong loading listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchLocation, guests]);

  const getAmenities = (amenities: unknown): string[] => {
    if (Array.isArray(amenities)) return amenities as string[];
    if (typeof amenities === 'string') {
      try { return JSON.parse(amenities); } catch { return []; }
    }
    return [];
  };

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="h-3 w-3" />;
    if (a.includes('parking') || a.includes('car') || a.includes('garage')) return <Car className="h-3 w-3" />;
    if (a.includes('breakfast') || a.includes('coffee')) return <Coffee className="h-3 w-3" />;
    if (a.includes('golf')) return <Trophy className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-neutral-900">
              {searchLocation ? `Stays near "${searchLocation}"` : 'All Golf Stays'}
            </h1>
            {!loading && (
              <p className="text-neutral-500 text-sm mt-0.5">
                {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
                {checkIn && checkOut && ` · ${format(checkIn, 'd MMM')} – ${format(checkOut, 'd MMM')}`}
                {` · ${guests} guest${guests !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-neutral-500">Finding golf stays...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => navigate('/')}>Back to Search</Button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Trophy className="h-12 w-12 text-neutral-300 mb-4" />
            <h2 className="text-xl font-heading font-semibold text-neutral-700 mb-2">No stays found</h2>
            <p className="text-neutral-500 mb-6 max-w-sm">
              {searchLocation
                ? `We don't have any active listings near "${searchLocation}" yet. Try a different destination.`
                : 'No active listings yet — check back soon!'}
            </p>
            <Button onClick={() => navigate('/')}>Try another search</Button>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const amenities = getAmenities(listing.amenities);
              return (
                <Card
                  key={listing.id}
                  className="bg-white border-neutral-200 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
                  onClick={() =>
                    navigate(`/property/${listing.id}`, {
                      state: { listing, checkIn, checkOut, guests },
                    })
                  }
                >
                  {/* Cover image */}
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    {listing.cover_image ? (
                      <img
                        src={listing.cover_image}
                        alt={listing.property_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                        <Trophy className="h-12 w-12 text-emerald-200" />
                      </div>
                    )}
                    {listing.instant_booking && (
                      <Badge className="absolute top-3 left-3 bg-emerald-600 text-white text-xs">
                        Instant Book
                      </Badge>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Title + price */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-neutral-900 leading-tight line-clamp-2">
                        {listing.property_title}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-bold text-emerald-600">€{listing.nightly_price}</span>
                        <span className="text-xs text-neutral-400 block">/ night</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{listing.full_address}</span>
                    </div>

                    {/* Distance to course */}
                    {listing.distance_to_course != null && (
                      <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium mb-3">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>
                          {listing.distance_to_course} {listing.distance_unit || 'km'} to nearest course
                        </span>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3 border-t border-neutral-100 pt-3">
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Up to {listing.max_guests}
                      </span>
                    </div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {amenities.slice(0, 4).map((amenity, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs border-neutral-200 text-neutral-600 flex items-center gap-1"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                        {amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs border-neutral-200 text-neutral-400">
                            +{amenities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
