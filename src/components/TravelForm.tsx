
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TreePine } from "lucide-react";
import { TravelData } from "@/types/travel";

interface TravelFormProps {
  formData: TravelData;
  isGenerating: boolean;
  onInputChange: (field: keyof TravelData, value: string) => void;
  onGenerate: () => void;
}

const TravelForm = ({ formData, isGenerating, onInputChange, onGenerate }: TravelFormProps) => {
  return (
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
              onChange={(e) => onInputChange("travelerName", e.target.value)}
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
              onChange={(e) => onInputChange("handicap", e.target.value)}
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
            <Select onValueChange={(value) => onInputChange("budget", value)}>
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
            <Select onValueChange={(value) => onInputChange("duration", value)}>
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
            <Select onValueChange={(value) => onInputChange("preferredRegion", value)}>
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
            <Select onValueChange={(value) => onInputChange("groupSize", value)}>
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
            <Select onValueChange={(value) => onInputChange("courseType", value)}>
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
            <Select onValueChange={(value) => onInputChange("accommodation", value)}>
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
            onChange={(e) => onInputChange("travelDates", e.target.value)}
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
            onChange={(e) => onInputChange("specialRequests", e.target.value)}
            placeholder="Any special requirements, interests, or must-see courses?"
            className="min-h-[140px] border-stone-300 focus:border-emerald-500 bg-white/95 rounded-2xl text-lg resize-none shadow-sm"
          />
        </div>

        <Button
          onClick={onGenerate}
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
  );
};

export default TravelForm;
