import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Support = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to a backend / email service
    setSubmitted(true);
  };

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
          Support
        </h1>
        <p style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '16px',
          color: '#5C6B62',
          marginBottom: '48px',
        }}>
          We're here to help. Fill in the form below or email us at{' '}
          <a href="mailto:support@teebnb.com" style={{ color: '#15794C' }}>support@teebnb.com</a>.
        </p>

        {submitted ? (
          <div style={{
            background: '#0B1F17',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              fontSize: '24px',
              color: '#C7F04A',
              marginBottom: '8px',
            }}>
              Message sent!
            </h2>
            <p style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '15px',
              color: '#8A9E93',
            }}>
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Your name', key: 'name', type: 'text', placeholder: 'Rory McIlroy' },
              { label: 'Email address', key: 'email', type: 'email', placeholder: 'rory@email.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#0B1F17',
                  marginBottom: '6px',
                }}>
                  {label}
                </label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #EDEBE1',
                    borderRadius: '8px',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: '14px',
                    background: 'white',
                    color: '#0B1F17',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                color: '#0B1F17',
                marginBottom: '6px',
              }}>
                How can we help?
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe your issue..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #EDEBE1',
                  borderRadius: '8px',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '14px',
                  background: 'white',
                  color: '#0B1F17',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#C7F04A',
                border: 'none',
                cursor: 'pointer',
                color: '#0B1F17',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                alignSelf: 'flex-start',
              }}
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
