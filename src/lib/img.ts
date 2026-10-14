/**
 * Return a resized, compressed version of an image URL for display.
 *
 * Hosts upload photos straight from their phones (some are 5–10 MB PNGs),
 * which made listing pages very slow on mobile data. Supabase Storage (Pro
 * plan) and Unsplash both resize on the fly, so we ask for roughly the size
 * we actually draw. Anything else is returned unchanged.
 */
export const imgUrl = (url: string | null | undefined, width: number): string => {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('.supabase.co') && u.pathname.includes('/storage/v1/object/public/')) {
      u.pathname = u.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      u.searchParams.set('width', String(width));
      u.searchParams.set('quality', '70');
      u.searchParams.set('resize', 'contain');
      return u.toString();
    }
    if (u.hostname === 'images.unsplash.com') {
      u.searchParams.set('w', String(width));
      u.searchParams.delete('h');
      u.searchParams.set('q', '70');
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      return u.toString();
    }
  } catch {
    // Not an absolute URL; fall through.
  }
  return url;
};
