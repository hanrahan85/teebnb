
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Signing up user:', email);
    
    const redirectUrl = `${window.location.origin}/auth?verified=true`;
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
      return { error };
    }

    // Send custom TeeBnB branded email using the edge function
    if (data.user && !data.user.email_confirmed_at) {
      try {
        // Get the verification URL from Supabase's response
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email: email,
          options: {
            redirectTo: redirectUrl
          }
        });

        if (linkError) {
          console.error('Link generation error:', linkError);
        } else if (linkData.properties?.verification_token) {
          // Send custom email with the actual verification token
          const { error: emailError } = await supabase.functions.invoke('send-custom-auth-email', {
            body: { 
              email, 
              token: linkData.properties.verification_token,
              type: 'signup',
              redirectTo: redirectUrl
            }
          });
          
          if (emailError) {
            console.error('Custom email error:', emailError);
          } else {
            console.log('Custom verification email sent successfully');
          }
        }
      } catch (emailError) {
        console.error('Custom email function error:', emailError);
      }
    }

    console.log('Signup successful:', data);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Signin error:', error);
    } else {
      console.log('Signin successful:', data);
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
