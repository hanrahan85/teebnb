import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  listing?: { title: string; full_address: string };
}

interface Listing {
  id: string;
  title: string;
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
    const [bookingsRes, listingsRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, listing:property_listings(title, full_address)')
        .eq('property_listings.user_id', user!.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('property_listings')
        .select('id, title, full_address, price_per_night, status, cover_image, bedrooms')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false }),
    ]);

    setBookings((bookingsRes.data as unknown as Booking[]) || []);
    setListings((listingsRes.data as unknown as Listing[]) || []);
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', bookingId);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
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
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Host Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Listings', value: listings.filter((l) => l.status === 'active').length, icon: Home },
            { label: 'Pending Requests', value: pendingCount, icon: Clock },
            { label: 'Confirmed Stays', value: bookings.filter((b) => b.status === 'confirmed').length, icon: CheckCircle },
            { label: 'Total Revenue', value: `€${confirmedRevenue.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-neutral-900">{value}</p>
                  <p className="text-xs text-neutral-500">{label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {t.label}
              {t.badge != null && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Bookings tab */}
        {!loading && tab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 && (
              <div className="text-center py-16 text-neutral-400">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No bookings yet. Share your listing to get your first guest!</p>
              </div>
            )}
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
              const filtered = bookings.filter((b) => b.status === status);
              if (filtered.length === 0) return null;
              return (
                <div key={status}>
                  <h3 className="text-sm font-heading font-semibold text-neutral-500 uppercase tracking-wide mb-3 capitalize">{status}</h3>
                  <div className="space-y-3">
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
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <div className="text-center py-16 text-neutral-400">
                <Trophy className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No upcoming confirmed stays.</p>
              </div>
            )}
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* Listings tab */}
        {!loading && tab === 'listings' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="premium" onClick={() => navigate('/list-property')}>
                + Add New Listing
              </Button>
            </div>
            {listings.length === 0 && (
              <div className="text-center py-16 text-neutral-400">
                <Home className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>You haven't listed any properties yet.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="bg-white overflow-hidden">
                  {listing.cover_image && (
                    <img src={listing.cover_image} alt={listing.title} className="w-full h-36 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading font-semibold text-sm leading-tight">{listing.title}</h3>
                      <Badge variant="outline" className={`text-xs ml-2 ${statusColor[listing.status || 'draft'] || 'bg-gray-100 text-gray-600'}`}>
                        {listing.status || 'draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">{listing.full_address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-emerald-600">€{listing.nightly_price}/night</span>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/property/${listing.id}`)}>View</Button>
                    </div>
                  </div>
                </Card>
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

  return (
    <Card className="bg-white p-5">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold">{booking.guest_name}</span>
            <Badge variant="outline" className={`text-xs ${(statusColor[booking.status] || 'bg-gray-100 text-gray-600')}`}>
              {booking.status}
            </Badge>
            {booking.status === 'confirmed' && daysUntilCheckin > 0 && daysUntilCheckin <= 14 && (
              <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                Check-in in {daysUntilCheckin} day{daysUntilCheckin !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {booking.listing && (
            <p className="text-xs text-neutral-500">{booking.listing.title}</p>
          )}
          <p className="text-xs text-neutral-400 mt-0.5">Ref: {booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="font-heading font-bold text-emerald-600">€{booking.total}</p>
          <p className="text-xs text-neutral-500">{booking.nights} night{booking.nights !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(booking.check_in), 'd MMM')} – {format(new Date(booking.check_out), 'd MMM yyyy')}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-neutral-500 mb-3">
        <a href={`mailto:${booking.guest_email}`} className="flex items-center gap-1 hover:text-neutral-700">
          <Mail className="h-3.5 w-3.5" />{booking.guest_email}
        </a>
        {booking.guest_phone && (
          <a href={`tel:${booking.guest_phone}`} className="flex items-center gap-1 hover:text-neutral-700">
            <Phone className="h-3.5 w-3.5" />{booking.guest_phone}
          </a>
        )}
      </div>

      {booking.special_requests && (
        <p className="text-xs italic text-neutral-400 mb-3">"{booking.special_requests}"</p>
      )}

      {booking.status === 'pending' && onAccept && onDecline && (
        <>
          <Separator className="mb-3" />
          <div className="flex gap-2">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1" onClick={onAccept}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1" onClick={onDecline}>
              <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
            </Button>
          </div>
        </>
      )}

      {booking.status === 'confirmed' && onComplete && new Date(booking.check_out) < new Date() && (
        <>
          <Separator className="mb-3" />
          <Button size="sm" variant="outline" className="w-full" onClick={onComplete}>
            Mark as Completed
          </Button>
        </>
      )}
    </Card>
  );
};

export default HostDashboard;
