import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  LogIn
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Left Aligned */}
          <div className="flex items-center py-3">
            <a href="/" className="flex items-center">
              <img 
                src="/lovable-uploads/9fdc648b-0426-40d5-a6e3-26dca5d25b8d.png" 
                alt="TeeBnB - Golf Accommodation Platform" 
                className="h-12 md:h-14 w-auto transition-opacity duration-200 hover:opacity-90"
              />
            </a>
          </div>
          
          {/* Navigation Links - Right Aligned */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/search-results" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200"
            >
              Browse Stays
            </a>
            <a 
              href="/list-property" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200"
            >
              List Your Property
            </a>
            <a 
              href="/about" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200"
            >
              About
            </a>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm font-body">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                  className="text-white hover:text-secondary hover:bg-white/10 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                  className="bg-secondary text-black hover:opacity-90 transition-opacity duration-200 font-heading font-semibold"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;