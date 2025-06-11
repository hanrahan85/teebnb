
import { useState } from "react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import TravelForm from "@/components/TravelForm";
import TravelRecommendations from "@/components/TravelRecommendations";
import { TravelData, TravelRecommendation } from "@/types/travel";

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
      title: `Curated Golf Experience for ${formData.travelerName}`,
      summary: `An exclusive golf journey crafted for ${formData.travelerName}, featuring championship courses, luxury accommodations, and bespoke experiences at the world's finest golf destinations.`,
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
    <div className="min-h-screen bg-gradient-to-br from-luxury-cream-50 via-luxury-cream-100 to-luxury-brown-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 luxury-texture">
        <div className="grid lg:grid-cols-2 gap-20">
          <TravelForm
            formData={formData}
            isGenerating={isGenerating}
            onInputChange={handleInputChange}
            onGenerate={generateRecommendation}
          />
          
          <div className="space-y-10">
            <TravelRecommendations recommendation={recommendation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
