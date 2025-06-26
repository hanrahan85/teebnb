
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Mail, Lock, User, Trophy, MapPin, Star, CheckCircle, Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user is already authenticated
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate("/list-property");
    }
  }, [user, navigate]);

  // Check if user just verified their email
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success("🎉 Email verified successfully! You can now sign in with your credentials.", {
        duration: 8000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
        }
      });
      // Switch to sign in tab if user just verified
      setActiveTab("signin");
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in error:', error);
      if (error.message.includes('Email not confirmed')) {
        toast.error("Please verify your email first. Check your inbox for the verification link.", {
          duration: 6000,
        });
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("🏌️ Welcome back to TeeBnB!", {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
      navigate("/list-property");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up error:', error);
      if (error.message.includes('User already registered')) {
        toast.error("This email is already registered. Please sign in instead or use a different email.");
        setActiveTab("signin");
      } else {
        toast.error(error.message);
      }
    } else {
      setShowVerificationMessage(true);
      toast.success("📧 Account created! Please check your email to verify your account.", {
        duration: 8000,
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    }
    setLoading(false);
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border border-emerald-200/60 shadow-2xl rounded-3xl text-center">
          <div className="animate-bounce mb-6">
            <Mail className="h-20 w-20 text-emerald-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-4">Check Your Email!</h1>
          <p className="text-emerald-700 mb-6 text-lg">
            We've sent a verification link to <strong className="text-emerald-800">{email}</strong>
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-emerald-700 mb-2">
              📱 <strong>Check your email and click the verification link</strong>
            </p>
            <p className="text-xs text-emerald-600">
              The link will bring you back here automatically!
            </p>
          </div>
          <Button
            onClick={() => setShowVerificationMessage(false)}
            variant="outline"
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Back to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Marketing content */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-emerald-900 mb-4">
              TeeBnB Host
            </h1>
            <p className="text-xl text-emerald-700 mb-8">
              Turn your golf-adjacent property into a profitable accommodation for golf travelers worldwide
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">Premium Golf Destinations</h3>
                <p className="text-emerald-600">Host guests visiting world-class golf courses and tournaments</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">Perfect Location</h3>
                <p className="text-emerald-600">Properties near golf courses are in high demand year-round</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">Premium Earnings</h3>
                <p className="text-emerald-600">Golf travelers often book longer stays and pay premium rates</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-100 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">Start earning today</h3>
            <p className="text-emerald-700">Join thousands of hosts already earning from golf tourism</p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border border-emerald-200/60 shadow-2xl rounded-3xl">
          <div className="text-center mb-8">
            <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl w-fit mx-auto mb-6">
              <Home className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Join TeeBnB</h1>
            <p className="text-emerald-600">Start hosting golf travelers at your property</p>
          </div>

          {searchParams.get('verified') === 'true' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Email Verified Successfully! 🎉</span>
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                You can now sign in with your credentials below.
              </p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signup">Get Started</TabsTrigger>
              <TabsTrigger value="signin">I'm a Host</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="signup-name" className="text-emerald-800 font-semibold mb-3 block">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 bg-white/95 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-emerald-800 font-semibold mb-3 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 bg-white/95 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-emerald-800 font-semibold mb-3 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a password (min. 6 characters)"
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 bg-white/95 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 text-lg font-semibold rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Start Hosting"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="signin-email" className="text-emerald-800 font-semibold mb-3 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 bg-white/95 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signin-password" className="text-emerald-800 font-semibold mb-3 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 bg-white/95 rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 text-lg font-semibold rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Continue to Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
