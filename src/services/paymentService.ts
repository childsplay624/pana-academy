import { supabase } from '@/integrations/supabase/client';
import { createAndSendInvoice } from './invoiceService';
import { v4 as uuidv4 } from 'uuid';
import type {
  Payment,
  PaymentProvider,
  PaymentStatus,
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
        callback: function (response: any) {
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
        onclose: function () {
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
 * Manual Payment Initialization
 */
const initializeManualPayment = (
  amount: number,
  userId: string,
  courseId: string
): PaymentResponse => {
  const reference = `MAN-${uuidv4().slice(0, 8).toUpperCase()}`;
  return {
    success: true,
    reference,
    message: 'Manual payment initiated. Please upload your receipt.'
  };
};

/**
 * Upload Payment Receipt
 */
export const uploadReceipt = async (
  userId: string,
  courseId: string,
  reference: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${courseId}/${reference}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-receipts')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('payment-receipts')
      .getPublicUrl(filePath);

    // Update payment record with receipt URL
    const { error: updateError } = await (supabase as any)
      .from('payments')
      .update({ receipt_url: publicUrl })
      .eq('reference', reference);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return { success: false, error };
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
    } else if (provider === 'manual') {
      return initializeManualPayment(amount, metadata.userId, metadata.courseId);
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
 * Calculate tax for a course amount
 */
export const calculateTaxAmount = async (
  courseId: string,
  baseAmount: number
): Promise<{ finalAmount: number; taxAmount: number; platformFee: number }> => {
  try {
    // Fetch tax settings from platform_settings
    const { data: taxSettings, error: taxError } = await (supabase as any)
      .from('platform_settings')
      .select('key, value')
      .in('key', ['tax_enabled', 'tax_rate', 'tax_type', 'tax_name', 'tax_number']);

    if (taxError) throw taxError;

    const settings: any = {};
    taxSettings.forEach(item => {
      try {
        settings[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
      } catch {
        settings[item.key] = item.value;
      }
    });

    const taxEnabled = settings.tax_enabled !== false;
    const taxRate = settings.tax_rate ? parseFloat(settings.tax_rate) : 0;
    const taxType = settings.tax_type || 'percentage';
    const taxName = settings.tax_name || 'VAT';

    // Calculate final amount with tax
    let finalAmount = baseAmount;
    let taxAmount = 0;
    let platformFee = 0;

    if (taxEnabled) {
      if (taxType === 'percentage') {
        taxAmount = (baseAmount * taxRate) / 100;
        finalAmount = baseAmount + taxAmount;
      } else if (taxType === 'fixed') {
        taxAmount = taxRate;
        finalAmount = baseAmount + taxAmount;
      }
      
      // Apply platform fee (if any)
      const { data: platformFeeSettings } = await (supabase as any)
        .from('platform_settings')
        .select('value')
        .eq('key', 'platform_fee')
        .single();

      const platformFeeRate = platformFeeSettings?.value ? parseFloat(platformFeeSettings.value) : 0;
      platformFee = (finalAmount * platformFeeRate) / 100;
      finalAmount = finalAmount + platformFee;
    }

    return { finalAmount, taxAmount, platformFee };
  } catch (error) {
    console.error('Error calculating tax:', error);
    return { finalAmount: baseAmount, taxAmount: 0, platformFee: 0 };
  }
};

/**
 * Save payment record to database with tax calculation
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
    // Calculate tax for the payment
    const { finalAmount, taxAmount, platformFee } = await calculateTaxAmount(courseId, amount);

    const paymentData = {
      user_id: userId,
      course_id: courseId,
      amount: finalAmount,
      provider,
      reference,
      status,
      metadata: {
        original_amount: amount,
        tax_amount: taxAmount,
        platform_fee: platformFee,
        tax_enabled: taxAmount > 0,
        currency: 'NGN'
      },
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
          course_id: courseId,
          student_id: userId,
          enrolled_at: new Date().toISOString(),
          status: 'enrolled',
          progress_percentage: 0
        }
      ]);

    if (enrollError) throw enrollError;

    // Generate and send invoice
    try {
      const invoiceResult = await createAndSendInvoice(userId, courseId, reference, provider);
      if (invoiceResult.success) {
        console.log(`Invoice generated and sent for payment ${reference}`);
      } else {
        console.error('Failed to generate invoice:', invoiceResult.error);
      }
    } catch (invoiceError) {
      console.error('Error generating invoice:', invoiceError);
      // Don't fail the payment process if invoice generation fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling payment success:', error);
    return { success: false, error };
  }
};

/**
 * Check if user has completed payment for a course
 */
export const checkPaymentStatus = async (
  userId: string,
  courseId: string
): Promise<boolean> => {
  try {
    const { data, error } = await (supabase as any)
      .from('payments')
      .select('id, status')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .limit(1);

    if (error) {
      console.error('Error checking payment status:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Payment check error:', error);
    return false;
  }
};

/**
 * Get all manual payments for admin review
 */
export const getAllManualPayments = async (status?: PaymentStatus): Promise<Payment[]> => {
  try {
    console.log('Fetching manual payments, filter status:', status);

    let query = (supabase as any)
      .from('payments')
      .select(`
        *,
        profiles:user_id(full_name, email),
        courses(title)
      `)
      .eq('provider', 'manual');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error in getAllManualPayments:', error);
      throw error;
    }

    console.log('Successfully fetched manual payments, count:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching manual payments:', error);
    return [];
  }
};

/**
 * Approve a manual payment and enroll the student
 */
export const approvePayment = async (paymentId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // 1. Get payment details
    const { data: payment, error: fetchError } = await (supabase as any)
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Handle successful payment (update status and enroll)
    const result = await handlePaymentSuccess(
      payment.user_id,
      payment.course_id,
      payment.reference,
      'manual'
    );

    return result;
  } catch (error) {
    console.error('Error approving payment:', error);
    return { success: false, error };
  }
};

/**
 * Reject a manual payment
 */
export const rejectPayment = async (paymentId: string, reason?: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await (supabase as any)
      .from('payments')
      .update({
        status: 'failed',
        metadata: { rejection_reason: reason },
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return { success: false, error };
  }
};

/**
 * Get payment details for a course enrollment
 */
export const getPaymentForCourse = async (
  userId: string,
  courseId: string
): Promise<Payment | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No payment found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting payment:', error);
    return null;
  }
};
