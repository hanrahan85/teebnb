import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, MapPin, Trophy } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen golf-hero-bg overflow-hidden">
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 luxury-pattern"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl">
          {/* Premium badge */}
          <div className="mb-8 fade-in">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2 text-sm font-medium">
              <Trophy className="h-4 w-4 mr-2" />
              Premium Golf Destinations
            </Badge>
          </div>
          
          {/* Main heading */}
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-heading font-bold text-white mb-6 fade-in tracking-tight leading-tight">
            TeeBnB
          </h1>
          
          <p className="text-3xl md:text-4xl lg:text-5xl text-white/90 mb-8 font-accent italic fade-in">
            Stay Where You Play
          </p>
          
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed fade-in font-body">
            A modern, premium platform for golfers seeking accommodation near championship courses and tournaments — like Airbnb for golf lovers.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in">
            <Button 
              onClick={() => window.location.href = '/reviews'}
              className="btn-primary text-lg px-10 py-5"
            >
              Explore Destinations
            </Button>
            
            <Button 
              variant="ghost" 
              className="btn-secondary text-lg group"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Video
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Premium Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">25</div>
              <div className="text-white/70 text-sm uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
