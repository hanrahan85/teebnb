// Every property_listings column except host_email and host_phone. Those two
// are not readable by anon or signed-in users directly (see the
// hide_host_contact migration); owners and admins get them through the
// listing_contacts() RPC instead. Selecting '*' on this table now fails, so
// list columns explicitly. A new column must be added here and granted in SQL.
export const PUBLIC_LISTING_COLUMNS = [
  'id', 'user_id', 'property_title', 'property_type', 'max_guests', 'bedrooms',
  'beds', 'bathrooms', 'property_privacy', 'full_address', 'latitude',
  'longitude', 'distance_to_course', 'distance_unit', 'nearby_golf_courses',
  'parking_availability', 'amenities', 'golf_bag_storage',
  'partnered_with_course', 'partner_course_name', 'tournament_discounts',
  'can_host_groups', 'photos', 'cover_image', 'nightly_price', 'cleaning_fee',
  'security_deposit', 'minimum_stay', 'maximum_stay', 'tournament_pricing',
  'instant_booking', 'cancellation_policy', 'house_rules', 'checkin_time',
  'checkout_time', 'host_name', 'host_photo', 'host_bio', 'languages_spoken',
  'status', 'created_at', 'updated_at', 'is_sample',
].join(', ');
