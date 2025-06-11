
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, User, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  name: string;
  location: string;
  course: string;
  rating: number;
  date: string;
  review: string;
  helpful: number;
  verified: boolean;
  avatar?: string;
}

const Reviews = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const reviews: Review[] = [
    {
      id: "1",
      name: "James McAllister",
      location: "Edinburgh, Scotland",
      course: "St Andrews Old Course",
      rating: 5,
      date: "November 2024",
      review: "Playing the Old Course at St Andrews was a dream come true. Every hole has history, and walking over the Swilcan Bridge gave me chills. The course conditions were immaculate despite the Scottish weather. Worth every penny and the wait time.",
      helpful: 24,
      verified: true
    },
    {
      id: "2",
      name: "Sarah Williams",
      location: "London, England",
      course: "Royal County Down",
      rating: 5,
      date: "October 2024",
      review: "Absolutely breathtaking views of the Mountains of Mourne and Dundrum Bay. This course is challenging yet fair, with some of the most spectacular scenery I've ever experienced on a golf course. The hospitality was exceptional.",
      helpful: 18,
      verified: true
    },
    {
      id: "3",
      name: "Michael Chen",
      location: "Atlanta, USA",
      course: "Augusta National",
      rating: 5,
      date: "September 2024",
      review: "A once-in-a-lifetime experience. The course is even more beautiful in person than on TV. Every detail is perfect - from the azaleas to the perfectly manicured greens. The staff treatment was world-class throughout.",
      helpful: 31,
      verified: true
    },
    {
      id: "4",
      name: "David Thompson",
      location: "Liverpool, England",
      course: "Royal Liverpool",
      rating: 4,
      date: "August 2024",
      review: "Historic links golf at its finest. The course has hosted many Open Championships and you can feel the history in every shot. Challenging wind conditions made for an authentic links experience. Excellent clubhouse facilities.",
      helpful: 15,
      verified: true
    },
    {
      id: "5",
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      course: "St Andrews Old Course",
      rating: 5,
      date: "July 2024",
      review: "Magical experience playing the Home of Golf. The course layout is genius - simple yet strategic. The town of St Andrews is charming, and the whole experience felt like a pilgrimage every golfer should make.",
      helpful: 22,
      verified: true
    },
    {
      id: "6",
      name: "Robert Johnson",
      location: "New York, USA",
      course: "Royal County Down",
      rating: 4,
      date: "June 2024",
      review: "One of the most beautiful courses I've ever played. The views are stunning and the course design is brilliant. Some blind shots can be tricky for first-time players, but that's part of the charm of traditional links golf.",
      helpful: 12,
      verified: true
    }
  ];

  const courses = ["all", "St Andrews Old Course", "Royal County Down", "Royal Liverpool", "Augusta National"];

  const filteredReviews = selectedCourse === "all" 
    ? reviews 
    : reviews.filter(review => review.course === selectedCourse);

  const getBackgroundImage = (course: string) => {
    switch (course) {
      case "St Andrews Old Course":
        return "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80')";
      case "Royal County Down":
        return "url('https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80')";
      case "Royal Liverpool":
        return "url('https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')";
      case "Augusta National":
        return "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80')";
      default:
        return "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80')";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-emerald-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: getBackgroundImage(selectedCourse === "all" ? "St Andrews Old Course" : selectedCourse)
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center h-full">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Golf Course Reviews
            </h1>
            <p className="text-xl text-stone-200 max-w-2xl leading-relaxed">
              Discover what fellow golfers say about the world's most prestigious courses
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Filter by Course</h2>
          <div className="flex flex-wrap gap-3">
            {courses.map((course) => (
              <Button
                key={course}
                variant={selectedCourse === course ? "default" : "outline"}
                onClick={() => setSelectedCourse(course)}
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedCourse === course
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {course === "all" ? "All Courses" : course}
              </Button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="bg-white/80 backdrop-blur-lg border border-stone-200/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg text-slate-900">{review.name}</CardTitle>
                        {review.verified && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {review.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {review.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {review.course}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4 text-base">
                  {review.review}
                </p>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-12 rounded-3xl">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Share Your Golf Experience
            </h3>
            <p className="text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have you played at one of these legendary courses? Help fellow golfers by sharing your experience and insights.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg">
              Write a Review
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
