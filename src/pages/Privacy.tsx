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
    <div style={{ background: '#FBFAF6', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#15794C', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: '14px', padding: 0, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>
        <h1 className="lux-display" style={{ fontSize: 'clamp(40px, 6vw, 56px)', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '14px', color: '#8A9E93', marginBottom: '48px' }}>Last updated: 9 October 2026</p>

        {section('Who we are', 'TeeBnB (teebnb.com) is a booking platform for accommodation near golf courses, run from Ireland by Darragh Hanrahan. We are the data controller for the personal data described here. You can reach us about anything in this policy at darragh@teebnb.com.')}
        {section('What we collect', 'If you request a booking: your name, email address, phone number, the dates and number of guests, and any special requests you write. If you create an account: your name, email address and phone number, plus a password, which is stored only in hashed form by our database provider. If you list a property: your name, email and phone number, the property address, its details and the photos you upload. We do not take or store any payment details, because TeeBnB does not handle payments.')}
        {section('Why we use it', 'We use booking details to pass your request to the host and to email you a confirmation and a link to manage your booking. This is necessary to provide the service you asked for. We use account and listing details to run your account, review listings before they go live and contact you about them. This is in our legitimate interest in operating the platform. We do not send marketing emails, and we never sell your data.')}
        {section('Who we share it with', 'When you request a booking, the host of that property receives your name, contact details, dates and requests so they can reply and arrange payment with you. We also use a small number of service providers to run the site: Supabase (database, accounts and photo storage, hosted in Ireland), Vercel (website hosting), Resend (sending emails) and OpenStreetMap (maps and turning addresses into map locations). Your browser also loads fonts from Google Fonts and some images from Unsplash and Wikimedia, which means those services see your IP address. We share data with no one else unless the law requires it.')}
        {section('Cookies', 'We do not use advertising or analytics cookies. If you sign in, your browser keeps a login token in local storage so you stay signed in. Nothing else is stored for tracking.')}
        {section('How long we keep it', 'Account and listing data is kept until you delete your account. Booking records are kept for six years, because Irish tax law requires us to keep transaction records. If you ask us to erase your data, we remove your name, email, phone number and notes from those records and keep only the anonymous booking details.')}
        {section('Your rights', 'You can see, correct or delete your data at any time. If you have an account, you can change your details or delete your account in Settings. If you booked without an account, use the link in your confirmation email to view, cancel or erase your booking. For a copy of your data, or for anything else, email darragh@teebnb.com and we will reply within 30 days. If you are unhappy with how we handle your data, you can complain to the Data Protection Commission (dataprotection.ie).')}
        {section('Changes', 'If we change how we use your data, we will update this page and the date at the top.')}
      </div>
    </div>
  );
};

export default Privacy;
