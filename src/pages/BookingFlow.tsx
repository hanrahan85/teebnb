import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  Shield,
  ChevronLeft,
  CheckCircle,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  User,
  CalendarPlus,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BookingStep = 'dates' | 'details' | 'confirmation';

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const property = {
    title: 'Luxury Golf Villa with Ocean Views',
    location: 'St. Andrews, Scotland',
    rating: 4.8,
    reviewCount: 124,
    pricePerNight: 450,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    host: 'Michael'
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateSubtotal = () => {
    return calculateNights() * property.pricePerNight;
  };

  const serviceFee = Math.round(calculateSubtotal() * 0.12);
  const taxes = Math.round(calculateSubtotal() * 0.08);
  const totalAmount = calculateSubtotal() + serviceFee + taxes;

  const handleNextStep = () => {
    if (currentStep === 'dates') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('confirmation');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('dates');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('details');
    }
  };

  const isStepValid = () => {
    if (currentStep === 'dates') {
      return checkIn && checkOut && guests > 0;
    } else if (currentStep === 'details') {
      return guestDetails.firstName && guestDetails.lastName && guestDetails.email && guestDetails.phone;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'dates':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Select your dates</h2>
              <p className="text-muted-foreground font-body">Choose your check-in and check-out dates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-heading font-semibold mb-3 block">Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {checkIn ? format(checkIn, "PPPP") : "Select check-in date"}
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
              </div>

              <div>
                <Label className="text-base font-heading font-semibold mb-3 block">Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {checkOut ? format(checkOut, "PPPP") : "Select check-out date"}
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
            </div>

            <div>
              <Label className="text-base font-heading font-semibold mb-3 block">Number of Guests</Label>
              <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3 max-w-xs">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-body">Guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-heading font-semibold">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(Math.min(8, guests + 1))}
                    disabled={guests >= 8}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {checkIn && checkOut && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {calculateNights()} nights in {property.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(checkIn, "MMM d")} - {format(checkOut, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-heading font-bold text-primary">${calculateSubtotal()}</p>
                    <p className="text-sm text-muted-foreground">Total before taxes</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Your details</h2>
              <p className="text-muted-foreground font-body">We'll use these details to confirm your booking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-base font-heading font-semibold">First Name</Label>
                <Input
                  id="firstName"
                  value={guestDetails.firstName}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  className="mt-2 h-12"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base font-heading font-semibold">Last Name</Label>
                <Input
                  id="lastName"
                  value={guestDetails.lastName}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  className="mt-2 h-12"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-heading font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                className="mt-2 h-12"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-heading font-semibold">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-2 h-12"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests" className="text-base font-heading font-semibold">Special Requests (Optional)</Label>
              <textarea
                id="specialRequests"
                value={guestDetails.specialRequests}
                onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="mt-2 w-full min-h-[100px] px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Any special requests for your stay? (e.g., early breakfast, golf equipment needs)"
              />
            </div>

            <Card className="p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-heading font-semibold mb-1">Your payment is secure</h4>
                  <p className="text-sm text-muted-foreground font-body">
                    We use industry-standard encryption to protect your payment information. 
                    You won't be charged until your booking is confirmed.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2 text-primary">You're all set, golfer!</h2>
              <p className="text-lg text-muted-foreground font-body">Your booking has been confirmed</p>
            </div>

            <Card className="p-6 text-left max-w-md mx-auto">
              <h3 className="font-heading font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-semibold">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{property.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates:</span>
                  <span>{checkIn && checkOut && `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span>{guests}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-heading font-semibold">
                  <span>Total Paid:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="premium" size="lg">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact {property.host}
              </Button>
            </div>

            <Card className="p-4 bg-accent/5 border-accent/20 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent mt-1" />
                <div className="text-left">
                  <h4 className="font-heading font-semibold mb-1 text-accent">What's Next?</h4>
                  <p className="text-sm text-muted-foreground font-body">
                    You'll receive a confirmation email with check-in instructions and your host's contact details.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
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
              onClick={handlePreviousStep}
              disabled={currentStep === 'dates'}
              className="font-heading font-semibold"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant={currentStep === 'dates' ? 'default' : 'secondary'}>1</Badge>
              <Badge variant={currentStep === 'details' ? 'default' : 'secondary'}>2</Badge>
              <Badge variant={currentStep === 'confirmation' ? 'default' : 'secondary'}>3</Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepContent()}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              {/* Property Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-heading font-semibold text-sm leading-tight mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className="font-semibold">{property.rating}</span>
                    <span className="text-muted-foreground">({property.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              {checkIn && checkOut && (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-semibold">{format(checkIn, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-semibold">{format(checkOut, "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-semibold">{guests}</span>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">${property.pricePerNight} × {calculateNights()} nights</span>
                      <span>${calculateSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>${serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes</span>
                      <span>${taxes}</span>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  <div className="flex justify-between font-heading font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </>
              )}

              {currentStep !== 'confirmation' && (
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  variant="premium"
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                >
                  {currentStep === 'dates' && 'Continue'}
                  {currentStep === 'details' && (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirm & Pay
                    </>
                  )}
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;