import React from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Trophy, 
  Shield, 
  CheckCircle, 
  Users,
  Star,
  Clock,
  Wifi,
  Car,
  Coffee,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

const HomePage = () => {
  const howItWorksSteps = [
    {
      icon: Search,
      title: "Search",
      description: "Find the perfect stay near your favorite golf course"
    },
    {
      icon: Calendar,
      title: "Book", 
      description: "Secure your accommodation with our easy booking process"
    },
    {
      icon: Trophy,
      title: "Stay & Play",
      description: "Enjoy your golf vacation with premium amenities"
    }
  ];

  const featuredDestinations = [
    {
      id: 1,
      name: "Algarve, Portugal",
      image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop",
      description: "World-class golf resorts with stunning ocean views",
      courses: "25+ championship courses"
    },
    {
      id: 2,
      name: "Scotland Highlands",
      image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=600&h=400&fit=crop",
      description: "Home of golf with historic links courses",
      courses: "50+ legendary courses"
    },
    {
      id: 3,
      name: "Pebble Beach, California",
      image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=600&h=400&fit=crop",
      description: "Iconic coastal golf with breathtaking Pacific views",
      courses: "8 world-renowned courses"
    },
    {
      id: 4,
      name: "Costa del Sol, Spain",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      description: "Mediterranean golf paradise with year-round sunshine",
      courses: "30+ premium courses"
    },
    {
      id: 5,
      name: "Scottsdale, Arizona",
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=600&h=400&fit=crop",
      description: "Desert golf at its finest with luxury resorts",
      courses: "200+ desert courses"
    },
    {
      id: 6,
      name: "Kiawah Island, South Carolina",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop",
      description: "Championship golf on pristine barrier island",
      courses: "5 signature courses"
    }
  ];

  const whyTeeBnBFeatures = [
    {
      icon: MapPin,
      title: "Geo-Based Listings",
      description: "Properties perfectly located near championship golf courses"
    },
    {
      icon: CheckCircle,
      title: "Golf-Ready Hosts",
      description: "Hosts who understand golfers' unique needs and schedules"
    },
    {
      icon: Trophy,
      title: "Tailored Stays",
      description: "Accommodations designed specifically for golf travelers"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with full booking guarantees"
    },
    {
      icon: Users,
      title: "Verified Hosts",
      description: "Thoroughly vetted hosts committed to exceptional service"
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Luxury amenities that enhance your golf vacation"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen golf-hero-bg overflow-hidden">
        <div className="absolute inset-0 luxury-pattern"></div>
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen pt-24 pb-16">
          <div className="text-center max-w-5xl w-full">

            {/* Eyebrow badge */}
            <div className="mb-5 fade-in">
              <Badge className="bg-secondary/90 text-black border-0 px-5 py-2 text-sm font-heading font-bold uppercase tracking-wider shadow-lg">
                <Trophy className="h-4 w-4 mr-2" />
                The Golf Travel Marketplace
              </Badge>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-5 fade-in tracking-tight leading-[1.1]">
              Stay Where<br className="hidden sm:block" /> You Play
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/85 mb-8 font-body leading-relaxed fade-in max-w-2xl mx-auto">
              Find and book unique stays near the world's finest golf courses — from St Andrews to Pebble Beach
            </p>

            {/* Search bar */}
            <div className="w-full mb-10 fade-in">
              <SearchBar />
            </div>

            {/* Trust stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/80 fade-in">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">500+ Golf Courses Nearby</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">30+ Destinations</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Instant Book Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 sm:mb-6">How It Works</h2>
            <p className="text-base sm:text-lg text-muted-foreground font-body max-w-2xl mx-auto px-4">
              Three simple steps to your perfect golf vacation
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed text-sm sm:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Golf Destinations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 sm:mb-6">Featured Golf Destinations</h2>
            <p className="text-base sm:text-lg text-muted-foreground font-body max-w-2xl mx-auto px-4">
              Discover the world's most prestigious golf destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-48 sm:h-56 lg:h-64">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                    <h3 className="text-lg sm:text-xl font-heading font-bold mb-1">{destination.name}</h3>
                    <p className="text-xs sm:text-sm text-white/80 flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {destination.courses}
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-muted-foreground font-body mb-4 leading-relaxed text-sm sm:text-base">{destination.description}</p>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground min-h-[44px]">
                    View Stays
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why TeeBnB */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 sm:mb-6">Why TeeBnB?</h2>
            <p className="text-base sm:text-lg text-muted-foreground font-body max-w-2xl mx-auto px-4">
              The ultimate platform designed specifically for golf travelers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {whyTeeBnBFeatures.map((feature, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <img 
                src="/teebnb-logo.svg" 
                alt="TeeBnB" 
                className="h-6 sm:h-8 w-auto mb-4"
              />
              <p className="text-muted-foreground font-body mb-6 max-w-md text-sm sm:text-base">
                The world's leading platform for golf accommodation. Stay where you play.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent w-10 h-10">
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent w-10 h-10">
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent w-10 h-10">
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4 text-base sm:text-lg">Company</h4>
              <ul className="space-y-2 font-body">
                <li><a href="/about" className="text-muted-foreground hover:text-accent transition-colors text-sm sm:text-base min-h-[44px] block py-1">About</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-accent transition-colors text-sm sm:text-base min-h-[44px] block py-1">Contact</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-accent transition-colors text-sm sm:text-base min-h-[44px] block py-1">Terms</a></li>
                <li><a href="/privacy" className="text-muted-foreground hover:text-accent transition-colors text-sm sm:text-base min-h-[44px] block py-1">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4 text-base sm:text-lg">Contact</h4>
              <ul className="space-y-3 font-body">
                <li className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">hello@teebnb.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground font-body text-sm sm:text-base">
              © 2024 TeeBnB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;