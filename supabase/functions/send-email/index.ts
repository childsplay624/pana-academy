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
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main function to handle the request
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
        from: from || 'PANA Academy <noreply@pana-academy.com>',
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

