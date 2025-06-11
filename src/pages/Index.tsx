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
import { Key, LogOut, User, LogIn, TestTube } from "lucide-react";
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
  const [isTesting, setIsTesting] = useState(false);

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

  const testEdgeFunction = async () => {
    setIsTesting(true);
    console.log('Testing edge function...');
    
    try {
      const testPrompt = `Create a simple test golf travel recommendation for John Doe with a budget of $5,000 for Europe. Format as JSON with title, summary, and one destination.`;
      
      const testFormData = {
        travelerName: "Test User",
        email: "test@example.com",
        budget: "5000-10000",
        preferredRegion: "europe",
        groupSize: "solo",
        courseType: "resort",
        accommodation: "luxury-resort",
        duration: "5-7-days",
        handicap: "15",
        travelDates: "June 2024",
        specialRequests: "Test request"
      };

      console.log('Making test call to edge function...');

      const response = await fetch('https://lwuncvddikvqtcmsabpw.supabase.co/functions/v1/generate-travel-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dW5jdmRkaWt2cXRjbXNhYnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Njk5ODMsImV4cCI6MjA2NTI0NTk4M30.A7WKvStX_TXh9NyLDVLfP7d9ent56nKK1XSbM-owsAw',
        },
        body: JSON.stringify({
          prompt: testPrompt,
          formData: testFormData
        }),
      });

      console.log('Test response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Test error response:', errorText);
        throw new Error(`Test failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Test response data:', data);
      
      if (data && data.recommendation) {
        toast.success("✅ Edge function test successful! The API is working correctly.");
        console.log('Test passed - recommendation received:', data.recommendation);
      } else {
        toast.error("❌ Test failed - No recommendation data in response");
        console.error('Test failed - Invalid response structure:', data);
      }
      
    } catch (error) {
      console.error('Test error:', error);
      toast.error(`❌ Test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
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

      console.log('Calling edge function with prompt:', prompt);

      const response = await fetch('https://lwuncvddikvqtcmsabpw.supabase.co/functions/v1/generate-travel-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3dW5jdmRkaWt2cXRjbXNhYnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Njk5ODMsImV4cCI6MjA2NTI0NTk4M30.A7WKvStX_TXh9NyLDVLfP7d9ent56nKK1XSbM-owsAw',
        },
        body: JSON.stringify({
          prompt: prompt,
          formData: formData
        }),
      });

      console.log('Edge function response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge function error response:', errorText);
        
        let errorMessage = 'Failed to generate recommendations';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText || 'Unknown error'}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Edge function response data:', data);
      
      if (!data || !data.recommendation) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from server - no recommendation data');
      }
      
      setRecommendation(data.recommendation);
      
      // Save to Supabase database only if user is authenticated
      if (user) {
        try {
          await saveTravelSubmission(formData, data.recommendation);
          console.log('Successfully saved travel data to database');
          toast.success("Your detailed golf travel itinerary with bookable details is ready and saved!");
        } catch (saveError) {
          console.error('Error saving to database:', saveError);
          toast.success("Your detailed golf travel itinerary is ready!");
          toast.error("Note: Data saving failed, but recommendations are still available.");
        }
      } else {
        toast.success("Your detailed golf travel itinerary with bookable details is ready!");
        toast.info("Sign in to save your recommendations for later.");
      }
      
    } catch (error) {
      console.error('Error generating recommendation:', error);
      
      // Provide more helpful error messages
      let userMessage = "Failed to generate recommendations";
      if (error.message.includes('fetch')) {
        userMessage = "Network error - please check your connection and try again";
      } else if (error.message.includes('JSON')) {
        userMessage = "Response parsing error - please try again";
      } else if (error.message.includes('Invalid response')) {
        userMessage = "Server returned invalid data - please try again";
      } else if (error.message) {
        userMessage = `Error: ${error.message}`;
      }
      
      toast.error(userMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Optional User Header - only show when logged in */}
      {user && (
        <div className="bg-white/90 backdrop-blur-lg border-b border-stone-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-600">Welcome back,</p>
                  <p className="font-semibold text-slate-900">{user.user_metadata?.full_name || user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={testEdgeFunction}
                  disabled={isTesting}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  {isTesting ? "Testing..." : "Test API"}
                </Button>
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
        </div>
      )}

      {/* Sign In Banner for non-authenticated users */}
      {!user && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Sign in to save your golf travel recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={testEdgeFunction}
                  disabled={isTesting}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {isTesting ? "Testing..." : "Test API"}
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth'}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeroSection />
      
      <div className="section-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
