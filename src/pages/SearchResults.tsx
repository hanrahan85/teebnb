import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import InteractiveMap, { type MapListing } from '@/components/InteractiveMap';

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
  status: string | null;
  user_id?: string;
  lat?: number;
  lng?: number;
}

const SAMPLE: Listing[] = [
  { id: 's1', property_title: 'The Fairway House', full_address: 'Monterey, California', nightly_price: 640, max_guests: 8, nearby_golf_courses: 'Pebble Beach Golf Links', description: '', photos: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: 36.6002, lng: -121.8947 },
  { id: 's2', property_title: 'Old Course Loft', full_address: 'St Andrews, Scotland', nightly_price: 310, max_guests: 4, nearby_golf_courses: 'St Andrews Links', description: '', photos: ['https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: 56.3431, lng: -2.7929 },
  { id: 's3', property_title: 'Cliffside Casita', full_address: 'Faro, Portugal', nightly_price: 210, max_guests: 4, nearby_golf_courses: 'Algarve Golf Club', description: '', photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: 37.0194, lng: -7.9322 },
  { id: 's4', property_title: 'Cedar Ridge Cabin', full_address: 'Queenstown, New Zealand', nightly_price: 280, max_guests: 6, nearby_golf_courses: 'Queenstown Golf Club', description: '', photos: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: -45.0312, lng: 168.6626 },
  { id: 's5', property_title: 'Loch Aria Cottage', full_address: 'County Kerry, Ireland', nightly_price: 300, max_guests: 5, nearby_golf_courses: 'Ballybunion Golf Club', description: '', photos: ['https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: 52.1545, lng: -9.5669 },
  { id: 's6', property_title: 'Casa del Green', full_address: 'Los Cabos, Mexico', nightly_price: 520, max_guests: 8, nearby_golf_courses: 'Cabo del Sol Golf Club', description: '', photos: ['https://images.unsplash.com/photo-1592919505780-303950717480?w=700&h=500&fit=crop'], cover_image: null, status: 'active', lat: 22.8905, lng: -109.9167 },
];

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {}
  return null;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showMap, setShowMap] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const state = location.state as {
    location?: string;
    checkIn?: Date | string;
    checkOut?: Date | string;
    guests?: number;
  } | null;

  const [listings, setListings] = useState<Listing[]>(SAMPLE);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  // Separate coords state so geocoding updates don't re-trigger geocoding effect
  const [geocodedCoords, setGeocodedCoords] = useState<Record<string, [number, number]>>({});
  const geocodingRef = useRef<Set<string>>(new Set()); // track in-flight requests

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
        const dbListings = (data as unknown as Listing[]) || [];
        setListings(dbListings.length > 0 ? dbListings : SAMPLE);
      } catch {
        setListings(SAMPLE);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchLocation]);

  // Geocode any listing that doesn't already have lat/lng
  // Runs whenever the set of listing IDs changes; uses a ref to avoid duplicate fetches
  const listingIds = listings.map(l => l.id).join(',');
  useEffect(() => {
    let cancelled = false;
    const toGeocode = listings.filter(
      l => l.lat == null && l.lng == null && !geocodingRef.current.has(l.id)
    );
    if (toGeocode.length === 0) return;

    (async () => {
      for (let i = 0; i < toGeocode.length; i++) {
        if (cancelled) break;
        const listing = toGeocode[i];
        geocodingRef.current.add(listing.id);
        const coords = await geocodeAddress(listing.full_address);
        if (coords && !cancelled) {
          setGeocodedCoords(prev => ({ ...prev, [listing.id]: coords }));
        }
        // Nominatim rate limit: max 1 req/s
        if (i < toGeocode.length - 1) {
          await new Promise(r => setTimeout(r, 1100));
        }
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingIds]);

  const filteredListings = listings.filter(listing => {
    if (activeFilters.size === 0) return true;
    let matches = true;
    if (activeFilters.has('sleeps-4') && listing.max_guests < 4) matches = false;
    if (activeFilters.has('sleeps-6') && listing.max_guests < 6) matches = false;
    if (activeFilters.has('under-200') && listing.nightly_price >= 200) matches = false;
    return matches;
  });

  const toggleFilter = (filterId: string) => {
    const n = new Set(activeFilters);
    if (n.has(filterId)) n.delete(filterId); else n.add(filterId);
    setActiveFilters(n);
  };

  // Merge baked-in coordinates with geocoded ones
  const mapListings: MapListing[] = filteredListings
    .map(l => {
      const lat = l.lat ?? geocodedCoords[l.id]?.[0];
      const lng = l.lng ?? geocodedCoords[l.id]?.[1];
      return { ...l, lat, lng };
    })
    .filter(l => l.lat != null && l.lng != null)
    .map(l => ({
      id: l.id,
      property_title: l.property_title,
      full_address: l.full_address,
      nightly_price: l.nightly_price,
      lat: l.lat!,
      lng: l.lng!,
      cover_image: l.cover_image || l.photos?.[0] || null,
    }));

  const filterOptions = [
    { id: 'any-type', label: 'Any type' },
    { id: 'sleeps-4', label: 'Sleeps 4+' },
    { id: 'sleeps-6', label: 'Sleeps 6+' },
    { id: 'pet-friendly', label: 'Pet-friendly' },
    { id: 'pool', label: 'Pool' },
    { id: 'near-links', label: 'Near links' },
    { id: 'under-200', label: 'Under €200' },
  ];

  const getCoverImage = (listing: Listing): string =>
    listing.cover_image || listing.photos?.[0] ||
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=500&fit=crop';

  return (
    <div style={{ background: '#F6F5EF', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #EDEBE1', background: '#F6F5EF', padding: '12px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: '#0B1F17', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#C7F04A', fontSize: '18px' }}>T</div>
            {!isMobile && <span style={{ color: '#15794C', fontSize: '16px', fontWeight: 700, fontFamily: 'Archivo' }}>TeeBnB</span>}
          </button>

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
      <div style={{ flexShrink: 0, borderBottom: '1px solid #EDEBE1', background: '#F6F5EF', padding: '12px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              style={{
                padding: '6px 12px', borderRadius: '20px',
                border: `1px solid ${activeFilters.has(filter.id) ? '#15794C' : '#EDEBE1'}`,
                background: activeFilters.has(filter.id) ? '#15794C' : 'white',
                color: activeFilters.has(filter.id) ? 'white' : '#0B1F17',
                cursor: 'pointer', fontSize: '13px', fontFamily: 'Hanken Grotesk', fontWeight: 500, whiteSpace: 'nowrap'
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
            {showMap ? '← List view' : '🗺 Show map'}
          </button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left panel - listings */}
        <div style={{
          flex: isMobile ? '1 1 100%' : '1 1 54%',
          overflowY: 'auto', borderRight: isMobile ? 'none' : '1px solid #EDEBE1',
          padding: '16px',
          display: isMobile && showMap ? 'none' : 'flex',
          flexDirection: 'column', gap: '12px'
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
            filteredListings.map(listing => {
              const hasCoords = listing.lat != null || geocodedCoords[listing.id] != null;
              return (
                <div
                  key={listing.id}
                  onClick={() => navigate(`/property/${listing.id}`, { state: { listing, checkIn, checkOut, guests } })}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px',
                    padding: '12px', background: 'white',
                    border: `1px solid ${hoveredId === listing.id ? '#15794C' : '#EDEBE1'}`,
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: hoveredId === listing.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <img
                    src={getCoverImage(listing)}
                    alt={listing.property_title}
                    style={{ width: isMobile ? '100%' : '200px', height: isMobile ? '180px' : '140px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Address — clicking opens OSM in new tab */}
                      <a
                        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(listing.full_address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          color: '#15794C', fontSize: '13px', fontFamily: 'Hanken Grotesk',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          textDecoration: 'none', marginBottom: '4px',
                        }}
                        title="View on map"
                      >
                        📍 {listing.full_address}
                        {!hasCoords && (
                          <span style={{ fontSize: '10px', color: '#8A968E', marginLeft: '4px' }}>
                            (locating…)
                          </span>
                        )}
                      </a>
                      <h3 style={{ color: '#0B1F17', fontSize: '19px', fontWeight: 700, fontFamily: 'Archivo', margin: '0 0 8px 0' }}>
                        {listing.property_title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#15794C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'Hanken Grotesk' }}>
                          Sleeps {listing.max_guests}
                        </span>
                        {listing.nearby_golf_courses && (
                          <span style={{ background: '#15794C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'Hanken Grotesk' }}>
                            ⛳ {typeof listing.nearby_golf_courses === 'string'
                              ? listing.nearby_golf_courses.substring(0, 22)
                              : (listing.nearby_golf_courses as string[])?.[0]?.substring(0, 22)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>per night</span>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F17', fontFamily: 'Archivo' }}>
                        €{listing.nightly_price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right panel - Interactive Map */}
        <div style={{
          flex: isMobile ? '1 1 100%' : '1 1 46%',
          display: isMobile && !showMap ? 'none' : 'block',
          position: 'relative', overflow: 'hidden',
        }}>
          <InteractiveMap
            listings={mapListings}
            highlightedId={hoveredId}
            onMarkerClick={(id) => {
              const listing = filteredListings.find(l => l.id === id);
              if (listing) navigate(`/property/${id}`, { state: { listing, checkIn, checkOut, guests } });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
