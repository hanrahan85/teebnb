import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  ChevronLeft,
  CreditCard,
  MapPin,
  Shield,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

type Step = 'details' | 'confirmation';

const BookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const state = location.state as {
    listing?: { id: string; property_title: string; full_address: string; cover_image?: string | null; host_name: string; nightly_price: number };
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
    nights?: number;
    subtotal?: number;
    cleaningFee?: number;
    serviceFee?: number;
    total?: number;
  } | null;

  const listing = state?.listing;

  const [step, setStep] = useState<Step>('details');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });

  if (!listing || !state?.checkIn || !state?.checkOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-heading font-semibold mb-4">Booking details not found</h2>
          <Button onClick={() => navigate('/')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const checkIn = new Date(state.checkIn);
  const checkOut = new Date(state.checkOut);
  const nights = state.nights || 1;
  const subtotal = state.subtotal || 0;
  const cleaningFee = state.cleaningFee || 0;
  const serviceFee = state.serviceFee || 0;
  const total = state.total || 0;
  const guests = state.guests || 1;

  const isDetailsValid =
    details.firstName.trim() &&
    details.lastName.trim() &&
    details.email.trim() &&
    details.phone.trim();

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          listing_id: listing.id,
          guest_user_id: user?.id || null,
          guest_name: `${details.firstName} ${details.lastName}`,
          guest_email: details.email,
          guest_phone: details.phone,
          special_requests: details.specialRequests || null,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
          nights,
          guests,
          price_per_night: listing.nightly_price,
          subtotal,
          cleaning_fee: cleaningFee,
          service_fee: serviceFee,
          total,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) throw error;
      setBookingRef((data.id as string).slice(0, 8).toUpperCase());
      setStep('confirmation');
    } catch (err: unknown) {
      setSubmitError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Back bar */}
      {step === 'details' && (
        <div className="border-b border-border bg-background sticky top-[64px] sm:top-[80px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-12">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to property
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-2xl font-heading font-bold mb-1">Confirm your booking</h1>
                <p className="text-muted-foreground font-body text-sm">Fill in your details to complete the reservation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-heading font-semibold">First Name</Label>
                  <Input
                    id="firstName"
                    className="mt-2"
                    value={details.firstName}
                    onChange={(e) => setDetails((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-heading font-semibold">Last Name</Label>
                  <Input
                    id="lastName"
                    className="mt-2"
                    value={details.lastName}
                    onChange={(e) => setDetails((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-heading font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  value={details.email}
                  onChange={(e) => setDetails((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="font-heading font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="mt-2"
                  value={details.phone}
                  onChange={(e) => setDetails((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+353 ..."
                />
              </div>

              <div>
                <Label htmlFor="requests" className="font-heading font-semibold">Special Requests <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <textarea
                  id="requests"
                  className="mt-2 w-full min-h-[80px] px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  value={details.specialRequests}
                  onChange={(e) => setDetails((p) => ({ ...p, specialRequests: e.target.value }))}
                  placeholder="Early breakfast, club storage, accessibility needs..."
                />
              </div>

              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground font-body">
                    Your payment information is secure. You won't be charged until your booking is confirmed by the host.
                  </p>
                </div>
              </Card>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              <Button
                size="lg"
                variant="premium"
                className="w-full"
                disabled={!isDetailsValid || submitting}
                onClick={handleConfirm}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {submitting ? 'Confirming...' : `Confirm & Pay · €${total}`}
              </Button>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-5 sticky top-28">
                {listing.cover_image && (
                  <img src={listing.cover_image} alt={listing.property_title} className="w-full h-32 object-cover rounded-lg mb-4" />
                )}
                <h3 className="font-heading font-semibold text-sm mb-1 leading-tight">{listing.property_title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" />
                  <span>{listing.full_address}</span>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">{format(checkIn, 'd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{format(checkOut, 'd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm mb-4">
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
                    <span className="text-muted-foreground">Service fee</span>
                    <span>€{serviceFee}</span>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="flex justify-between font-heading font-bold">
                  <span>Total</span>
                  <span>€{total}</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">You're all set!</h1>
            <p className="text-muted-foreground font-body mb-6">Your booking request has been sent to {listing.host_name}.</p>

            {bookingRef && (
              <Card className="p-4 mb-6 bg-neutral-50">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Booking Reference</p>
                <p className="text-2xl font-heading font-bold tracking-wider">{bookingRef}</p>
              </Card>
            )}

            <Card className="p-5 text-left mb-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium text-right max-w-[60%]">{listing.property_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-medium">{format(checkIn, 'd MMM')} – {format(checkOut, 'd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-medium">{guests}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-heading font-bold">
                <span>Total</span>
                <span>€{total}</span>
              </div>
            </Card>

            <Card className="p-4 bg-emerald-50 border-emerald-200 flex items-start gap-3 text-left mb-6">
              <Clock className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-body">
                You'll receive a confirmation email with check-in instructions once {listing.host_name} accepts your request.
              </p>
            </Card>

            <Button variant="premium" size="lg" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
