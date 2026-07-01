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

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#F6F5EF', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#15794C', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', padding: 0, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '48px', color: '#0B1F17', lineHeight: 1.1, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#8A9E93', marginBottom: '48px' }}>Last updated: July 2026</p>

        {section('What we collect', 'We collect information you provide when creating an account, making a booking, or listing a property. This includes your name, email address, payment details, and any profile information you choose to add.')}
        {section('How we use it', 'We use your data to process bookings, communicate with you about your stays, improve our platform, and (with your consent) send you relevant offers and updates. We never sell your personal data to third parties.')}
        {section('Cookies', 'TeeBnB uses cookies to keep you logged in, remember your preferences, and understand how people use our site. You can disable cookies in your browser settings, though some features may not work as expected.')}
        {section('Data sharing', 'We share limited data with hosts when you make a booking (your name and contact details), and with payment processors to handle transactions securely. We may also share anonymised, aggregated data for analytics.')}
        {section('Your rights', 'You have the right to access, correct, or delete your personal data at any time. To make a request, contact us at privacy@teebnb.com. We will respond within 30 days.')}
        {section('Data retention', 'We retain your data for as long as your account is active, or as required by law. If you delete your account, we will remove your personal data within 90 days.')}
        {section('Contact', 'If you have any questions about this policy, email us at privacy@teebnb.com.')}
      </div>
    </div>
  );
};

export default Privacy;
