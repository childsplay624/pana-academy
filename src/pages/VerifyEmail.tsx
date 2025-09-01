import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        // In a real app, you would verify the token and mark the email as verified
        // This is a simplified example that just updates the user's metadata
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        
        if (userError || !user) {
          throw new Error(userError?.message || 'Invalid or expired verification link');
        }

        // Update user's email_verified status in the database
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { 
            user_metadata: { 
              ...user.user_metadata,
              email_verified: true 
            } 
          }
        );

        if (updateError) {
          throw updateError;
        }

        setStatus('success');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
        
      } catch (err: any) {
        console.error('Email verification error:', err);
        setStatus('error');
        setError(err.message || 'Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'verifying' ? 'Verifying Email...' : 
             status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'verifying' 
              ? 'Please wait while we verify your email address.'
              : status === 'success' 
                ? 'Your email has been successfully verified. Redirecting to login...'
                : 'We encountered an issue verifying your email.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                {error || 'An unknown error occurred. Please try again later.'}
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your email has been verified. You'll be redirected to the login page shortly.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-pana-gold hover:bg-pana-gold/90"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmail;
