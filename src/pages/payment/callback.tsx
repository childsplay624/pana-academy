import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment, handlePaymentSuccess } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  const { toast } = useToast();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const reference = searchParams.get('reference') || searchParams.get('transaction_id');
        const provider = searchParams.get('provider') as 'paystack' | 'flutterwave' || 'paystack';
        const courseId = searchParams.get('courseId');
        
        if (!reference || !courseId) {
          throw new Error('Missing payment reference or course ID');
        }

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Verify payment with the provider
        const isPaymentValid = await verifyPayment(reference, provider);
        
        if (!isPaymentValid) {
          throw new Error('Payment verification failed');
        }

        // Handle successful payment
        await handlePaymentSuccess(user.id, courseId, reference, provider);
        
        setStatus('success');
        setMessage('Payment successful! You are now enrolled in the course.');
        
        // Show success toast
        toast({
          title: 'Payment Successful',
          description: 'You have been successfully enrolled in the course.',
        });
        
        // Redirect to course after a delay
        setTimeout(() => {
          navigate(`/learn/${courseId}`);
        }, 3000);
        
      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage(
          error instanceof Error 
            ? error.message 
            : 'An error occurred while processing your payment. Please contact support.'
        );
      }
    };

    processPayment();
  }, [searchParams, user, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Payment Successful!</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to course...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Payment Failed</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
