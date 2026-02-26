import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { handlePaymentSuccess } from '@/services/paymentService';

export function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const { showNotification } = useNotifications();

    useEffect(() => {
        const processCallback = async () => {
            const reference = searchParams.get('reference');
            const status = searchParams.get('status');
            const courseId = searchParams.get('course_id');

            // Check for payment success
            if (status === 'success' && reference && courseId && user) {
                try {
                    // Handle payment success - this will create enrollment
                    const result = await handlePaymentSuccess(
                        user.id,
                        courseId,
                        reference,
                        'paystack' // Default to paystack, should be passed from payment initiation
                    );

                    if (result.success) {
                        toast({
                            title: "Payment Successful!",
                            description: "You have been enrolled in the course",
                        });

                        // Fire a persistent in-app notification
                        showNotification(
                            'enrollment',
                            'Enrollment Confirmed!',
                            'You have been successfully enrolled in your new course. Start learning now!',
                            `/course/${courseId}/learn`
                        );

                        // Redirect to course page
                        setTimeout(() => {
                            navigate(`/course/${courseId}/learn`);
                        }, 2000);
                    } else {
                        throw new Error('Failed to process enrollment');
                    }
                } catch (error) {
                    console.error('Payment callback error:', error);
                    toast({
                        title: "Error",
                        description: "Payment received but enrollment failed. Please contact support.",
                        variant: "destructive",
                    });

                    setTimeout(() => {
                        navigate('/courses');
                    }, 3000);
                }
            } else {
                // Payment failed or cancelled
                toast({
                    title: "Payment Failed",
                    description: "Your payment was not successful. Please try again.",
                    variant: "destructive",
                });

                setTimeout(() => {
                    if (courseId) {
                        navigate(`/payment/${courseId}`);
                    } else {
                        navigate('/courses');
                    }
                }, 3000);
            }
        };

        processCallback();
    }, [searchParams, user, navigate, toast]);

    const status = searchParams.get('status');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="max-w-md w-full mx-4">
                <CardContent className="p-8 text-center">
                    {status === 'success' ? (
                        <>
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Processing your enrollment...
                            </p>
                            <Loader2 className="h-8 w-8 animate-spin text-pana-gold mx-auto" />
                        </>
                    ) : (
                        <>
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your payment was not successful. Redirecting...
                            </p>
                            <Button
                                onClick={() => {
                                    const courseId = searchParams.get('course_id');
                                    navigate(courseId ? `/payment/${courseId}` : '/courses');
                                }}
                                className="bg-pana-gold hover:bg-pana-gold/90"
                            >
                                Try Again
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
