
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, MapPin, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-stone-800 to-emerald-900">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%)
          `,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px, 40px 40px'
        }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="bg-gradient-to-r from-white via-stone-200 to-emerald-200 bg-clip-text text-transparent">
              TeeBnB
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-stone-200 mb-6 max-w-5xl mx-auto animate-fade-in font-light leading-relaxed tracking-wide">
            Discover the world's most prestigious golf destinations
          </p>
          <p className="text-lg text-stone-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Curated luxury golf experiences at championship courses and premium resorts worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
            <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
              <Award className="h-5 w-5 mr-3" />
              Championship Courses
            </Badge>
            <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
              <MapPin className="h-5 w-5 mr-3" />
              Premium Destinations
            </Badge>
            <Badge variant="secondary" className="px-8 py-4 bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25 transition-all text-base">
              <Star className="h-5 w-5 mr-3" />
              Luxury Experiences
            </Badge>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = '/reviews'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
            >
              Read Golf Course Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
