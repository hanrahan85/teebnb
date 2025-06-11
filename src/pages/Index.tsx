import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plane, Calendar, Users, Star, Clock, DollarSign, Map, Waves } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Hero Section with Links Golf Aesthetic */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-green-700 to-teal-600 text-white">
        {/* Subtle wave pattern for links golf feel */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 60px 60px'
          }}></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30">
                  <Waves className="h-16 w-16 text-emerald-100" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full">
                  <Map className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
              TeebnB
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-4xl mx-auto animate-fade-in font-light leading-relaxed">
              Discover the world's most beautiful golf destinations with personalized travel recommendations
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Badge variant="secondary" className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all">
                <Plane className="h-4 w-4 mr-2" />
                Links & Coastal Courses
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all">
                <MapPin className="h-4 w-4 mr-2" />
                Seaside Destinations
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all">
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
          <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">
                Plan Your Golf Adventure
              </h2>
              <p className="text-emerald-700 leading-relaxed">
                Tell us about your dream golf trip and we'll create a personalized travel plan featuring the world's most stunning courses and coastal destinations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelerName" className="text-emerald-800 font-medium">
                    Traveler Name *
                  </Label>
                  <Input
                    id="travelerName"
                    value={formData.travelerName}
                    onChange={(e) => handleInputChange("travelerName", e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80"
                  />
                </div>
                <div>
                  <Label htmlFor="handicap" className="text-emerald-800 font-medium">
                    Golf Handicap
                  </Label>
                  <Input
                    id="handicap"
                    value={formData.handicap}
                    onChange={(e) => handleInputChange("handicap", e.target.value)}
                    placeholder="e.g., 15"
                    className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-emerald-800 font-medium">
                    Total Budget *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="under-5000">Under $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000-plus">$20,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-emerald-800 font-medium">
                    Trip Duration
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
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
                  <Label htmlFor="preferredRegion" className="text-emerald-800 font-medium">
                    Preferred Region *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("preferredRegion", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="Where to?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="middle-east">Middle East</SelectItem>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="groupSize" className="text-emerald-800 font-medium">
                    Group Size
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("groupSize", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="How many people?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
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
                  <Label htmlFor="courseType" className="text-emerald-800 font-medium">
                    Course Preference
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("courseType", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="Course style" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="links">Links courses</SelectItem>
                      <SelectItem value="resort">Resort courses</SelectItem>
                      <SelectItem value="championship">Championship courses</SelectItem>
                      <SelectItem value="historic">Historic courses</SelectItem>
                      <SelectItem value="variety">Variety of styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accommodation" className="text-emerald-800 font-medium">
                    Accommodation Style
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("accommodation", value)}>
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80">
                      <SelectValue placeholder="Where to stay?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="luxury-resort">Luxury golf resort</SelectItem>
                      <SelectItem value="boutique-hotel">Boutique hotel</SelectItem>
                      <SelectItem value="vacation-rental">Vacation rental</SelectItem>
                      <SelectItem value="golf-lodge">Golf lodge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="travelDates" className="text-emerald-800 font-medium">
                  Preferred Travel Dates
                </Label>
                <Input
                  id="travelDates"
                  value={formData.travelDates}
                  onChange={(e) => handleInputChange("travelDates", e.target.value)}
                  placeholder="e.g., June 2024 or flexible dates"
                  className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80"
                />
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-emerald-800 font-medium">
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Any special requirements, interests, or must-see courses?"
                  className="mt-2 border-emerald-200 focus:border-emerald-400 bg-white/80"
                />
              </div>

              <Button
                onClick={generateRecommendation}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-900">
                        {recommendation.title}
                      </h3>
                      <p className="text-emerald-700 mt-2 leading-relaxed">{recommendation.summary}</p>
                    </div>
                  </div>
                </Card>

                {/* Destinations */}
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <h4 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <Map className="h-5 w-5 text-emerald-600" />
                    Recommended Destinations
                  </h4>
                  <div className="space-y-6">
                    {recommendation.destinations.map((dest, index) => (
                      <div key={index} className="border-l-4 border-emerald-400 pl-4 bg-emerald-50/50 rounded-r-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-emerald-900">{dest.name}, {dest.country}</h5>
                          <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                            {dest.bestTime}
                          </Badge>
                        </div>
                        <p className="text-sm text-emerald-700 mb-3 leading-relaxed">{dest.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-emerald-800 mb-1">Featured Courses:</p>
                            <ul className="space-y-1">
                              {dest.courses.map((course, courseIndex) => (
                                <li key={courseIndex} className="text-emerald-700">• {course}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-emerald-800 mb-1">Highlights:</p>
                            <ul className="space-y-1">
                              {dest.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex} className="text-emerald-700">• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium text-emerald-800">{dest.estimatedCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Itinerary */}
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <h4 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Suggested Itinerary
                  </h4>
                  <div className="space-y-4">
                    {recommendation.itinerary.map((day, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-semibold text-emerald-900 mb-2">{day.day}</h5>
                          <p className="text-sm text-emerald-700 mb-2 leading-relaxed">{day.notes}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-emerald-800 mb-1">Activities:</p>
                              <ul className="space-y-1">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-emerald-700">• {activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-emerald-800 mb-1">Golf:</p>
                              <ul className="space-y-1">
                                {day.courses.map((course, courseIndex) => (
                                  <li key={courseIndex} className="text-emerald-700">• {course}</li>
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
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <h4 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Travel Essentials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-emerald-900 mb-2">Flights & Transport</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.flights.map((item, index) => (
                          <li key={index} className="text-sm text-emerald-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-emerald-900 mb-2">Accommodation</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.accommodation.map((item, index) => (
                          <li key={index} className="text-sm text-emerald-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-emerald-900 mb-2">Local Transport</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.transportation.map((item, index) => (
                          <li key={index} className="text-sm text-emerald-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-emerald-900 mb-2">Equipment & Gear</h5>
                      <ul className="space-y-1">
                        {recommendation.practicalInfo.equipment.map((item, index) => (
                          <li key={index} className="text-sm text-emerald-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl w-fit mx-auto mb-6">
                    <Waves className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                    Ready for Your Golf Adventure?
                  </h3>
                  <p className="text-emerald-700 mb-6 leading-relaxed">
                    Fill out your travel preferences to receive personalized golf destination recommendations from the world's most beautiful courses.
                  </p>
                  <div className="space-y-3 text-sm text-emerald-600">
                    <div className="flex items-center justify-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span>Coastal destinations</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Links courses</span>
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
