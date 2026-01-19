import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string | string[];
  type?: 'welcome' | 'enrollment' | 'certificate' | 'grading' | 'reminder' | 'custom';
  payload?: any;
  subject?: string;
  html?: string;
}

const templates: Record<string, (payload: any) => { subject: string; html: string }> = {
  welcome: (payload: any) => ({
    subject: `Welcome to PANA Academy, ${payload.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to PANA Academy, ${payload.name}!</h1>
        <p>Thank you for joining our learning community. We're excited to have you on board.</p>
        <p>Start exploring our courses and enhance your skills today!</p>
        <a href="${payload.appUrl}" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          Get Started
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    `
  }),
  enrollment: (payload: any) => ({
    subject: `You're enrolled in ${payload.courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to ${payload.courseTitle}, ${payload.userName}!</h1>
        <p>You've successfully enrolled in the course. We're excited to have you in the class!</p>
        <p>Course: <strong>${payload.courseTitle}</strong></p>
        <p>Start your learning journey now by accessing the course materials.</p>
        <a href="${payload.appUrl}/my-courses" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          Go to My Courses
        </a>
      </div>
    `
  }),
  certificate: (payload: any) => ({
    subject: `Congratulations! Your certificate for ${payload.courseTitle} is ready`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Congratulations, ${payload.userName}!</h1>
        <p>You have successfully completed <strong>${payload.courseTitle}</strong>.</p>
        <p>Your certificate of completion has been generated and is now available in your dashboard.</p>
        <a href="${payload.appUrl}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          View Certificate
        </a>
      </div>
    `
  }),
  grading: (payload: any) => ({
    subject: `Your submission for ${payload.assignmentTitle} has been graded`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Assignment Graded: ${payload.assignmentTitle}</h2>
        <p>Hello ${payload.userName},</p>
        <p>Your submission has been reviewed and graded.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Score:</strong> ${payload.score}%</p>
          ${payload.feedback ? `<p><strong>Feedback:</strong> ${payload.feedback}</p>` : ''}
        </div>
        <a href="${payload.appUrl}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
          View Details
        </a>
      </div>
    `
  })
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, type, payload, subject: rawSubject, html: rawHtml }: EmailRequest = await req.json()

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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PANA Academy <onboarding@resend.dev>', // Should be updated to verified domain in production
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', data)
      return new Response(JSON.stringify({ error: 'Failed to send email', details: data }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
