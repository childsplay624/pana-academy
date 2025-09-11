import { supabase } from '@/integrations/supabase/client';

export const signInWithLinkedIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with LinkedIn:', error);
    throw error;
  }

  return data;
};

export const handleOAuthCallback = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }

    return data.session;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    throw error;
  }
};
