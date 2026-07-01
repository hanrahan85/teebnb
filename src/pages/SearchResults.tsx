import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

interface Listing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  max_guests: number;
  nearby_golf_courses: string | string[] | null;
  description: string | null;
  images: string[] | null;
  status: string | null;
  user_id?: string;
}

const SAMPLE: Listing[] = [
  { id: 's1', property_title: 'The Fairway House', full_address: 'Monterey, California', nightly_price: 640, max_guests: 8, nearby_golf_courses: 'Pebble Beach Golf Links', description: '', images: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop'], status: 'active' },
  { id: 's2', property_title: 'Old Course Loft', full_address: 'St Andrews, Scotland', nightly_price: 310, max_guests: 4, nearby_golf_courses: 'St Andrews Links', description: '', images: ['https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=700&h=500&fit=crop'], status: 'active' },
  { id: 's3', property_title: 'Cliffside Casita', full_address: 'Faro, Portugal', nightly_price: 210, max_guests: 4, nearby_golf_courses: 'Algarve Golf Club', description: '', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=500&fit=crop'], status: 'active' },
  { id: 's4', property_title: 'Cedar Ridge Cabin', full_address: 'Queenstown, New Zealand', nightly_price: 280, max_guests: 6, nearby_golf_courses: 'Queenstown Golf Club', description: '', images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&h=500&fit=crop'], status: 'active' },
  { id: 's5', property_title: 'Loch Aria Cottage', full_address: 'County Kerry, Ireland', nightly_price: 300, max_guests: 5, nearby_golf_courses: 'Ballybunion Golf Club', description: '', images: ['https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=700&h=500&fit=crop'], status: 'active' },
  { id: 's6', property_title: 'Casa del Green', full_address: 'Los Cabos, Mexico', nightly_price: 520, max_guests: 8, nearby_golf_courses: 'Cabo del Sol Golf Club', description: '', images: ['https://images.unsplash.com/photo-1592919505780-303950717480?w=700&h=500&fit=crop'], status: 'active' },
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showMap, setShowMap] = useState(false);
  const state = location.state as {
    location?: string;
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
  } | null;

  const [listings, setListings] = useState<Listing[]>(SAMPLE);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const searchLocation = state?.location || '';
  const guests = state?.guests || 1;
  const checkIn = state?.checkIn ? new Date(state.checkIn) : null;
  const checkOut = state?.checkOut ? new Date(state.checkOut) : null;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('property_listings')
          .select('*')
          .eq('status', 'active');

        if (searchLocation.trim()) {
          query = query.ilike('full_address', `%${searchLocation.trim()}%`);
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setListings((data as unknown as Listing[]) || SAMPLE);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setListings(SAMPLE);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchLocation]);

  const filteredListings = listings.filter(listing => {
    if (activeFilters.size === 0) return true;

    let matches = true;
    if (activeFilters.has('sleeps-4') && listing.max_guests < 4) matches = false;
    if (activeFilters.has('sleeps-6') && listing.max_guests < 6) matches = false;
    if (activeFilters.has('under-200') && listing.nightly_price >= 200) matches = false;

    return matches;
  });

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setActiveFilters(newFilters);
  };

  const filterOptions = [
    { id: 'any-type', label: 'Any type' },
    { id: 'sleeps-4', label: 'Sleeps 4+' },
    { id: 'sleeps-6', label: 'Sleeps 6+' },
    { id: 'pet-friendly', label: 'Pet-friendly' },
    { id: 'pool', label: 'Pool' },
    { id: 'near-links', label: 'Near links' },
    { id: 'under-200', label: 'Under $200' },
  ];

  return (
    <div style={{ background: '#F6F5EF', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #EDEBE1', background: '#F6F5EF', padding: '12px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {/* Logo */}
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: '#0B1F17', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#C7F04A', fontSize: '18px' }}>T</div>
            {!isMobile && <span style={{ color: '#15794C', fontSize: '16px', fontWeight: 700, fontFamily: 'Archivo' }}>TeeBnB</span>}
          </button>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '400px', display: 'flex', gap: '8px', alignItems: 'center', background: 'white', border: '1px solid #EDEBE1', borderRadius: '8px', padding: '8px 12px' }}>
            <input
              type="text"
              placeholder={`${searchLocation || 'Location'} · ${checkIn ? checkIn.toLocaleDateString() : 'Dates'} · ${guests} guests`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#0B1F17', fontFamily: 'Hanken Grotesk', minWidth: 0 }}
              readOnly
            />
            <button style={{ background: '#0B1F17', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Archivo', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </div>

          {!isMobile && (
            <button onClick={() => navigate('/list-property')} style={{ background: 'none', border: 'none', color: '#15794C', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'Hanken Grotesk', whiteSpace: 'nowrap' }}>
              List your place
            </button>
          )}

          <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B1F17', padding: 0, flexShrink: 0 }}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{
        flexShrink: 0,
        borderBottom: '1px solid #EDEBE1',
        background: '#F6F5EF',
        padding: '12px 24px',
        overflowX: 'auto'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: `1px solid ${activeFilters.has(filter.id) ? '#15794C' : '#EDEBE1'}`,
                background: activeFilters.has(filter.id) ? '#15794C' : 'white',
                color: activeFilters.has(filter.id) ? 'white' : '#0B1F17',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'Hanken Grotesk',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile map toggle */}
      {isMobile && (
        <div style={{ flexShrink: 0, padding: '8px 16px', background: '#F6F5EF', borderBottom: '1px solid #EDEBE1', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowMap(m => !m)}
            style={{ background: '#0B1F17', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Archivo' }}
          >
            {showMap ? '← List view' : 'Show map'}
          </button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left panel - listings (hidden on mobile when map is shown) */}
        <div style={{
          flex: isMobile ? '1 1 100%' : '1 1 54%',
          overflowY: 'auto',
          borderRight: isMobile ? 'none' : '1px solid #EDEBE1',
          padding: '16px',
          display: isMobile && showMap ? 'none' : 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <p style={{ color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <p style={{ color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>No listings found</p>
            </div>
          ) : (
            filteredListings.map(listing => (
              <div
                key={listing.id}
                onClick={() =>
                  navigate(`/property/${listing.id}`, {
                    state: { listing, checkIn, checkOut, guests },
                  })
                }
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '12px',
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #EDEBE1',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <img
                  src={listing.images?.[0] || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop'}
                  alt={listing.property_title}
                  style={{
                    width: isMobile ? '100%' : '200px',
                    height: isMobile ? '180px' : '140px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#8A968E', fontSize: '13px', fontFamily: 'Hanken Grotesk', margin: '0 0 4px 0' }}>
                      {listing.full_address}
                    </p>
                    <h3 style={{
                      color: '#0B1F17',
                      fontSize: '19px',
                      fontWeight: 700,
                      fontFamily: 'Archivo',
                      margin: '0 0 8px 0'
                    }}>
                      {listing.property_title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#15794C',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontFamily: 'Hanken Grotesk'
                      }}>
                        Sleeps {listing.max_guests}
                      </span>
                      {listing.nearby_golf_courses && (
                        <span style={{
                          background: '#15794C',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'Hanken Grotesk'
                        }}>
                          {typeof listing.nearby_golf_courses === 'string'
                            ? listing.nearby_golf_courses.substring(0, 20) + '...'
                            : (listing.nearby_golf_courses as string[])?.[0]?.substring(0, 20) + '...'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>
                      per night
                    </span>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0B1F17',
                      fontFamily: 'Archivo'
                    }}>
                      ${listing.nightly_price}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right panel - map placeholder (hidden on mobile unless toggled) */}
        <div style={{
          flex: isMobile ? '1 1 100%' : '1 1 46%',
          display: isMobile && !showMap ? 'none' : 'block',
          background: 'linear-gradient(135deg, #DDE4DB 0%, #EDEBE1 100%)',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `
            linear-gradient(90deg, transparent 24%, rgba(107, 114, 107, .05) 25%, rgba(107, 114, 107, .05) 26%, transparent 27%, transparent 74%, rgba(107, 114, 107, .05) 75%, rgba(107, 114, 107, .05) 76%, transparent 77%, transparent),
            linear-gradient(0deg, transparent 24%, rgba(107, 114, 107, .05) 25%, rgba(107, 114, 107, .05) 26%, transparent 27%, transparent 74%, rgba(107, 114, 107, .05) 75%, rgba(107, 114, 107, .05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '40px 40px'
        }}>
          {/* Golf course blobs */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'rgba(21, 121, 76, 0.1)',
              borderRadius: '50%',
              top: '10%',
              left: '15%',
              filter: 'blur(40px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              background: 'rgba(21, 121, 76, 0.08)',
              borderRadius: '50%',
              top: '60%',
              right: '20%',
              filter: 'blur(35px)'
            }}
          />

          {/* Price pins */}
          {filteredListings.slice(0, 3).map((listing, idx) => (
            <div
              key={listing.id}
              style={{
                position: 'absolute',
                left: `${15 + idx * 30}%`,
                top: `${25 + idx * 25}%`,
                background: '#15794C',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'Archivo',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              ${listing.nightly_price}
            </div>
          ))}

          {/* Center banner */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '24px 32px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <p style={{
              color: '#0B1F17',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'Archivo',
              margin: 0
            }}>
              Interactive map coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
