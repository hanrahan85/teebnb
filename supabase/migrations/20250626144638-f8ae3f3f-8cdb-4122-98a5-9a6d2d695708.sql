
-- Create table for property listings
CREATE TABLE public.property_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Section 1: Property Overview
  property_title TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('Apartment', 'House', 'Cottage', 'B&B', 'Hotel Room', 'Other')),
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  beds INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  property_privacy TEXT NOT NULL CHECK (property_privacy IN ('Entire Place', 'Private Room', 'Shared Space')),
  
  -- Section 2: Location
  full_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_to_course INTEGER,
  distance_unit TEXT CHECK (distance_unit IN ('mins', 'metres', 'miles', 'km')),
  nearby_golf_courses TEXT[], -- Array of golf course names
  parking_availability TEXT CHECK (parking_availability IN ('None', 'On-Site', 'Street', 'Paid Nearby')),
  
  -- Section 3: Amenities (stored as JSONB for flexibility)
  amenities JSONB DEFAULT '{}',
  
  -- Section 4: Golf-Specific Features
  golf_bag_storage BOOLEAN DEFAULT false,
  partnered_with_course BOOLEAN DEFAULT false,
  partner_course_name TEXT,
  tournament_discounts BOOLEAN DEFAULT false,
  can_host_groups BOOLEAN DEFAULT false,
  
  -- Section 5: Photos
  photos TEXT[], -- Array of image URLs
  cover_image TEXT,
  
  -- Section 6: Pricing & Availability
  nightly_price DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2),
  security_deposit DECIMAL(10, 2),
  minimum_stay INTEGER DEFAULT 1,
  maximum_stay INTEGER,
  tournament_pricing JSONB, -- Store date ranges and prices
  
  -- Section 7: Booking & Rules
  instant_booking BOOLEAN DEFAULT false,
  cancellation_policy TEXT CHECK (cancellation_policy IN ('Flexible', 'Moderate', 'Strict')),
  house_rules TEXT,
  checkin_time TIME,
  checkout_time TIME,
  
  -- Section 8: Host Info
  host_name TEXT NOT NULL,
  host_photo TEXT,
  host_bio TEXT,
  languages_spoken TEXT[],
  host_phone TEXT,
  host_email TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view active listings or their own listings" 
  ON public.property_listings 
  FOR SELECT 
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" 
  ON public.property_listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
  ON public.property_listings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
  ON public.property_listings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Storage policies for property images
CREATE POLICY "Anyone can view property images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their property images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their property images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);
