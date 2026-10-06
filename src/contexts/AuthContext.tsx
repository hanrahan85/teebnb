
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
  /** True when the signed-in user's email is in public.admins. */
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin membership against the database whenever the user changes.
  // Deliberately not derived from anything in the client — the same table
  // backs the RLS policies, so the UI and the database agree by construction.
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user?.email) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .maybeSingle();
      if (!cancelled) setIsAdmin(Boolean(data));
    };
    check();
    return () => { cancelled = true; };
  }, [user]);

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
    console.log('Starting signup process for:', email);
    
    const redirectUrl = `${window.location.origin}/list-property?welcome=true`;
    console.log('Redirect URL:', redirectUrl);
    
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
    
    console.log('Signup response:', { error, data });
    
    if (error) {
      console.error('Signup error:', error);
      return { error };
    }

    console.log('Signup successful. User will receive verification email.');

    // Tell the owner straight away. Deliberately not awaited — a notification
    // failure must never make a successful sign-up look broken to the user.
    supabase.functions
      .invoke('send-signup-notification', { body: { email, source: 'signup' } })
      .catch((e) => console.error('Signup notification failed to send:', e));

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
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
