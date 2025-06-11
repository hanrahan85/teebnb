
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, MapPin, Star, Trophy, Crown, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-luxury-brown-900 via-luxury-brown-800 to-luxury-forest-900">
      {/* Sophisticated luxury pattern overlay */}
      <div className="absolute inset-0 luxury-texture opacity-30"></div>
      
      {/* Elegant golf pattern */}
      <div className="absolute inset-0 golf-pattern opacity-20"></div>
      
      {/* Subtle gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-brown-900/60 via-transparent to-luxury-brown-800/40"></div>
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-luxury-brown-900/80 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center min-h-screen">
        <div className="text-center w-full">
          {/* Luxury badge */}
          <div className="mb-8 flex justify-center">
            <Badge className="px-6 py-3 bg-luxury-gold-500/20 text-luxury-gold-400 border-luxury-gold-400/30 backdrop-blur-md text-base font-display">
              <Crown className="h-5 w-5 mr-2" />
              Est. 1923 • Luxury Golf Experiences
            </Badge>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-display font-bold mb-8 animate-fade-in">
            <span className="text-luxury-gold block mb-4">TeeBnB</span>
            <span className="text-4xl md:text-5xl text-luxury-cream-200 font-light tracking-wider">
              Championship Golf Estates
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-luxury-cream-300 mb-6 max-w-4xl mx-auto animate-fade-in font-display font-light leading-relaxed">
            Curated Collection of the World's Finest Golf Destinations
          </p>
          
          <p className="text-lg text-luxury-cream-400 mb-16 max-w-3xl mx-auto leading-relaxed font-body">
            Experience championship courses, luxury accommodations, and impeccable service at golf's most prestigious venues
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <Badge variant="secondary" className="px-8 py-4 glass-luxury hover:bg-white/30 transition-all text-base font-body">
              <Trophy className="h-5 w-5 mr-3 text-luxury-gold-500" />
              Championship Venues
            </Badge>
            <Badge variant="secondary" className="px-8 py-4 glass-luxury hover:bg-white/30 transition-all text-base font-body">
              <Crown className="h-5 w-5 mr-3 text-luxury-gold-500" />
              Luxury Concierge
            </Badge>
            <Badge variant="secondary" className="px-8 py-4 glass-luxury hover:bg-white/30 transition-all text-base font-body">
              <Sparkles className="h-5 w-5 mr-3 text-luxury-gold-500" />
              Exclusive Access
            </Badge>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = '/reviews'}
              className="btn-luxury text-white px-12 py-6 rounded-full text-xl font-display font-semibold shadow-2xl hover:shadow-luxury-gold-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Explore Premium Golf Destinations
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="mt-20 flex justify-center space-x-12 opacity-60">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-luxury-gold-400">500+</div>
              <div className="text-luxury-cream-400 font-body">Premium Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-luxury-gold-400">50+</div>
              <div className="text-luxury-cream-400 font-body">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-luxury-gold-400">25</div>
              <div className="text-luxury-cream-400 font-body">Years Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
