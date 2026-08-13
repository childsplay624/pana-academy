// @ts-nocheck
// Import required modules
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('VITE_RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY');

// Define the request type
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth, x-pana-signature',
};

const PANA_SIGNATURE = Deno.env.get('VITE_PANA_SIGNATURE');

// Main function to handle the request
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
    console.warn('VITE_PANA_SIGNATURE is not set in Supabase Secrets.');
  }

  try {
    // Parse the request body
    const { to, subject, html, from } = (await req.json()) as EmailRequest;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from || 'PANA Institute <noreply@pana-institute.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = (await res.json()) as any;

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data?.message || 'Failed to send email via Resend');
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully via Resend', id: data?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

