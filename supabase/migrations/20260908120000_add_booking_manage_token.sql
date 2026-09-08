-- Give every booking an unguessable token so a guest who booked without an
-- account can still manage it (view, cancel, request erasure) from a link in
-- their confirmation email. This is what closes the GDPR self-service gap for
-- guests who have no login.
--
-- The token is never exposed via PostgREST: anon has no SELECT policy on
-- bookings, so it can only be read by the service-role edge function.

alter table public.bookings
  add column if not exists manage_token uuid not null default gen_random_uuid();

-- Backfill anything created before this migration.
update public.bookings
set manage_token = gen_random_uuid()
where manage_token is null;

create unique index if not exists bookings_manage_token_idx
  on public.bookings (manage_token);

-- Record when a guest exercises erasure, so we have an audit trail.
alter table public.bookings
  add column if not exists guest_data_erased_at timestamptz;
