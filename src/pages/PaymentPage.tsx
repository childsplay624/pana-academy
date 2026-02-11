import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchCourseById } from '@/services/courseService';
import {
    initializePayment,
    savePaymentRecord,
    uploadReceipt,
    calculateTaxAmount,
    type PaymentProvider
} from '@/services/paymentService';
import { getBankDetails, type BankDetails } from '@/services/settingsService';
import { supabase } from '@/integrations/supabase/client';

export function PaymentPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [provider, setProvider] = useState<PaymentProvider>('paystack');
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const [loadingBankDetails, setLoadingBankDetails] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState<{
        paystack_enabled: boolean;
        flutterwave_enabled: boolean;
        manual_enabled: boolean;
    }>({
        paystack_enabled: true,
        flutterwave_enabled: true,
        manual_enabled: true
    });

    useEffect(() => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to continue with payment",
                variant: "destructive",
            });
            navigate('/auth');
            return;
        }

        if (courseId) {
            loadCourse();
        }

        loadBankInformation();
        loadPaymentSettings();
    }, [courseId, user]);

    const loadPaymentSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('platform_settings')
                .select('key, value')
                .in('key', ['paystack_enabled', 'flutterwave_enabled', 'manual_enabled']);

            if (error) throw error;

            const settings: any = {};
            data.forEach(item => {
                try {
                    settings[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                } catch {
                    settings[item.key] = item.value;
                }
            });

            setPaymentSettings({
                paystack_enabled: settings.paystack_enabled !== false,
                flutterwave_enabled: settings.flutterwave_enabled !== false,
                manual_enabled: settings.manual_enabled !== false
            });

            // Set default provider to first available payment method
            if (settings.paystack_enabled !== false) {
                setProvider('paystack');
            } else if (settings.flutterwave_enabled !== false) {
                setProvider('flutterwave');
            } else if (settings.manual_enabled !== false) {
                setProvider('manual');
            }
        } catch (error) {
            console.error('Error loading payment settings:', error);
        }
    };

    const loadBankInformation = async () => {
        setLoadingBankDetails(true);
        try {
            const details = await getBankDetails();
            setBankDetails(details);
        } catch (error) {
            console.error('Error loading bank details:', error);
        } finally {
            setLoadingBankDetails(false);
        }
    };

    const loadCourse = async () => {
        try {
            const data = await fetchCourseById(courseId!);

            if (!data) {
                toast({
                    title: "Error",
                    description: "Course not found",
                    variant: "destructive",
                });
                navigate('/courses');
                return;
            }

            // Check if course is free
            if ((data as any).is_free || data.price === 0) {
                toast({
                    title: "Free Course",
                    description: "This course is free. Redirecting to enrollment...",
                });
                navigate(`/course/${courseId}`);
                return;
            }

            setCourse(data);
        } catch (error) {
            console.error('Error loading course:', error);
            toast({
                title: "Error",
                description: "Failed to load course details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [taxCalculation, setTaxCalculation] = useState<{
        finalAmount: number;
        taxAmount: number;
        platformFee: number;
    } | null>(null);

    // Calculate tax when course loads
    useEffect(() => {
        if (course && courseId) {
            calculateTaxAmount(courseId, course.price).then(calculation => {
                setTaxCalculation(calculation);
            });
        }
    }, [course, courseId]);

    const handlePayment = async () => {
        if (!user || !course || !courseId) return;

        // If manual provider and no receipt file, tell user to upload
        if (provider === 'manual' && !receiptFile) {
            toast({
                title: "Receipt Required",
                description: "Please upload your payment receipt to continue",
                variant: "destructive"
            });
            return;
        }

        setProcessing(true);

        try {
            // Calculate tax and get final amount
            const { finalAmount, taxAmount, platformFee } = await calculateTaxAmount(courseId, course.price);
            
            // Initialize payment with selected provider using final amount
            const response = await initializePayment(
                provider,
                finalAmount,
                user.email || '',
                {
                    courseId,
                    userId: user.id,
                    email: user.email || '',
                    fullName: profile?.full_name
                },
                `${window.location.origin}/payment/callback`
            );

            if (!response.success) {
                throw new Error(response.message || 'Payment initialization failed');
            }

            // Save payment record to database
            if (response.reference) {
                const saveResult = await savePaymentRecord(
                    user.id,
                    courseId,
                    course.price, // Keep original amount for record
                    provider,
                    response.reference,
                    'pending'
                );

                if (saveResult.error) {
                    console.error('Failed to save payment record:', saveResult.error);
                    throw new Error('Failed to register payment in database. Please contact support.');
                }

                // Handle receipt upload for manual payments
                if (provider === 'manual' && receiptFile) {
                    setUploadingReceipt(true);
                    const uploadResult = await uploadReceipt(
                        user.id,
                        courseId,
                        response.reference,
                        receiptFile
                    );

                    if (!uploadResult.success) {
                        throw new Error('Failed to upload receipt. Please try again.');
                    }

                    toast({
                        title: "Payment Submitted",
                        description: "Your receipt has been uploaded. An admin will verify it shortly.",
                    });

                    // Redirect to dashboard or a "Thank You" page
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                    return;
                }
            }

            // Redirect to payment gateway for Paystack/Flutterwave
            if (response.paymentLink) {
                toast({
                    title: "Redirecting to Payment Gateway",
                    description: "Please complete your payment...",
                });
                window.location.href = response.paymentLink;
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast({
                title: "Payment Error",
                description: error instanceof Error ? error.message : "Failed to initialize payment",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
            setUploadingReceipt(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pana-gold" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">Course not found</p>
                        <Button className="mt-4" onClick={() => navigate('/courses')}>
                            Browse Courses
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-2xl mx-auto px-4">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate(`/course/${courseId}`)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Course
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Complete Payment</CardTitle>
                        <CardDescription>
                            Secure checkout for your course enrollment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Course Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        By {course.instructor_name || 'PANA Academy'}
                                    </p>
                                    {course.duration_hours && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Duration: {course.duration_hours} hours
                                        </p>
                                    )}
                                </div>
                                {course.thumbnail_url && (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-24 h-24 object-cover rounded-lg ml-4"
                                    />
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-blue-200">
                                <div className="space-y-2">
                                    {taxCalculation && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Course Price:</span>
                                                <span className="font-medium">₦{course.price.toLocaleString()}</span>
                                            </div>
                                            {taxCalculation.taxAmount > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Tax:</span>
                                                    <span className="font-medium">₦{taxCalculation.taxAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {taxCalculation.platformFee > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Platform Fee:</span>
                                                    <span className="font-medium">₦{taxCalculation.platformFee.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                                <span className="text-gray-700 font-medium">Total Amount:</span>
                                                <span className="text-3xl font-bold text-pana-navy">
                                                    ₦{taxCalculation.finalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {!taxCalculation && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 font-medium">Total Amount:</span>
                                            <span className="text-3xl font-bold text-pana-navy">
                                                ₦{course.price.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Select Payment Method</Label>
                            <RadioGroup value={provider} onValueChange={(v) => setProvider(v as PaymentProvider)}>
                                {paymentSettings.paystack_enabled && (
                                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="paystack" id="paystack" />
                                        <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                                            <div>
                                                <p className="font-medium">Paystack</p>
                                                <p className="text-sm text-gray-500">Card, Bank Transfer, USSD</p>
                                            </div>
                                        </Label>
                                    </div>
                                )}
                                {paymentSettings.flutterwave_enabled && (
                                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="flutterwave" id="flutterwave" />
                                        <Label htmlFor="flutterwave" className="flex-1 cursor-pointer">
                                            <div>
                                                <p className="font-medium">Flutterwave</p>
                                                <p className="text-sm text-gray-500">Card, Bank Transfer, Mobile Money</p>
                                            </div>
                                        </Label>
                                    </div>
                                )}
                                {paymentSettings.manual_enabled && (
                                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="manual" id="manual" />
                                        <Label htmlFor="manual" className="flex-1 cursor-pointer">
                                            <div>
                                                <p className="font-medium">Manual Bank Transfer</p>
                                                <p className="text-sm text-gray-500">Upload payment receipt for verification</p>
                                            </div>
                                        </Label>
                                    </div>
                                )}
                            </RadioGroup>
                            
                            {!paymentSettings.paystack_enabled && !paymentSettings.flutterwave_enabled && !paymentSettings.manual_enabled && (
                                <div className="text-center py-8 border rounded-lg bg-red-50">
                                    <p className="text-red-600 font-medium">No payment methods are currently available</p>
                                    <p className="text-sm text-red-500 mt-1">Please contact support or try again later</p>
                                </div>
                            )}
                        </div>

                        {/* Manual Payment Instructions */}
                        {provider === 'manual' && (
                            <div className="space-y-4 p-6 border rounded-lg bg-pana-navy/5 border-pana-navy/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-pana-navy">Bank Account Details</h4>
                                    {loadingBankDetails ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading account details...</span>
                                        </div>
                                    ) : bankDetails ? (
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-muted-foreground">Bank Name:</span>
                                            <span className="font-medium">{bankDetails.bank_name}</span>
                                            <span className="text-muted-foreground">Account Number:</span>
                                            <span className="font-medium tracking-wider">{bankDetails.account_number}</span>
                                            <span className="text-muted-foreground">Account Name:</span>
                                            <span className="font-medium">{bankDetails.account_name}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500">Failed to load bank details. Please contact support.</p>
                                    )}
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <Label htmlFor="receipt" className="font-semibold text-pana-navy">
                                        Upload Payment Receipt *
                                    </Label>
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            id="receipt"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Please upload a clear image or PDF of your transfer receipt.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Features */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-green-900">Secure Payment</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your payment information is encrypted and secure. We never store your card details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={processing || (provider === 'manual' && !receiptFile)}
                            className="w-full bg-pana-gold hover:bg-pana-gold/90 text-white"
                            size="lg"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {uploadingReceipt ? 'Uploading Receipt...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    {provider === 'manual' ? 'Submit Payment' : `Pay ₦${taxCalculation?.finalAmount.toLocaleString() || course?.price.toLocaleString()}`}
                                </>
                            )}
                        </Button>

                        {/* Trust Badges */}
                        <p className="text-xs text-center text-gray-500">
                            🔒 Powered by {provider === 'paystack' ? 'Paystack' : 'Flutterwave'} •
                            PCI DSS Compliant • SSL Encrypted
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
