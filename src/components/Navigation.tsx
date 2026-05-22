import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="flex justify-between items-center h-24 sm:h-28">
          {/* Logo - Left Aligned */}
          <div className="flex items-center">
            <a href="/" className="flex items-center" onClick={closeMobileMenu}>
              <img
                src="/lovable-uploads/9fdc648b-0426-40d5-a6e3-26dca5d25b8d.png"
                alt="TeeBnB - Golf Accommodation Platform"
                className="h-20 sm:h-24 md:h-28 w-auto transition-opacity duration-200 hover:opacity-90"
              />
            </a>
          </div>

          {/* Desktop Navigation Links - Right Aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => navigate('/search-results', { state: {} })}
              className="text-secondary font-body font-semibold hover:text-secondary/80 transition-colors duration-200 text-sm lg:text-base bg-transparent border-none outline-none appearance-none cursor-pointer"
            >
              Browse Stays
            </button>
            <button
              onClick={() => navigate('/list-property')}
              className="text-secondary font-body font-semibold hover:text-secondary/80 transition-colors duration-200 text-sm lg:text-base bg-transparent border-none outline-none appearance-none cursor-pointer"
            >
              List Your Property
            </button>

            {user ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1 text-secondary font-body font-semibold hover:text-secondary/80 transition-colors duration-200 text-sm lg:text-base bg-transparent border-none outline-none appearance-none cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <span className="text-white/70 text-xs lg:text-sm font-body max-w-24 lg:max-w-none truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-white/70 font-body font-medium hover:text-white transition-colors duration-200 text-sm lg:text-base bg-transparent border-none outline-none appearance-none cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 lg:gap-6">
                <button
                  onClick={() => navigate('/auth')}
                  className="text-secondary font-body font-semibold hover:text-secondary/80 transition-colors duration-200 text-sm lg:text-base bg-transparent border-none outline-none appearance-none cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-secondary text-black font-heading font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity duration-200 text-sm lg:text-base border-none outline-none appearance-none cursor-pointer"
                >
                  Register
                </button>
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
              <button
                className="block w-full text-left px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                onClick={() => { navigate('/search-results', { state: {} }); closeMobileMenu(); }}
              >
                Browse Stays
              </button>
              <button
                className="block w-full text-left px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                onClick={() => { navigate('/list-property'); closeMobileMenu(); }}
              >
                List Your Property
              </button>

              {user ? (
                <div className="border-t border-primary-foreground/10 pt-3 mt-3 space-y-1">
                  <button
                    className="block w-full text-left px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                    onClick={() => { navigate('/dashboard'); closeMobileMenu(); }}
                  >
                    Dashboard
                  </button>
                  <div className="px-3 py-2 text-white/70 text-sm font-body">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-3 text-white/80 font-body font-medium hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                    onClick={() => { handleSignOut(); }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-primary-foreground/10 pt-3 mt-3 space-y-1">
                  <button
                    className="block w-full text-left px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                    onClick={() => { navigate('/auth'); closeMobileMenu(); }}
                  >
                    Sign In
                  </button>
                  <button
                    className="block w-full text-left px-3 py-3 text-white font-body font-medium hover:bg-white/10 transition-colors duration-200 rounded-md min-h-[48px]"
                    onClick={() => { navigate('/auth'); closeMobileMenu(); }}
                  >
                    Register
                  </button>
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