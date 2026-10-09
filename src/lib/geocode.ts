// Nominatim only matches when every word in the query is recognised, so a
// house name or an Eircode (which OpenStreetMap doesn't index) makes the whole
// lookup fail. Try the full address without the Eircode first, then drop the
// most specific part each time, e.g. "House, Townland, Town, County" →
// "Townland, Town, County" → "Town, County".
const EIRCODE = /\b[AC-FHKNPRTV-Y]\d{2}\s?[AC-FHKNPRTV-Y0-9]{4}\b/i;

const candidates = (address: string): string[] => {
  const parts = address
    .replace(EIRCODE, '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1 || (i === 0 && parts.length === 1); i++) {
    out.push(parts.slice(i).join(', '));
  }
  return out;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const queries = candidates(address);
  for (let i = 0; i < queries.length; i++) {
    // Nominatim's usage policy allows one request a second.
    if (i > 0) await sleep(1100);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queries[i])}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const data = await res.json();
      if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch {
      return null;
    }
  }
  return null;
}
