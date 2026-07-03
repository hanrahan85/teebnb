
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Mail, Lock, User, CheckCircle, Loader2 } from "lucide-react";

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

  // Pre-select tab based on ?mode=signin param
  useEffect(() => {
    if (searchParams.get('mode') === 'signin') {
      setActiveTab('signin');
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    console.log('Attempting sign in for:', email);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in error:', error);
      if (error.message.includes('Email not confirmed')) {
        toast.error("Please check your email and click the verification link first.", {
          duration: 8000,
        });
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error("Invalid email or password. Make sure you've verified your email first.", {
          duration: 8000,
        });
      } else {
        toast.error(`Sign in failed: ${error.message}`, {
          duration: 6000,
        });
      }
    } else {
      toast.success("🏌️ Welcome to TeeBnB!", {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
      navigate("/dashboard");
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
    console.log('Attempting signup for:', email);
    
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up error:', error);
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        toast.error("This email is already registered. Please use a different email or try signing in.", {
          duration: 8000,
        });
      } else {
        toast.error(`Signup failed: ${error.message}`, {
          duration: 6000,
        });
      }
    } else {
      console.log('Signup successful - verification email should be sent');
      setShowVerificationMessage(true);
      toast.success("📧 Account created! Check your email for the verification link.", {
        duration: 12000,
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23006633%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative flex items-center justify-center p-4 min-h-screen">
          <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border-2 border-accent/20 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden text-center">
            {/* Subtle gold accent border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 rounded-3xl"></div>
            
            <div className="relative">
              <div className="animate-bounce mb-6">
                <Mail className="h-20 w-20 text-primary mx-auto" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-primary mb-4">Check Your Email!</h1>
              <p className="text-primary/80 mb-6 text-lg font-body">
                We've sent a verification link to <strong className="text-primary">{email}</strong>
              </p>
              <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl mb-6">
                <p className="text-sm text-primary font-body mb-3">
                  📱 <strong>Click the verification link in your email</strong>
                </p>
                <p className="text-xs text-primary/70 font-body mb-2">
                  Check your spam/junk folder if you don't see it!
                </p>
                <p className="text-xs text-primary/70 font-body">
                  After clicking the link, you'll be automatically taken to list your property.
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowVerificationMessage(false);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                variant="outline"
                className="w-full border-2 border-primary/30 text-primary hover:bg-primary/5 h-12 font-heading font-semibold rounded-2xl transition-all duration-300"
              >
                Try Different Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23006633%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Marketing content */}
        <div className="hidden lg:block space-y-8 pl-8">
          <div>
            <h1 className="text-5xl font-heading font-bold text-primary mb-4 leading-tight">
              TeeBnB Host
            </h1>
            <p className="text-xl font-body text-primary/80 mb-8 leading-relaxed">
              Turn your golf-adjacent property into a profitable accommodation for golf travelers worldwide
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/20 rounded-full group-hover:bg-accent/30 transition-colors duration-300">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary">Simple 3-Step Process</h3>
                <p className="text-primary/70 font-body">Sign up → Verify email → List your property</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/20 rounded-full group-hover:bg-accent/30 transition-colors duration-300">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary">Instant Verification</h3>
                <p className="text-primary/70 font-body">Quick email verification gets you started in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-accent/20 rounded-full group-hover:bg-accent/30 transition-colors duration-300">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary">Start Earning Today</h3>
                <p className="text-primary/70 font-body">List your property and connect with golf travelers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border-2 border-accent/20 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
          {/* Subtle gold accent border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 rounded-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl w-fit mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Home className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-primary mb-2">Join TeeBnB</h1>
              <p className="text-primary/70 font-body">Start hosting golf travelers at your property</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-primary/5 border border-accent/20 rounded-2xl p-1">
                <TabsTrigger 
                  value="signup" 
                  className="font-heading font-semibold data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-md rounded-xl transition-all duration-300"
                >
                  Get Started
                </TabsTrigger>
                <TabsTrigger 
                  value="signin"
                  className="font-heading font-semibold data-[state=active]:bg-accent data-[state=active]:text-primary data-[state=active]:shadow-md rounded-xl transition-all duration-300"
                >
                  I'm a Host
                </TabsTrigger>
              </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-primary font-heading font-semibold text-sm flex items-center gap-2">
                    Full Name
                    <span className="text-accent text-xs">*</span>
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors duration-300" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-12 h-14 border-2 border-primary/20 focus:border-accent bg-white/95 rounded-2xl font-body text-primary placeholder:text-primary/40 hover:border-primary/30 transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-primary font-heading font-semibold text-sm flex items-center gap-2">
                    Email Address
                    <span className="text-accent text-xs">*</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors duration-300" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-12 h-14 border-2 border-primary/20 focus:border-accent bg-white/95 rounded-2xl font-body text-primary placeholder:text-primary/40 hover:border-primary/30 transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-primary font-heading font-semibold text-sm flex items-center gap-2">
                    Password
                    <span className="text-accent text-xs">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors duration-300" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a password (min. 6 characters)"
                      className="pl-12 h-14 border-2 border-primary/20 focus:border-accent bg-white/95 rounded-2xl font-body text-primary placeholder:text-primary/40 hover:border-primary/30 transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-primary h-14 text-lg font-heading font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-accent/20 uppercase tracking-wide"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account & Verify Email"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-primary font-heading font-semibold text-sm flex items-center gap-2">
                    Email Address
                    <span className="text-accent text-xs">*</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors duration-300" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-12 h-14 border-2 border-primary/20 focus:border-accent bg-white/95 rounded-2xl font-body text-primary placeholder:text-primary/40 hover:border-primary/30 transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-primary font-heading font-semibold text-sm flex items-center gap-2">
                    Password
                    <span className="text-accent text-xs">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-accent transition-colors duration-300" />
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-12 h-14 border-2 border-primary/20 focus:border-accent bg-white/95 rounded-2xl font-body text-primary placeholder:text-primary/40 hover:border-primary/30 transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-primary h-14 text-lg font-heading font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-accent/20 uppercase tracking-wide"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In & Continue"
                  )}
                </Button>
              </form>
            </TabsContent>
            </Tabs>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
