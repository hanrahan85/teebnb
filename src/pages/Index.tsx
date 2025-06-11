import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plane, Calendar, Users, Star, Clock, DollarSign, Map, Waves, Award, TreePine } from "lucide-react";
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
          name: "The Grove",
          country: "England",
          description: "Championship golf resort with three world-class courses in the beautiful Hertfordshire countryside",
          courses: ["The Grove Championship Course", "West London Golf Centre", "Academy Course", "Practice facilities"],
          bestTime: "April - October",
          estimatedCost: "£200-400/round",
          highlights: ["Championship PGA course", "Luxury spa resort", "Award-winning dining", "Corporate golf facilities"]
        },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-emerald-50">
      {/* Hero Section with Luxury Golf Resort Aesthetic */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-stone-800 to-emerald-900">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%)
            `,
            backgroundSize: '60px 60px, 80px 80px, 40px 40px, 40px 40px'
          }}></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-white via-stone-200 to-emerald-200 bg-clip-text text-transparent">
                TeeBnB
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-stone-200 mb-6 max-w-5xl mx-auto animate-fade-in font-light leading-relaxed tracking-wide">
              Discover the world's most prestigious golf destinations
            </p>
            <p className="text-lg text-stone-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Curated luxury golf experiences at championship courses and premium resorts worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
              <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
                <Award className="h-5 w-5 mr-3" />
                Championship Courses
              </Badge>
              <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
                <MapPin className="h-5 w-5 mr-3" />
                Premium Destinations
              </Badge>
              <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
                <Star className="h-5 w-5 mr-3" />
                Luxury Experiences
              </Badge>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => window.location.href = '/reviews'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
              >
                Read Golf Course Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Enhanced Form Section */}
          <Card className="p-12 bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                Plan Your Golf Journey
              </h2>
              <p className="text-slate-700 leading-relaxed text-xl font-light">
                Share your preferences and we'll craft a bespoke golf travel experience featuring world-class courses, luxury accommodations, and unforgettable destinations.
              </p>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="travelerName" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Traveler Name *
                  </Label>
                  <Input
                    id="travelerName"
                    value={formData.travelerName}
                    onChange={(e) => handleInputChange("travelerName", e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="handicap" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Golf Handicap
                  </Label>
                  <Input
                    id="handicap"
                    value={formData.handicap}
                    onChange={(e) => handleInputChange("handicap", e.target.value)}
                    placeholder="e.g., 15"
                    className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="budget" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Total Budget *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="under-5000">Under $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000-plus">$20,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Trip Duration
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="3-4-days">3-4 days</SelectItem>
                      <SelectItem value="5-7-days">5-7 days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-weeks-plus">2+ weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="preferredRegion" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Preferred Region *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("preferredRegion", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="Where to?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="middle-east">Middle East</SelectItem>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="groupSize" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Group Size
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("groupSize", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="How many people?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="solo">Solo traveler</SelectItem>
                      <SelectItem value="couple">2 people</SelectItem>
                      <SelectItem value="small-group">3-4 people</SelectItem>
                      <SelectItem value="large-group">5+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="courseType" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Course Preference
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("courseType", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="Course style" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="links">Links courses</SelectItem>
                      <SelectItem value="resort">Resort courses</SelectItem>
                      <SelectItem value="championship">Championship courses</SelectItem>
                      <SelectItem value="historic">Historic courses</SelectItem>
                      <SelectItem value="variety">Variety of styles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accommodation" className="text-slate-800 font-semibold text-lg mb-4 block">
                    Accommodation Style
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("accommodation", value)}>
                    <SelectTrigger className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm">
                      <SelectValue placeholder="Where to stay?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl">
                      <SelectItem value="luxury-resort">Luxury golf resort</SelectItem>
                      <SelectItem value="boutique-hotel">Boutique hotel</SelectItem>
                      <SelectItem value="vacation-rental">Vacation rental</SelectItem>
                      <SelectItem value="golf-lodge">Golf lodge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="travelDates" className="text-slate-800 font-semibold text-lg mb-4 block">
                  Preferred Travel Dates
                </Label>
                <Input
                  id="travelDates"
                  value={formData.travelDates}
                  onChange={(e) => handleInputChange("travelDates", e.target.value)}
                  placeholder="e.g., June 2024 or flexible dates"
                  className="h-14 border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg shadow-sm"
                />
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-slate-800 font-semibold text-lg mb-4 block">
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Any special requirements, interests, or must-see courses?"
                  className="min-h-[140px] border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg resize-none shadow-sm"
                />
              </div>

              <Button
                onClick={generateRecommendation}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-slate-800 via-emerald-700 to-teal-700 hover:from-slate-900 hover:via-emerald-800 hover:to-teal-800 text-white border-0 h-18 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-5">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                    Crafting Your Luxury Golf Experience...
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <TreePine className="h-7 w-7" />
                    Create My Golf Journey
                  </div>
                )}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-10">
            {recommendation ? (
              <div className="space-y-10 animate-fade-in">
                {/* Header */}
                <Card className="p-10 bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl">
                  <div className="flex items-start gap-8 mb-8">
                    <div className="p-5 bg-gradient-to-br from-slate-700 via-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        {recommendation.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-xl font-light">{recommendation.summary}</p>
                    </div>
                  </div>
                </Card>

                {/* Destinations */}
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
                  <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Award className="h-7 w-7 text-emerald-600" />
                    Recommended Destinations
                  </h4>
                  <div className="space-y-8">
                    {recommendation.destinations.map((dest, index) => (
                      <div key={index} className="border-l-4 border-emerald-500 pl-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-r-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xl font-bold text-slate-900">{dest.name}, {dest.country}</h5>
                          <Badge variant="outline" className="border-emerald-600 text-emerald-800 bg-emerald-100/80 px-4 py-2 text-sm">
                            {dest.bestTime}
                          </Badge>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed text-base">{dest.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="font-bold text-slate-800 mb-2 text-base">Featured Courses:</p>
                            <ul className="space-y-2">
                              {dest.courses.map((course, courseIndex) => (
                                <li key={courseIndex} className="text-slate-700 text-base">• {course}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 mb-2 text-base">Highlights:</p>
                            <ul className="space-y-2">
                              {dest.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex} className="text-slate-700 text-base">• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold text-slate-800 text-base">{dest.estimatedCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Itinerary */}
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
                  <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Calendar className="h-7 w-7 text-emerald-600" />
                    Suggested Itinerary
                  </h4>
                  <div className="space-y-6">
                    {recommendation.itinerary.map((day, index) => (
                      <div key={index} className="flex items-start gap-6 p-6 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-700 via-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h5 className="text-xl font-bold text-slate-900 mb-3">{day.day}</h5>
                          <p className="text-slate-700 mb-4 leading-relaxed text-base">{day.notes}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="font-bold text-slate-800 mb-2 text-base">Activities:</p>
                              <ul className="space-y-1">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-slate-700 text-base">• {activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 mb-2 text-base">Golf:</p>
                              <ul className="space-y-1">
                                {day.courses.map((course, courseIndex) => (
                                  <li key={courseIndex} className="text-slate-700 text-base">• {course}</li>
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
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
                  <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Clock className="h-7 w-7 text-emerald-600" />
                    Travel Essentials
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-lg font-bold text-slate-900 mb-3">Flights & Transport</h5>
                      <ul className="space-y-2">
                        {recommendation.practicalInfo.flights.map((item, index) => (
                          <li key={index} className="text-slate-700 text-base">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-slate-900 mb-3">Accommodation</h5>
                      <ul className="space-y-2">
                        {recommendation.practicalInfo.accommodation.map((item, index) => (
                          <li key={index} className="text-slate-700 text-base">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-slate-900 mb-3">Local Transport</h5>
                      <ul className="space-y-2">
                        {recommendation.practicalInfo.transportation.map((item, index) => (
                          <li key={index} className="text-slate-700 text-base">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-slate-900 mb-3">Equipment & Gear</h5>
                      <ul className="space-y-2">
                        {recommendation.practicalInfo.equipment.map((item, index) => (
                          <li key={index} className="text-slate-700 text-base">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-16 bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="p-12 bg-gradient-to-br from-slate-100 via-emerald-100 to-teal-100 rounded-full w-fit mx-auto mb-10 shadow-lg">
                    <TreePine className="h-20 w-20 text-emerald-700" />
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
                    Your Golf Adventure Awaits
                  </h3>
                  <p className="text-slate-700 mb-12 leading-relaxed text-xl font-light">
                    Share your preferences to receive curated recommendations for the world's most prestigious golf destinations and luxury resort experiences.
                  </p>
                  <div className="space-y-6 text-slate-600">
                    <div className="flex items-center justify-center gap-4">
                      <Award className="h-6 w-6 text-emerald-600" />
                      <span className="text-lg font-medium">Championship courses</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                      <span className="text-lg font-medium">Premium destinations</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Star className="h-6 w-6 text-emerald-600" />
                      <span className="text-lg font-medium">Luxury experiences</span>
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

</edits_to_apply>
