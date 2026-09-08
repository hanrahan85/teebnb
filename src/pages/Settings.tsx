import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, AlertTriangle, Mail, User, Phone, Lock } from 'lucide-react';

const CARD: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #EDEBE1',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
};

const LABEL: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontFamily: "'Archivo', sans-serif",
  fontWeight: 600,
  color: '#3A4A41',
  marginBottom: '6px',
};

const INPUT: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #EDEBE1',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: "'Hanken Grotesk', sans-serif",
  color: '#0B1F17',
  background: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

const H2: React.CSSProperties = {
  fontSize: '17px',
  fontFamily: "'Archivo', sans-serif",
  fontWeight: 700,
  color: '#0B1F17',
  margin: '0 0 4px 0',
};

const SUB: React.CSSProperties = {
  fontSize: '13px',
  color: '#5C6B62',
  fontFamily: "'Hanken Grotesk', sans-serif",
  margin: '0 0 18px 0',
  lineHeight: 1.5,
};

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  padding: '10px 18px',
  background: disabled ? '#D1D5DB' : '#C7F04A',
  color: '#0B1F17',
  border: 'none',
  borderRadius: '8px',
  fontFamily: "'Archivo', sans-serif",
  fontWeight: 700,
  fontSize: '14px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
});

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth?mode=signin'); return; }
    setFullName((user.user_metadata?.full_name as string) || '');
    setPhone((user.user_metadata?.phone as string) || '');
    setEmail(user.email || '');
  }, [user, navigate]);

  if (!user) return null;

  const originalEmail = user.email || '';
  const emailChanged = email.trim().toLowerCase() !== originalEmail.toLowerCase();

  // ── Profile details ────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!fullName.trim()) { toast.error('Please enter your name'); return; }
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim() },
    });
    setSavingProfile(false);
    if (error) { toast.error(`Couldn't save: ${error.message}`); return; }
    toast.success('Details updated');
  };

  // ── Email (requires confirmation on the new address) ────────────────
  const saveEmail = async () => {
    const next = email.trim();
    if (!next || !next.includes('@')) { toast.error('Please enter a valid email address'); return; }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: next });
    setSavingEmail(false);
    if (error) { toast.error(`Couldn't change email: ${error.message}`); return; }
    toast.success(
      `Check ${next} for a confirmation link. Your email changes once you click it.`,
      { duration: 9000 }
    );
  };

  // ── Password ───────────────────────────────────────────────────────
  const savePassword = async () => {
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { toast.error(`Couldn't update password: ${error.message}`); return; }
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated');
  };

  // ── Account deletion ───────────────────────────────────────────────
  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-account');

      // Supabase surfaces non-2xx as an error; dig out the real message.
      if (error) {
        let message = 'Something went wrong. Please try again or email darragh@teebnb.com.';
        try {
          const ctx = (error as { context?: Response }).context;
          if (ctx && typeof ctx.json === 'function') {
            const body = await ctx.json();
            if (body?.message) message = body.message;
            else if (body?.error) message = body.error;
          }
        } catch { /* fall back to the generic message */ }
        toast.error(message, { duration: 10000 });
        setDeleting(false);
        return;
      }

      toast.success('Your account has been deleted. A confirmation email is on its way.', {
        duration: 8000,
      });
      await supabase.auth.signOut();
      navigate('/');
    } catch (e) {
      toast.error((e as Error).message || 'Could not delete account');
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F6F5EF' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #EDEBE1',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent', border: '1px solid #EDEBE1',
            borderRadius: '6px', padding: '8px 14px', cursor: 'pointer',
            fontFamily: "'Archivo', sans-serif", fontWeight: 600,
            fontSize: '14px', color: '#0B1F17',
          }}
        >
          <ArrowLeft size={16} /> Profile
        </button>
        <h1 style={{
          fontFamily: "'Archivo', sans-serif", fontWeight: 700,
          fontSize: '18px', color: '#0B1F17', margin: 0,
        }}>
          Account settings
        </h1>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Personal details */}
        <div style={CARD}>
          <h2 style={H2}>Personal details</h2>
          <p style={SUB}>The name hosts and guests see when you book or list.</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={LABEL}><User size={14} /> Full name</label>
            <input style={INPUT} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={LABEL}><Phone size={14} /> Phone number</label>
            <input style={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+353 ..." />
          </div>

          <button onClick={saveProfile} disabled={savingProfile} style={primaryBtn(savingProfile)}>
            {savingProfile && <Loader2 size={14} className="animate-spin" />}
            {savingProfile ? 'Saving…' : 'Save details'}
          </button>
        </div>

        {/* Email */}
        <div style={CARD}>
          <h2 style={H2}>Email address</h2>
          <p style={SUB}>
            Used to sign in and to receive booking notifications. Changing it sends a
            confirmation link to the new address — the change only takes effect once you click it.
          </p>

          <div style={{ marginBottom: '18px' }}>
            <label style={LABEL}><Mail size={14} /> Email</label>
            <input style={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button onClick={saveEmail} disabled={savingEmail || !emailChanged} style={primaryBtn(savingEmail || !emailChanged)}>
            {savingEmail && <Loader2 size={14} className="animate-spin" />}
            {savingEmail ? 'Sending…' : 'Change email'}
          </button>
        </div>

        {/* Password */}
        <div style={CARD}>
          <h2 style={H2}>Password</h2>
          <p style={SUB}>Choose something at least 6 characters long.</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={LABEL}><Lock size={14} /> New password</label>
            <input style={INPUT} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={LABEL}><Lock size={14} /> Confirm new password</label>
            <input style={INPUT} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button
            onClick={savePassword}
            disabled={savingPassword || !newPassword || !confirmPassword}
            style={primaryBtn(savingPassword || !newPassword || !confirmPassword)}
          >
            {savingPassword && <Loader2 size={14} className="animate-spin" />}
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </div>

        {/* Your data */}
        <div style={CARD}>
          <h2 style={H2}>Your data</h2>
          <p style={{ ...SUB, marginBottom: '12px' }}>
            You have the right to access, correct, or request deletion of the personal
            data we hold about you, and to receive a copy of it.
          </p>
          <p style={{ ...SUB, margin: 0 }}>
            To request a copy of your data, email{' '}
            <a href="mailto:darragh@teebnb.com?subject=Data%20access%20request" style={{ color: '#15794C', fontWeight: 600 }}>
              darragh@teebnb.com
            </a>
            . We'll respond within 30 days. See our{' '}
            <a href="/privacy" style={{ color: '#15794C', fontWeight: 600 }}>privacy policy</a> for details.
          </p>
        </div>

        {/* Danger zone */}
        <div style={{ ...CARD, border: '1px solid #FECACA', background: '#FFFBFB' }}>
          <h2 style={{ ...H2, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Delete account
          </h2>
          <p style={SUB}>
            This permanently deletes your login, your profile and any properties you've listed.
            It cannot be undone.
          </p>

          <div style={{
            background: '#FFFFFF', border: '1px solid #EDEBE1', borderRadius: '8px',
            padding: '14px', marginBottom: '18px',
          }}>
            <p style={{
              margin: '0 0 8px 0', fontSize: '13px', fontWeight: 700,
              color: '#0B1F17', fontFamily: "'Archivo', sans-serif",
            }}>
              What happens to your bookings
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#5C6B62', fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.6 }}>
              Past bookings are anonymised — your name, email and phone are removed. We keep the
              transaction record itself (dates and amounts only) because Irish tax law requires
              financial records to be held for six years. It can no longer be linked to you.
              You can't delete your account while you have upcoming bookings; cancel or complete
              those first.
            </p>
          </div>

          {!deleteOpen ? (
            <button
              onClick={() => setDeleteOpen(true)}
              style={{
                padding: '10px 18px', background: '#FFFFFF', color: '#991B1B',
                border: '1px solid #FECACA', borderRadius: '8px',
                fontFamily: "'Archivo', sans-serif", fontWeight: 700,
                fontSize: '14px', cursor: 'pointer',
              }}
            >
              Delete my account
            </button>
          ) : (
            <div>
              <label style={{ ...LABEL, color: '#991B1B' }}>
                Type <strong>DELETE</strong> to confirm
              </label>
              <input
                style={{ ...INPUT, borderColor: '#FECACA', marginBottom: '14px' }}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={deleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                  style={{
                    padding: '10px 18px',
                    background: deleteConfirm === 'DELETE' && !deleting ? '#DC2626' : '#E5E7EB',
                    color: deleteConfirm === 'DELETE' && !deleting ? '#FFFFFF' : '#9CA3AF',
                    border: 'none', borderRadius: '8px',
                    fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '14px',
                    cursor: deleteConfirm === 'DELETE' && !deleting ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {deleting ? 'Deleting…' : 'Permanently delete'}
                </button>
                <button
                  onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); }}
                  disabled={deleting}
                  style={{
                    padding: '10px 18px', background: 'transparent', color: '#5C6B62',
                    border: '1px solid #EDEBE1', borderRadius: '8px',
                    fontFamily: "'Archivo', sans-serif", fontWeight: 600,
                    fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
