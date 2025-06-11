
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plane, Calendar, Users, Star, Clock, DollarSign, Map } from "lucide-react";
import { toast } from "sonner";

interface TravelData {
  travelerName: string;
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

interface TravelRecommendation {
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

const Index = () => {
  const [formData, setFormData] = useState<TravelData>({
    travelerName: "",
    handicap: "",
    budget: "",
    travelDates: "",
    groupSize: "",
    preferredRegion: "",
    courseType: "",
    accommodation: "",
    duration: "",
    specialRequests: ""
  });

  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof TravelData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendation = async () => {
    if (!formData.travelerName || !formData.budget || !formData.preferredRegion) {
      toast.error("Please fill in at least your name, budget, and preferred region to get recommendations.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate travel recommendations based on input
    const travelRecommendation: TravelRecommendation = {
      title: `Golf Travel Itinerary for ${formData.travelerName}`,
      summary: `A curated golf travel experience designed for ${formData.travelerName} featuring world-class courses, premium accommodations, and unforgettable golf destinations tailored to your preferences and budget.`,
      destinations: [
        {
          name: "St. Andrews",
          country: "Scotland",
          description: "The Home of Golf featuring legendary links courses and rich golf history",
          courses: ["The Old Course", "The New Course", "Jubilee Course", "Castle Course"],
          bestTime: "May - September",
          estimatedCost: "$300-500/round",
          highlights: ["Historic clubhouse", "Royal & Ancient Golf Club", "Swilcan Bridge", "Golf museums"]
        },
        {
          name: "Pebble Beach",
          country: "USA",
          description: "Iconic coastal course with breathtaking Pacific Ocean views",
          courses: ["Pebble Beach Golf Links", "Spyglass Hill", "The Links at Spanish Bay", "Cypress Point"],
          bestTime: "April - October",
          estimatedCost: "$500-800/round",
          highlights: ["Dramatic coastline", "Seal Point Clubhouse", "Lodge at Pebble Beach", "17-Mile Drive"]
        },
        {
          name: "Augusta National",
          country: "USA",
          description: "Home of The Masters Tournament (invitation only)",
          courses: ["Augusta National Golf Club"],
          bestTime: "March - May",
          estimatedCost: "Invitation only",
          highlights: ["Amen Corner", "Azaleas and Magnolias", "Masters history", "Butler Cabin"]
        }
      ],
      itinerary: [
        {
          day: "Day 1-2",
          activities: ["Arrival and check-in", "Welcome dinner", "Practice round"],
          courses: ["Local warm-up course"],
          notes: "Settle in and adjust to time zone"
        },
        {
          day: "Day 3-4",
          activities: ["Championship course rounds", "Golf lessons", "Local sightseeing"],
          courses: ["Main destination courses"],
          notes: "Peak golf experience days"
        },
        {
          day: "Day 5-6",
          activities: ["Additional rounds", "Golf shopping", "Cultural experiences"],
          courses: ["Secondary courses in area"],
          notes: "Explore local golf culture"
        },
        {
          day: "Day 7",
          activities: ["Final round", "Departure preparations", "Farewell dinner"],
          courses: ["Memorable closing round"],
          notes: "Perfect ending to golf journey"
        }
      ],
      practicalInfo: {
        flights: [
          "Book flights 2-3 months in advance for best rates",
          "Consider premium economy for long-haul comfort",
          "Check golf bag policies and fees",
          "Arrange ground transportation in advance"
        ],
        accommodation: [
          "Golf resort packages often include course access",
          "Book accommodations near courses to minimize travel",
          "Consider vacation rentals for groups",
          "Premium hotels may offer golf concierge services"
        ],
        transportation: [
          "Rental car recommended for flexibility",
          "Golf resort shuttles often available",
          "Taxi/ride-sharing for single destinations",
          "Consider golf travel companies for full packages"
        ],
        equipment: [
          "Ship clubs ahead or rent premium sets",
          "Pack appropriate weather gear",
          "Bring multiple pairs of golf shoes",
          "Don't forget golf travel insurance"
        ]
      }
    };

    setRecommendation(travelRecommendation);
    setIsGenerating(false);
    toast.success("Your personalized golf travel recommendations are ready!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-navy-50 via-white to-golf-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 golf-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-golf-green-500 rounded-full golf-shadow">
                <Map className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              AI Golf Travel Planner
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
              Discover amazing golf destinations worldwide with personalized travel recommendations
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="px-4 py-2">
                <Plane className="h-4 w-4 mr-2" />
                Global Destinations
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Curated Courses
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Luxury Experiences
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <Card className="p-8 glass-card golf-shadow">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-golf-navy-900 mb-4">
                Plan Your Golf Adventure
              </h2>
              <p className="text-golf-navy-600">
                Tell us about your dream golf trip and we'll create a personalized travel plan featuring the world's best courses and destinations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelerName" className="text-golf-navy-700 font-medium">
                    Traveler Name *
                  </Label>
                  <Input
                    id="travelerName"
                    value={formData.travelerName}
                    onChange={(e) => handleInputChange("travelerName", e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="handicap" className="text-golf-navy-700 font-medium">
                    Golf Handicap
                  </Label>
                  <Input
                    id="handicap"
                    value={formData.handicap}
                    onChange={(e) => handleInputChange("handicap", e.target.value)}
                    placeholder="e.g., 15"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-golf-navy-700 font-medium">
                    Total Budget *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5000">Under $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000-plus">$20,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-golf-navy-700 font-medium">
                    Trip Duration
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-4-days">3-4 days</SelectItem>
                      <SelectItem value="5-7-days">5-7 days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-weeks-plus">2+ weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredRegion" className="text-golf-navy-700 font-medium">
                    Preferred Region *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("preferredRegion", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Where to?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="middle-east">Middle East</SelectItem>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="groupSize" className="text-golf-navy-700 font-medium">
                    Group Size
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("groupSize", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="How many people?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo traveler</SelectItem>
                      <SelectItem value="couple">2 people</SelectItem>
                      <SelectItem value="small-group">3-4 people</SelectItem>
                      <SelectItem value="large-group">5+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseType" className="text-golf-navy-700 font-medium">
                    Course Preference
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("courseType", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Course style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="links">Links courses</SelectItem>
                      <SelectItem value="resort">Resort courses</SelectItem>
                      <SelectItem value="championship">Championship courses</SelectItem>
                      <SelectItem value="historic">Historic courses</SelectItem>
                      <SelectItem value="variety">Variety of styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accommodation" className="text-golf-navy-700 font-medium">
                    Accommodation Style
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("accommodation", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Where to stay?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury-resort">Luxury golf resort</SelectItem>
                      <SelectItem value="boutique-hotel">Boutique hotel</SelectItem>
                      <SelectItem value="vacation-rental">Vacation rental</SelectItem>
                      <SelectItem value="golf-lodge">Golf lodge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="travelDates" className="text-golf-navy-700 font-medium">
                  Preferred Travel Dates
                </Label>
                <Input
                  id="travelDates"
                  value={formData.travelDates}
                  onChange={(e) => handleInputChange("travelDates", e.target.value)}
                  placeholder="e.g., June 2024 or flexible dates"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-golf-navy-700 font-medium">
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Any special requirements, interests, or must-see courses?"
                  className="mt-2"
                />
              </div>

              <Button
                onClick={generateRecommendation}
                disabled={isGenerating}
                className="w-full bg-golf-gradient hover:scale-105 transition-all duration-300 golf-shadow h-14 text-lg font-semibold"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Your Golf Adventure...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5" />
                    Plan My Golf Trip
                  </div>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {recommendation ? (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <Card className="p-6 glass-card golf-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-golf-green-500 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-golf-navy-900">
                        {recommendation.title}
                      </h3>
                      <p className="text-golf-navy-600 mt-2">{recommendation.summary}</p>
                    </div>
                  </div>
                </Card>

                {/* Destinations */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <Map className="h-5 w-5 text-golf-green-600" />
                    Recommended Destinations
                  </h4>
                  <div className="space-y-6">
                    {recommendation.destinations.map((dest, index) => (
                      <div key={index} className="border-l-4 border-golf-green-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-golf-navy-800">{dest.name}, {dest.country}</h5>
                          <Badge variant="outline" className="border-golf-green-600 text-golf-green-700">
                            {dest.bestTime}
                          </Badge>
                        </div>
                        <p className="text-sm text-golf-navy-600 mb-3">{dest.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-golf-navy-700 mb-1">Featured Courses:</p>
                            <ul className="space-y-1">
                              {dest.courses.map((course, courseIndex) => (
                                <li key={courseIndex} className="text-golf-navy-600">• {course}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-golf-navy-700 mb-1">Highlights:</p>
                            <ul className="space-y-1">
                              {dest.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex} className="text-golf-navy-600">• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-golf-gold-500" />
                          <span className="text-sm font-medium text-golf-navy-700">{dest.estimatedCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Itinerary */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-golf-green-600" />
                    Suggested Itinerary
                  </h4>
                  <div className="space-y-4">
                    {recommendation.itinerary.map((day, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-golf-green-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-golf-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-semibold text-golf-navy-800 mb-2">{day.day}</h5>
                          <p className="text-sm text-golf-navy-600 mb-2">{day.notes}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-golf-navy-700 mb-1">Activities:</p>
                              <ul className="space-y-1">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-golf-navy-600">• {activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-golf-navy-700 mb-1">Golf:</p>
                              <ul className="space-y-1">
                                {day.courses.map((course, courseIndex) => (
                                  <li key={courseIndex} className="text-golf-navy-600">• {course}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Practical Info */}
                <Card className="p-6 glass-card">
                  <h4 className="text-xl font-semibold text-golf-navy-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-golf-green-600" />
                    Travel Essentials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Flights & Transport</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.flights.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Accommodation</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.accommodation.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Local Transport</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.transportation.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-golf-navy-800 mb-2">Equipment & Gear</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.equipment.map((item, index) => (
                          <li key={index} className="text-sm text-golf-navy-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 glass-card text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-golf-green-100 rounded-full w-fit mx-auto mb-6">
                    <Map className="h-12 w-12 text-golf-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-golf-navy-900 mb-4">
                    Ready for Your Golf Adventure?
                  </h3>
                  <p className="text-golf-navy-600 mb-6">
                    Fill out your travel preferences to receive personalized golf destination recommendations from around the world.
                  </p>
                  <div className="space-y-3 text-sm text-golf-navy-500">
                    <div className="flex items-center justify-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span>Global golf destinations</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>World-class courses</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Luxury experiences</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
