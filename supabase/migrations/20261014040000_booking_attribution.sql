-- Record which link brought the guest to the site (e.g. utm_source=society),
-- so we can tell which outreach produces booking requests.
alter table public.bookings
  add column if not exists utm_source text,
  add column if not exists utm_campaign text,
  add column if not exists referrer text;
