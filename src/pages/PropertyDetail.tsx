import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar as CalendarIcon,
  Award,
  Trophy,
  BedDouble,
  Bath,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInCalendarDays } from 'date-fns';

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
  host_bio: string | null;
  host_photo: string | null;
  house_rules: string | null;
  cleaning_fee: number | null;
  instant_booking: boolean | null;
  description?: string | null;
  photos?: string[] | null;
}

const PropertyDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    listing?: Listing;
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
  } | null;

  const listing = state?.listing;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    state?.checkIn ? new Date(state.checkIn) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    state?.checkOut ? new Date(state.checkOut) : undefined
  );
  const [guests, setGuests] = useState(state?.guests || 2);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-heading font-semibold mb-4">Property not found</h2>
          <Button onClick={() => navigate('/')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const amenities: string[] = Array.isArray(listing.amenities)
    ? (listing.amenities as string[])
    : typeof listing.amenities === 'string'
    ? (() => { try { return JSON.parse(listing.amenities as string); } catch { return []; } })()
    : [];

  const images: string[] = [
    ...(listing.cover_image ? [listing.cover_image] : []),
    ...(listing.photos || []),
  ];
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop');
  }

  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  const subtotal = nights * listing.nightly_price;
  const cleaningFee = listing.cleaning_fee || 0;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const handleBook = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    navigate('/booking', {
      state: { listing, checkIn, checkOut, guests, nights, subtotal, cleaningFee, serviceFee, total },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="border-b border-border bg-background sticky top-[64px] sm:top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-12">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to results
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{listing.property_title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-body">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{listing.full_address}</span>
            </div>
            {listing.distance_to_course != null && (
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <Trophy className="h-4 w-4" />
                <span>{listing.distance_to_course} {listing.distance_unit || 'km'} to nearest course</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-8 rounded-xl overflow-hidden bg-neutral-100">
          <div className="relative h-72 sm:h-96 md:h-[480px]">
            <img src={images[currentImageIndex]} alt={listing.property_title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <Button variant="secondary" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((p) => (p + 1) % images.length)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-heading font-semibold">Hosted by {listing.host_name}</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Award className="h-3 w-3 mr-1" />Golf Verified
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {listing.max_guests} guests</span>
                <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {listing.host_bio && (
              <div className="border-t border-border pt-8">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{listing.host_name?.[0] || 'H'}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-heading font-semibold">About {listing.host_name}</h3>
                </div>
                <p className="font-body text-muted-foreground leading-relaxed">{listing.host_bio}</p>
              </div>
            )}

            {listing.description && (
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-heading font-semibold mb-4">About this place</h3>
                {listing.description.split('\n\n').map((para, i) => (
                  <p key={i} className="font-body text-muted-foreground mb-3 leading-relaxed">{para}</p>
                ))}
              </div>
            )}

            {amenities.length > 0 && (
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.nearby_golf_courses && listing.nearby_golf_courses.length > 0 && (
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Nearby Courses</h3>
                <div className="space-y-2">
                  {listing.nearby_golf_courses.map((course, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.house_rules && (
              <div className="border-t border-border pt-8">
                <h3 className="text-xl font-heading font-semibold mb-4">House Rules</h3>
                <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">{listing.house_rules}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-28">
              <div className="mb-6">
                <span className="text-3xl font-heading font-bold">€{listing.nightly_price}</span>
                <span className="text-muted-foreground font-body ml-1">/ night</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !checkIn && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "d MMM") : "Check in"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "d MMM") : "Check out"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between border border-border rounded-md px-3 py-2 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-body">Guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}>-</Button>
                  <span className="w-6 text-center font-semibold text-sm">{guests}</span>
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setGuests(Math.min(listing.max_guests, guests + 1))} disabled={guests >= listing.max_guests}>+</Button>
                </div>
              </div>

              {checkIn && checkOut && nights > 0 && (
                <div className="border-t border-border pt-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">€{listing.nightly_price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>€{subtotal}</span>
                  </div>
                  {cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaning fee</span>
                      <span>€{cleaningFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee (12%)</span>
                    <span>€{serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-base border-t border-border pt-2 mt-2">
                    <span>Total</span>
                    <span>€{total}</span>
                  </div>
                </div>
              )}

              <Button className="w-full" size="lg" variant="premium" disabled={!checkIn || !checkOut || nights <= 0} onClick={handleBook}>
                {checkIn && checkOut && nights > 0 ? 'Reserve Now' : 'Select dates to book'}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">You won't be charged yet</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
