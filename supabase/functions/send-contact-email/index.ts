import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('VITE_RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
    name: string
    email: string
    subject: string
    message: string
}

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Parse request body
        const { name, email, subject, message } = (await req.json()) as ContactFormData

        // Validate input
        if (!name || !email || !subject || !message) {
            return new Response(
                JSON.stringify({ error: 'All fields are required' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
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
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'PANA Academy <onboarding@resend.dev>', // Use your verified domain
                to: ['Info@pana-academy.com'],
                reply_to: email,
                subject: `Contact Form: ${subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #DC2626;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              Sent from PANA Academy Contact Form<br>
              ${new Date().toLocaleString()}
            </p>
          </div>
        `,
            }),
        })

        const data = (await res.json()) as any

        if (!res.ok) {
            console.error('Resend API error:', data)
            return new Response(
                JSON.stringify({ error: 'Failed to send email', details: data }),
                {
                    status: 500,
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
