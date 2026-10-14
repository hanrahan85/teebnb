/**
 * Remember which link brought a visitor to the site, so a booking request can
 * record it (e.g. utm_source=society from a golf-society email). Kept in
 * sessionStorage only: it is forgotten when the tab closes and is never used
 * to identify anyone.
 */
const KEY = 'teebnb-attribution';

export interface Attribution {
  utm_source: string | null;
  utm_campaign: string | null;
  referrer: string | null;
}

export const captureAttribution = (): void => {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    if (source) {
      const value: Attribution = {
        utm_source: source.slice(0, 100),
        utm_campaign: params.get('utm_campaign')?.slice(0, 100) ?? null,
        referrer: null,
      };
      sessionStorage.setItem(KEY, JSON.stringify(value));
      return;
    }
    if (sessionStorage.getItem(KEY)) return;
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    if (ref && ref !== window.location.hostname) {
      sessionStorage.setItem(KEY, JSON.stringify({ utm_source: null, utm_campaign: null, referrer: ref.slice(0, 100) }));
    }
  } catch {
    // Storage blocked or bad referrer; attribution is best-effort.
  }
};

export const getAttribution = (): Attribution => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // ignore
  }
  return { utm_source: null, utm_campaign: null, referrer: null };
};
