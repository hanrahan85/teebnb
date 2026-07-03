import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import InteractiveMap, { type MapListing } from '@/components/InteractiveMap';

// Maps country name → flag emoji + search keyword
const DESTINATION_COUNTRIES: Record<string, { flag: string; search: string }> = {
  'Ireland':          { flag: '🇮🇪', search: 'Ireland' },
  'Northern Ireland': { flag: '🇬🇧', search: 'Northern Ireland' },
  'Scotland':         { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', search: 'Scotland' },
  'England':          { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', search: 'England' },
  'Wales':            { flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', search: 'Wales' },
  'Portugal':         { flag: '🇵🇹', search: 'Portugal' },
  'Spain':            { flag: '🇪🇸', search: 'Spain' },
  'USA':              { flag: '🇺🇸', search: 'USA' },
  'New Zealand':      { flag: '🇳🇿', search: 'New Zealand' },
  'Australia':        { flag: '🇦🇺', search: 'Australia' },
  'South Africa':     { flag: '🇿🇦', search: 'South Africa' },
  'UAE':              { flag: '🇦🇪', search: 'UAE' },
  'Japan':            { flag: '🇯🇵', search: 'Japan' },
  'Mexico':           { flag: '🇲🇽', search: 'Mexico' },
};

function detectCountry(address: string): { name: string; flag: string; search: string } | null {
  // Check "Northern Ireland" before "Ireland" to avoid false match
  const ordered = ['Northern Ireland', ...Object.keys(DESTINATION_COUNTRIES).filter(k => k !== 'Northern Ireland')];
  for (const country of ordered) {
    if (address.toLowerCase().includes(country.toLowerCase())) {
      return { name: country, ...DESTINATION_COUNTRIES[country] };
    }
  }
  return null;
}

interface Listing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  max_guests: number;
  bedrooms: number | null;
  nearby_golf_courses: string | string[] | null;
  description: string | null;
  photos: string[] | null;
  cover_image: string | null;
  status: string | null;
  user_id?: string;
  lat?: number;
  lng?: number;
  // Golf-specific fields
  golf_bag_storage?: boolean;
  partnered_with_course?: boolean;
  tournament_discounts?: boolean;
  can_host_groups?: boolean;
  instant_booking?: boolean;
  parking_availability?: string | null;
  distance_to_course?: number | null;
  distance_unit?: string | null;
  amenities?: {
    wifi?: boolean;
    tv?: boolean;
    kitchen?: boolean;
    golfClubStorage?: boolean;
    washerDryer?: boolean;
    heating?: boolean;
    ac?: boolean;
    golfCourseView?: boolean;
    patioBalcony?: boolean;
    breakfastIncluded?: boolean;
    shuttleService?: boolean;
  } | null;
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

  // Search bar open/edit state
  const [searchOpen, setSearchOpen] = useState(false);
  const [editLocation, setEditLocation] = useState(state?.location || '');
  const [editCheckIn, setEditCheckIn] = useState(
    state?.checkIn ? new Date(state.checkIn).toISOString().split('T')[0] : ''
  );
  const [editCheckOut, setEditCheckOut] = useState(
    state?.checkOut ? new Date(state.checkOut).toISOString().split('T')[0] : ''
  );
  const [editGuests, setEditGuests] = useState(state?.guests || 1);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  // Close search panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  const handleSearch = () => {
    setSearchOpen(false);
    navigate('/search-results', {
      state: {
        location: editLocation,
        checkIn: editCheckIn ? new Date(editCheckIn) : undefined,
        checkOut: editCheckOut ? new Date(editCheckOut) : undefined,
        guests: editGuests,
      },
      replace: true,
    });
  };
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
    // Capacity
    if (activeFilters.has('sleeps-4') && listing.max_guests < 4) return false;
    if (activeFilters.has('sleeps-6') && listing.max_guests < 6) return false;
    if (activeFilters.has('sleeps-8') && listing.max_guests < 8) return false;
    // Price
    if (activeFilters.has('under-150') && listing.nightly_price >= 150) return false;
    if (activeFilters.has('under-200') && listing.nightly_price >= 200) return false;
    if (activeFilters.has('under-300') && listing.nightly_price >= 300) return false;
    // Golf features
    if (activeFilters.has('golf-bag-storage') && !listing.golf_bag_storage) return false;
    if (activeFilters.has('club-storage') && !listing.amenities?.golfClubStorage) return false;
    if (activeFilters.has('course-view') && !listing.amenities?.golfCourseView) return false;
    if (activeFilters.has('partnered-course') && !listing.partnered_with_course) return false;
    if (activeFilters.has('group-friendly') && !listing.can_host_groups) return false;
    if (activeFilters.has('tournament-deals') && !listing.tournament_discounts) return false;
    if (activeFilters.has('shuttle') && !listing.amenities?.shuttleService) return false;
    // Amenities
    if (activeFilters.has('wifi') && !listing.amenities?.wifi) return false;
    if (activeFilters.has('breakfast') && !listing.amenities?.breakfastIncluded) return false;
    if (activeFilters.has('parking') && (!listing.parking_availability || listing.parking_availability === 'None')) return false;
    if (activeFilters.has('instant-book') && !listing.instant_booking) return false;
    return true;
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
    // Golf-specific (shown first — most unique to TeeBnB)
    { id: 'golf-bag-storage',  label: '⛳ Bag storage',       group: 'golf' },
    { id: 'club-storage',      label: '🏌️ Club storage',      group: 'golf' },
    { id: 'course-view',       label: '🌿 Course view',       group: 'golf' },
    { id: 'partnered-course',  label: '🤝 Partner course',    group: 'golf' },
    { id: 'group-friendly',    label: '👥 Group-friendly',    group: 'golf' },
    { id: 'tournament-deals',  label: '🏆 Tournament deals',  group: 'golf' },
    { id: 'shuttle',           label: '🚌 Shuttle service',   group: 'golf' },
    // Capacity
    { id: 'sleeps-4',  label: 'Sleeps 4+',  group: 'capacity' },
    { id: 'sleeps-6',  label: 'Sleeps 6+',  group: 'capacity' },
    { id: 'sleeps-8',  label: 'Sleeps 8+',  group: 'capacity' },
    // Price
    { id: 'under-150', label: 'Under €150', group: 'price' },
    { id: 'under-200', label: 'Under €200', group: 'price' },
    { id: 'under-300', label: 'Under €300', group: 'price' },
    // Amenities
    { id: 'wifi',         label: '📶 WiFi',             group: 'amenities' },
    { id: 'breakfast',    label: '🍳 Breakfast',         group: 'amenities' },
    { id: 'parking',      label: '🚗 Parking',           group: 'amenities' },
    { id: 'instant-book', label: '⚡ Instant book',      group: 'amenities' },
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

          {/* Search bar — click to expand */}
          <div ref={searchPanelRef} style={{ flex: 1, maxWidth: isMobile ? '100%' : '480px', position: 'relative' }}>
            {/* Collapsed pill */}
            <button
              onClick={() => setSearchOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'white', border: `1px solid ${searchOpen ? '#15794C' : '#EDEBE1'}`,
                borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', gap: '8px',
                boxShadow: searchOpen ? '0 0 0 2px rgba(21,121,76,0.15)' : 'none',
              }}
            >
              <span style={{ fontSize: '14px', color: searchLocation || checkIn ? '#0B1F17' : '#8A968E', fontFamily: 'Hanken Grotesk', textAlign: 'left', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {[
                  searchLocation || 'Anywhere',
                  checkIn ? checkIn.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) : null,
                  checkOut ? '→ ' + checkOut.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) : null,
                  `${guests} guest${guests !== 1 ? 's' : ''}`,
                ].filter(Boolean).join(' · ')}
              </span>
              <div style={{ background: '#0B1F17', color: 'white', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, fontFamily: 'Archivo', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Search
              </div>
            </button>

            {/* Expanded panel */}
            {searchOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: 'white', border: '1px solid #EDEBE1', borderRadius: '12px',
                padding: '16px', zIndex: 100,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5C6B62', fontFamily: 'Archivo', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                    Where
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search destinations, courses, cities…"
                    style={{
                      width: '100%', border: '1px solid #EDEBE1', borderRadius: '6px',
                      padding: '9px 12px', fontSize: '14px', fontFamily: 'Hanken Grotesk',
                      color: '#0B1F17', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5C6B62', fontFamily: 'Archivo', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={editCheckIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setEditCheckIn(e.target.value)}
                      style={{ width: '100%', border: '1px solid #EDEBE1', borderRadius: '6px', padding: '9px 10px', fontSize: '14px', fontFamily: 'Hanken Grotesk', color: '#0B1F17', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5C6B62', fontFamily: 'Archivo', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={editCheckOut}
                      min={editCheckIn || new Date().toISOString().split('T')[0]}
                      onChange={e => setEditCheckOut(e.target.value)}
                      style={{ width: '100%', border: '1px solid #EDEBE1', borderRadius: '6px', padding: '9px 10px', fontSize: '14px', fontFamily: 'Hanken Grotesk', color: '#0B1F17', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#5C6B62', fontFamily: 'Archivo', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                    Guests
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setEditGuests(g => Math.max(1, g - 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #EDEBE1', background: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B1F17' }}
                    >−</button>
                    <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Archivo', color: '#0B1F17', minWidth: '24px', textAlign: 'center' }}>{editGuests}</span>
                    <button
                      onClick={() => setEditGuests(g => g + 1)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #EDEBE1', background: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B1F17' }}
                    >+</button>
                  </div>
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  style={{
                    width: '100%', background: '#0B1F17', color: 'white', border: 'none',
                    borderRadius: '8px', padding: '12px', fontSize: '15px',
                    fontWeight: 700, fontFamily: 'Archivo', cursor: 'pointer',
                  }}
                >
                  Search stays
                </button>
              </div>
            )}
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
      <div style={{ flexShrink: 0, borderBottom: '1px solid #EDEBE1', background: '#F6F5EF', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px 16px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Clear all */}
          {activeFilters.size > 0 && (
            <button
              onClick={() => setActiveFilters(new Set())}
              style={{
                padding: '6px 12px', borderRadius: '20px', flexShrink: 0,
                border: '1px solid #0B1F17', background: '#0B1F17', color: 'white',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'Hanken Grotesk', fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              ✕ Clear ({activeFilters.size})
            </button>
          )}
          {filterOptions.map((filter, idx) => {
            const prevGroup = idx > 0 ? filterOptions[idx - 1].group : filter.group;
            const showDivider = idx > 0 && filter.group !== prevGroup;
            return (
              <React.Fragment key={filter.id}>
                {showDivider && (
                  <div style={{ width: '1px', height: '24px', background: '#DEDBD0', flexShrink: 0, margin: '0 2px' }} />
                )}
                <button
                  onClick={() => toggleFilter(filter.id)}
                  style={{
                    padding: '6px 12px', borderRadius: '20px', flexShrink: 0,
                    border: `1px solid ${activeFilters.has(filter.id) ? '#15794C' : '#DEDBD0'}`,
                    background: activeFilters.has(filter.id) ? '#15794C' : 'white',
                    color: activeFilters.has(filter.id) ? 'white' : '#0B1F17',
                    cursor: 'pointer', fontSize: '13px', fontFamily: 'Hanken Grotesk', fontWeight: activeFilters.has(filter.id) ? 600 : 400,
                    whiteSpace: 'nowrap', transition: 'all 0.15s',
                  }}
                >
                  {filter.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        {activeFilters.size > 0 && (
          <div style={{ padding: '0 16px 8px', maxWidth: '1400px', margin: '0 auto' }}>
            <span style={{ fontSize: '12px', color: '#5C6B62', fontFamily: 'Hanken Grotesk' }}>
              {filteredListings.length} {filteredListings.length === 1 ? 'stay' : 'stays'} match your filters
            </span>
          </div>
        )}
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
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                        {(() => {
                          const country = detectCountry(listing.full_address);
                          if (!country) return null;
                          return (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                navigate('/search-results', { state: { location: country.search } });
                              }}
                              title={`More stays in ${country.name}`}
                              style={{
                                background: '#F0FAF5', color: '#15794C', border: '1px solid #C7F04A',
                                padding: '3px 8px', borderRadius: '10px',
                                fontSize: '11px', fontFamily: 'Hanken Grotesk', fontWeight: 600,
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                              }}
                            >
                              {country.flag} {country.name}
                            </button>
                          );
                        })()}
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
