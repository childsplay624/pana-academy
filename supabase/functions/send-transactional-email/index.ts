// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

declare const Deno: any;

// VITE_RESEND_API_KEY is the secret name configured in Supabase project settings
const RESEND_API_KEY = Deno.env.get('VITE_RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string | string[];
  type?: 'welcome' | 'enrollment' | 'certificate' | 'grading' | 'reminder' | 'verification' | 'reset_password' | 'custom';
  payload?: any;
  subject?: string;
  html?: string;
}

const BRAND_COLORS = {
  navy: '#0f172a',
  red: '#b91c1c',
  gold: '#c5a059',
  bg: '#f8fafc'
};

// Centralized Layout Wrapper
const emailLayout = (content: string, previewText: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PANA Academy</title>
  <style>
    body { background-color: ${BRAND_COLORS.bg}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { background-color: ${BRAND_COLORS.navy}; padding: 30px; text-align: center; }
    .content { padding: 40px; color: #334155; line-height: 1.6; font-size: 16px; }
    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
    .btn { display: inline-block; padding: 14px 28px; background-color: ${BRAND_COLORS.red}; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
    .gold-bar { height: 4px; background: ${BRAND_COLORS.gold}; }
    h1 { color: ${BRAND_COLORS.navy}; margin-top: 0; }
    .preview { display: none; max-height: 0px; overflow: hidden; }
  </style>
</head>
<body>
  <span class="preview">${previewText}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div style="font-size: 24px; font-weight: bold; color: white; letter-spacing: 2px;">
          PANA <span style="color: ${BRAND_COLORS.red};">ACADEMY</span>
        </div>
      </div>
      <div class="gold-bar"></div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} PANA Academy. All rights reserved.</p>
        <p>Competency Cultivation Hub | Port Harcourt &amp; Abuja, Nigeria</p>
        <p><a href="mailto:support@pana-academy.com" style="color: #64748b;">support@pana-academy.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const templates: Record<string, (payload: any) => { subject: string; html: string }> = {
  welcome: (payload: any) => ({
    subject: `Welcome to PANA Academy, ${payload.name}!`,
    html: emailLayout(`
      <h1>Welcome Aboard, ${payload.name}!</h1>
      <p>We're thrilled to have you join our learning community. PANA Academy is dedicated to your professional growth and competency cultivation.</p>
      <p>Your account is now active. You can start exploring our catalog of specialized courses and resources.</p>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/dashboard" class="btn">Access Your Dashboard</a>
      </div>
      <p style="margin-top: 30px;">If you have any questions, our support team is always here to help.</p>
    `, "Welcome to PANA Academy - Your professional growth starts here.")
  }),
  enrollment: (payload: any) => ({
    subject: `Enrollment Confirmed: ${payload.courseTitle}`,
    html: emailLayout(`
      <h1>Enrollment Successful!</h1>
      <p>Hello ${payload.userName}, you are now officially enrolled in:</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${BRAND_COLORS.red};">
        <strong style="font-size: 18px;">${payload.courseTitle}</strong>
      </div>
      <p>Get ready to dive into the course materials and start your journey towards mastering new skills.</p>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/my-courses" class="btn">Start Learning Now</a>
      </div>
    `, `You're officially enrolled in ${payload.courseTitle}`)
  }),
  certificate: (payload: any) => ({
    subject: `Congratulations! Your Certificate for ${payload.courseTitle}`,
    html: emailLayout(`
      <h1 style="color: ${BRAND_COLORS.gold};">Achievement Unlocked!</h1>
      <p>Incredible work, ${payload.userName}! You have successfully completed all the requirements for:</p>
      <p style="font-weight: bold; font-size: 18px;">${payload.courseTitle}</p>
      <p>Your official Certificate of Completion is now ready for download and sharing.</p>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/dashboard" class="btn">View Certificate</a>
      </div>
    `, `Great job! You earned your certificate for ${payload.courseTitle}`)
  }),
  grading: (payload: any) => ({
    subject: `Grade Released: ${payload.assignmentTitle}`,
    html: emailLayout(`
      <h1>Assignment Results</h1>
      <p>Hello ${payload.userName}, your instructor has reviewed and graded your submission for:</p>
      <p><strong>${payload.assignmentTitle}</strong></p>
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e2e8f0;">
        <div style="font-size: 14px; text-transform: uppercase; color: #64748b;">Your Grade</div>
        <div style="font-size: 42px; font-weight: bold; color: ${BRAND_COLORS.red}; margin: 10px 0;">${payload.score}%</div>
        ${payload.feedback ? `<div style="text-align: left; margin-top: 15px; font-style: italic; color: #475569;">"${payload.feedback}"</div>` : ''}
      </div>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/dashboard" class="btn">Review Submission</a>
      </div>
    `, `Your grade for ${payload.assignmentTitle} is now available.`)
  }),
  payment_confirmed: (payload: any) => ({
    subject: `Payment Confirmed: ${payload.courseTitle}`,
    html: emailLayout(`
      <h1>Payment Received!</h1>
      <p>Hello ${payload.userName}, your payment has been confirmed and you are now enrolled in:</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${BRAND_COLORS.gold};">
        <strong style="font-size: 18px;">${payload.courseTitle}</strong>
        <div style="margin-top: 12px; color: #64748b;">
          <div>Amount Paid: <strong>₦${payload.amount}</strong></div>
          <div>Reference: <strong>${payload.reference}</strong></div>
        </div>
      </div>
      <p>You can now access all course materials from your dashboard.</p>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/my-courses" class="btn">Go to My Courses</a>
      </div>
    `, `Your payment for ${payload.courseTitle} has been confirmed.`)
  }),
  payment_rejected: (payload: any) => ({
    subject: `Payment Update: ${payload.courseTitle}`,
    html: emailLayout(`
      <h1>Payment Could Not Be Verified</h1>
      <p>Hello ${payload.userName},</p>
      <p>Unfortunately, we were unable to verify your payment for <strong>${payload.courseTitle}</strong>.</p>
      ${payload.reason ? `<div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${BRAND_COLORS.red};"><strong>Reason:</strong> ${payload.reason}</div>` : ''}
      <p>Please contact our support team or try submitting your payment receipt again.</p>
      <div style="text-align: center;">
        <a href="${payload.appUrl}/contact" class="btn">Contact Support</a>
      </div>
    `, `Important update about your payment for ${payload.courseTitle}.`)
  }),
  verification: (payload: any) => ({
    subject: 'Verify your email address - PANA Academy',
    html: emailLayout(`
      <h1>Verify Your Email</h1>
      <p>Hello ${payload.name},</p>
      <p>Thank you for joining PANA Academy! To ensure the security of your account, please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        <a href="${payload.verificationLink}" class="btn">Verify Email Address</a>
      </div>
      <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all; color: ${BRAND_COLORS.red};">${payload.verificationLink}</span>
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
        This link will expire in 24 hours.
      </p>
    `, "Verify your email to get started with PANA Academy.")
  }),
  reset_password: (payload: any) => ({
    subject: 'Reset Your Password - PANA Academy',
    html: emailLayout(`
      <h1>Password Reset Request</h1>
      <p>Hello ${payload.name},</p>
      <p>We received a request to reset the password for your PANA Academy account. Click the button below to set a new password:</p>
      <div style="text-align: center;">
        <a href="${payload.resetLink}" class="btn">Reset Password</a>
      </div>
      <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
      </p>
      <p style="font-size: 14px; color: #64748b;">
        Button not working? Use this link instead:<br>
        <span style="word-break: break-all; color: ${BRAND_COLORS.red};">${payload.resetLink}</span>
      </p>
    `, "Reset your PANA Academy password.")
  })
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, type, payload, subject: rawSubject, html: rawHtml } = (await req.json()) as EmailRequest;

    let subject = rawSubject;
    let html = rawHtml;

    if (type && templates[type]) {
      const result = templates[type](payload || {});
      subject = subject || result.subject;
      html = html || result.html;
    }

    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, and html (or a valid type)')
    }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in Supabase project secrets')
    }

    // Use Resend REST API directly (no nodemailer dependency)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PANA Academy <noreply@pana-academy.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = (await res.json()) as any;

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data?.message || 'Failed to send email via Resend');
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error?.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
