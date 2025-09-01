import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Payment, 
  PaymentProvider, 
  InsertPayment 
} from '@/types/database.types';

// Re-export types for backward compatibility
export type { PaymentProvider } from '@/types/database.types';

export type PaymentMetadata = {
  courseId: string;
  userId: string;
  email: string;
  fullName?: string;
};

export type PaymentResponse = {
  success: boolean;
  paymentLink?: string;
  reference?: string;
  message?: string;
  error?: any;
};

// Initialize payment providers with environment variables
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

/**
 * Paystack Payment Integration
 */
const initializePaystackPayment = async (
  amount: number,
  email: string,
  metadata: PaymentMetadata,
  callbackUrl?: string
): Promise<PaymentResponse> => {
  try {
    const reference = `PANA-${uuidv4()}`;
    const amountInKobo = Math.round(amount * 100); // Convert to kobo (smallest currency unit)

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl || `${API_BASE_URL}/payment/callback`,
        metadata: {
          custom_fields: [
            {
              display_name: 'Course ID',
              variable_name: 'course_id',
              value: metadata.courseId
            },
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: metadata.userId
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || 'Failed to initialize Paystack payment');
    }

    return {
      success: true,
      paymentLink: data.data.authorization_url,
      reference: data.data.reference
    };
  } catch (error) {
    console.error('Paystack payment error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize payment',
      error
    };
  }
};

/**
 * Flutterwave Payment Integration
 */
const initializeFlutterwavePayment = async (
  amount: number,
  email: string,
  metadata: PaymentMetadata,
  callbackUrl?: string
): Promise<PaymentResponse> => {
  try {
    const tx_ref = `PANA-${uuidv4()}`;
    
    // Flutterwave requires loading their script first
    await loadFlutterwaveScript();

    return new Promise((resolve) => {
      // @ts-ignore - Flutterwave is loaded dynamically
      window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref,
        amount,
        currency: 'NGN', // Default to Naira, can be made dynamic
        payment_options: 'card, banktransfer, ussd',
        redirect_url: callbackUrl || `${API_BASE_URL}/payment/callback`,
        customer: {
          email,
          name: metadata.fullName || 'Customer'
        },
        customizations: {
          title: 'PANA Academy',
          description: `Payment for course: ${metadata.courseId}`,
          logo: `${API_BASE_URL}/logo.png`
        },
        callback: function(response: any) {
          if (response.status === 'successful') {
            resolve({
              success: true,
              reference: response.transaction_id,
              message: 'Payment successful'
            });
          } else {
            resolve({
              success: false,
              message: 'Payment was not successful'
            });
          }
        },
        onclose: function() {
          resolve({
            success: false,
            message: 'Payment window closed'
          });
        }
      });
    });
  } catch (error) {
    console.error('Flutterwave payment error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize payment',
      error
    };
  }
};

/**
 * Load Flutterwave script dynamically
 */
export const loadFlutterwaveScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('flutterwave-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'flutterwave-script';
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (error) => {
      console.error('Failed to load Flutterwave script:', error);
      reject(new Error('Failed to load payment processor'));
    };
    document.head.appendChild(script);
  });
};

/**
 * Verify Payment
 */
export const verifyPayment = async (reference: string, provider: PaymentProvider): Promise<boolean> => {
  try {
    if (provider === 'paystack') {
      return await verifyPaystackPayment(reference);
    } else if (provider === 'flutterwave') {
      return await verifyFlutterwavePayment(reference);
    }
    return false;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

const verifyPaystackPayment = async (reference: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`
      }
    });

    const data = await response.json();
    return data.status && data.data.status === 'success';
  } catch (error) {
    console.error('Paystack verification error:', error);
    return false;
  }
};

const verifyFlutterwavePayment = async (transactionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_PUBLIC_KEY}`
      }
    });

    const data = await response.json();
    return data.status === 'success' && data.data.status === 'successful';
  } catch (error) {
    console.error('Flutterwave verification error:', error);
    return false;
  }
};

/**
 * Main Payment Initialization Function
 */
export const initializePayment = async (
  provider: PaymentProvider,
  amount: number,
  email: string,
  metadata: PaymentMetadata,
  callbackUrl?: string
): Promise<PaymentResponse> => {
  try {
    // Validate required fields
    if (!email || !metadata.courseId || !metadata.userId) {
      throw new Error('Missing required payment information');
    }

    // Initialize the selected payment provider
    if (provider === 'paystack') {
      return await initializePaystackPayment(amount, email, metadata, callbackUrl);
    } else if (provider === 'flutterwave') {
      return await initializeFlutterwavePayment(amount, email, metadata, callbackUrl);
    } else {
      throw new Error('Unsupported payment provider');
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize payment',
      error
    };
  }
};

/**
 * Save payment record to database
 */
export const savePaymentRecord = async (
  userId: string,
  courseId: string,
  amount: number,
  provider: PaymentProvider,
  reference: string,
  status: 'pending' | 'completed' | 'failed'
) => {
  try {
    const paymentData = {
      user_id: userId,
      course_id: courseId,
      amount,
      provider,
      reference,
      status,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Use type assertion to bypass TypeScript error for now
    const { data, error } = await (supabase as any)
      .from('payments')
      .insert(paymentData);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving payment record:', error);
    return { data: null, error };
  }
};

/**
 * Handle payment success
 */
export const handlePaymentSuccess = async (
  userId: string,
  courseId: string,
  reference: string,
  provider: PaymentProvider
) => {
  try {
    // Update payment status
    const { error } = await (supabase as any)
      .from('payments')
      .update({ 
        status: 'completed', 
        updated_at: new Date().toISOString() 
      })
      .eq('reference', reference);

    if (error) throw error;

    // Enroll user in course
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          student_id: userId,
          enrolled_at: new Date().toISOString(),
          status: 'enrolled',
          progress_percentage: 0
        }
      ]);

    if (enrollError) throw enrollError;

    return { success: true };
  } catch (error) {
    console.error('Error handling payment success:', error);
    return { success: false, error };
  }
};
