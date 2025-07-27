import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  LogIn, 
  Trophy
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-bold text-primary">TeeBnB</h1>
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Golf Stays
              </Badge>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="font-heading font-semibold"
              onClick={() => window.location.href = '/search-results'}
            >
              Find Stays
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="premium" 
                  size="sm"
                  onClick={() => window.location.href = '/list-property'}
                >
                  List Property
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;