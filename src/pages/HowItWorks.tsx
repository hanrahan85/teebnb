import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const steps = [
  {
    number: '01',
    title: 'Find your spot',
    desc: 'Search by destination, golf course, or date. Filter by amenities like golf bag storage, proximity to the first tee, or group capacity.',
  },
  {
    number: '02',
    title: 'Book with confidence',
    desc: 'Every listing shows verified amenities, clear cancellation policies, and honest reviews from fellow golfers. Book instantly or request to book.',
  },
  {
    number: '03',
    title: 'Play more, stay better',
    desc: 'Check in, meet your host, and focus on your golf. Our hosts understand golfers — early starts, late finishes, and muddy boots included.',
  },
];

const hostSteps = [
  {
    number: '01',
    title: 'List for free',
    desc: 'Create your listing in minutes. Add photos, describe your golf-friendly features, and set your price.',
  },
  {
    number: '02',
    title: 'Welcome golfers',
    desc: 'Accept booking requests, message guests, and manage your calendar — all from your TeeBnB dashboard.',
  },
  {
    number: '03',
    title: 'Get paid',
    desc: 'Receive payment after each check-in, directly to your bank account. TeeBnB handles the rest.',
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#F6F5EF', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#15794C', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', padding: 0, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>

        {/* Guests */}
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '48px', color: '#0B1F17', lineHeight: 1.1, marginBottom: '8px' }}>How TeeBnB works</h1>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#5C6B62', marginBottom: '56px' }}>For golfers and hosts alike — it's simple.</p>

        <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '24px', color: '#0B1F17', marginBottom: '32px' }}>For guests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', marginBottom: '72px' }}>
          {steps.map(({ number, title, desc }) => (
            <div key={number} style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #EDEBE1' }}>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '40px', color: '#C7F04A', marginBottom: '16px' }}>{number}</div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '18px', color: '#0B1F17', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#5C6B62', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Hosts */}
        <div style={{ background: '#0B1F17', borderRadius: '20px', padding: '48px', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '24px', color: '#C7F04A', marginBottom: '32px' }}>For hosts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {hostSteps.map(({ number, title, desc }) => (
              <div key={number}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '36px', color: '#C7F04A', marginBottom: '12px' }}>{number}</div>
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '16px', color: 'white', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#8A9E93', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/list-property')}
          style={{ background: '#C7F04A', border: 'none', cursor: 'pointer', color: '#0B1F17', fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '8px' }}
        >
          List your place →
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
