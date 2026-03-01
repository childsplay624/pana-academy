import { supabase } from "@/integrations/supabase/client";

type EmailPayload = {
  [key: string]: any;
};

type EmailOptions = {
  to: string | string[];
  type?: 'welcome' | 'enrollment' | 'certificate' | 'grading' | 'reminder' | 'verification' | 'reset_password' | 'payment_confirmed' | 'payment_rejected' | 'custom';
  payload?: EmailPayload;
  subject?: string;
  html?: string;
};

export const sendEmail = async (options: EmailOptions) => {
  try {
    // Add appUrl to payload if not present
    const payload = {
      ...options.payload,
      appUrl: import.meta.env.VITE_APP_URL || window.location.origin
    };

    const { data, error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        to: options.to,
        type: options.type,
        payload,
        subject: options.subject,
        html: options.html
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// Frontend templates are now placeholders, preferably handled by the Edge Function
// But we keep this object structure for backward compatibility with existing calls
export const emailTemplates = {
  welcome: (name: string) => ({
    type: 'welcome' as const,
    payload: { name },
    subject: 'Welcome to PANA Academy!', // Fallback
    html: '', // Handled by Edge Function
  }),

  courseEnrollment: (courseTitle: string, userName: string) => ({
    type: 'enrollment' as const,
    payload: { courseTitle, userName },
    subject: `You're enrolled in ${courseTitle}`, // Fallback
    html: '', // Handled by Edge Function
  }),

  passwordReset: (userName: string, resetLink: string) => ({
    type: 'reset_password' as const,
    payload: { name: userName, resetLink },
    subject: 'Password Reset Request', // Fallback
    html: '', // Handled by Edge Function
  }),

  verification: (userName: string, verificationLink: string) => ({
    type: 'verification' as const,
    payload: { name: userName, verificationLink },
    subject: 'Verify your email address', // Fallback
    html: '', // Handled by Edge Function
  }),
};
