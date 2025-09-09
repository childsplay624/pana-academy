import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { initializePayment } from '@/services/paymentService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PaymentButtonProps {
  courseId: string;
  amount: number;
  courseTitle: string;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  amount,
  courseTitle,
  className = ''
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'paystack' | 'flutterwave'>('paystack');
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to make a payment',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const callbackUrl = `${window.location.origin}/payment/callback?courseId=${courseId}`;
      
      const response = await initializePayment(
        selectedProvider,
        amount,
        user.email!,
        {
          courseId,
          userId: user.id,
          fullName: user.user_metadata?.full_name || '',
          email: user.email!
        },
        callbackUrl
      );

      if (response.success && response.paymentLink) {
        // Redirect to payment provider
        window.location.href = response.paymentLink;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex space-x-4">
        <Button
          variant={selectedProvider === 'paystack' ? 'default' : 'outline'}
          onClick={() => setSelectedProvider('paystack')}
          className="flex-1 bg-black text-white hover:bg-black/90 hover:text-white"
        >
          Pay with Paystack
        </Button>
        <Button
          variant={selectedProvider === 'flutterwave' ? 'default' : 'outline'}
          onClick={() => setSelectedProvider('flutterwave')}
          className="flex-1 bg-black text-white hover:bg-black/90 hover:text-white"
        >
          Pay with Flutterwave
        </Button>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-black hover:bg-black/90 text-white hover:text-white"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ₦{amount.toLocaleString()} for {courseTitle}
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Secure payment processed by {selectedProvider === 'paystack' ? 'Paystack' : 'Flutterwave'}
      </p>
    </div>
  );
};
