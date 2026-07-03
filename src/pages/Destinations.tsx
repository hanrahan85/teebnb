import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const destinations = [
  {
    country: 'Ireland',
    tagline: 'Home of links golf',
    description: 'Stay near legendary links like Portmarnock, Royal County Down and Lahinch. Coastal scenery, warm pubs, and world-class courses around every corner.',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800&h=500&fit=crop',
    courses: ['Portmarnock Golf Club', 'Royal County Down', 'Lahinch Golf Club', 'Old Head Golf Links'],
    flag: '🇮🇪',
  },
  {
    country: 'Scotland',
    tagline: 'Birthplace of golf',
    description: 'Walk the same fairways as legends at St Andrews, Carnoustie and Turnberry. Scotland is where golf began — and it shows in every blade of fescue.',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=500&fit=crop',
    courses: ['St Andrews Links', 'Carnoustie Golf Links', 'Turnberry Resort', 'Muirfield'],
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  },
  {
    country: 'Portugal',
    tagline: 'Sun, sea and fairways',
    description: 'The Algarve\'s stunning clifftop and oceanside courses, coupled with year-round sunshine and superb food, make Portugal Europe\'s top golf travel destination.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=500&fit=crop',
    courses: ['Quinta do Lago', 'Vale do Lobo', 'Penha Longa', 'Royal Óbidos'],
    flag: '🇵🇹',
  },
  {
    country: 'Spain',
    tagline: 'Golf under the Spanish sun',
    description: 'From Costa del Sol to Mallorca, Spain offers over 400 courses with perfect winter escapes. Marbella\'s glamour and world-class golf make it unmissable.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop',
    courses: ['Real Club Valderrama', 'Sotogrande', 'PGA Catalunya', 'Son Gual'],
    flag: '🇪🇸',
  },
  {
    country: 'USA',
    tagline: 'From Pebble to Pinehurst',
    description: 'Tee it up on iconic American courses from Pebble Beach\'s Pacific views to Augusta\'s azaleas. The US offers the most diverse golf travel on the planet.',
    image: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&h=500&fit=crop',
    courses: ['Pebble Beach', 'Augusta National', 'Pinehurst No. 2', 'TPC Sawgrass'],
    flag: '🇺🇸',
  },
  {
    country: 'England',
    tagline: 'Royal and ancient courses',
    description: 'From Royal Birkdale on the Lancashire coast to the Surrey heathland classics, England\'s golf heritage is second to none — with great country house stays to match.',
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=500&fit=crop',
    courses: ['Royal Birkdale', 'Royal St George\'s', 'Wentworth Club', 'Sunningdale'],
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
];

const Destinations = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      <Navigation />

      {/* Hero */}
      <div style={{
        background: '#0B1F17',
        padding: '64px 24px',
        textAlign: 'center',
      }}>
        <p style={{
          color: '#C7F04A',
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Golf Travel
        </p>
        <h1 style={{
          color: '#FFFFFF',
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(32px, 5vw, 56px)',
          margin: '0 0 16px 0',
          lineHeight: 1.1,
        }}>
          Top Golf Destinations
        </h1>
        <p style={{
          color: '#A3B89A',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '18px',
          maxWidth: '560px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>
          Find a home near the world's greatest courses. TeeBnB connects golfers with the perfect stay, wherever your game takes you.
        </p>
        <button
          onClick={() => navigate('/search-results')}
          style={{
            background: '#C7F04A',
            color: '#0B1F17',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '24px',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Browse all stays →
        </button>
      </div>

      {/* Destination cards */}
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
        }}>
          {destinations.map((dest) => (
            <div
              key={dest.country}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
              onClick={() => navigate('/search-results', { state: { location: dest.country } })}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '200px' }}>
                <img
                  src={dest.image}
                  alt={dest.country}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '16px' }}>{dest.flag}</span>
                  <span style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#0B1F17',
                  }}>
                    {dest.country}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <p style={{
                  color: '#15794C',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                }}>
                  {dest.tagline}
                </p>
                <h2 style={{
                  color: '#0B1F17',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 800,
                  fontSize: '20px',
                  margin: '0 0 10px 0',
                }}>
                  {dest.country}
                </h2>
                <p style={{
                  color: '#5C6B62',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.6,
                  margin: '0 0 16px 0',
                }}>
                  {dest.description}
                </p>

                {/* Nearby courses */}
                <div style={{ borderTop: '1px solid #EDEBE1', paddingTop: '14px', marginBottom: '16px' }}>
                  <p style={{
                    color: '#0B1F17',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: '12px',
                    margin: '0 0 8px 0',
                  }}>
                    ⛳ Top nearby courses
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {dest.courses.map((course) => (
                      <span
                        key={course}
                        style={{
                          background: '#F0FAF5',
                          color: '#15794C',
                          fontSize: '11px',
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          border: '1px solid #C7F04A',
                        }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/search-results', { state: { location: dest.country } }); }}
                  style={{
                    width: '100%',
                    background: '#0B1F17',
                    color: '#C7F04A',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Find stays in {dest.country} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        background: '#0B1F17',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{
          color: '#FFFFFF',
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 800,
          fontSize: '28px',
          margin: '0 0 12px 0',
        }}>
          Don't see your destination?
        </h2>
        <p style={{
          color: '#A3B89A',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          margin: '0 0 24px 0',
        }}>
          We're adding new courses and destinations every week. Browse all available stays.
        </p>
        <button
          onClick={() => navigate('/search-results')}
          style={{
            background: '#C7F04A',
            color: '#0B1F17',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '24px',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Browse all stays
        </button>
      </div>
    </div>
  );
};

export default Destinations;
