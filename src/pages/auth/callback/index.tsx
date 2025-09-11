import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { handleOAuthCallback } from '@/lib/auth-utils';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const session = await handleOAuthCallback();
        if (session) {
          // Redirect to dashboard or home page after successful login
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to sign in. Please try again.');
        // Redirect to login page after showing error
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <h2 className="text-2xl font-semibold text-gray-800">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we authenticate your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
