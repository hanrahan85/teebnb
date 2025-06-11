
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import TravelForm from "@/components/TravelForm";
import TravelRecommendations from "@/components/TravelRecommendations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, LogOut, User } from "lucide-react";
import { TravelData, TravelRecommendation } from "@/types/travel";
import { saveTravelSubmission } from "@/services/travelService";

const Index = () => {
  const { user, signOut } = useAuth();
  
  const [formData, setFormData] = useState<TravelData>({
    travelerName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
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
  const [openaiApiKey, setOpenaiApiKey] = useState("");

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        travelerName: user.user_metadata?.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof TravelData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const generateRecommendation = async () => {
    if (!formData.travelerName || !formData.email || !formData.budget || !formData.preferredRegion) {
      toast.error("Please fill in your name, email, budget, and preferred region to get recommendations.");
      return;
    }

    if (!openaiApiKey.trim()) {
      toast.error("Please enter your OpenAI API key to generate AI-powered recommendations.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setMonth(currentDate.getMonth() + 3);
      
      const prompt = `Create a detailed golf travel recommendation for ${formData.travelerName} with the following preferences:
      - Budget: ${formData.budget}
      - Preferred Region: ${formData.preferredRegion}
      - Group Size: ${formData.groupSize}
      - Course Type: ${formData.courseType}
      - Accommodation: ${formData.accommodation}
      - Duration: ${formData.duration}
      - Golf Handicap: ${formData.handicap}
      - Travel Dates: ${formData.travelDates || "Flexible"}
      - Special Requests: ${formData.specialRequests}

      IMPORTANT: Generate SPECIFIC, REALISTIC details including:
      1. Exact hotel names and rates per night
      2. Specific flight numbers, airlines, and prices
      3. Exact tee times with course names and green fees
      4. Specific dates for travel (use realistic future dates)
      5. Real restaurant names and reservation details
      6. Actual transfer services and costs

      Make everything feel bookable and authentic. Use real-sounding hotel names, flight schedules, and pricing that matches the budget range.

      Please provide a comprehensive golf travel recommendation including:
      1. A personalized title and summary
      2. 3 specific golf destinations with:
         - Exact course names and green fees
         - Real hotel names with nightly rates
         - Specific flight details (airline, flight numbers, times, prices)
         - Best times to visit with specific dates
         - Estimated total costs broken down by category
         - Local highlights and activities
      3. A detailed 7-day itinerary with:
         - Specific dates and times
         - Exact tee times and course bookings
         - Hotel check-in/out times
         - Flight departure/arrival times
         - Restaurant reservations and dining times
         - Transportation details between locations
      4. Practical travel information including:
         - Specific flight booking details (airline, routes, times, costs)
         - Exact hotel recommendations with rates and booking info
         - Local transportation options with costs
         - Golf equipment rental details and prices

      Format the response as a JSON object matching this structure:
      {
        "title": "string",
        "summary": "string",
        "destinations": [
          {
            "name": "string",
            "country": "string", 
            "description": "string",
            "courses": ["Course Name - Green Fee: $XXX - Tee Time: XX:XX AM"],
            "bestTime": "Specific dates (e.g., March 15-22, 2024)",
            "estimatedCost": "Total: $X,XXX (Flights: $XXX, Hotels: $XXX/night, Golf: $XXX, Meals: $XXX)",
            "highlights": ["Specific activity with time and cost"]
          }
        ],
        "itinerary": [
          {
            "day": "Day 1 - March 15, 2024",
            "activities": ["10:00 AM - Hotel check-in at [Hotel Name]", "2:00 PM - City tour with [Company] - $XX"],
            "courses": ["18:00 PM - Sunset round at [Course Name] - $XXX green fee"],
            "notes": "Specific daily schedule with times and costs"
          }
        ],
        "practicalInfo": {
          "flights": ["Outbound: [Airline] Flight XX departing [City] at XX:XX AM, arriving [City] at XX:XX PM - $XXX", "Return: [Airline] Flight XX departing [City] at XX:XX PM - $XXX"],
          "accommodation": ["[Hotel Name] - $XXX/night, includes breakfast and golf shuttle", "[Resort Name] - $XXX/night, oceanview room with balcony"],
          "transportation": ["Airport transfer: [Company] - $XX each way", "Rental car: [Company] compact car - $XX/day"],
          "equipment": ["Golf club rental at [Course Name] - $XX/round", "Golf shoes rental - $XX/day"]
        }
      }`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert golf travel advisor with access to real-time booking systems. Create detailed, specific recommendations with exact prices, times, dates, and booking details. Make everything feel authentic and bookable. Use realistic pricing for the specified budget range and region. Include specific hotel names, flight numbers, course tee times, and restaurant reservations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate recommendations');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse the JSON response
      const parsedRecommendation = JSON.parse(aiResponse);
      
      setRecommendation(parsedRecommendation);
      
      // Save to Supabase database
      try {
        await saveTravelSubmission(formData, parsedRecommendation);
        console.log('Successfully saved travel data to database');
        toast.success("Your detailed golf travel itinerary with bookable details is ready!");
      } catch (saveError) {
        console.error('Error saving to database:', saveError);
        toast.success("Your detailed golf travel itinerary is ready!");
        toast.error("Note: Data saving failed, but recommendations are still available.");
      }
      
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast.error("Failed to generate recommendations. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* User Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-stone-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-900">{user?.user_metadata?.full_name || user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <HeroSection />
      
      <div className="section-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* OpenAI API Key Input */}
          <Card className="p-8 bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl mb-16">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">AI-Powered Booking Assistant</h3>
                  <p className="text-slate-600">Get specific dates, flights, hotels, and tee times</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="openai-key" className="text-slate-800 font-semibold text-base mb-3 block">
                  OpenAI API Key
                </Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="h-12 border-stone-300 focus:border-blue-500 bg-white/95 rounded-xl"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Your API key enables detailed recommendations with bookable flights, hotels, and tee times. Get one at{" "}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    OpenAI Platform
                  </a>
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-16">
            <TravelForm
              formData={formData}
              isGenerating={isGenerating}
              onInputChange={handleInputChange}
              onGenerate={generateRecommendation}
            />
            
            <div className="space-y-8">
              <TravelRecommendations recommendation={recommendation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
