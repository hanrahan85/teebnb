import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import { Heart } from 'lucide-react';

interface Listing {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  tag: string;
  specs: string;
}

const HomePage = () => {
  const navigate = useNavigate();

  const listings: Listing[] = [
    {
      id: 1,
      name: 'Fairway House',
      location: 'Monterey, CA',
      price: 640,
      rating: 4.9,
      reviews: 142,
      tag: 'Featured',
      specs: '4 bed • 2 bath',
    },
    {
      id: 2,
      name: 'Old Course Loft',
      location: 'St Andrews, Scotland',
      price: 310,
      rating: 4.95,
      reviews: 289,
      tag: 'Best Rated',
      specs: '2 bed • 1 bath',
    },
    {
      id: 3,
      name: 'Cedar Ridge Cabin',
      location: 'Queenstown, NZ',
      price: 280,
      rating: 4.85,
      reviews: 156,
      tag: 'Great Value',
      specs: '3 bed • 2 bath',
    },
    {
      id: 4,
      name: 'Casa del Green',
      location: 'Los Cabos, Mexico',
      price: 520,
      rating: 4.88,
      reviews: 203,
      tag: 'Luxury',
      specs: '5 bed • 3 bath',
    },
    {
      id: 5,
      name: 'Sakura Villa',
      location: 'Hokkaido, Japan',
      price: 340,
      rating: 4.92,
      reviews: 178,
      tag: 'Exclusive',
      specs: '4 bed • 2 bath',
    },
    {
      id: 6,
      name: 'Cliffside Casita',
      location: 'Faro, Portugal',
      price: 210,
      rating: 4.80,
      reviews: 134,
      tag: 'Budget',
      specs: '2 bed • 1 bath',
    },
    {
      id: 7,
      name: 'Saguaro Retreat',
      location: 'Phoenix, AZ',
      price: 260,
      rating: 4.87,
      reviews: 167,
      tag: 'Desert',
      specs: '3 bed • 2 bath',
    },
    {
      id: 8,
      name: 'Loch Aria Cottage',
      location: 'County Kerry, Ireland',
      price: 300,
      rating: 4.91,
      reviews: 198,
      tag: 'Lakeside',
      specs: '3 bed • 2 bath',
    },
  ];

  const [savedListings, setSavedListings] = React.useState<number[]>([]);

  const toggleSave = (id: number): void => {
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
            paddingTop: '96px',
            paddingBottom: '64px',
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
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#C7F04A',
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              8,400+
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#C7F04A',
                fontFamily: "'Hanken Grotesk', sans-serif",
                marginTop: '4px',
              }}
            >
              Homes near courses
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#C7F04A',
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              60
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#C7F04A',
                fontFamily: "'Hanken Grotesk', sans-serif",
                marginTop: '4px',
              }}
            >
              Countries
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#C7F04A',
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              4.9★
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#C7F04A',
                fontFamily: "'Hanken Grotesk', sans-serif",
                marginTop: '4px',
              }}
            >
              Avg. guest rating
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#C7F04A',
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              $0
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#C7F04A',
                fontFamily: "'Hanken Grotesk', sans-serif",
                marginTop: '4px',
              }}
            >
              Host listing fees
            </div>
          </div>
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
                onClick={(): void => navigate('/search-results')}
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
                    src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop"
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

                  {/* Tag Badge */}
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
                    <span style={{ color: '#C7F04A', fontSize: '14px' }}>★</span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#0B1F17',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {listing.rating}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#5C6B62',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                    >
                      ({listing.reviews} reviews)
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
                      ${listing.price}
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
              { number: '02', title: 'Book direct with owners', description: 'Secure your stay with verified hosts' },
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
              Guest favorite
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
                $640/night
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
            world. Join thousands of successful hosts.
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
                The world's leading platform for golf accommodation. Stay where you
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
                  { label: 'Destinations', href: '/search-results' },
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