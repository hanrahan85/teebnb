import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { X, Lock } from 'lucide-react';

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
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontFamily: "'Archivo', sans-serif", fontWeight: 600, marginBottom: '16px', color: '#0B1F17' }}>
            Booking details not found
          </h2>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: '#15794C',
              color: '#F6F5EF',
              border: 'none',
              borderRadius: '6px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Back to Search
          </button>
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
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#F6F5EF',
        borderBottom: '1px solid #EDEBE1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{display:'grid',placeItems:'center',width:'36px',height:'36px',borderRadius:'50%',background:'#0B1F17',boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)'}}>
            <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:700,fontSize:'16px',color:'#C8A24B',lineHeight:1}}>T</span>
          </span>
          <span style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:'20px',letterSpacing:'-.02em',color:'#15794C'}}>Checkout</span>
        </div>
        {step === 'details' && (
          <button
            onClick={() => navigate('/search-results')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#0B1F17" />
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {step === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px' }}>
            {/* LEFT COLUMN - Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h1 style={{
                fontSize: '28px',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                color: '#0B1F17',
                margin: 0,
              }}>
                Confirm your booking
              </h1>

              {/* Trip Info Card */}
              <div style={{
                padding: '20px',
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  marginBottom: '12px',
                }}>{listing.property_title}</h3>
                <div style={{ fontSize: '14px', color: '#5C6B62', marginBottom: '16px' }}>{listing.full_address}</div>
                <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                    <div>
                      <div style={{ color: '#5C6B62', marginBottom: '4px' }}>Check-in</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>
                        {format(checkIn, 'd MMM yyyy')}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#5C6B62', marginBottom: '4px' }}>Check-out</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>
                        {format(checkOut, 'd MMM yyyy')}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#5C6B62', marginBottom: '4px' }}>Guests</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>
                        {guests} guest{guests !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#5C6B62', marginBottom: '4px' }}>Price/night</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#15794C' }}>
                        €{listing.nightly_price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Label htmlFor="firstName" style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  fontSize: '14px',
                }}>Full Name</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    id="firstName"
                    value={details.firstName}
                    onChange={(e) => setDetails((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="First name"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #EDEBE1',
                      borderRadius: '6px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: '14px',
                    }}
                  />
                  <Input
                    id="lastName"
                    value={details.lastName}
                    onChange={(e) => setDetails((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Last name"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #EDEBE1',
                      borderRadius: '6px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="email" style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  fontSize: '14px',
                }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #EDEBE1',
                    borderRadius: '6px',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="phone" style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  fontSize: '14px',
                }}>Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+353 ..."
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #EDEBE1',
                    borderRadius: '6px',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="requests" style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  fontSize: '14px',
                }}>Special Requests (optional)</Label>
                <textarea
                  id="requests"
                  value={details.specialRequests}
                  onChange={(e) => setDetails((p) => ({ ...p, specialRequests: e.target.value }))}
                  placeholder="Early breakfast, club storage, accessibility needs..."
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #EDEBE1',
                    borderRadius: '6px',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Cancellation Policy */}
              <div style={{
                padding: '16px',
                background: '#EDEBE1',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#5C6B62',
                fontFamily: "'Hanken Grotesk', sans-serif",
                lineHeight: '1.5',
              }}>
                <p style={{ margin: 0, fontWeight: 500 }}>Cancellation Policy</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Free cancellation up to 48 hours before check-in. Full refund applies.</p>
              </div>

              {submitError && (
                <div style={{ padding: '12px', background: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '14px' }}>
                  {submitError}
                </div>
              )}

              {/* Confirm & Pay Button */}
              <button
                onClick={handleConfirm}
                disabled={!isDetailsValid || submitting}
                style={{
                  padding: '14px 20px',
                  background: isDetailsValid && !submitting ? '#C7F04A' : '#D1D5DB',
                  color: '#0B1F17',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: isDetailsValid && !submitting ? 'pointer' : 'not-allowed',
                  width: '100%',
                }}
              >
                {submitting ? 'Confirming...' : `Confirm & Pay · €${total.toFixed(2)}`}
              </button>
            </div>

            {/* RIGHT COLUMN - Sticky Price Summary */}
            <div style={{
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
            }}>
              <div style={{
                padding: '20px',
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                {listing.cover_image && (
                  <img
                    src={listing.cover_image}
                    alt={listing.property_title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}
                  />
                )}
                <h3 style={{
                  fontSize: '14px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  color: '#0B1F17',
                  marginBottom: '12px',
                }}>{listing.property_title}</h3>

                <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5C6B62' }}>€{listing.nightly_price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{subtotal.toFixed(2)}</span>
                  </div>
                  {cleaningFee > 0 && (
                    <div style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#5C6B62' }}>Cleaning fee</span>
                      <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{cleaningFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5C6B62' }}>Service fee</span>
                    <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{serviceFee.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '16px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#0B1F17',
                  }}>
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Note */}
                <div style={{
                  padding: '12px',
                  background: '#F0FDF4',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#166534',
                }}>
                  <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Secure payment via TeeBnB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            paddingTop: '40px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#C7F04A',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '48px',
            }}>
              ✓
            </div>

            <h1 style={{
              fontSize: '32px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              color: '#0B1F17',
              marginBottom: '8px',
            }}>
              Booking confirmed!
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#5C6B62',
              marginBottom: '32px',
              fontFamily: "'Hanken Grotesk', sans-serif",
            }}>
              Your reservation has been successfully submitted to {listing.host_name}.
            </p>

            {bookingRef && (
              <div style={{
                padding: '16px',
                background: '#EDEBE1',
                borderRadius: '8px',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '12px', color: '#5C6B62', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Reference Number
                </div>
                <div style={{
                  fontSize: '24px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 900,
                  color: '#0B1F17',
                  letterSpacing: '2px',
                }}>
                  TB-{bookingRef}
                </div>
              </div>
            )}

            <div style={{
              padding: '20px',
              background: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'left',
              fontSize: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #EDEBE1' }}>
                <span style={{ color: '#5C6B62' }}>Property</span>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>{listing.property_title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #EDEBE1' }}>
                <span style={{ color: '#5C6B62' }}>Dates</span>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>
                  {format(checkIn, 'd MMM')} – {format(checkOut, 'd MMM yyyy')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #EDEBE1' }}>
                <span style={{ color: '#5C6B62' }}>Guests</span>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#0B1F17' }}>{guests}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, color: '#0B1F17' }}>Total</span>
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, color: '#0B1F17' }}>€{total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#DBEAFE',
              borderLeft: '4px solid #15794C',
              borderRadius: '8px',
              marginBottom: '32px',
              textAlign: 'left',
              fontSize: '14px',
              color: '#0B1F17',
            }}>
              You'll receive a confirmation email with check-in instructions once the host accepts your request.
            </div>

            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <button
                onClick={() => navigate('/trips')}
                style={{
                  padding: '14px 20px',
                  background: '#15794C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                View my trips
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '14px 20px',
                  background: 'transparent',
                  color: '#15794C',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
