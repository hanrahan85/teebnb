-- Host email and phone were readable by anyone through the public API
-- (select * on active listings). Lock them to owners and admins.

-- Owners and admins read contact details through this instead.
create or replace function public.listing_contacts(p_ids uuid[])
returns table (id uuid, host_email text, host_phone text)
language sql
stable
security definer
set search_path = public
as $$
  select l.id, l.host_email, l.host_phone
  from public.property_listings l
  where l.id = any(p_ids)
    and (
      l.user_id = auth.uid()
      or exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email'))
    );
$$;

revoke all on function public.listing_contacts(uuid[]) from public, anon;
grant execute on function public.listing_contacts(uuid[]) to authenticated;

-- Column privileges only bite once the table-wide SELECT is gone. Every other
-- column stays readable (RLS still limits which rows). Keep this list in step
-- with src/lib/listingColumns.ts when adding columns.
revoke select on public.property_listings from anon, authenticated;
grant select (
  id, user_id, property_title, property_type, max_guests, bedrooms, beds,
  bathrooms, property_privacy, full_address, latitude, longitude,
  distance_to_course, distance_unit, nearby_golf_courses, parking_availability,
  amenities, golf_bag_storage, partnered_with_course, partner_course_name,
  tournament_discounts, can_host_groups, photos, cover_image, nightly_price,
  cleaning_fee, security_deposit, minimum_stay, maximum_stay,
  tournament_pricing, instant_booking, cancellation_policy, house_rules,
  checkin_time, checkout_time, host_name, host_photo, host_bio,
  languages_spoken, status, created_at, updated_at, is_sample
) on public.property_listings to anon, authenticated;
