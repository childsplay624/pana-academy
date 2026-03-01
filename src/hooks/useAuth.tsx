import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { sendEmail, emailTemplates } from '@/services/emailService';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  website?: string | null;
  education?: string | null;
  work_experience?: string | null;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const displayName = fullName || email;

    try {
      // First create user without sending Supabase's confirmation email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: displayName,
            email_verified: false // Custom flag to track verification status
          }
        }
      });

      if (signUpError) throw signUpError;

      // If signup was successful, send welcome email via Edge Function
      // Note: Supabase also sends its own confirmation email based on project settings.
      if (data.user) {
        // Fire-and-forget: don't block signup if email fails
        const { subject, html } = emailTemplates.welcome(displayName);
        sendEmail({ to: email, subject, html }).catch((emailError) => {
          console.warn('Welcome email failed to send (non-critical):', emailError);
        });
      }

      return { error: null };

    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    return { error };
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      // Supabase sends the password reset email natively via its auth system.
      // We do NOT send a separate custom email to avoid duplicate/broken emails.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // Filter out undefined values to avoid database constraint issues
      const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
        const value = updates[key as keyof Profile];
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<Profile>);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchUserProfile(user.id);

      return { error: null };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
