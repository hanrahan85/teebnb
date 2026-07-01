import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

const NAV_BTN: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#3A4A41',
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '14px',
  padding: 0,
  outline: 'none',
  whiteSpace: 'nowrap',
};

const MOBILE_BTN: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '14px 12px',
  color: '#0B1F17',
  fontFamily: "'Hanken Grotesk', sans-serif",
  fontWeight: 500,
  fontSize: '15px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '8px',
  minHeight: '48px',
  outline: 'none',
};

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string): void => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(246, 245, 239, 0.92)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid #EDEBE1',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        {/* Main bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

          {/* Logo */}
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{
              display: 'grid', placeItems: 'center',
              width: '34px', height: '34px', borderRadius: '50%',
              background: '#0B1F17',
              boxShadow: 'inset 0 0 0 1.5px rgba(200,162,75,.9)',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: '16px', color: '#C8A24B', lineHeight: 1 }}>T</span>
            </span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', color: '#15794C' }}>
              TeeBnB
            </span>
          </a>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <button style={NAV_BTN} onClick={() => handleNavigate('/search-results')}>Explore stays</button>
              <button style={NAV_BTN} onClick={() => handleNavigate('/search-results')}>Destinations</button>
              {user && <button style={NAV_BTN} onClick={() => handleNavigate('/trips')}>Trips</button>}
              {user && <button style={NAV_BTN} onClick={() => handleNavigate('/profile')}>Profile</button>}

              {user ? (
                <>
                  <button style={NAV_BTN} onClick={() => handleNavigate('/dashboard')}>Dashboard</button>
                  <button style={NAV_BTN} onClick={() => handleNavigate('/list-property')}>List your place</button>
                  <span style={{ color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif", maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button style={{ ...NAV_BTN, color: '#5C6B62' }} onClick={handleSignOut}>Sign out</button>
                </>
              ) : (
                <>
                  <button style={{ ...NAV_BTN, color: '#15794C' }} onClick={() => handleNavigate('/list-property')}>Become a host</button>
                  <button
                    onClick={() => handleNavigate('/auth')}
                    style={{ background: '#C7F04A', border: 'none', cursor: 'pointer', color: '#0B1F17', fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px', padding: '8px 18px', borderRadius: '20px', outline: 'none', whiteSpace: 'nowrap' }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(o => !o)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#0B1F17', outline: 'none' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div style={{ borderTop: '1px solid #EDEBE1', background: 'rgba(246,245,239,1)', paddingBottom: '12px' }}>
            <button style={MOBILE_BTN} onClick={() => handleNavigate('/search-results')}>Explore stays</button>
            <button style={MOBILE_BTN} onClick={() => handleNavigate('/search-results')}>Destinations</button>
            <button style={MOBILE_BTN} onClick={() => handleNavigate('/list-property')}>List your place</button>
            {user && <button style={MOBILE_BTN} onClick={() => handleNavigate('/trips')}>Trips</button>}
            {user && <button style={MOBILE_BTN} onClick={() => handleNavigate('/dashboard')}>Dashboard</button>}
            {user && <button style={MOBILE_BTN} onClick={() => handleNavigate('/profile')}>Profile</button>}

            <div style={{ borderTop: '1px solid #EDEBE1', marginTop: '8px', paddingTop: '12px' }}>
              {user ? (
                <>
                  <div style={{ padding: '8px 12px', color: '#5C6B62', fontSize: '13px', fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <button style={{ ...MOBILE_BTN, color: '#5C6B62' }} onClick={handleSignOut}>Sign out</button>
                </>
              ) : (
                <button
                  style={{ margin: '8px 12px', background: '#C7F04A', border: 'none', cursor: 'pointer', color: '#0B1F17', fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '8px', width: 'calc(100% - 24px)' }}
                  onClick={() => handleNavigate('/auth')}
                >
                  Sign up / Log in
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
