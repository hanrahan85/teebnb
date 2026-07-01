import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      {/* Logo */}
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#0B1F17', boxShadow: 'inset 0 0 0 1.5px rgba(200,162,75,.9)' }}>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: '18px', color: '#C8A24B' }}>T</span>
        </span>
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '22px', color: '#15794C' }}>TeeBnB</span>
      </div>

      <div style={{ fontSize: '80px', marginBottom: '16px' }}>⛳</div>

      <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '48px', color: '#0B1F17', margin: '0 0 12px 0' }}>
        Out of bounds
      </h1>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', color: '#5C6B62', maxWidth: '440px', lineHeight: 1.6, margin: '0 0 8px 0' }}>
        The page <code style={{ background: '#EDEBE1', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}>{location.pathname}</code> doesn't exist.
      </p>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '15px', color: '#8A968E', marginBottom: '40px' }}>
        Looks like this one landed in the rough.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: '#0B1F17', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '24px', fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
        >
          Back to home
        </button>
        <button
          onClick={() => navigate('/search-results')}
          style={{ background: 'transparent', color: '#15794C', border: '1px solid #15794C', padding: '12px 28px', borderRadius: '24px', fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
        >
          Browse stays
        </button>
      </div>
    </div>
  );
};

export default NotFound;
