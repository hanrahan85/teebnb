import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const section = (title: string, body: string) => (
  <div key={title} style={{ marginBottom: '36px' }}>
    <h2 style={{
      fontFamily: "'Archivo', sans-serif",
      fontWeight: 700,
      fontSize: '20px',
      color: '#0B1F17',
      marginBottom: '12px',
    }}>{title}</h2>
    <p style={{
      fontFamily: "'Hanken Grotesk', sans-serif",
      fontSize: '15px',
      color: '#5C6B62',
      lineHeight: 1.8,
    }}>{body}</p>
  </div>
);

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#F6F5EF', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#15794C', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', padding: 0, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '48px', color: '#0B1F17', lineHeight: 1.1, marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#8A9E93', marginBottom: '48px' }}>Last updated: July 2026</p>

        {section('Acceptance of terms', 'By creating an account or using TeeBnB, you agree to these terms. If you do not agree, please do not use the platform.')}
        {section('Bookings', 'When you book a property through TeeBnB, you enter into a contract directly with the host. TeeBnB acts as an intermediary and is not a party to that contract. All bookings are subject to the individual cancellation policy shown on each listing.')}
        {section('Host responsibilities', 'Hosts are responsible for ensuring their listings are accurate, their properties are safe and as described, and that they comply with all applicable local laws and regulations including planning permissions and short-term rental rules.')}
        {section('Guest responsibilities', 'Guests must treat properties with respect, adhere to house rules set by the host, and not exceed the stated maximum occupancy. Any damage caused during a stay is the responsibility of the guest.')}
        {section('Payments', 'All payments are processed securely through our payment provider. TeeBnB charges a service fee on each booking. Hosts receive payment after guest check-in, minus the platform commission.')}
        {section('Prohibited uses', 'You may not use TeeBnB for any unlawful purpose, to post false or misleading listings, to harass other users, or to circumvent our payment system by arranging off-platform transactions.')}
        {section('Liability', 'TeeBnB is not liable for any loss, injury, or damage arising from a stay booked through the platform. We strongly recommend all guests have appropriate travel insurance.')}
        {section('Changes to terms', 'We may update these terms from time to time. We will notify you of significant changes by email. Continued use of the platform after changes constitutes acceptance.')}
        {section('Contact', 'Questions about these terms? Email legal@teebnb.com.')}
      </div>
    </div>
  );
};

export default Terms;
