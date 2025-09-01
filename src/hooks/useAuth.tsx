import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
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
      // First create the user without sending Supabase's confirmation email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: displayName,
            email_verified: false // Custom flag to track verification status
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // If signup was successful, send verification email via Resend
      if (data.user) {
        try {
          const { sendEmail, emailTemplates } = await import('@/services/emailService');
          
          // Generate email verification link
          const verificationLink = `${window.location.origin}/verify-email?token=${data.user.id}`;
          
          // Send verification email
          await sendEmail({
            to: email,
            subject: 'Verify your email address',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to PANA Academy, ${displayName}!</h2>
                <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                  Verify Email
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            `
          });
          
          // Send welcome email
          const { subject, html } = emailTemplates.welcome(displayName);
          await sendEmail({ to: email, subject, html });
          
          return { error: null };
          
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Delete the user if email sending fails to maintain data consistency
          if (data.user) {
            await supabase.auth.admin.deleteUser(data.user.id);
          }
          throw new Error('Failed to send verification email. Please try again.');
        }
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (!error) {
        try {
          const { sendEmail, emailTemplates } = await import('@/services/emailService');
          const resetLink = `${redirectUrl}?token=reset_token_placeholder`; // In a real app, this would be the actual reset token
          
          const { subject, html } = emailTemplates.passwordReset('User', resetLink);
          
          await sendEmail({
            to: email,
            subject,
            html,
          });
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
          // Don't fail the reset if email sending fails
        }
      }

      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
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