import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ChevronLeft, Calendar, MessageSquare, Home, Briefcase, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.created_at
    ? format(new Date(user.created_at), 'MMMM yyyy')
    : 'Recently';

  const quickLinks = [
    { label: 'My Trips', icon: Calendar, href: '/trips' },
    { label: 'Messages', icon: MessageSquare, href: '/inbox' },
    { label: 'My Listings', icon: Home, href: '/dashboard' },
    { label: 'Become a Host', icon: Briefcase, href: '/list-property' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #EDEBE1',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} color="#0B1F17" />
        </button>
        <span style={{display:'grid',placeItems:'center',width:'36px',height:'36px',borderRadius:'50%',background:'#0B1F17',boxShadow:'inset 0 0 0 1.5px rgba(200,162,75,.9)'}}>
          <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontWeight:700,fontSize:'16px',color:'#C8A24B',lineHeight:1}}>T</span>
        </span>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          fontSize: '20px',
          color: '#0B1F17',
          margin: 0,
        }}>
          Profile
        </h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Avatar & Info */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: '#0B1F17',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <span style={{
              fontSize: '36px',
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              color: '#FFFFFF',
            }}>
              {initials}
            </span>
          </div>

          <h2 style={{
            fontSize: '24px',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 700,
            color: '#0B1F17',
            margin: '0 0 8px 0',
          }}>
            {fullName}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#5C6B62',
            margin: '0 0 16px 0',
          }}>
            {user.email}
          </p>
          <p style={{
            fontSize: '13px',
            color: '#A1A9A8',
            margin: 0,
          }}>
            Member since {memberSince}
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: 'transparent',
            color: '#15794C',
            border: '1px solid #EDEBE1',
            borderRadius: '8px',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '40px',
          }}
        >
          Go to Host Dashboard
        </button>

        {/* Quick Links */}
        <h3 style={{
          fontSize: '14px',
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 700,
          color: '#5C6B62',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>
          Quick Links
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '40px',
        }}>
          {quickLinks.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              onClick={() => navigate(href)}
              style={{
                padding: '16px',
                background: '#FFFFFF',
                border: '1px solid #EDEBE1',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#F9FAFB';
                (e.target as HTMLElement).style.borderColor = '#15794C';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#FFFFFF';
                (e.target as HTMLElement).style.borderColor = '#EDEBE1';
              }}
            >
              <Icon size={24} color="#15794C" />
              <span style={{
                fontSize: '13px',
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 600,
                color: '#0B1F17',
              }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: 'transparent',
            color: '#DC2626',
            border: 'none',
            borderRadius: '8px',
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
