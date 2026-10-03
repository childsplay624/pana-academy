import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { enrollInCourse } from '@/services/enrollmentService';
import { useNavigate } from 'react-router-dom';

import { usePlatformSettings } from '@/hooks/usePlatformSettings';

interface PaymentButtonProps {
  courseId: string;
  amount: number;
  courseTitle: string;
  isExpired?: boolean;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  amount,
  courseTitle,
  isExpired = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;

  if (isExpired) {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <Button
          disabled
          className="w-full bg-zinc-400 text-white cursor-not-allowed border-none font-semibold shadow-none"
          size="lg"
        >
          Enrollment Closed (Date Passed)
        </Button>
        <Button
          onClick={() => navigate(`/contact?subject=Next+Cohort+Enquiry&course=${encodeURIComponent(courseTitle)}`)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs rounded-xl shadow-sm transition-all"
        >
          Request / Enquire for Next Session
        </Button>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to enroll',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    try {
      // Check if course is free
      const isFree = amount === 0;

      if (isFree) {
        // Free course - enroll directly
        const { data, error } = await enrollInCourse(courseId);

        if (error) {
          throw error;
        }

        toast({
          title: 'Success!',
          description: 'You have been enrolled in the course',
        });

        // Redirect to learning page
        setTimeout(() => {
          navigate(`/course/${courseId}/learn`);
        }, 1000);
      } else {
        // Paid course - redirect to payment page
        toast({
          title: 'Redirecting to Payment',
          description: `Please complete payment to enroll in this course`,
        });

        setTimeout(() => {
          navigate(`/payment/${courseId}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process enrollment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isFree = amount === 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <Button
        onClick={handleEnroll}
        disabled={isProcessing}
        className="w-full bg-pana-gold hover:bg-pana-gold/90 text-white hover:text-white"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isFree ? (
          'Enroll Now - Free'
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Enroll Now {hidePrices ? '' : `- ₦${amount.toLocaleString()}`}
          </>
        )}
      </Button>

      {!isFree && !hidePrices && (
        <p className="text-xs text-muted-foreground text-center">
          🔒 Secure payment • You'll be redirected to complete payment
        </p>
      )}
    </div>
  );
};
