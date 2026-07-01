import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const posts = [
  {
    category: 'Destinations',
    title: 'The 7 best golf stays in Ireland',
    excerpt: 'From a clifftop cottage above Lahinch to a country house minutes from Royal County Down — our pick of the finest golf accommodation on the island.',
    date: 'June 2026',
    readTime: '5 min read',
  },
  {
    category: 'Hosting',
    title: 'How to earn more from your golf-side property',
    excerpt: 'Hosts near top courses are earning 40% more than comparable Airbnb listings. Here\'s exactly what makes a golf-friendly listing stand out.',
    date: 'May 2026',
    readTime: '4 min read',
  },
  {
    category: 'Travel Tips',
    title: 'Planning a golf trip for 8: the complete guide',
    excerpt: 'Group golf trips have a hundred moving parts. We break down how to book tee times, find the right house, and keep everyone happy.',
    date: 'April 2026',
    readTime: '7 min read',
  },
  {
    category: 'Destinations',
    title: 'Scotland\'s hidden gem golf courses (and where to stay)',
    excerpt: 'Everyone knows St Andrews and Carnoustie. But Scotland has 550 courses — and some of the best are nowhere near the tourist trail.',
    date: 'March 2026',
    readTime: '6 min read',
  },
];

const Blog = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#F6F5EF', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#15794C', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', padding: 0, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>
        <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '48px', color: '#0B1F17', lineHeight: 1.1, marginBottom: '8px' }}>Blog</h1>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', color: '#5C6B62', marginBottom: '48px' }}>Golf travel guides, hosting tips, and destination inspiration.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {posts.map((post) => (
            <div
              key={post.title}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #EDEBE1',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(11,31,23,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {/* Placeholder image area */}
              <div style={{ height: '180px', background: '#0B1F17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '48px' }}>⛳</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    background: '#C7F04A',
                    color: '#0B1F17',
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>{post.category}</span>
                  <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '12px', color: '#8A9E93' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '18px', color: '#0B1F17', marginBottom: '8px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#5C6B62', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
                <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '12px', color: '#8A9E93' }}>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
