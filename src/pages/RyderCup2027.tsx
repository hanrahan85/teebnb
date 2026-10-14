import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { getAttribution } from '@/lib/attribution';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Ryder Cup 2027 (Adare Manor) landing page. Copy approved by Darragh on
 * 14 Oct 2026 (CMO thread; source: teebnb/marketing/ryder-cup-2027-page-draft.md).
 * Both forms email darragh@teebnb.com through the send-enquiry edge function,
 * with the visitor's utm_source/campaign so submissions can be counted per source.
 */

const CARAGH_LAKE_ID = '97aeb7b3-4b67-4479-8f54-473f8669c2f5';

const body: React.CSSProperties = {
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontSize: '17px',
  lineHeight: 1.75,
  color: '#3A4A41',
  margin: '0 0 18px',
};

const label: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '13px',
  color: '#0B1F17',
  marginBottom: '6px',
};

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  border: '1px solid #D9D6C9',
  borderRadius: '2px',
  background: '#fff',
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontSize: '16px',
  color: '#0B1F17',
};

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

const GROUP_FIELDS: Field[] = [
  { name: 'Group size', label: 'Group size', type: 'number', required: true },
  { name: 'Arrival', label: 'Arrival date', type: 'date', required: true },
  { name: 'Departure', label: 'Departure date', type: 'date', required: true },
  { name: 'Nights', label: 'Number of nights', type: 'number', required: true },
  { name: 'Budget for the week', label: 'Budget for the week', required: true, placeholder: 'e.g. €15,000 for the group' },
  { name: 'Max drive from Adare', label: 'Max drive from Adare (optional)', placeholder: 'e.g. 90 minutes' },
  { name: 'Name', label: 'Your name', required: true },
  { name: 'Email', label: 'Email', type: 'email', required: true },
  { name: 'Anything else', label: 'Anything else', type: 'textarea' },
];

const OWNER_FIELDS: Field[] = [
  { name: 'Property name', label: 'Property name', required: true },
  { name: 'Town and county', label: 'Town and county', required: true },
  { name: 'Bedrooms', label: 'Bedrooms', type: 'number', required: true },
  { name: 'Sleeps', label: 'Sleeps', type: 'number', required: true },
  { name: 'Minimum stay', label: 'Minimum stay', required: true, placeholder: 'e.g. 7 nights' },
  { name: 'Asking price for the week', label: 'Asking price for the week (optional)' },
  { name: 'Name', label: 'Your name', required: true },
  { name: 'Email', label: 'Email', type: 'email', required: true },
  { name: 'Phone', label: 'Phone', type: 'tel', required: true },
];

const EnquiryForm: React.FC<{
  form: 'adare-group' | 'adare-owner';
  fields: Field[];
  submitLabel: string;
  event: string;
}> = ({ form, fields, submitLabel, event }) => {
  const isMobile = useIsMobile();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fields.forEach((f) => { values[f.name] = String(data.get(f.name) ?? ''); });
    const attribution = getAttribution();
    setState('sending');
    const { error } = await supabase.functions.invoke('send-enquiry', {
      body: { form, fields: values, attribution, website: data.get('website') },
    });
    if (error) {
      setState('error');
      return;
    }
    track(event, { source: attribution.utm_source || attribution.referrer || 'direct' });
    setState('sent');
  };

  if (state === 'sent') {
    return (
      <div style={{ background: '#fff', border: '1px solid #EDEBE1', padding: '28px' }}>
        <p style={{ ...body, margin: 0, color: '#0B1F17', fontWeight: 600 }}>Thanks, we've got it.</p>
        <p style={{ ...body, margin: '8px 0 0' }}>We'll email you back ourselves.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '18px',
        background: '#fff',
        border: '1px solid #EDEBE1',
        padding: isMobile ? '22px 16px' : '32px',
      }}
    >
      {fields.map((f) => (
        <div key={f.name} style={{ gridColumn: f.type === 'textarea' ? '1 / -1' : undefined }}>
          <label style={label} htmlFor={`${form}-${f.name}`}>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea id={`${form}-${f.name}`} name={f.name} rows={4} style={{ ...input, resize: 'vertical' }} />
          ) : (
            <input
              id={`${form}-${f.name}`}
              name={f.name}
              type={f.type || 'text'}
              required={f.required}
              placeholder={f.placeholder}
              min={f.type === 'number' ? 1 : undefined}
              style={input}
            />
          )}
        </div>
      ))}
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" className="lux-btn lux-btn-dark" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : submitLabel}
        </button>
        {state === 'error' && (
          <p style={{ ...body, margin: '14px 0 0', color: '#A33B2B', fontSize: '15px' }}>
            That didn't send. Please try again, or email{' '}
            <a href="mailto:darragh@teebnb.com" style={{ color: '#15794C' }}>darragh@teebnb.com</a>.
          </p>
        )}
      </div>
    </form>
  );
};

const RyderCup2027: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [caragh, setCaragh] = useState<{ bedrooms: number | null; max_guests: number | null } | null>(null);

  useEffect(() => {
    document.title = 'Ryder Cup 2027 at Adare Manor: group houses in Kerry | TeeBnB';
    // Pull the house's size from its live listing so the page can't drift from it.
    supabase
      .from('property_listings')
      .select('bedrooms, max_guests')
      .eq('id', CARAGH_LAKE_ID)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data }) => { if (data) setCaragh(data as { bedrooms: number | null; max_guests: number | null }); });
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const caraghSize = caragh?.bedrooms && caragh?.max_guests
    ? `${caragh.bedrooms} bedrooms, sleeps ${caragh.max_guests}, about`
    : 'About';

  return (
    <div style={{ minHeight: '100vh', background: '#FBFAF6' }}>
      <Navigation />

      {/* Hero */}
      <section style={{ background: '#0B1F17', color: '#fff', padding: isMobile ? '72px 0 64px' : '120px 0 104px' }}>
        <div className="lux-container" style={{ maxWidth: '900px' }}>
          <p className="lux-eyebrow" style={{ color: '#C7F04A', margin: 0 }}>Ryder Cup week · 13 to 19 September 2027</p>
          <h1 className="lux-display" style={{ color: '#fff', fontSize: isMobile ? '40px' : '64px', marginTop: '18px' }}>
            Ryder Cup 2027 at Adare Manor. Somewhere to stay for the whole group.
          </h1>
          <p style={{ ...body, color: '#C9D4CE', marginTop: '28px', fontSize: isMobile ? '16px' : '18px' }}>
            The Ryder Cup comes to Adare Manor, Co. Limerick, for Ryder Cup week, 13 to 19 September 2027 (dates
            confirmed on rydercup.com). Publicly reported estimates put visitor numbers at 250,000 to 300,000, far
            more than the region has beds for. TeeBnB is a golf-first accommodation marketplace: whole houses for
            groups, organised around the course.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '36px' }}>
            <button className="lux-btn lux-btn-lime" onClick={() => scrollTo('groups')}>Request Adare week</button>
            <button className="lux-btn lux-btn-light" onClick={() => scrollTo('owners')}>List your house for Ryder Cup week</button>
          </div>
        </div>
      </section>

      {/* Kerry */}
      <section className="lux-section">
        <div className="lux-container" style={{ maxWidth: '760px' }}>
          <h2 className="lux-h2" style={{ marginBottom: '24px' }}>Kerry is closer than you think</h2>
          <p style={body}>
            The official Ryder Cup home-rental programme is recruiting in Limerick, Clare, Galway, Tipperary and
            Offaly. <strong>Kerry isn't on the list</strong>, yet Tralee, Ballybunion and Killarney are roughly 60 to
            75 minutes from Adare by road, and Caragh Lake about 90.
          </p>
          <p style={body}>
            So Kerry makes sense two ways. For groups, it means a whole house within reach of the gate, with
            Ballybunion, Killarney, Dooks and Tralee to play on the days off. For owners, it means a week of demand
            that the official scheme isn't pointing their way.
          </p>
        </div>
      </section>

      {/* Groups */}
      <section id="groups" className="lux-section" style={{ background: '#F2F0E8' }}>
        <div className="lux-container" style={{ maxWidth: '860px' }}>
          <p className="lux-eyebrow" style={{ margin: 0 }}>For groups</p>
          <h2 className="lux-h2" style={{ marginBottom: '24px' }}>Request Adare week</h2>
          <p style={body}>
            Tell us the group size, the nights you need and roughly what you want to spend. We'll come back to you
            with houses that fit. If we can't find one, we'll say so.
          </p>
          <ul style={{ ...body, paddingLeft: '20px', listStyle: 'disc', margin: '0 0 32px' }}>
            <li>Whole houses, not hotel rooms, for groups of four to twelve or more.</li>
            <li>Every listing is reviewed by us before it goes live.</li>
            <li>We email you back ourselves; there's no automated reply.</li>
            <li>You arrange payment directly with the owner.</li>
          </ul>

          <EnquiryForm form="adare-group" fields={GROUP_FIELDS} submitLabel="Request Adare week" event="Adare group request" />

          <div style={{ marginTop: '48px', borderTop: '1px solid #DEDAC9', paddingTop: '32px' }}>
            <p className="lux-eyebrow" style={{ margin: 0 }}>Already on TeeBnB</p>
            <h3 className="lux-display" style={{ fontSize: '32px', marginTop: '10px' }}>Caragh Lake House, Killorglin, Co. Kerry</h3>
            <p style={{ ...body, marginTop: '14px' }}>
              {caraghSize} 90 minutes from Adare. Book it directly: the owner confirms your request, and you can
              manage or cancel it online without an account.
            </p>
            <button className="lux-link" onClick={() => navigate(`/property/${CARAGH_LAKE_ID}`)}>View the house</button>
          </div>
        </div>
      </section>

      {/* Owners */}
      <section id="owners" className="lux-section">
        <div className="lux-container" style={{ maxWidth: '860px' }}>
          <p className="lux-eyebrow" style={{ margin: 0 }}>For owners</p>
          <h2 className="lux-h2" style={{ marginBottom: '24px' }}>List your house for Ryder Cup week</h2>
          <p style={body}>
            If your house sleeps six or more within about 90 minutes of Adare, Ryder Cup week is likely to be the
            most-searched week your area sees for years.
          </p>

          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '18px', color: '#0B1F17', margin: '36px 0 12px' }}>
            What owners are asking for the week
          </h3>
          <p style={body}>
            We read the listings advertised for Ryder Cup week on a public event-rental site on 8 October 2026: 53
            properties.
          </p>
          <ul style={{ ...body, paddingLeft: '20px', listStyle: 'disc' }}>
            <li>The median asking price among those showing a price is <strong>€30,000 for the week</strong>, across 25 listings.</li>
            <li>More than half (28 of 53) don't name a price at all.</li>
            <li>Two three-bedroom houses are asking €10,000 and €45,000. Nobody yet knows what a week is worth.</li>
          </ul>
          <p style={{ ...body, fontWeight: 600, color: '#0B1F17' }}>
            These are asking prices, not achieved prices. None of them has been paid, and the event is eleven months
            away. We'll update this when there's real evidence.
          </p>

          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '18px', color: '#0B1F17', margin: '36px 0 12px' }}>
            What listing on TeeBnB means
          </h3>
          <ul style={{ ...body, paddingLeft: '20px', listStyle: 'disc', margin: '0 0 32px' }}>
            <li>Free to list.</li>
            <li>Guests send a booking request. You accept or decline, and you deal with the guest directly.</li>
            <li>You set the price and the minimum stay.</li>
          </ul>

          <EnquiryForm form="adare-owner" fields={OWNER_FIELDS} submitLabel="List your house" event="Adare owner signup" />
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #EDEBE1', padding: '32px 0 48px' }}>
        <div className="lux-container" style={{ maxWidth: '860px' }}>
          <p style={{ ...body, fontSize: '13px', color: '#5C6B62', margin: 0 }}>
            TeeBnB is independent and has no connection to the Ryder Cup, Ryder Cup Europe or Adare Manor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RyderCup2027;
