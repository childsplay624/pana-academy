import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { certificateId } = await req.json()

    if (!certificateId) {
      return new Response(
        JSON.stringify({ error: 'Certificate ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get certificate data
    const { data: certificate, error: certError } = await supabaseClient
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single()

    if (certError || !certificate) {
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get user data
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', certificate.user_id)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate HTML certificate
    const certificateHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate - ${certificate.certificate_number}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 100%;
            text-align: center;
            border: 3px solid #667eea;
        }
        .header {
            margin-bottom: 40px;
        }
        .seal {
            width: 80px;
            height: 80px;
            background: #667eea;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .title {
            font-size: 36px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 18px;
            color: #667eea;
            margin-bottom: 40px;
        }
        .recipient {
            font-size: 24px;
            margin-bottom: 30px;
        }
        .recipient-name {
            font-size: 32px;
            font-weight: bold;
            color: #2d3748;
            border-bottom: 2px solid #667eea;
            display: inline-block;
            padding-bottom: 5px;
            margin: 0 20px;
        }
        .course-info {
            margin: 40px 0;
            padding: 20px;
            background: #f7fafc;
            border-radius: 10px;
        }
        .course-title {
            font-size: 24px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
        }
        .course-details {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .detail {
            text-align: center;
            margin: 10px;
        }
        .detail-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .signature {
            text-align: center;
            flex: 1;
        }
        .signature-line {
            border-bottom: 1px solid #2d3748;
            margin-bottom: 5px;
            height: 20px;
        }
        .signature-label {
            font-size: 12px;
            color: #718096;
        }
        .verification {
            margin-top: 40px;
            padding: 20px;
            background: #667eea;
            color: white;
            border-radius: 10px;
        }
        .verification-code {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="seal">🏆</div>
            <div class="title">Certificate of Completion</div>
            <div class="subtitle">This is to certify that</div>
        </div>
        
        <div class="recipient">
            <div class="recipient-name">${user.full_name || 'Student'}</div>
        </div>
        
        <div class="subtitle">has successfully completed the course</div>
        
        <div class="course-info">
            <div class="course-title">${certificate.course_title}</div>
            <div class="course-details">
                <div class="detail">
                    <div class="detail-label">Completion Date</div>
                    <div class="detail-value">${new Date(certificate.completion_date).toLocaleDateString()}</div>
                </div>
                <div class="detail">
                    <div class="detail-label">Issue Date</div>
                    <div class="detail-value">${new Date(certificate.issued_date).toLocaleDateString()}</div>
                </div>
                ${certificate.grade ? `
                <div class="detail">
                    <div class="detail-label">Grade</div>
                    <div class="detail-value">${certificate.grade}</div>
                </div>
                ` : ''}
                ${certificate.score ? `
                <div class="detail">
                    <div class="detail-label">Score</div>
                    <div class="detail-value">${certificate.score}%</div>
                </div>
                ` : ''}
                ${certificate.course_duration_hours ? `
                <div class="detail">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${certificate.course_duration_hours} hours</div>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="signatures">
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Instructor</div>
                <div style="margin-top: 5px; font-weight: bold;">${certificate.instructor_name}</div>
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Date</div>
                <div style="margin-top: 5px; font-weight: bold;">${new Date(certificate.issued_date).toLocaleDateString()}</div>
            </div>
        </div>
        
        <div class="verification">
            <div style="font-size: 14px; margin-bottom: 10px;">Certificate Details</div>
            <div>Certificate Number: <span class="verification-code">${certificate.certificate_number}</span></div>
            <div>Verification Code: <span class="verification-code">${certificate.verification_code}</span></div>
            <div style="font-size: 12px; margin-top: 10px; opacity: 0.9;">
                Verify this certificate at: ${Deno.env.get('SUPABASE_URL')?.replace('https://', '').replace('.supabase.co', '')}.vercel.app/verify-certificate?code=${certificate.verification_code}
            </div>
        </div>
    </div>
</body>
</html>
    `

    // For now, return the HTML. In a production environment, you would:
    // 1. Use a PDF generation library like Puppeteer
    // 2. Upload the PDF to Supabase Storage
    // 3. Update the certificate record with the PDF URL
    // 4. Return the PDF URL

    return new Response(
      JSON.stringify({ 
        success: true, 
        html: certificateHtml,
        message: 'Certificate HTML generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error generating certificate:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})