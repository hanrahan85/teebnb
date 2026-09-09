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
    { id: 1, name: 'Fairway House', location: 'Monterey, CA', price: 640, rating: 4.9, reviews: 142, tag: 'Sample', specs: '4 bed • 2 bath', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop' },
    { id: 2, name: 'Old Course Loft', location: 'St Andrews, Scotland', price: 310, rating: 4.95, reviews: 289, tag: 'Sample', specs: '2 bed • 1 bath', image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=600&h=400&fit=crop' },
    { id: 3, name: 'Cedar Ridge Cabin', location: 'Queenstown, NZ', price: 280, rating: 4.85, reviews: 156, tag: 'Sample', specs: '3 bed • 2 bath', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop' },
    { id: 4, name: 'Casa del Green', location: 'Los Cabos, Mexico', price: 520, rating: 4.88, reviews: 203, tag: 'Sample', specs: '5 bed • 3 bath', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop' },
    { id: 5, name: 'Sakura Villa', location: 'Hokkaido, Japan', price: 340, rating: 4.92, reviews: 178, tag: 'Sample', specs: '4 bed • 2 bath', image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&h=400&fit=crop' },
    { id: 6, name: 'Cliffside Casita', location: 'Faro, Portugal', price: 210, rating: 4.80, reviews: 134, tag: 'Sample', specs: '2 bed • 1 bath', image: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=400&fit=crop' },
    { id: 7, name: 'Saguaro Retreat', location: 'Phoenix, AZ', price: 260, rating: 4.87, reviews: 167, tag: 'Sample', specs: '3 bed • 2 bath', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop' },
    { id: 8, name: 'Loch Aria Cottage', location: 'County Kerry, Ireland', price: 300, rating: 4.91, reviews: 198, tag: 'Sample', specs: '3 bed • 2 bath', image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=600&h=400&fit=crop' },
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
          ].filter(Boolean).join(' • ')
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

  const toggleSave = (id: number | string): void => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      <Navigation />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: `url('https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%2014th,%2015th%20and%2016th%20holes%20at%20Portmarnock%20Golf%20Club,%20Ireland.jpg?width=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          overflow: 'hidden',
        }}
      >
        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            paddingTop: isMobile ? '80px' : '96px',
            paddingBottom: isMobile ? '40px' : '64px',
            padding: isMobile ? '80px 16px 40px' : '96px 32px 64px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '1280px',
              width: '100%',
            }}
          >
            {/* Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-block',
                  borderRadius: '20px',
                  border: '2px solid #C7F04A',
                  color: '#C7F04A',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
              >
                Homes on the world's best fairways
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(42px, 8vw, 92px)',
                color: 'white',
                lineHeight: 0.96,
                marginBottom: '20px',
                letterSpacing: '-.02em',
              }}
            >
              Stay steps from the tee.
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: "'Hanken Grotesk', sans-serif",
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px',
              }}
            >
              Book privately-owned homes, villas, and condos right beside the
              courses you came to play...
            </p>

            {/* Search Bar */}
            <div style={{ width: '100%', marginBottom: '40px' }}>
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '40px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px',
              animation: 'bounce 2s infinite',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '12px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          background: '#0B1F17',
          padding: '40px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          {/* Propositions, not metrics. Every line here must stay true —
              no counts or ratings until they can be read from real data. */}
          {[
            { headline: '€0', caption: 'To list your place' },
            { headline: 'Golf only', caption: 'Built for one kind of trip' },
            { headline: 'Direct', caption: 'Book with the owner' },
            { headline: 'Ireland', caption: 'Launching here first' },
          ].map(({ headline, caption }) => (
            <div key={caption} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#C7F04A',
                  fontFamily: "'Archivo', sans-serif",
                }}
              >
                {headline}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#C7F04A',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  marginTop: '4px',
                }}
              >
                {caption}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section
        style={{
          background: '#F6F5EF',
          padding: '80px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 800,
                fontSize: '36px',
                color: '#0B1F17',
                marginBottom: '20px',
                letterSpacing: '-.02em',
              }}
            >
              Homes hosted by golfers
            </h2>

            {/* Region Filter Pills */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['All', 'North America', 'Europe', 'Asia-Pacific'].map((region) => (
                <button
                  key={region}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #15794C',
                    background: 'transparent',
                    color: '#15794C',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  onClick={(): void => {}}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {loadingListings && (
              <p style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                color: '#5C6B62',
                fontFamily: "'Hanken Grotesk', sans-serif",
                padding: '32px 0',
                margin: 0,
              }}>
                Loading stays…
              </p>
            )}
            {listings.map((listing) => (
              <div
                key={listing.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onClick={(): void =>
                  listing.isReal
                    ? navigate(`/property/${listing.id}`)
                    : navigate('/search-results')
                }
                onMouseEnter={(e): void => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 12px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e): void => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                {/* Image Container */}
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '75%',
                    overflow: 'hidden',
                    background: '#EDEBE1',
                  }}
                >
                  <img
                    src={listing.image}
                    alt={listing.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Course badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#0B1F17',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {listing.tag}
                  </span>

                  {/* Sample badge — demo properties must never read as real inventory */}
                  {!listing.isReal && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '52px',
                        background: '#F5C518',
                        color: '#0B1F17',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 700,
                        letterSpacing: '.3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Sample
                    </span>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e): void => {
                      e.stopPropagation();
                      toggleSave(listing.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <Heart
                      size={20}
                      fill={savedListings.includes(listing.id) ? '#C7F04A' : 'none'}
                      color={savedListings.includes(listing.id) ? '#C7F04A' : '#0B1F17'}
                    />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#0B1F17',
                      marginBottom: '4px',
                    }}
                  >
                    {listing.name}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: listing.isReal ? '#166534' : '#3A4A41',
                        background: listing.isReal ? '#F0FDF4' : '#EDEBE1',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {listing.isReal ? listing.tag : 'Sample listing'}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#5C6B62',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      marginBottom: '8px',
                    }}
                  >
                    {listing.location}
                  </p>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#8A968E',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      marginBottom: '12px',
                    }}
                  >
                    {listing.specs}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#0B1F17',
                      }}
                    >
                      €{listing.price}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#5C6B62',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                    >
                      /night
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          background: '#EDEBE1',
          padding: '80px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 800,
                fontSize: '36px',
                color: '#0B1F17',
                marginBottom: '16px',
                letterSpacing: '-.02em',
              }}
            >
              Your home base for the whole trip.
            </h2>
          </div>

          {/* Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              { number: '01', title: 'Find your spot', description: 'Browse homes near world-class golf courses' },
              { number: '02', title: 'Book direct with owners', description: 'Deal with the owner, not a call centre' },
              { number: '03', title: 'Unpack & play', description: 'Enjoy your golf vacation from day one' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: '56px',
                    color: '#C7F04A',
                    textShadow: '2px 2px 0 #0B1F17',
                    marginBottom: '16px',
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#0B1F17',
                    marginBottom: '12px',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#5C6B62',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Property */}
      <section
        style={{
          background: '#F6F5EF',
          padding: '80px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Image */}
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '1',
              background: '#EDEBE1',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1672825952732-ecef34882416?w=1100&q=70&auto=format&fit=crop"
              alt="The Fairway House"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Content */}
          <div>
            <span
              style={{
                display: 'inline-block',
                background: '#15794C',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              Sample listing
            </span>

            <h2
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 800,
                fontSize: '36px',
                color: '#0B1F17',
                marginBottom: '16px',
                letterSpacing: '-.02em',
              }}
            >
              The Fairway House
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: '#5C6B62',
                fontFamily: "'Hanken Grotesk', sans-serif",
                lineHeight: 1.7,
                marginBottom: '24px',
              }}
            >
              A stunning oceanfront property with direct access to Pebble Beach Golf
              Links. Featuring 4 spacious bedrooms, a gourmet kitchen, and a private
              terrace overlooking the Pacific coast. Perfect for golf groups seeking
              luxury and convenience.
            </p>

            {/* Feature Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              {['Private pool', 'Golf cart access', 'Chef services', 'Wine cellar'].map(
                (feature) => (
                  <span
                    key={feature}
                    style={{
                      background: '#EDEBE1',
                      color: '#0B1F17',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {feature}
                  </span>
                )
              )}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={(): void => navigate('/search-results')}
                style={{
                  background: '#0B1F17',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                View home
              </button>
              <span
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#0B1F17',
                }}
              >
                €640/night
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section
        style={{
          background: '#C7F04A',
          padding: '60px 16px',
          borderRadius: '16px',
          margin: '0 16px 80px',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 800,
              fontSize: '32px',
              color: '#0B1F17',
              marginBottom: '12px',
              letterSpacing: '-.02em',
            }}
          >
            Live near a course? List it on TeeBnB.
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#0B1F17',
              fontFamily: "'Hanken Grotesk', sans-serif",
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            Earn extra income by sharing your home with golfers from around the
            world. Listing is free while we get started.
          </p>

          <button
            onClick={(): void => navigate('/list-property')}
            style={{
              background: '#0B1F17',
              color: '#C7F04A',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            List your place →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#0B1F17',
          color: 'white',
          padding: '64px 16px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#EDEBE1',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#C8A24B',
                    lineHeight: 1,
                  }}
                >
                  T
                </span>
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 800,
                    fontSize: '18px',
                    color: '#C7F04A',
                    letterSpacing: '-.02em',
                  }}
                >
                  TeeBnB
                </span>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: '#5C6B62',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                A booking platform built just for golf trips. Stay where you
                play.
              </p>
            </div>

            {/* Explore Column */}
            <div>
              <h4
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#C7F04A',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Explore
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Browse homes', href: '/search-results' },
                  { label: 'Destinations', href: '/destinations' },
                  { label: 'Become a host', href: '/list-property' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '8px' }}>
                    <a
                      href={href}
                      style={{
                        color: '#5C6B62',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                      onMouseEnter={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#C7F04A';
                      }}
                      onMouseLeave={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#5C6B62';
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hosting Column */}
            <div>
              <h4
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#C7F04A',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Hosting
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'How it works', href: '/how-it-works' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Support', href: '/support' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '8px' }}>
                    <a
                      href={href}
                      style={{
                        color: '#5C6B62',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                      onMouseEnter={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#C7F04A';
                      }}
                      onMouseLeave={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#5C6B62';
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#C7F04A',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'About us', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                ].map(({ label, href }) => (
                  <li key={label} style={{ marginBottom: '8px' }}>
                    <a
                      href={href}
                      style={{
                        color: '#5C6B62',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                      onMouseEnter={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#C7F04A';
                      }}
                      onMouseLeave={(e): void => {
                        (e.currentTarget as HTMLElement).style.color = '#5C6B62';
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div
            style={{
              borderTop: '1px solid rgba(199, 240, 74, 0.1)',
              paddingTop: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: '#5C6B62',
                fontFamily: "'Hanken Grotesk', sans-serif",
              }}
            >
              © 2024 TeeBnB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: translateY(4px);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;