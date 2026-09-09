import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, MapPin, Users, BedDouble, Check, X, ExternalLink } from 'lucide-react';

/**
 * Listing review queue.
 *
 * New listings are created with status 'pending_review'. Public queries filter
 * on status = 'active', so nothing appears on the site until approved here.
 *
 * Access is enforced in the database, not here — the admins table plus RLS
 * policies decide who can read pending listings or change status. This page
 * just hides the UI from non-admins.
 */

interface PendingListing {
  id: string;
  property_title: string;
  full_address: string;
  nightly_price: number;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  cover_image: string | null;
  photos: string[] | null;
  description: string | null;
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  nearby_golf_courses: string | string[] | null;
  status: string;
  created_at: string;
}

const AdminReview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending_review' | 'active' | 'rejected'>('pending_review');

  // Check admin membership against the database rather than trusting the client.
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    (async () => {
      const { data } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .maybeSingle();
      setIsAdmin(Boolean(data));
    })();
  }, [user]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false });
    if (error) toast.error(`Could not load listings: ${error.message}`);
    setListings((data as unknown as PendingListing[]) || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (isAdmin) fetchListings();
  }, [isAdmin, fetchListings]);

  const setStatus = async (id: string, status: string, label: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('property_listings')
      .update({ status })
      .eq('id', id);
    setBusyId(null);
    if (error) { toast.error(`Failed: ${error.message}`); return; }
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast.success(label);
  };

  if (isAdmin === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'grid', placeItems: 'center' }}>
        <Loader2 size={28} className="animate-spin" color="#15794C" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⛳</div>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '22px', color: '#0B1F17', marginBottom: '8px' }}>
            Not found
          </h1>
          <p style={{ color: '#5C6B62', fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: '18px' }}>
            This page doesn't exist, or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px', background: '#C7F04A', color: '#0B1F17',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: typeof filter; label: string }[] = [
    { id: 'pending_review', label: 'Awaiting review' },
    { id: 'active', label: 'Published' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      <div style={{
        padding: '16px 24px', background: '#FFFFFF', borderBottom: '1px solid #EDEBE1',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display:'grid', placeItems:'center', width:'34px', height:'34px', borderRadius:'50%', background:'#0B1F17', boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)' }}>
            <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'15px', color:'#C8A24B', lineHeight:1 }}>T</span>
          </span>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '17px', color: '#0B1F17', margin: 0 }}>
            Listing review
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '8px 16px', background: 'transparent', color: '#0B1F17',
            border: '1px solid #EDEBE1', borderRadius: '6px', cursor: 'pointer',
            fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '14px',
          }}
        >
          Dashboard
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px 64px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                padding: '9px 16px',
                background: filter === t.id ? '#0B1F17' : 'transparent',
                color: filter === t.id ? '#FFFFFF' : '#5C6B62',
                border: filter === t.id ? 'none' : '1px solid #EDEBE1',
                borderRadius: '20px', cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '14px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Loader2 size={26} className="animate-spin" color="#15794C" />
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 0', color: '#9AA5A0' }}>
            <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", margin: 0 }}>
              {filter === 'pending_review'
                ? 'Nothing waiting for review.'
                : `No ${filter === 'active' ? 'published' : 'rejected'} listings.`}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {listings.map((l) => {
            const photos = l.photos || [];
            const courses = Array.isArray(l.nearby_golf_courses)
              ? l.nearby_golf_courses.join(', ')
              : l.nearby_golf_courses;

            return (
              <div key={l.id} style={{
                background: '#FFFFFF', border: '1px solid #EDEBE1',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                {/* Photo strip — the most common reason to reject */}
                {photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '2px', background: '#EDEBE1', overflowX: 'auto' }}>
                    {photos.slice(0, 6).map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt={`${l.property_title} photo ${i + 1}`}
                        style={{ width: '150px', height: '100px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '17px', color: '#0B1F17', margin: '0 0 4px' }}>
                        {l.property_title}
                      </h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", margin: 0 }}>
                        <MapPin size={13} /> {l.full_address}
                      </p>
                    </div>
                    <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '18px', color: '#15794C', whiteSpace: 'nowrap' }}>
                      €{l.nightly_price}<span style={{ fontSize: '12px', fontWeight: 500, color: '#5C6B62' }}>/night</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: '12px' }}>
                    {l.max_guests && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={13} /> {l.max_guests} guests</span>}
                    {l.bedrooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BedDouble size={13} /> {l.bedrooms} bed · {l.bathrooms} bath</span>}
                    {courses && <span>⛳ {courses}</span>}
                  </div>

                  {l.description && (
                    <p style={{ color: '#3A4A41', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, margin: '0 0 12px', maxHeight: '76px', overflow: 'hidden' }}>
                      {l.description}
                    </p>
                  )}

                  <div style={{ background: '#F6F5EF', borderRadius: '8px', padding: '11px', marginBottom: '14px', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", color: '#3A4A41' }}>
                    <strong>{l.host_name || 'Unnamed host'}</strong>
                    {l.host_email && <> · {l.host_email}</>}
                    {l.host_phone && <> · {l.host_phone}</>}
                    <span style={{ color: '#9AA5A0' }}> · submitted {new Date(l.created_at).toLocaleDateString('en-IE')}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => window.open(`/property/${l.id}`, '_blank')}
                      style={{
                        padding: '9px 14px', background: '#FFFFFF', color: '#15794C',
                        border: '1px solid #EDEBE1', borderRadius: '8px', cursor: 'pointer',
                        fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '13px',
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <ExternalLink size={13} /> Preview
                    </button>

                    {filter !== 'active' && (
                      <button
                        onClick={() => setStatus(l.id, 'active', `${l.property_title} is now live`)}
                        disabled={busyId === l.id}
                        style={{
                          padding: '9px 16px', background: '#C7F04A', color: '#0B1F17',
                          border: 'none', borderRadius: '8px',
                          cursor: busyId === l.id ? 'not-allowed' : 'pointer',
                          fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '13px',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}
                      >
                        {busyId === l.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                        Approve &amp; publish
                      </button>
                    )}

                    {filter !== 'rejected' && (
                      <button
                        onClick={() => setStatus(l.id, 'rejected', 'Listing rejected')}
                        disabled={busyId === l.id}
                        style={{
                          padding: '9px 16px', background: '#FFFFFF', color: '#991B1B',
                          border: '1px solid #FECACA', borderRadius: '8px',
                          cursor: busyId === l.id ? 'not-allowed' : 'pointer',
                          fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '13px',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}
                      >
                        <X size={14} /> Reject
                      </button>
                    )}

                    {filter === 'active' && (
                      <button
                        onClick={() => setStatus(l.id, 'pending_review', 'Moved back to review')}
                        disabled={busyId === l.id}
                        style={{
                          padding: '9px 16px', background: 'transparent', color: '#5C6B62',
                          border: '1px solid #EDEBE1', borderRadius: '8px', cursor: 'pointer',
                          fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '13px',
                        }}
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminReview;
