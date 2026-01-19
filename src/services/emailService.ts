import { supabase } from "@/integrations/supabase/client";

type EmailPayload = {
  [key: string]: any;
};

type EmailOptions = {
  to: string | string[];
  type?: 'welcome' | 'enrollment' | 'certificate' | 'grading' | 'reminder' | 'custom';
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
    type: 'custom' as const,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset Your Password</h1>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          This link will expire in 1 hour for security reasons.
        </p>
      </div>
    `,
  }),
};
