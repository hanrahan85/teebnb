import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';

interface Trip {
  id: string;
  listing_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total: number;
  status: string;
  created_at: string;
  listing?: {
    property_title: string;
    cover_image?: string | null;
    full_address?: string;
  };
}

type TabType = 'upcoming' | 'past' | 'cancelled';

const Trips = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>('upcoming');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, listing:property_listings(*)')
      .eq('guest_user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTrips(data as unknown as Trip[]);
    }
    setLoading(false);
  };

  const upcomingTrips = trips.filter(
    (t) => new Date(t.check_in) > new Date() && t.status !== 'cancelled'
  );
  const pastTrips = trips.filter(
    (t) => new Date(t.check_out) <= new Date() && t.status !== 'cancelled'
  );
  const cancelledTrips = trips.filter((t) => t.status === 'cancelled');

  const tabTrips: Record<TabType, Trip[]> = {
    upcoming: upcomingTrips,
    past: pastTrips,
    cancelled: cancelledTrips,
  };

  const displayTrips = tabTrips[tab];

  // Sample trips if no real bookings
  const sampleTrips: Trip[] = !user
    ? [
        {
          id: '1',
          listing_id: '1',
          check_in: new Date(2025, 6, 16).toISOString().split('T')[0],
          check_out: new Date(2025, 6, 19).toISOString().split('T')[0],
          guests: 2,
          total: 1920,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          listing: {
            property_title: 'The Fairway House',
            cover_image: null,
            full_address: 'Monterey, CA',
          },
        },
      ]
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #EDEBE1',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={() => navigate('/')}
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
          <ChevronLeft size={24} color="#0B1F17" />
        </button>
        <span style={{display:'grid',placeItems:'center',width:'36px',height:'36px',borderRadius:'50%',background:'#0B1F17',boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)'}}>
          <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:700,fontSize:'16px',color:'#C8A24B',lineHeight:1}}>T</span>
        </span>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          color: '#0B1F17',
          margin: 0,
        }}>
          My Trips
        </h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {!user ? (
          <div style={{
            textAlign: 'center',
            paddingTop: '60px',
            paddingBottom: '60px',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              color: '#0B1F17',
              marginBottom: '16px',
            }}>
              Sign in to see your trips
            </h2>
            <button
              onClick={() => navigate('/auth')}
              style={{
                padding: '12px 24px',
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
              Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '32px',
              borderBottom: '1px solid #EDEBE1',
            }}>
              {(['upcoming', 'past', 'cancelled'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '12px 16px',
                    background: tab === t ? '#0B1F17' : 'transparent',
                    color: tab === t ? '#FFFFFF' : '#5C6B62',
                    border: 'none',
                    borderRadius: '20px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '4px solid #EDEBE1',
                  borderTopColor: '#15794C',
                  animation: 'spin 1s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : displayTrips.length === 0 ? (
              <div style={{
                textAlign: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
                color: '#D1D5DB',
              }}>
                <p style={{
                  margin: 0,
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '16px',
                }}>
                  Your {tab} bookings will appear here
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {displayTrips.map((trip) => (
                  <div
                    key={trip.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '200px',
                      height: '160px',
                      flexShrink: 0,
                      background: trip.listing?.cover_image ? `url(${trip.listing.cover_image})` : '#D1D5DB',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />

                    {/* Content */}
                    <div style={{
                      padding: '20px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 700,
                          color: '#0B1F17',
                          margin: '0 0 8px 0',
                        }}>
                          {trip.listing?.property_title || 'Property'}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#5C6B62',
                          margin: '0 0 12px 0',
                        }}>
                          {trip.listing?.full_address || 'Location'}
                        </p>
                        <div style={{
                          fontSize: '14px',
                          color: '#5C6B62',
                          display: 'flex',
                          gap: '16px',
                        }}>
                          <span>
                            {format(new Date(trip.check_in), 'd MMM')} – {format(new Date(trip.check_out), 'd MMM yyyy')}
                          </span>
                          <span>{trip.guests} guest{trip.guests !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #EDEBE1',
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 900,
                          color: '#0B1F17',
                        }}>
                          €{trip.total}
                        </span>
                        <button
                          onClick={() => navigate(`/property/${trip.listing_id}`)}
                          style={{
                            padding: '8px 16px',
                            background: '#15794C',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sample trips message */}
            {displayTrips.length === 0 && sampleTrips.length > 0 && (
              <div style={{
                marginTop: '32px',
                padding: '16px',
                background: '#FEF3C7',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#92400E',
              }}>
                Sample bookings shown above. Your actual bookings will appear here.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Trips;
