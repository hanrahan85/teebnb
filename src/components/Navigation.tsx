import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log('Navigation component rendering with enlarged logo');

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo - Left Aligned */}
          <div className="flex items-center py-3">
            <a href="/" className="flex items-center" onClick={closeMobileMenu}>
              <img 
                src="/lovable-uploads/9fdc648b-0426-40d5-a6e3-26dca5d25b8d.png" 
                alt="TeeBnB - Golf Accommodation Platform" 
                className="h-10 sm:h-12 md:h-14 w-auto transition-opacity duration-200 hover:opacity-90"
              />
            </a>
          </div>
          
          {/* Desktop Navigation Links - Right Aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a 
              href="/search-results" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200 text-sm lg:text-base"
            >
              Browse Stays
            </a>
            <a 
              href="/list-property" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200 text-sm lg:text-base"
            >
              List Your Property
            </a>
            <a 
              href="/about" 
              className="text-white font-body font-medium hover:text-secondary transition-colors duration-200 text-sm lg:text-base"
            >
              About
            </a>
            
            {user ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="text-white/80 text-xs lg:text-sm font-body max-w-24 lg:max-w-none truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-200 text-xs lg:text-sm"
                >
                  <LogOut className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                  className="text-white hover:text-secondary hover:bg-white/10 transition-all duration-200 text-xs lg:text-sm"
                >
                  Sign In
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                  className="bg-secondary text-black hover:opacity-90 transition-opacity duration-200 font-heading font-semibold text-xs lg:text-sm"
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
              className="text-white hover:bg-white/10 w-10 h-10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-primary-foreground/10 bg-primary">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="/search-results" 
                className="block px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px] flex items-center"
                onClick={closeMobileMenu}
              >
                Browse Stays
              </a>
              <a 
                href="/list-property" 
                className="block px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px] flex items-center"
                onClick={closeMobileMenu}
              >
                List Your Property
              </a>
              <a 
                href="/about" 
                className="block px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px] flex items-center"
                onClick={closeMobileMenu}
              >
                About
              </a>
              
              {user ? (
                <div className="border-t border-primary-foreground/10 pt-3 mt-3 space-y-2">
                  <div className="px-3 py-2 text-white/80 text-sm font-body">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline" 
                    size="sm"
                    className="mx-3 border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-200 w-auto min-h-[48px]"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="border-t border-primary-foreground/10 pt-3 mt-3 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      window.location.href = '/auth';
                      closeMobileMenu();
                    }}
                    className="mx-3 text-white hover:bg-white/10 transition-all duration-200 w-auto min-h-[48px] justify-start"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      window.location.href = '/auth';
                      closeMobileMenu();
                    }}
                    className="mx-3 bg-secondary text-black hover:opacity-90 transition-opacity duration-200 font-heading font-semibold w-auto min-h-[48px]"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;