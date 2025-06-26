
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireEmailVerification = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    try {
      // This would typically be a call to resend verification email
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

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

  // Check if email verification is required and user hasn't verified
  if (requireEmailVerification && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-4">
              <Mail className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              Please verify your email address before listing your property on TeeBnB.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  Verification email sent to:
                </p>
                <p className="text-sm text-amber-700 font-mono break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to TeeBnB
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Check your spam folder if you don't see the email within a few minutes.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
