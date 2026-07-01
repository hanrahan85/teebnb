import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface Listing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  max_guests: number;
  nearby_golf_courses: string | string[] | null;
  description: string | null;
  photos: string[] | null;
  cover_image: string | null;
  bedrooms: number | null;
  [key: string]: any;
}

const PropertyDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();

  const state = location.state as {
    listing?: Listing;
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
  } | null;

  const [listing, setListing] = useState<Listing | null>(state?.listing || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    state?.checkIn ? new Date(state.checkIn) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    state?.checkOut ? new Date(state.checkOut) : undefined
  );
  const [guests, setGuests] = useState(state?.guests || 2);
  const [loading, setLoading] = useState(!state?.listing);

  useEffect(() => {
    if (!listing && id) {
      const fetchListing = async () => {
        try {
          const { data, error } = await supabase
            .from('property_listings')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setListing(data as Listing);
        } catch (err) {
          console.error('Error fetching listing:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchListing();
    } else {
      setLoading(false);
    }
  }, [id, listing]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0B1F17', fontSize: '20px', fontWeight: 600, fontFamily: 'Archivo', marginBottom: '16px' }}>Property not found</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#15794C',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Archivo',
              fontWeight: 600
            }}
          >
            Back to search
          </button>
        </div>
      </div>
    );
  }

  // Use uploaded photos; cover_image goes first if not already in the array
  const uploadedPhotos: string[] = listing.photos || [];
  const allPhotos = listing.cover_image && !uploadedPhotos.includes(listing.cover_image)
    ? [listing.cover_image, ...uploadedPhotos]
    : uploadedPhotos.length > 0
      ? uploadedPhotos
      : ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop'];
  const images: string[] = allPhotos.slice(0, 5);

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const subtotal = nights > 0 ? nights * listing.nightly_price : 0;
  const cleaningFee = 120;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    navigate('/booking', {
      state: { listing, checkIn, checkOut, guests, nights, subtotal, cleaningFee, serviceFee, total },
    });
  };

  const amenities = ['WiFi', 'Full kitchen', 'Club storage', 'Free parking', 'Golf cart', 'Putting green', 'Washer/Dryer', 'Smart TV'];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF', paddingTop: '16px' }}>
      {/* Header */}
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        paddingBottom: '16px',
        borderBottom: '1px solid #EDEBE1'
      }}>
        <button
          onClick={() => navigate('/search-results')}
          style={{
            background: 'none',
            border: 'none',
            color: '#15794C',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Hanken Grotesk',
            fontWeight: 600,
            marginBottom: '16px'
          }}
        >
          ← Back to search
        </button>

        {/* Title */}
        <h1 style={{
          color: '#0B1F17',
          fontSize: '32px',
          fontWeight: 800,
          fontFamily: 'Archivo',
          margin: '0 0 12px 0'
        }}>
          {listing.property_title}
        </h1>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#5C6B62', fontSize: '14px', fontFamily: 'Hanken Grotesk' }}>
            {listing.full_address}
          </span>
          <span style={{
            background: '#C7F04A',
            color: '#0B1F17',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Archivo',
            fontWeight: 600
          }}>
            Golfer favorite
          </span>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#15794C',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Hanken Grotesk',
              fontWeight: 600,
              marginLeft: 'auto'
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      <div style={{
        maxWidth: '1120px',
        margin: '24px auto 32px',
        padding: isMobile ? '0 16px' : '0',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gridTemplateRows: isMobile ? 'auto' : 'repeat(2, 200px)',
        gap: '8px',
        borderRadius: '16px',
        overflow: 'hidden',
        height: isMobile ? '260px' : 'clamp(300px, 44vw, 440px)'
      }}>
        {/* Main image - spans 2 rows, 1 column */}
        <div style={{ gridColumn: 1, gridRow: '1 / 3', position: 'relative' }}>
          <img
            src={images[0] || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop'}
            alt="Main"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            ›
          </button>
        </div>

        {/* Smaller images - 2x2 grid on right (desktop only) */}
        {!isMobile && images.slice(1, 5).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Photo ${idx + 2}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 350px',
        gap: isMobile ? '24px' : '32px'
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Host info */}
          <div>
            <p style={{
              color: '#5C6B62',
              fontSize: '14px',
              fontFamily: 'Hanken Grotesk',
              margin: '0 0 16px 0'
            }}>
              Entire home hosted by {listing.property_title}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>
              <span>Sleeps {listing.max_guests}</span>
              {listing.bedrooms && (
                <>
                  <span>·</span>
                  <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: '⛳', title: 'Distance to course', text: '0.5 km away' },
              { icon: '🏡', title: 'Private whole place', text: 'Entire home for you' },
              { icon: '🕑', title: 'Flexible check-in', text: 'Check in from 4 PM' },
            ].map((feature, idx) => (
              <div key={idx} style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #EDEBE1' }}>
                <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>{feature.icon}</p>
                <p style={{ color: '#0B1F17', fontWeight: 600, fontFamily: 'Archivo', margin: '0 0 4px 0', fontSize: '14px' }}>
                  {feature.title}
                </p>
                <p style={{ color: '#5C6B62', fontSize: '13px', fontFamily: 'Hanken Grotesk', margin: 0 }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 style={{ color: '#0B1F17', fontSize: '18px', fontWeight: 700, fontFamily: 'Archivo', marginBottom: '12px' }}>
              About this place
            </h3>
            <p style={{
              color: '#5C6B62',
              fontSize: '14px',
              fontFamily: 'Hanken Grotesk',
              lineHeight: '1.6',
              margin: 0
            }}>
              {listing.description || 'Experience luxury golf living at its finest. This exquisite property offers stunning views of the championship course and world-class amenities for the discerning golfer. Perfect for golf retreats and unforgettable vacations.'}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 style={{ color: '#0B1F17', fontSize: '18px', fontWeight: 700, fontFamily: 'Archivo', marginBottom: '16px' }}>
              Amenities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
              {amenities.map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#15794C', fontSize: '16px' }}>✓</span>
                  <span style={{ color: '#0B1F17', fontSize: '14px', fontFamily: 'Hanken Grotesk' }}>
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 style={{ color: '#0B1F17', fontSize: '18px', fontWeight: 700, fontFamily: 'Archivo', marginBottom: '16px' }}>
              Reviews
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>★★★★★</span>
              <span style={{ color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>4.9 (127 reviews)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { name: 'Sarah M.', text: 'Fantastic property! Perfect golf getaway.' },
                { name: 'John D.', text: 'Amazing views and excellent hospitality.' },
              ].map((review, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #EDEBE1' }}>
                  <p style={{ fontWeight: 600, color: '#0B1F17', fontFamily: 'Archivo', margin: '0 0 4px 0', fontSize: '14px' }}>
                    {review.name}
                  </p>
                  <p style={{ color: '#5C6B62', fontSize: '13px', fontFamily: 'Hanken Grotesk', margin: 0 }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - booking widget */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : '92px', height: 'fit-content' }}>
          <div style={{
            background: 'white',
            border: '1px solid #EDEBE1',
            borderRadius: '12px',
            padding: '24px'
          }}>
            {/* Price */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontSize: '26px',
                fontWeight: 800,
                fontFamily: 'Archivo',
                color: '#0B1F17'
              }}>
                €{listing.nightly_price}
              </span>
              <span style={{
                fontSize: '14px',
                color: '#5C6B62',
                fontFamily: 'Hanken Grotesk',
                marginLeft: '6px'
              }}>
                / night
              </span>
            </div>

            {/* Date/Guest picker */}
            <div style={{ marginBottom: '16px', border: '1px solid #EDEBE1', borderRadius: '8px', padding: '12px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#5C6B62', fontFamily: 'Hanken Grotesk', marginBottom: '4px' }}>
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
                  onChange={(e) => setCheckIn(e.target.value ? new Date(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    border: 'none',
                    fontSize: '14px',
                    fontFamily: 'Hanken Grotesk',
                    padding: '4px 0'
                  }}
                />
              </div>
              <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#5C6B62', fontFamily: 'Hanken Grotesk', marginBottom: '4px' }}>
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
                  onChange={(e) => setCheckOut(e.target.value ? new Date(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    border: 'none',
                    fontSize: '14px',
                    fontFamily: 'Hanken Grotesk',
                    padding: '4px 0'
                  }}
                />
              </div>
            </div>

            {/* Guests */}
            <div style={{
              marginBottom: '16px',
              border: '1px solid #EDEBE1',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: '#0B1F17', fontFamily: 'Hanken Grotesk' }}>
                Guests
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '1px solid #EDEBE1',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  −
                </button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: 600, fontSize: '14px' }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(listing.max_guests, guests + 1))}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '1px solid #EDEBE1',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            {nights > 0 && (
              <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#5C6B62' }}>€{listing.nightly_price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#5C6B62' }}>Cleaning fee</span>
                  <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{cleaningFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#5C6B62' }}>Service fee (12%)</span>
                  <span style={{ color: '#0B1F17', fontWeight: 600 }}>€{serviceFee}</span>
                </div>
                <div style={{
                  borderTop: '1px solid #EDEBE1',
                  paddingTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#0B1F17'
                }}>
                  <span>Total</span>
                  <span>€{total}</span>
                </div>
              </div>
            )}

            {/* Reserve button */}
            <button
              onClick={handleReserve}
              disabled={!checkIn || !checkOut || nights <= 0}
              style={{
                width: '100%',
                background: !checkIn || !checkOut || nights <= 0 ? '#EDEBE1' : '#0B1F17',
                color: !checkIn || !checkOut || nights <= 0 ? '#8A968E' : 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: !checkIn || !checkOut || nights <= 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'Archivo',
                transition: 'all 0.2s',
                marginBottom: '8px'
              }}
              onMouseEnter={(e) => {
                if (!(!checkIn || !checkOut || nights <= 0)) {
                  (e.target as HTMLButtonElement).style.background = '#15794C';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!checkIn || !checkOut || nights <= 0)) {
                  (e.target as HTMLButtonElement).style.background = '#0B1F17';
                }
              }}
            >
              {!checkIn || !checkOut || nights <= 0 ? 'Select dates to book' : 'Reserve'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#5C6B62', fontFamily: 'Hanken Grotesk', margin: 0 }}>
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#0B1F17',
        color: 'white',
        padding: '20px 24px',
        marginTop: '60px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '12px', fontFamily: 'Hanken Grotesk', margin: 0 }}>
          © 2024 TeeBnB. All rights reserved.
        </p>
        <button
          onClick={() => navigate('/search-results')}
          style={{
            background: 'none',
            border: 'none',
            color: '#C7F04A',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'Hanken Grotesk',
            fontWeight: 600
          }}
        >
          ← Back to all stays
        </button>
      </div>
    </div>
  );
};

export default PropertyDetail;
