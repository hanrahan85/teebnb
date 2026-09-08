import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, Calendar, Users, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface SafeBooking {
  reference: string;
  guestName: string;
  guestEmail: string | null;
  guestPhone: string | null;
  specialRequests: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: string;
  erased: boolean;
  property: { title: string; address: string; host: string } | null;
}

const CARD: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #EDEBE1',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
};

const statusStyle: Record<string, { bg: string; fg: string; label: string }> = {
  pending:   { bg: '#FEF3C7', fg: '#92400E', label: 'Awaiting host confirmation' },
  confirmed: { bg: '#D1FAE5', fg: '#065F46', label: 'Confirmed' },
  completed: { bg: '#D1E7F0', fg: '#0C4A6E', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', fg: '#991B1B', label: 'Cancelled' },
};

const ManageBooking = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [booking, setBooking] = useState<SafeBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmErase, setConfirmErase] = useState(false);
  const [erased, setErased] = useState(false);

  const call = useCallback(async (action: string) => {
    const { data, error } = await supabase.functions.invoke('manage-booking', {
      body: { token, action },
    });
    if (error) {
      let message = 'Something went wrong. Please try again.';
      try {
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.json === 'function') {
          const body = await ctx.json();
          message = body?.message || body?.error || message;
        }
      } catch { /* keep generic message */ }
      throw new Error(message);
    }
    return data as { booking?: SafeBooking; erased?: boolean };
  }, [token]);

  useEffect(() => {
    if (!token) { setLoading(false); setNotFound(true); return; }
    (async () => {
      try {
        const data = await call('view');
        if (data.booking) setBooking(data.booking);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, call]);

  const doCancel = async () => {
    setBusy(true);
    try {
      const data = await call('cancel');
      if (data.booking) setBooking(data.booking);
      setConfirmCancel(false);
      toast.success('Your booking has been cancelled. The host has been notified.');
    } catch (e) {
      toast.error((e as Error).message, { duration: 8000 });
    } finally {
      setBusy(false);
    }
  };

  const doErase = async () => {
    setBusy(true);
    try {
      await call('erase');
      setErased(true);
      setConfirmErase(false);
    } catch (e) {
      toast.error((e as Error).message, { duration: 8000 });
    } finally {
      setBusy(false);
    }
  };

  // ── States ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', color: '#5C6B62' }}>
          <Loader2 size={30} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", margin: 0 }}>Finding your booking…</p>
        </div>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '44px', marginBottom: '12px' }}>⛳</div>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '24px', color: '#0B1F17', marginBottom: '10px' }}>
            We couldn't find that booking
          </h1>
          <p style={{ color: '#5C6B62', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, marginBottom: '22px' }}>
            The link may be incomplete or out of date. Check the link in your confirmation email,
            or get in touch and we'll help.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="mailto:darragh@teebnb.com" style={{
              padding: '11px 20px', background: '#C7F04A', color: '#0B1F17',
              borderRadius: '8px', textDecoration: 'none',
              fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
            }}>Contact us</a>
            <button onClick={() => navigate('/')} style={{
              padding: '11px 20px', background: 'transparent', color: '#0B1F17',
              border: '1px solid #EDEBE1', borderRadius: '8px', cursor: 'pointer',
              fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '14px',
            }}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  if (erased || booking.erased) {
    return (
      <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '460px' }}>
          <CheckCircle size={44} color="#15794C" style={{ margin: '0 auto 14px' }} />
          <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '24px', color: '#0B1F17', marginBottom: '10px' }}>
            Your details have been removed
          </h1>
          <p style={{ color: '#5C6B62', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, marginBottom: '18px' }}>
            We've deleted your name, email, phone number and any notes from this booking.
            A confirmation has been sent to you.
          </p>
          <p style={{ color: '#9AA5A0', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6 }}>
            We keep an anonymised record of the stay (dates and amount only) because Irish tax law
            requires transaction records for six years. It can't be linked back to you.
          </p>
        </div>
      </div>
    );
  }

  const st = statusStyle[booking.status] || statusStyle.pending;
  const isCancellable = booking.status === 'pending' || booking.status === 'confirmed';
  const isPast = new Date(booking.checkOut) < new Date();

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      <div style={{ padding: '16px 24px', background: '#FFFFFF', borderBottom: '1px solid #EDEBE1', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ display:'grid', placeItems:'center', width:'34px', height:'34px', borderRadius:'50%', background:'#0B1F17', boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)' }}>
          <span style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'15px', color:'#C8A24B', lineHeight:1 }}>T</span>
        </span>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '17px', color: '#0B1F17', margin: 0 }}>
          Manage your booking
        </h1>
      </div>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Summary */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#9AA5A0', margin: '0 0 4px', fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: '.5px' }}>
                REFERENCE
              </p>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '20px', color: '#0B1F17', margin: 0 }}>
                TB-{booking.reference}
              </p>
            </div>
            <span style={{ background: st.bg, color: st.fg, padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap' }}>
              {st.label}
            </span>
          </div>

          {booking.property && (
            <>
              <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '17px', color: '#0B1F17', margin: '0 0 6px' }}>
                {booking.property.title}
              </h2>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5C6B62', fontSize: '14px', fontFamily: "'Hanken Grotesk', sans-serif", margin: '0 0 18px' }}>
                <MapPin size={14} /> {booking.property.address}
              </p>
            </>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '16px', borderTop: '1px solid #EDEBE1', color: '#3A4A41', fontSize: '14px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#15794C" />
              {format(new Date(booking.checkIn), 'd MMM')} – {format(new Date(booking.checkOut), 'd MMM yyyy')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#15794C" />
              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: "'Archivo', sans-serif", fontWeight: 700, color: '#15794C' }}>
              €{Number(booking.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Cancel */}
        {isCancellable && (
          <div style={CARD}>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '16px', color: '#0B1F17', margin: '0 0 4px' }}>
              Need to cancel?
            </h2>
            <p style={{ color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, margin: '0 0 16px' }}>
              Free cancellation up to 48 hours before check-in. Your host will be notified straight away.
            </p>

            {!confirmCancel ? (
              <button onClick={() => setConfirmCancel(true)} style={{
                padding: '10px 18px', background: '#FFFFFF', color: '#991B1B',
                border: '1px solid #FECACA', borderRadius: '8px', cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
              }}>
                Cancel this booking
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={doCancel} disabled={busy} style={{
                  padding: '10px 18px', background: '#DC2626', color: '#FFF', border: 'none',
                  borderRadius: '8px', cursor: busy ? 'not-allowed' : 'pointer',
                  fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}>
                  {busy && <Loader2 size={14} className="animate-spin" />}
                  Yes, cancel it
                </button>
                <button onClick={() => setConfirmCancel(false)} disabled={busy} style={{
                  padding: '10px 18px', background: 'transparent', color: '#5C6B62',
                  border: '1px solid #EDEBE1', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '14px',
                }}>
                  Keep it
                </button>
              </div>
            )}
          </div>
        )}

        {/* Your data */}
        <div style={CARD}>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '16px', color: '#0B1F17', margin: '0 0 4px' }}>
            Your personal data
          </h2>
          <p style={{ color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, margin: '0 0 14px' }}>
            This is everything we hold about you for this booking.
          </p>

          <div style={{ background: '#F6F5EF', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '14px', fontFamily: "'Hanken Grotesk', sans-serif", color: '#3A4A41', lineHeight: 1.9 }}>
            <div><strong>Name:</strong> {booking.guestName}</div>
            {booking.guestEmail && <div><strong>Email:</strong> {booking.guestEmail}</div>}
            {booking.guestPhone && <div><strong>Phone:</strong> {booking.guestPhone}</div>}
            {booking.specialRequests && <div><strong>Notes:</strong> {booking.specialRequests}</div>}
          </div>

          {!isPast && isCancellable ? (
            <p style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#92400E', background: '#FEF3C7', padding: '12px', borderRadius: '8px', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.5, margin: 0 }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>Your host needs these details for your upcoming stay. Cancel the booking first if you'd like them removed.</span>
            </p>
          ) : !confirmErase ? (
            <button onClick={() => setConfirmErase(true)} style={{
              padding: '10px 18px', background: '#FFFFFF', color: '#991B1B',
              border: '1px solid #FECACA', borderRadius: '8px', cursor: 'pointer',
              fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
            }}>
              Remove my details
            </button>
          ) : (
            <div>
              <p style={{ color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6, marginBottom: '12px' }}>
                We'll delete your name, email, phone and notes. We keep an anonymised record of the
                stay (dates and amount only) because Irish tax law requires it for six years —
                it won't be linked to you. This can't be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={doErase} disabled={busy} style={{
                  padding: '10px 18px', background: '#DC2626', color: '#FFF', border: 'none',
                  borderRadius: '8px', cursor: busy ? 'not-allowed' : 'pointer',
                  fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}>
                  {busy && <Loader2 size={14} className="animate-spin" />}
                  Delete my details
                </button>
                <button onClick={() => setConfirmErase(false)} disabled={busy} style={{
                  padding: '10px 18px', background: 'transparent', color: '#5C6B62',
                  border: '1px solid #EDEBE1', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: '14px',
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#9AA5A0', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Need help? <a href="mailto:darragh@teebnb.com" style={{ color: '#15794C', fontWeight: 600 }}>darragh@teebnb.com</a>
        </p>
      </div>
    </div>
  );
};

export default ManageBooking;
