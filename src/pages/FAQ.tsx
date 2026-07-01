import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const faqs = [
  {
    q: 'How does TeeBnB work?',
    a: 'Browse properties near golf courses, pick your dates, and book directly through the platform. Hosts confirm your booking and you get all the details you need for your stay.',
  },
  {
    q: 'Do I need an account to book?',
    a: 'Yes — you\'ll need to create a free account before booking. This lets you manage your trips, message hosts, and keep track of your bookings in one place.',
  },
  {
    q: 'How do I know a property is golf-friendly?',
    a: 'Every listing on TeeBnB is verified for golf suitability. Look out for amenities like golf bag storage, club cleaning facilities, proximity to courses, and partner course discounts.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellation policies vary by property — Flexible, Moderate, or Strict. The policy is shown clearly on each listing before you book.',
  },
  {
    q: 'Can I list my property on TeeBnB?',
    a: 'Absolutely. If your property is within a reasonable distance of a golf course, you can list it for free. Head to "List your place" to get started.',
  },
  {
    q: 'How do hosts get paid?',
    a: 'Hosts receive payment via bank transfer after a guest checks in. TeeBnB deducts a small service fee to cover the platform.',
  },
  {
    q: 'What if something goes wrong during my stay?',
    a: 'Contact our support team at support@teebnb.com and we\'ll help resolve any issues as quickly as possible.',
  },
];

const FAQ = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);

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
          marginBottom: '8px',
        }}>
          FAQ
        </h1>
        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          color: '#5C6B62',
          marginBottom: '48px',
        }}>
          Everything you need to know about TeeBnB.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #EDEBE1',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '20px 24px',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#0B1F17',
                }}>
                  {faq.q}
                </span>
                <span style={{
                  color: '#15794C',
                  fontSize: '20px',
                  flexShrink: 0,
                  fontWeight: 300,
                }}>
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <div style={{
                  padding: '0 24px 20px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '14px',
                  color: '#5C6B62',
                  lineHeight: 1.7,
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
