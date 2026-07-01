import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F6F5EF', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#15794C',
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            padding: 0,
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to home
        </button>

        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: '48px',
          color: '#0B1F17',
          lineHeight: 1.1,
          marginBottom: '24px',
        }}>
          About TeeBnB
        </h1>

        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '18px',
          color: '#3A4A41',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          TeeBnB is the world's first dedicated platform for golf accommodation. We connect golfers with
          hand-picked stays near the world's greatest courses — from cottage rentals steps from Lahinch
          to townhouses in the shadow of Augusta.
        </p>

        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          color: '#5C6B62',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          We started TeeBnB because we believe every great golf trip deserves a great place to stay.
          Too many golfers were booking generic accommodation with no thought to proximity, storage,
          or the needs of a travelling golfer. We're fixing that.
        </p>

        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          color: '#5C6B62',
          lineHeight: 1.7,
          marginBottom: '48px',
        }}>
          Whether you're a solo weekend golfer or organising a group trip for 12, TeeBnB makes it
          easy to find somewhere brilliant to stay. And if you have a property near a golf course,
          we make it just as easy to list it.
        </p>

        <div style={{
          background: '#0B1F17',
          borderRadius: '16px',
          padding: '40px',
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          {[
            { stat: '500+', label: 'Properties listed' },
            { stat: '50+', label: 'Golf destinations' },
            { stat: '10k+', label: 'Nights booked' },
          ].map(({ stat, label }) => (
            <div key={label} style={{ flex: '1 1 140px' }}>
              <div style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: '36px',
                color: '#C7F04A',
                marginBottom: '4px',
              }}>{stat}</div>
              <div style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: '14px',
                color: '#8A9E93',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
