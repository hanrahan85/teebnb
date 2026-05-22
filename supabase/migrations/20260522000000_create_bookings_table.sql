-- Create bookings table for TeeBnB
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.property_listings(id) on delete cascade,
  guest_user_id uuid references auth.users(id) on delete set null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  special_requests text,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guests integer not null default 1,
  price_per_night numeric not null,
  subtotal numeric not null,
  cleaning_fee numeric not null default 0,
  service_fee numeric not null default 0,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

-- Row Level Security
alter table public.bookings enable row level security;

-- Anyone can insert (guest booking without account)
create policy "Anyone can create a booking"
  on public.bookings for insert
  with check (true);

-- Guests can view their own bookings
create policy "Guests can view own bookings"
  on public.bookings for select
  using (guest_user_id = auth.uid() or guest_email = (select email from auth.users where id = auth.uid()));

-- Hosts can view bookings for their listings
create policy "Hosts can view bookings on their listings"
  on public.bookings for select
  using (
    listing_id in (
      select id from public.property_listings where host_user_id = auth.uid()
    )
  );

-- Hosts can update booking status
create policy "Hosts can update booking status"
  on public.bookings for update
  using (
    listing_id in (
      select id from public.property_listings where host_user_id = auth.uid()
    )
  )
  with check (true);

-- Guests can cancel their own bookings
create policy "Guests can cancel own bookings"
  on public.bookings for update
  using (guest_user_id = auth.uid())
  with check (status = 'cancelled');
