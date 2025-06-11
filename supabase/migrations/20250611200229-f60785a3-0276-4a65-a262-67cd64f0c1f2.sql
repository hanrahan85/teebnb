
-- Create travel_submissions table with user_id from the beginning
CREATE TABLE IF NOT EXISTS travel_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  traveler_name TEXT NOT NULL,
  email TEXT NOT NULL,
  handicap TEXT,
  budget TEXT NOT NULL,
  travel_dates TEXT,
  group_size TEXT,
  preferred_region TEXT NOT NULL,
  course_type TEXT,
  accommodation TEXT,
  duration TEXT,
  special_requests TEXT
);

-- Create travel_recommendations table
CREATE TABLE IF NOT EXISTS travel_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES travel_submissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  destinations JSONB NOT NULL,
  itinerary JSONB NOT NULL,
  practical_info JSONB NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_travel_submissions_email ON travel_submissions(email);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_created_at ON travel_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_travel_submissions_user_id ON travel_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_recommendations_submission_id ON travel_recommendations(submission_id);

-- Enable Row Level Security (RLS)
ALTER TABLE travel_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_recommendations ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for travel_submissions
CREATE POLICY "Users can view their own submissions" 
  ON travel_submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" 
  ON travel_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
  ON travel_submissions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
  ON travel_submissions FOR DELETE 
  USING (auth.uid() = user_id);

-- Create secure RLS policies for travel_recommendations
CREATE POLICY "Users can view recommendations for their submissions" 
  ON travel_recommendations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM travel_submissions 
    WHERE travel_submissions.id = travel_recommendations.submission_id 
    AND travel_submissions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create recommendations for their submissions" 
  ON travel_recommendations FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM travel_submissions 
    WHERE travel_submissions.id = travel_recommendations.submission_id 
    AND travel_submissions.user_id = auth.uid()
  ));

-- Create a profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
