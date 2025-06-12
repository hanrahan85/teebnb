
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Award, Calendar, Clock, Star, TreePine, Plane, Hotel, Clock3, Mail, Phone, User } from "lucide-react";
import { TravelRecommendation } from "@/types/travel";
import { useState } from "react";
import { toast } from "sonner";

interface TravelRecommendationsProps {
  recommendation: TravelRecommendation | null;
}

const TravelRecommendations = ({ recommendation }: TravelRecommendationsProps) => {
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send booking request email
    toast.success("Booking request sent! We'll contact you soon.");
    setBookingData({ name: "", email: "", phone: "", message: "" });
  };

  if (!recommendation) {
    return (
      <Card className="p-16 bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl text-center">
        <div className="max-w-2xl mx-auto">
          <div className="p-12 bg-gradient-to-br from-slate-100 via-emerald-100 to-teal-100 rounded-full w-fit mx-auto mb-10 shadow-lg">
            <TreePine className="h-20 w-20 text-emerald-700" />
          </div>
          <h3 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
            Your Bookable Golf Adventure Awaits
          </h3>
          <p className="text-slate-700 mb-12 leading-relaxed text-xl font-light">
            Get detailed recommendations with specific dates, flight times, hotel rates, and available tee times ready for booking.
          </p>
          <div className="space-y-6 text-slate-600">
            <div className="flex items-center justify-center gap-4">
              <Plane className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-medium">Specific flight details</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Hotel className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-medium">Available hotels</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Clock3 className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-medium">Exact tee times</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
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
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="border-blue-600 text-blue-800 bg-blue-100/80 px-3 py-1">
                <Plane className="h-4 w-4 mr-1" />
                Bookable Details Included
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Destinations without Pricing */}
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Award className="h-7 w-7 text-emerald-600" />
          Golf Destinations & Details
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
                  <p className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    Available Golf Courses:
                  </p>
                  <ul className="space-y-2">
                    {dest.courses.map((course, courseIndex) => (
                      <li key={courseIndex} className="text-slate-700 text-base bg-white/60 p-2 rounded-lg">
                        • {course.split(' - Green Fee:')[0]} - {course.split(' - Tee Time: ')[1]}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-emerald-600" />
                    Local Highlights:
                  </p>
                  <ul className="space-y-2">
                    {dest.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-slate-700 text-base bg-white/60 p-2 rounded-lg">
                        • {highlight.split(' - $')[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Itinerary without Pricing */}
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Calendar className="h-7 w-7 text-emerald-600" />
          Daily Schedule with Booking Times
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
                    <p className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Scheduled Activities:
                    </p>
                    <ul className="space-y-2">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-slate-700 text-base bg-white/70 p-2 rounded-lg">
                          • {activity.split(' - $')[0]}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-emerald-600" />
                      Golf Reservations:
                    </p>
                    <ul className="space-y-2">
                      {day.courses.map((course, courseIndex) => (
                        <li key={courseIndex} className="text-slate-700 text-base bg-white/70 p-2 rounded-lg">
                          • {course.split(' - $')[0]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Practical Info without Pricing */}
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Clock className="h-7 w-7 text-emerald-600" />
          Booking Information & Contact Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Flight Information
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.flights.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  • {item.split(' - $')[0]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Hotel className="h-5 w-5 text-purple-600" />
              Hotel Information
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.accommodation.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                  • {item.split(' - $')[0]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Transportation Services
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.transportation.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                  • {item.split(' - $')[0]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Golf Equipment & Services
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.equipment.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">
                  • {item.split(' - $')[0]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Booking Signup Section */}
      <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xl rounded-3xl">
        <div className="text-center mb-8">
          <h4 className="text-3xl font-bold text-slate-900 mb-4">Ready to Book Your Golf Adventure?</h4>
          <p className="text-slate-700 text-lg">Fill out the form below and we'll get in touch to finalize your booking</p>
        </div>
        
        <form onSubmit={handleBookingSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bookingName" className="text-slate-800 font-semibold mb-3 block">
                <User className="h-4 w-4 inline mr-2" />
                Full Name *
              </Label>
              <Input
                id="bookingName"
                value={bookingData.name}
                onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
                className="h-12 border-emerald-300 focus:border-emerald-500 bg-white rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="bookingEmail" className="text-slate-800 font-semibold mb-3 block">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address *
              </Label>
              <Input
                id="bookingEmail"
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
                className="h-12 border-emerald-300 focus:border-emerald-500 bg-white rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bookingPhone" className="text-slate-800 font-semibold mb-3 block">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </Label>
            <Input
              id="bookingPhone"
              type="tel"
              value={bookingData.phone}
              onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              className="h-12 border-emerald-300 focus:border-emerald-500 bg-white rounded-xl"
            />
          </div>
          
          <div>
            <Label htmlFor="bookingMessage" className="text-slate-800 font-semibold mb-3 block">
              Additional Message
            </Label>
            <textarea
              id="bookingMessage"
              value={bookingData.message}
              onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any special requests or questions?"
              rows={4}
              className="w-full border border-emerald-300 focus:border-emerald-500 bg-white rounded-xl p-3 resize-none"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-14 text-lg font-semibold rounded-xl shadow-lg"
          >
            Send Booking Request
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TravelRecommendations;
