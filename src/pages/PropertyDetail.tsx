import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  MapPin, 
  Star, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Clock,
  Users,
  Calendar as CalendarIcon,
  Shield,
  Award,
  Home,
  MessageCircle,
  CalendarPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const PropertyDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const property = {
    id: '1',
    title: 'Luxury Golf Villa with Ocean Views',
    subtitle: 'Entire villa hosted by Michael',
    location: 'St. Andrews, Scotland',
    rating: 4.8,
    reviewCount: 124,
    pricePerNight: 450,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
    ],
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    nearbyGolf: {
      course: 'St. Andrews Old Course',
      distance: '0.3 miles',
      walkingTime: '5 minutes'
    },
    amenities: [
      { icon: Wifi, label: 'WiFi' },
      { icon: Car, label: 'Golf cart available' },
      { icon: Coffee, label: 'Club storage' },
      { icon: Clock, label: 'Early breakfast' },
      { icon: Home, label: 'Locker access' },
      { icon: Shield, label: 'Late checkout' }
    ],
    host: {
      name: 'Michael',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinedDate: 'Joined in 2019',
      isVerified: true,
      responseRate: '100%',
      responseTime: 'Within an hour'
    },
    description: `Welcome to our stunning golf villa, perfectly positioned just moments from the legendary St. Andrews Old Course. This luxurious 4-bedroom property offers everything the discerning golfer needs for an unforgettable Scottish golf experience.

The villa features spacious, elegantly appointed rooms with breathtaking views of the North Sea and golf course. Our dedicated golf amenities include secure club storage, access to private changing facilities, and complimentary golf cart usage.

Start your day with our signature early breakfast service (available from 5:30 AM) designed specifically for golfers with early tee times. After your round, relax in our comfortable lounge areas or enjoy a drink on the private terrace while watching the sunset over the iconic 18th hole.`,
    
    highlights: [
      '5-minute walk to St. Andrews Old Course',
      'Secure club storage and locker access',
      'Golf cart available for course transfers',
      'Early breakfast service from 5:30 AM',
      'Late checkout until 2 PM',
      'Complimentary course booking assistance'
    ]
  };

  const reviews = [
    {
      id: 1,
      guest: 'David Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: 'October 2024',
      text: 'Absolutely perfect for our golf trip! The location is unbeatable - we could walk to the Old Course in minutes. Michael was incredibly helpful with course bookings and local recommendations.'
    },
    {
      id: 2,
      guest: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: 'September 2024',
      text: 'The villa exceeded all expectations. The golf amenities are top-notch, and the early breakfast service was a game-changer for our dawn tee times. Will definitely return!'
    },
    {
      id: 3,
      guest: 'James Mitchell',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: 'August 2024',
      text: 'Perfect location and amazing host. The club storage and golf cart access made our stay seamless. Highly recommend for any serious golfer visiting St. Andrews.'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.pricePerNight;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="font-heading font-semibold"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{property.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground font-body">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="font-semibold">{property.rating}</span>
              <span>({property.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={previousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Summary */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-heading font-semibold">{property.subtitle}</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Award className="h-3 w-3 mr-1" />
                  Golf Verified
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-muted-foreground font-body mb-6">
                <span>{property.maxGuests} guests</span>
                <span>{property.bedrooms} bedrooms</span>
                <span>{property.bathrooms} bathrooms</span>
              </div>

              {/* Golf Highlight */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {property.nearbyGolf.distance} from {property.nearbyGolf.course}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {property.nearbyGolf.walkingTime} walk to first tee
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Host Info */}
            <div className="border-t border-border pt-8">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.host.avatar} alt={property.host.name} />
                  <AvatarFallback>{property.host.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold">Hosted by {property.host.name}</h3>
                    {property.host.isVerified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{property.host.joinedDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Response rate: {property.host.responseRate}</div>
                <div>Response time: {property.host.responseTime}</div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-heading font-semibold mb-4">Golf Highlights</h3>
              <ul className="space-y-3">
                {property.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="font-body text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-heading font-semibold mb-4">About this place</h3>
              <div className="prose max-w-none">
                {property.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="font-body text-muted-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-t border-border pt-8">
              <h3 className="text-xl font-heading font-semibold mb-4">Golf Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span className="font-body text-muted-foreground">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-border pt-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-current text-yellow-400" />
                <h3 className="text-xl font-heading font-semibold">
                  {property.rating} · {property.reviewCount} reviews
                </h3>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.avatar} alt={review.guest} />
                      <AvatarFallback>{review.guest[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold">{review.guest}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <p className="font-body text-muted-foreground leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-bold">${property.pricePerNight}</span>
                  <span className="text-muted-foreground font-body">per night</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviewCount})</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "MMM d") : "Check in"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "MMM d") : "Check out"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < (checkIn || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-body">Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">{guests}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                      disabled={guests >= property.maxGuests}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {checkIn && checkOut && (
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-body">Total for {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                    <span className="font-heading font-semibold">${calculateTotal()}</span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full mb-4" 
                size="lg"
                variant="premium"
                onClick={() => window.location.href = '/booking'}
              >
                Book Now
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-body">You won't be charged yet</p>
                <div className="flex justify-center gap-4">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Host
                  </Button>
                  <Button variant="ghost" size="sm">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;