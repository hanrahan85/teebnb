
export interface TravelData {
  travelerName: string;
  email: string;
  handicap: string;
  budget: string;
  travelDates: string;
  groupSize: string;
  preferredRegion: string;
  courseType: string;
  accommodation: string;
  duration: string;
  specialRequests: string;
}

export interface TravelRecommendation {
  title: string;
  summary: string;
  destinations: {
    name: string;
    country: string;
    description: string;
    courses: string[];
    bestTime: string;
    estimatedCost: string;
    highlights: string[];
  }[];
  itinerary: {
    day: string;
    activities: string[];
    courses: string[];
    notes: string;
  }[];
  practicalInfo: {
    flights: string[];
    accommodation: string[];
    transportation: string[];
    equipment: string[];
  };
}
