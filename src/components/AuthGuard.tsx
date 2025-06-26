
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireEmailVerification = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (requireEmailVerification && user && !user.email_confirmed_at) {
        navigate('/auth');
        return;
      }
    }
  }, [user, loading, navigate, requireEmailVerification]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireEmailVerification && !user.email_confirmed_at) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
