import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string): void => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(246, 245, 239, 0.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid #EDEBE1',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '72px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <a
              onClick={() => navigate('/')}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#0B1F17',
                  boxShadow:
                    'inset 0 0 0 1.5px rgba(200,162,75,.9), 0 2px 9px -3px rgba(11,31,23,.45)',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 700,
                    fontSize: '17px',
                    color: '#C8A24B',
                    lineHeight: 1,
                  }}
                >
                  T
                </span>
              </span>
              <span
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 800,
                  fontSize: '22px',
                  letterSpacing: '-.02em',
                  color: '#15794C',
                }}
              >
                TeeBnB
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'none',
            }}
            className="md:flex"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
              }}
              className="md:flex"
            >
              <button
                onClick={() => handleNavigate('/search-results')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A4A41',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: 0,
                  outline: 'none',
                }}
              >
                Explore stays
              </button>
              <button
                onClick={() => handleNavigate('/search-results')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A4A41',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: 0,
                  outline: 'none',
                }}
              >
                Destinations
              </button>
              <button
                onClick={() => handleNavigate('/trips')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A4A41',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: 0,
                  outline: 'none',
                }}
              >
                Trips
              </button>
              <button
                onClick={() => handleNavigate('/profile')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A4A41',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: 0,
                  outline: 'none',
                }}
              >
                Profile
              </button>
              <button
                onClick={() => handleNavigate('/list-property')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A4A41',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: 0,
                  outline: 'none',
                }}
              >
                List your place
              </button>

              {/* Right side content */}
              {user ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginLeft: '24px',
                  }}
                >
                  <button
                    onClick={() => handleNavigate('/dashboard')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3A4A41',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    Dashboard
                  </button>
                  <span
                    style={{
                      color: '#5C6B62',
                      fontSize: '13px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#5C6B62',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginLeft: '24px',
                  }}
                >
                  <button
                    onClick={() => handleNavigate('/list-property')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#15794C',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    Become a host
                  </button>
                  <button
                    onClick={() => handleNavigate('/auth')}
                    style={{
                      background: '#C7F04A',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#0B1F17',
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      outline: 'none',
                    }}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div
            style={{
              display: 'flex',
            }}
            className="md:hidden"
          >
            <button
              onClick={toggleMobileMenu}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#0B1F17',
                outline: 'none',
              }}
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid #EDEBE1',
              background: 'rgba(246, 245, 239, 1)',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="md:hidden"
          >
            <div
              style={{
                padding: '12px 8px 12px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  color: '#0B1F17',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  minHeight: '48px',
                  outline: 'none',
                }}
                onClick={() => handleNavigate('/search-results')}
              >
                Explore stays
              </button>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  color: '#0B1F17',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  minHeight: '48px',
                  outline: 'none',
                }}
                onClick={() => handleNavigate('/search-results')}
              >
                Destinations
              </button>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  color: '#0B1F17',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  minHeight: '48px',
                  outline: 'none',
                }}
                onClick={() => handleNavigate('/trips')}
              >
                Trips
              </button>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  color: '#0B1F17',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  minHeight: '48px',
                  outline: 'none',
                }}
                onClick={() => handleNavigate('/profile')}
              >
                Profile
              </button>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  color: '#0B1F17',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  minHeight: '48px',
                  outline: 'none',
                }}
                onClick={() => handleNavigate('/list-property')}
              >
                List your place
              </button>

              {user ? (
                <div
                  style={{
                    borderTop: '1px solid #EDEBE1',
                    paddingTop: '12px',
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <button
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px',
                      color: '#0B1F17',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      minHeight: '48px',
                      outline: 'none',
                    }}
                    onClick={() => handleNavigate('/dashboard')}
                  >
                    Dashboard
                  </button>
                  <div
                    style={{
                      padding: '8px 12px',
                      color: '#5C6B62',
                      fontSize: '12px',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '12px',
                      color: '#5C6B62',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      minHeight: '48px',
                      outline: 'none',
                    }}
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    borderTop: '1px solid #EDEBE1',
                    paddingTop: '12px',
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <button
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px',
                      color: '#0B1F17',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      minHeight: '48px',
                      outline: 'none',
                    }}
                    onClick={() => handleNavigate('/list-property')}
                  >
                    Become a host
                  </button>
                  <button
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px',
                      color: '#0B1F17',
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      minHeight: '48px',
                      outline: 'none',
                    }}
                    onClick={() => handleNavigate('/auth')}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;