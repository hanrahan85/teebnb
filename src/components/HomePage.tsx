import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Heart } from 'lucide-react';

interface Listing {
  id: number | string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  tag: string;
  specs: string;
  image: string;
  guests?: number;
  isReal?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop';

/** Trim a full address down to something card-sized, e.g. "Malahide, Co. Dublin". */
const shortLocation = (address: string): string => {
  if (!address) return '';
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 2) return parts.join(', ');
  return parts.slice(-3, -1).join(', ');
};

const HomePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const SAMPLE_LISTINGS: Listing[] = [
    { id: 1, name: 'Fairway House', location: 'Monterey, CA', price: 640, rating: 4.9, reviews: 142, tag: 'Sample', specs: '4 bed · 2 bath', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop' },
    { id: 2, name: 'Old Course Loft', location: 'St Andrews, Scotland', price: 310, rating: 4.95, reviews: 289, tag: 'Sample', specs: '2 bed · 1 bath', image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=600&h=400&fit=crop' },
    { id: 3, name: 'Cedar Ridge Cabin', location: 'Queenstown, NZ', price: 280, rating: 4.85, reviews: 156, tag: 'Sample', specs: '3 bed · 2 bath', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop' },
    { id: 4, name: 'Casa del Green', location: 'Los Cabos, Mexico', price: 520, rating: 4.88, reviews: 203, tag: 'Sample', specs: '5 bed · 3 bath', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop' },
    { id: 5, name: 'Sakura Villa', location: 'Hokkaido, Japan', price: 340, rating: 4.92, reviews: 178, tag: 'Sample', specs: '4 bed · 2 bath', image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&h=400&fit=crop' },
    { id: 6, name: 'Cliffside Casita', location: 'Faro, Portugal', price: 210, rating: 4.80, reviews: 134, tag: 'Sample', specs: '2 bed · 1 bath', image: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=400&fit=crop' },
    { id: 7, name: 'Saguaro Retreat', location: 'Phoenix, AZ', price: 260, rating: 4.87, reviews: 167, tag: 'Sample', specs: '3 bed · 2 bath', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop' },
    { id: 8, name: 'Loch Aria Cottage', location: 'County Kerry, Ireland', price: 300, rating: 4.91, reviews: 198, tag: 'Sample', specs: '3 bed · 2 bath', image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=600&h=400&fit=crop' },
  ];

  const [savedListings, setSavedListings] = React.useState<(number | string)[]>([]);
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = React.useState(true);

  // Show real listings from the database. Samples are only a fallback for when
  // there are none yet — as soon as a real host lists, the front page is theirs.
  React.useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('id, property_title, full_address, nightly_price, bedrooms, bathrooms, max_guests, cover_image, photos, nearby_golf_courses, is_sample')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        if (cancelled) return;

        const rows = (data as unknown as Record<string, unknown>[]) || [];
        const mapped: Listing[] = rows.map((r) => {
          const photos = (r.photos as string[]) || [];
          const beds = (r.bedrooms as number) ?? null;
          const baths = (r.bathrooms as number) ?? null;
          const specs = [
            beds ? `${beds} bed` : null,
            baths ? `${baths} bath` : null,
          ].filter(Boolean).join(' · ')
            || (r.max_guests ? `Sleeps ${r.max_guests}` : '');

          const courses = r.nearby_golf_courses;
          const firstCourse = Array.isArray(courses) ? courses[0] : undefined;

          return {
            id: r.id as string,
            name: (r.property_title as string) || 'Untitled listing',
            location: shortLocation((r.full_address as string) || ''),
            price: (r.nightly_price as number) ?? 0,
            rating: 0,
            reviews: 0,
            tag: firstCourse ? `⛳ ${firstCourse}` : 'New listing',
            specs,
            image: (r.cover_image as string) || photos[0] || FALLBACK_IMAGE,
            guests: (r.max_guests as number) ?? undefined,
            // Seeded demo properties are flagged in the database so they can be
            // labelled honestly rather than passing as real inventory.
            isReal: !r.is_sample,
          };
        });

        setListings(mapped.length > 0 ? mapped : SAMPLE_LISTINGS);
      } catch {
        if (!cancelled) setListings(SAMPLE_LISTINGS);
      } finally {
        if (!cancelled) setLoadingListings(false);
      }
    };

    fetchListings();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The spotlight goes to a real listing, never a sample. With none live it is hidden.
  const featured = listings.find((l) => l.isReal);

  const toggleSave = (id: number | string): void => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBFAF6' }}>
      <Navigation />

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: isMobile ? '88vh' : '92vh',
          backgroundImage: `url('https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%2014th,%2015th%20and%2016th%20holes%20at%20Portmarnock%20Golf%20Club,%20Ireland.jpg?width=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(11,31,23,0.45), rgba(11,31,23,0.25) 45%, rgba(11,31,23,0.6))',
          }}
        />
        <div className="lux-container" style={{ position: 'relative', width: '100%', textAlign: 'center', padding: isMobile ? '96px 16px 56px' : '120px 24px 80px' }}>
          <p className="lux-eyebrow" style={{ color: 'rgba(255,255,255,.9)', margin: 0 }}>
            Golf stays &middot; Ireland first
          </p>
          <h1
            className="lux-display"
            style={{ color: '#fff', fontSize: 'clamp(48px, 7.5vw, 104px)', margin: '22px 0 0' }}
          >
            Stay steps from the tee.
          </h1>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,.88)',
              maxWidth: '560px',
              margin: '22px auto 40px',
            }}
          >
            Privately owned homes beside the courses you came to play, booked
            direct with the owner.
          </p>
          <div style={{ width: '100%' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="lux-section">
        <div className="lux-container" style={{ maxWidth: '820px', textAlign: 'center' }}>
          <p className="lux-eyebrow" style={{ margin: 0 }}>Welcome to TeeBnB</p>
          <h2 className="lux-h2">Houses for golf trips, found by the course rather than the town.</h2>
          <hr className="lux-rule" />
          <p className="lux-lede" style={{ margin: 0 }}>
            Search by where you are playing, find a whole house for the group,
            and arrange your stay with the owner directly. No call centre in the
            middle. We are starting in Ireland.
          </p>
        </div>

        {/* Propositions, not metrics. Every line here must stay true —
            no counts or ratings until they can be read from real data. */}
        <div
          className="lux-container"
          style={{
            marginTop: '64px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            borderTop: '1px solid rgba(11,31,23,.12)',
            borderBottom: '1px solid rgba(11,31,23,.12)',
          }}
        >
          {[
            { headline: '€0', caption: 'To list your place' },
            { headline: 'Golf only', caption: 'Built for one kind of trip' },
            { headline: 'Direct', caption: 'Book with the owner' },
            { headline: 'Ireland', caption: 'Launching here first' },
          ].map(({ headline, caption }) => (
            <div key={caption} style={{ textAlign: 'center', padding: '32px 12px' }}>
              <div className="lux-display" style={{ fontSize: '34px', color: '#15794C' }}>
                {headline}
              </div>
              <div className="lux-card-meta" style={{ marginTop: '8px' }}>{caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured stay — a real listing only */}
      {featured && (
        <section style={{ background: '#F1EFE7' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.25fr 1fr',
              alignItems: 'stretch',
            }}
          >
            <div style={{ minHeight: isMobile ? '320px' : '620px', background: '#E4E1D6' }}>
              <img
                src={featured.image}
                alt={featured.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: isMobile ? '48px 16px 64px' : '80px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="lux-eyebrow" style={{ margin: 0 }}>Featured stay</p>
              <h2 className="lux-h2">{featured.name}</h2>
              <p className="lux-card-meta" style={{ marginTop: '14px' }}>{featured.location}</p>
              <hr className="lux-rule" style={{ marginLeft: 0 }} />
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 28px', fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', color: '#3A4A41' }}>
                {featured.guests ? (<><dt className="lux-card-meta">Sleeps</dt><dd style={{ margin: 0 }}>{featured.guests}</dd></>) : null}
                {featured.specs && !featured.specs.startsWith('Sleeps') ? (<><dt className="lux-card-meta">Rooms</dt><dd style={{ margin: 0 }}>{featured.specs}</dd></>) : null}
                {featured.tag.startsWith('⛳') ? (<><dt className="lux-card-meta">Nearby</dt><dd style={{ margin: 0 }}>{featured.tag.replace('⛳ ', '')}</dd></>) : null}
                {featured.price ? (<><dt className="lux-card-meta">From</dt><dd style={{ margin: 0 }}>€{featured.price.toLocaleString('en-IE')} a night</dd></>) : null}
              </dl>
              <div style={{ marginTop: '40px' }}>
                <button className="lux-btn lux-btn-dark" onClick={(): void => navigate(`/property/${featured.id}`)}>
                  View the house
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="lux-section">
        <div className="lux-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <div>
              <p className="lux-eyebrow" style={{ margin: 0 }}>The houses</p>
              <h2 className="lux-h2">Homes near the course</h2>
            </div>
            <button className="lux-link" onClick={(): void => navigate('/search-results')}>
              View all stays
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: isMobile ? '40px' : '56px 32px',
            }}
          >
            {loadingListings && (
              <p className="lux-lede" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 0', margin: 0 }}>
                Loading stays…
              </p>
            )}
            {listings.slice(0, 6).map((listing) => (
              <div
                key={listing.id}
                className="lux-card"
                onClick={(): void =>
                  listing.isReal
                    ? navigate(`/property/${listing.id}`)
                    : navigate('/search-results')
                }
              >
                <div className="lux-card-img">
                  <img src={listing.image} alt={listing.name} />
                  {!listing.isReal && <span className="lux-sample">Sample listing</span>}
                  <button
                    aria-label={savedListings.includes(listing.id) ? 'Remove from saved' : 'Save'}
                    onClick={(e): void => {
                      e.stopPropagation();
                      toggleSave(listing.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(251,250,246,.92)',
                      border: 'none',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      fill={savedListings.includes(listing.id) ? '#15794C' : 'none'}
                      color={savedListings.includes(listing.id) ? '#15794C' : '#0B1F17'}
                    />
                  </button>
                </div>
                <h3 className="lux-card-title">{listing.name}</h3>
                <p className="lux-card-meta" style={{ margin: 0 }}>
                  {[listing.location, listing.specs].filter(Boolean).join(' · ')}
                </p>
                {listing.isReal && listing.tag.startsWith('⛳') && (
                  <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#15794C', margin: '8px 0 0' }}>
                    Near {listing.tag.replace('⛳ ', '')}
                  </p>
                )}
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', color: '#0B1F17', margin: '10px 0 0' }}>
                  From <strong style={{ fontWeight: 600 }}>€{listing.price.toLocaleString('en-IE')}</strong>
                  <span style={{ color: '#5C6B62' }}> a night</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to play */}
      <section className="lux-section" style={{ paddingTop: 0 }}>
        <div className="lux-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="lux-eyebrow" style={{ margin: 0 }}>Where to play</p>
            <h2 className="lux-h2">Start with the course</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'Kerry',
                line: 'Waterville, Ballybunion, Killarney',
                search: 'Kerry',
                image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=900&q=70&auto=format&fit=crop',
              },
              {
                title: 'Limerick & Clare',
                line: 'Adare Manor, Lahinch, Doonbeg',
                search: 'Limerick',
                image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=900&q=70&auto=format&fit=crop',
              },
              {
                title: 'Dublin & the east',
                line: 'Portmarnock, The K Club, Druids Glen',
                search: 'Dublin',
                image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=900&q=70&auto=format&fit=crop',
              },
            ].map((c) => (
              <button
                key={c.title}
                className="lux-tile"
                onClick={(): void => navigate('/search-results', { state: { location: c.search } })}
              >
                <img src={c.image} alt="" />
                <span className="lux-tile-text">
                  <span className="lux-display" style={{ display: 'block', color: '#fff', fontSize: '34px' }}>
                    {c.title}
                  </span>
                  <span className="lux-card-meta" style={{ display: 'block', color: 'rgba(255,255,255,.85)', marginTop: '8px' }}>
                    {c.line}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lux-section" style={{ background: '#F1EFE7' }}>
        <div className="lux-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="lux-eyebrow" style={{ margin: 0 }}>How it works</p>
            <h2 className="lux-h2">Your home base for the whole trip</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '40px' : '56px',
            }}
          >
            {[
              { number: 'I', title: 'Find your spot', description: 'Browse homes near the courses you want to play.' },
              { number: 'II', title: 'Book direct with owners', description: 'Deal with the owner, not a call centre.' },
              { number: 'III', title: 'Unpack and play', description: 'Settle in and be on the first tee in minutes.' },
            ].map((step) => (
              <div key={step.number} style={{ textAlign: 'center' }}>
                <div className="lux-display" style={{ fontSize: '40px', color: '#15794C', fontStyle: 'italic' }}>
                  {step.number}
                </div>
                <h3 className="lux-card-title" style={{ marginTop: '12px' }}>{step.title}</h3>
                <p className="lux-lede" style={{ fontSize: '15px', margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="lux-section">
        <div className="lux-container" style={{ maxWidth: '760px', textAlign: 'center' }}>
          <p className="lux-eyebrow" style={{ margin: 0 }}>For owners</p>
          <h2 className="lux-h2">Own a house near a course?</h2>
          <hr className="lux-rule" />
          <p className="lux-lede" style={{ margin: '0 0 36px' }}>
            List it on TeeBnB and reach golfers planning their trip around the
            course. Listing is free while we get started, and you deal with
            guests directly.
          </p>
          <button className="lux-btn lux-btn-outline" onClick={(): void => navigate('/list-property')}>
            List your home
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B1F17', color: '#F6F5EF', padding: isMobile ? '56px 0 28px' : '80px 0 32px' }}>
        <div className="lux-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1.6fr 1fr 1fr 1fr',
              gap: '40px',
              marginBottom: '56px',
            }}
          >
            <div style={{ gridColumn: isMobile ? '1 / -1' : undefined }}>
              <span className="lux-wordmark" style={{ color: '#F6F5EF' }}>TeeBnB</span>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', lineHeight: 1.7, color: 'rgba(246,245,239,.68)', margin: '16px 0 0', maxWidth: '300px' }}>
                A booking platform built just for golf trips. Stay where you play.
              </p>
            </div>
            {[
              {
                heading: 'Explore',
                links: [
                  { label: 'Browse homes', href: '/search-results' },
                  { label: 'Destinations', href: '/destinations' },
                  { label: 'Become a host', href: '/list-property' },
                ],
              },
              {
                heading: 'Hosting',
                links: [
                  { label: 'How it works', href: '/how-it-works' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Support', href: '/support' },
                ],
              },
              {
                heading: 'Company',
                links: [
                  { label: 'About us', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="lux-eyebrow" style={{ color: '#C7F04A', margin: '0 0 18px', fontSize: '11px' }}>
                  {col.heading}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map(({ label, href }) => (
                    <li key={label} style={{ marginBottom: '10px' }}>
                      <a href={href} className="lux-footer-link">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(246,245,239,.14)', paddingTop: '24px' }}>
            <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '12px', color: 'rgba(246,245,239,.5)', margin: 0 }}>
              © {new Date().getFullYear()} TeeBnB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
