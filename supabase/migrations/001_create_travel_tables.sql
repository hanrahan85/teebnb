
-- Create travel_submissions table
CREATE TABLE travel_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
CREATE TABLE travel_recommendations (
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
CREATE INDEX idx_travel_submissions_email ON travel_submissions(email);
CREATE INDEX idx_travel_submissions_created_at ON travel_submissions(created_at);
CREATE INDEX idx_travel_recommendations_submission_id ON travel_recommendations(submission_id);

-- Enable Row Level Security (RLS)
ALTER TABLE travel_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you can restrict later)
CREATE POLICY "Allow all operations on travel_submissions" ON travel_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on travel_recommendations" ON travel_recommendations FOR ALL USING (true);
