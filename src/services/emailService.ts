import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

export const sendEmail = async (options: EmailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'PANA Academy <noreply@panaacademy.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
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

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to PANA Academy!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to PANA Academy, ${name}!</h1>
        <p>Thank you for joining our learning community. We're excited to have you on board.</p>
        <p>Start exploring our courses and enhance your skills today!</p>
        <a href="${import.meta.env.VITE_APP_URL}" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          Get Started
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  }),
  
  courseEnrollment: (courseTitle: string, userName: string) => ({
    subject: `You're enrolled in ${courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to ${courseTitle}, ${userName}!</h1>
        <p>You've successfully enrolled in the course. We're excited to have you in the class!</p>
        <p>Course: <strong>${courseTitle}</strong></p>
        <p>Start your learning journey now by accessing the course materials.</p>
        <a href="${import.meta.env.VITE_APP_URL}/my-courses" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          Go to My Courses
        </a>
      </div>
    `,
  }),
  
  passwordReset: (userName: string, resetLink: string) => ({
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
