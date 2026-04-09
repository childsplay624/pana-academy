// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('VITE_RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth, x-pana-signature',
}

const PANA_SIGNATURE = Deno.env.get('VITE_PANA_SIGNATURE');

// Simple in-memory rate limiting (Note: This resets on function restart, but good for basic protection)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_COUNT = 5; // 5 emails
const RATE_LIMIT_WINDOW = 3600000; // per hour (1 hour in ms)

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Security Check: Verify PANA Signature
    const signature = req.headers.get('x-pana-signature');
    if (PANA_SIGNATURE) {
        if (signature !== PANA_SIGNATURE) {
            console.warn('Unauthorized access attempt: Invalid signature');
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid signature' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    } else {
        console.warn('VITE_PANA_SIGNATURE is not set in Supabase Secrets. Contact form is working without signature verification.');
    }

    // Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];

    // Filter old requests
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= RATE_LIMIT_COUNT) {
        console.warn(`Rate limit exceeded for IP: ${ip}`);
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Update rate limit map
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    try {
        const body = await req.json();
        
        // Handle Supabase Webhook payload vs Direct Invocation
        const { name, email, subject, message } = body.record || body;

        // Validate input
        if (!name || !email || !subject || !message) {
            console.error('Missing fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
            return new Response(
                JSON.stringify({ error: 'All fields are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 1. SAVE TO DATABASE (Only if not already called by a webhook)
        if (!body.record && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
            const { error: dbError } = await supabase
                .from('contact_messages')
                .insert([{ name, email, subject, message }]);
            
            if (dbError) {
                console.error('Database error:', dbError);
            } else {
                console.log('Successfully saved to database');
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email address' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Send email using Resend
        console.log(`Attempting to send contact email from ${email} via Resend`);
        
        if (!RESEND_API_KEY) {
            console.error('ERROR: RESEND_API_KEY is not defined in the environment secrets.');
            return new Response(
                JSON.stringify({ error: 'Mail service configuration error' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                // NOTE: Use 'onboarding@resend.dev' if your domain is not yet verified in Resend.
                // Once verified, change back to 'PANA Academy <info@pana-academy.com>'
                from: 'onboarding@resend.dev', 
                to: ['info@pana-academy.com'],
                reply_to: email,
                subject: `Contact Form: ${subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Inquiry</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #374151;">You have received a new message from the PANA Academy contact form.</p>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #374151; border-bottom: 2px solid #ef4444; padding-bottom: 5px; display: inline-block;">Message:</h3>
                <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">${message}</p>
              </div>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              Sent from PANA Academy Contact Form • ${new Date().toLocaleString()}
            </div>
          </div>
        `,
            }),
        })

        const data = (await res.json()) as any

        if (!res.ok) {
            console.error('Resend API error details:', data)
            
            let errorMessage = 'Failed to send email';
            if (res.status === 403 || res.status === 422) {
                errorMessage = `Resend configuration error: ${data?.message || 'Domain not verified or unauthorized'}`;
            }

            return new Response(
                JSON.stringify({ error: errorMessage, details: data }),
                {
                    status: res.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Email sent successfully',
                id: data?.id
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error: any) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error?.message || 'Unknown error'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
