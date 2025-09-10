import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we're in development and show a warning if env vars are missing
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    'Missing Supabase environment variables. Some features may not work.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create a function to initialize the client
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client with error handling
    return {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
        signOut: () => Promise.reject(new Error('Supabase not configured')),
        user: () => ({ data: { user: null } }),
      },
      from: () => ({
        select: () => ({
          data: [],
          error: new Error('Supabase not configured'),
        }),
        insert: () => ({
          select: () => ({
            data: null,
            error: new Error('Supabase not configured'),
          }),
        }),
      }),
    } as any;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

// Export the Supabase client
export const supabase = createClient();
