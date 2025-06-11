
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Calendar, Clock, DollarSign, Star, TreePine, Plane, Hotel, Clock3 } from "lucide-react";
import { TravelRecommendation } from "@/types/travel";

interface TravelRecommendationsProps {
  recommendation: TravelRecommendation | null;
}

const TravelRecommendations = ({ recommendation }: TravelRecommendationsProps) => {
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
              <span className="text-lg font-medium">Specific flight details & pricing</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Hotel className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-medium">Available hotels with rates</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Clock3 className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-medium">Exact tee times & green fees</span>
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

      {/* Destinations with Booking Details */}
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Award className="h-7 w-7 text-emerald-600" />
          Bookable Destinations & Pricing
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
              
              {/* Enhanced Cost Breakdown */}
              <div className="mb-6 p-4 bg-white/80 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-slate-800 text-lg">Pricing Breakdown</span>
                </div>
                <p className="text-slate-700 text-base font-medium">{dest.estimatedCost}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold text-slate-800 mb-3 text-base flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    Available Tee Times & Fees:
                  </p>
                  <ul className="space-y-2">
                    {dest.courses.map((course, courseIndex) => (
                      <li key={courseIndex} className="text-slate-700 text-base bg-white/60 p-2 rounded-lg">• {course}</li>
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
                      <li key={highlightIndex} className="text-slate-700 text-base bg-white/60 p-2 rounded-lg">• {highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Itinerary with Times */}
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
                        <li key={actIndex} className="text-slate-700 text-base bg-white/70 p-2 rounded-lg">• {activity}</li>
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
                        <li key={courseIndex} className="text-slate-700 text-base bg-white/70 p-2 rounded-lg">• {course}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Enhanced Practical Info with Booking Details */}
      <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Clock className="h-7 w-7 text-emerald-600" />
          Booking Information & Contact Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Flight Reservations
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.flights.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Hotel className="h-5 w-5 text-purple-600" />
              Hotel Bookings
            </h5>
            <ul className="space-y-3">
              {recommendation.practicalInfo.accommodation.map((item, index) => (
                <li key={index} className="text-slate-700 text-base bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">• {item}</li>
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
                <li key={index} className="text-slate-700 text-base bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">• {item}</li>
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
                <li key={index} className="text-slate-700 text-base bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200">
          <h6 className="text-lg font-bold text-slate-900 mb-2">Ready to Book?</h6>
          <p className="text-slate-700 text-base">All recommendations include specific contact information, booking references, and available time slots. Contact the providers directly using the details above to secure your reservations.</p>
        </div>
      </Card>
    </div>
  );
};

export default TravelRecommendations;
