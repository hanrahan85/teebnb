
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Calendar, Clock, DollarSign, Star, TreePine } from "lucide-react";
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
  );
};

export default TravelRecommendations;
