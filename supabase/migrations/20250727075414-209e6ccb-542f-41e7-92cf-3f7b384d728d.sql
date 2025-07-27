-- Fix the INSERT policy for property_listings to ensure users can only create listings for themselves
DROP POLICY IF EXISTS "Users can create their own listings" ON public.property_listings;

CREATE POLICY "Users can create their own listings" 
ON public.property_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);