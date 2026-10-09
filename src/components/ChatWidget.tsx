import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Turn = { role: 'user' | 'assistant'; content: string };

type ListingCard = {
  id: string;
  title: string;
  area: string;
  nightly_price: number;
  max_guests: number;
  distance: string | null;
  courses: string[];
  cover_image: string | null;
};

type Entry = Turn & { listings?: ListingCard[] };

const GREEN = '#15794C';
const CREAM = '#F6F5EF';
const INK = '#1F2A24';

const GREETING: Entry = {
  role: 'assistant',
  content: "Hi, I'm Caddie. Tell me which courses you're playing and how many of you there are, and I'll find somewhere close by. Hosts, ask me about listing too.",
};

const SUGGESTIONS = [
  'Four of us playing Lahinch in May',
  'Somewhere near Portmarnock with bag storage',
  'How do I list my B&B?',
];

// Routes where a floating bubble would get in the way of the task at hand.
const HIDDEN_ON = ['/booking', '/admin', '/list-property'];

const ChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries, sending, open]);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    const next = [...entries, { role: 'user' as const, content }];
    setEntries(next);
    setDraft('');
    setSending(true);
    try {
      // The greeting is UI only; the conversation sent starts with the visitor.
      const messages: Turn[] = next.slice(1).map(({ role, content }) => ({ role, content }));
      const { data, error } = await supabase.functions.invoke('teebnb-assistant', { body: { messages } });
      if (error || !data?.reply) throw error ?? new Error(data?.error);
      setEntries([...next, { role: 'assistant', content: data.reply, listings: data.listings ?? [] }]);
    } catch {
      setEntries([
        ...next,
        { role: 'assistant', content: "Sorry, I couldn't get an answer just now. Please try again, or email support@teebnb.com." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const openListing = (id: string) => {
    navigate(`/property/${id}`);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Chat with Caddie"
        style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 8,
          background: GREEN, color: '#fff', border: 'none', borderRadius: 999,
          padding: '12px 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        }}
      >
        <MessageCircle size={20} /> Ask Caddie
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Caddie, the TeeBnB assistant"
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 1000,
        width: 'min(380px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 32px))',
        display: 'flex', flexDirection: 'column', background: '#fff',
        borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
        fontFamily: 'inherit', color: INK,
      }}
    >
      <div style={{ background: GREEN, color: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Caddie</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Golf stays, near the first tee</div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 14, background: CREAM, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ alignSelf: e.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
            <div
              style={{
                background: e.role === 'user' ? GREEN : '#fff',
                color: e.role === 'user' ? '#fff' : INK,
                padding: '9px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.45,
                whiteSpace: 'pre-wrap', border: e.role === 'user' ? 'none' : '1px solid #E4E1D6',
              }}
            >
              {e.content}
            </div>
            {e.listings?.map((l) => (
              <button
                key={l.id}
                onClick={() => openListing(l.id)}
                style={{
                  marginTop: 8, width: '100%', display: 'flex', gap: 10, textAlign: 'left',
                  background: '#fff', border: '1px solid #E4E1D6', borderRadius: 10, padding: 8, cursor: 'pointer',
                }}
              >
                {l.cover_image && (
                  <img src={l.cover_image} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: INK }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: '#5B6660' }}>
                    {l.area}{l.distance ? ` · ${l.distance} to the course` : ''}
                  </div>
                  <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginTop: 2 }}>
                    €{l.nightly_price}/night · sleeps {l.max_guests}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}

        {entries.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{ background: '#fff', border: `1px solid ${GREEN}`, color: GREEN, borderRadius: 999, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {sending && <div style={{ fontSize: 13, color: '#5B6660' }}>Caddie is looking…</div>}
      </div>

      <form
        onSubmit={(ev) => { ev.preventDefault(); send(draft); }}
        style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #E4E1D6', background: '#fff' }}
      >
        <input
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          maxLength={2000}
          placeholder="Ask about stays, courses or listing…"
          aria-label="Message Caddie"
          style={{ flex: 1, border: '1px solid #E4E1D6', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none' }}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          aria-label="Send"
          style={{ background: GREEN, color: '#fff', border: 'none', borderRadius: 10, padding: '0 14px', cursor: 'pointer', opacity: sending || !draft.trim() ? 0.5 : 1 }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;
