import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Calendar,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Users,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  listing_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  listing?: { property_title: string; full_address: string };
}

interface Listing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  status: string | null;
  cover_image: string | null;
  bedrooms: number;
}

type Tab = 'bookings' | 'listings' | 'upcoming';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

const HostDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch this host's listings first
    const listingsRes = await supabase
      .from('property_listings')
      .select('id, property_title, full_address, nightly_price, status, cover_image, bedrooms')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    const fetchedListings = (listingsRes.data as unknown as Listing[]) || [];
    setListings(fetchedListings);

    // Fetch bookings only for this host's listings
    if (fetchedListings.length > 0) {
      const listingIds = fetchedListings.map((l) => l.id);
      const bookingsRes = await supabase
        .from('bookings')
        .select('*, listing:property_listings(property_title, full_address)')
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false });
      setBookings((bookingsRes.data as unknown as Booking[]) || []);
    } else {
      setBookings([]);
    }

    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', bookingId);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  };

  const deleteListing = async (listingId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('property_listings').delete().eq('id', listingId);
    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } else {
      alert('Failed to delete listing. Please try again.');
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const upcoming = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.check_in) > new Date()
  ).sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'bookings', label: 'All Bookings', badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'listings', label: 'My Listings' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #EDEBE1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{display:'grid',placeItems:'center',width:'36px',height:'36px',borderRadius:'50%',background:'#0B1F17',boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)'}}>
            <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:700,fontSize:'16px',color:'#C8A24B',lineHeight:1}}>T</span>
          </span>
          <h1 style={{fontFamily:"'Archivo',sans-serif",fontWeight:700,fontSize:'18px',color:'#0B1F17',margin:0}}>
            Host Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#0B1F17',
              border: '1px solid #EDEBE1',
              borderRadius: '6px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ← Home
          </button>
          <button
            onClick={() => navigate('/search-results')}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#0B1F17',
              border: '1px solid #EDEBE1',
              borderRadius: '6px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Browse
          </button>
          <div style={{ fontSize: '14px', color: '#0B1F17', fontFamily: "'Archivo', sans-serif", fontWeight: 600 }}>
            {user?.email}
          </div>
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate('/');
            }}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats Row */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Active Listings', value: listings.filter((l) => l.status === 'active').length, icon: Home },
            { label: 'Pending Requests', value: pendingCount, icon: Clock },
            { label: 'Confirmed Stays', value: bookings.filter((b) => b.status === 'confirmed').length, icon: CheckCircle },
            { label: 'Total Revenue', value: `€${confirmedRevenue.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{
                padding: '20px',
                background: '#FFFFFF',
                borderRadius: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: '#DBEAFE',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={24} color="#15794C" />
              </div>
              <div>
                <p style={{
                  fontSize: '24px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 900,
                  color: '#0B1F17',
                  margin: '0 0 4px 0',
                }}>
                  {value}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#5C6B62',
                  margin: 0,
                }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid #EDEBE1',
        }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '12px 16px',
                background: tab === t.id ? '#0B1F17' : 'transparent',
                color: tab === t.id ? '#FFFFFF' : '#5C6B62',
                border: 'none',
                borderRadius: '20px',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {t.label}
              {t.badge != null && (
                <span style={{
                  background: '#FCD34D',
                  color: '#78350F',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '12px',
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
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
        )}

        {/* Bookings tab */}
        {!loading && tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {bookings.length === 0 && (
              <div style={{
                textAlign: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
                color: '#D1D5DB',
              }}>
                <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ margin: 0, fontFamily: "'Hanken Grotesk', sans-serif" }}>No bookings yet. Share your listing to get your first guest!</p>
              </div>
            )}
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
              const filtered = bookings.filter((b) => b.status === status);
              if (filtered.length === 0) return null;
              return (
                <div key={status}>
                  <h3 style={{
                    fontSize: '12px',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    color: '#5C6B62',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px',
                  }}>
                    {status}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onAccept={() => updateBookingStatus(booking.id, 'confirmed')}
                        onDecline={() => updateBookingStatus(booking.id, 'cancelled')}
                        onComplete={() => updateBookingStatus(booking.id, 'completed')}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming tab */}
        {!loading && tab === 'upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcoming.length === 0 && (
              <div style={{
                textAlign: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
                color: '#D1D5DB',
              }}>
                <Trophy size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ margin: 0, fontFamily: "'Hanken Grotesk', sans-serif" }}>No upcoming confirmed stays.</p>
              </div>
            )}
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* Listings tab */}
        {!loading && tab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate('/list-property')}
                style={{
                  padding: '12px 20px',
                  background: '#C7F04A',
                  color: '#0B1F17',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                + Add New Listing
              </button>
            </div>
            {listings.length === 0 && (
              <div style={{
                textAlign: 'center',
                paddingTop: '60px',
                paddingBottom: '60px',
                color: '#D1D5DB',
              }}>
                <Home size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ margin: 0, fontFamily: "'Hanken Grotesk', sans-serif" }}>You haven't listed any properties yet.</p>
              </div>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {listing.cover_image && (
                    <img
                      src={listing.cover_image}
                      alt={listing.property_title}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 700,
                        color: '#0B1F17',
                        margin: 0,
                        lineHeight: '1.3',
                      }}>
                        {listing.property_title}
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        background: '#F0FDF4',
                        color: '#166534',
                        borderRadius: '4px',
                        marginLeft: '8px',
                        whiteSpace: 'nowrap',
                      }}>
                        {listing.status || 'draft'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#5C6B62',
                      marginBottom: '12px',
                      margin: 0,
                    }}>
                      {listing.full_address}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #EDEBE1',
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 700,
                        color: '#15794C',
                      }}>
                        €{listing.nightly_price}/night
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/property/${listing.id}`)}
                          style={{
                            padding: '6px 12px',
                            background: '#FFFFFF',
                            color: '#15794C',
                            border: '1px solid #EDEBE1',
                            borderRadius: '6px',
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate('/list-property', { state: { editListingId: listing.id } })}
                          style={{
                            padding: '6px 12px',
                            background: '#EFF6FF',
                            color: '#1D4ED8',
                            border: '1px solid #BFDBFE',
                            borderRadius: '6px',
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteListing(listing.id, listing.property_title)}
                          style={{
                            padding: '6px 12px',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard = ({
  booking,
  onAccept,
  onDecline,
  onComplete,
}: {
  booking: Booking;
  onAccept?: () => void;
  onDecline?: () => void;
  onComplete?: () => void;
}) => {
  const daysUntilCheckin = Math.ceil(
    (new Date(booking.check_in).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const statusBgColor: Record<string, string> = {
    pending: '#FEF3C7',
    confirmed: '#D1FAE5',
    completed: '#D1E7F0',
    cancelled: '#FEE2E2',
  };

  const statusTextColor: Record<string, string> = {
    pending: '#92400E',
    confirmed: '#065F46',
    completed: '#0C4A6E',
    cancelled: '#991B1B',
  };

  return (
    <div style={{
      background: '#FFFFFF',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              color: '#0B1F17',
            }}>
              {booking.guest_name}
            </span>
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              background: statusBgColor[booking.status] || '#F3F4F6',
              color: statusTextColor[booking.status] || '#6B7280',
              borderRadius: '4px',
            }}>
              {booking.status}
            </span>
            {booking.status === 'confirmed' && daysUntilCheckin > 0 && daysUntilCheckin <= 14 && (
              <span style={{
                fontSize: '12px',
                padding: '4px 8px',
                background: '#D1FAE5',
                color: '#065F46',
                borderRadius: '4px',
              }}>
                Check-in in {daysUntilCheckin} day{daysUntilCheckin !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {booking.listing && (
            <p style={{
              fontSize: '13px',
              color: '#5C6B62',
              margin: 0,
              marginBottom: '4px',
            }}>
              {booking.listing.property_title}
            </p>
          )}
          <p style={{
            fontSize: '12px',
            color: '#A1A9A8',
            margin: 0,
          }}>
            Ref: {booking.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 700,
            color: '#15794C',
            margin: 0,
            marginBottom: '4px',
            fontSize: '16px',
          }}>
            €{booking.total}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#5C6B62',
            margin: 0,
          }}>
            {booking.nights} night{booking.nights !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '13px',
        color: '#5C6B62',
        marginBottom: '12px',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} />
          {format(new Date(booking.check_in), 'd MMM')} – {format(new Date(booking.check_out), 'd MMM yyyy')}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={14} />
          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#5C6B62',
        marginBottom: '12px',
      }}>
        <a
          href={`mailto:${booking.guest_email}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#5C6B62',
            textDecoration: 'none',
          }}
        >
          <Mail size={14} />
          {booking.guest_email}
        </a>
        {booking.guest_phone && (
          <a
            href={`tel:${booking.guest_phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#5C6B62',
              textDecoration: 'none',
            }}
          >
            <Phone size={14} />
            {booking.guest_phone}
          </a>
        )}
      </div>

      {booking.special_requests && (
        <p style={{
          fontSize: '12px',
          fontStyle: 'italic',
          color: '#A1A9A8',
          marginBottom: '12px',
          margin: 0,
        }}>
          "{booking.special_requests}"
        </p>
      )}

      {booking.status === 'pending' && onAccept && onDecline && (
        <>
          <div style={{ borderTop: '1px solid #EDEBE1', margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onAccept}
              style={{
                padding: '8px 12px',
                background: '#15794C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle size={14} />
              Accept
            </button>
            <button
              onClick={onDecline}
              style={{
                padding: '8px 12px',
                background: '#FEE2E2',
                color: '#991B1B',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={14} />
              Decline
            </button>
          </div>
        </>
      )}

      {booking.status === 'confirmed' && onComplete && new Date(booking.check_out) < new Date() && (
        <>
          <div style={{ borderTop: '1px solid #EDEBE1', margin: '12px 0' }} />
          <button
            onClick={onComplete}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#FFFFFF',
              color: '#15794C',
              border: '1px solid #EDEBE1',
              borderRadius: '6px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Mark as Completed
          </button>
        </>
      )}
    </div>
  );
};

export default HostDashboard;
