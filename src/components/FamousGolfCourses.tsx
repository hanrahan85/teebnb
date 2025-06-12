
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Award } from "lucide-react";

const FamousGolfCourses = () => {
  const famousCourses = [
    {
      name: "St. Andrews Old Course",
      location: "Scotland",
      image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=250&fit=crop",
      description: "The Home of Golf - the most famous golf course in the world",
      features: ["Links Course", "Historic", "Open Championship Venue"]
    },
    {
      name: "Augusta National",
      location: "Georgia, USA",
      image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=250&fit=crop",
      description: "Home of The Masters Tournament with iconic azaleas and Amen Corner",
      features: ["Masters Tournament", "Exclusive", "Pristine Conditions"]
    },
    {
      name: "Pebble Beach Golf Links",
      location: "California, USA", 
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      description: "Dramatic coastal course with stunning Pacific Ocean views",
      features: ["Ocean Views", "U.S. Open Venue", "Scenic Beauty"]
    },
    {
      name: "Royal County Down",
      location: "Northern Ireland",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop",
      description: "Magnificent links course with Mountains of Mourne backdrop",
      features: ["Links Course", "Mountain Views", "Championship Venue"]
    },
    {
      name: "Cypress Point Club",
      location: "California, USA",
      image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=250&fit=crop",
      description: "Exclusive course along the rugged Monterey Peninsula coastline",
      features: ["Exclusive", "Coastal Views", "Dramatic Holes"]
    },
    {
      name: "Muirfield",
      location: "Scotland",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop",
      description: "Prestigious championship links course with rich history",
      features: ["Links Course", "Open Championship", "Prestigious"]
    },
    {
      name: "Royal Melbourne",
      location: "Australia",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      description: "Southern Hemisphere's finest golf course with sandbelt design",
      features: ["Sandbelt Course", "Championship Venue", "Fast Greens"]
    },
    {
      name: "Pine Valley",
      location: "New Jersey, USA",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      description: "Often ranked #1 in the world - the ultimate golf challenge",
      features: ["#1 Ranked", "Extremely Exclusive", "Ultimate Challenge"]
    }
  ];

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-2xl rounded-3xl mb-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Award className="h-8 w-8 text-emerald-600" />
          World's Most Famous Golf Courses
        </h3>
        <p className="text-slate-700 text-lg">Inspiration from the world's greatest golf destinations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {famousCourses.map((course, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-white/90 border-emerald-600 text-emerald-800">
                  <Star className="h-3 w-3 mr-1" />
                  Famous
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-bold text-slate-900 mb-2 text-lg">{course.name}</h4>
              <p className="flex items-center text-slate-600 mb-3 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {course.location}
              </p>
              <p className="text-slate-700 text-sm mb-4 leading-relaxed">{course.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {course.features.map((feature, featureIndex) => (
                  <Badge 
                    key={featureIndex} 
                    variant="outline" 
                    className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FamousGolfCourses;
