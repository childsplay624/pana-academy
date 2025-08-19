import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ZoomMeetingRequest {
  topic: string
  start_time: string
  duration: number
  description?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get Zoom credentials from platform settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('platform_settings')
      .select('key, value')
      .in('key', ['zoom_api_key', 'zoom_api_secret'])

    if (settingsError) {
      console.error('Settings error:', settingsError)
      throw new Error('Failed to fetch Zoom credentials')
    }

    const zoomApiKey = settings.find(s => s.key === 'zoom_api_key')?.value
    const zoomApiSecret = settings.find(s => s.key === 'zoom_api_secret')?.value

    if (!zoomApiKey || !zoomApiSecret) {
      console.error('Missing Zoom credentials')
      return new Response(
        JSON.stringify({ error: 'Zoom API credentials not configured' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { topic, start_time, duration, description }: ZoomMeetingRequest = await req.json()

    // Create JWT token for Zoom API
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }

    const payload = {
      iss: JSON.parse(zoomApiKey),
      exp: Math.floor(Date.now() / 1000) + 3600 // Token expires in 1 hour
    }

    // Simple JWT creation (for production, use a proper JWT library)
    const base64Header = btoa(JSON.stringify(header))
    const base64Payload = btoa(JSON.stringify(payload))
    
    const signatureInput = `${base64Header}.${base64Payload}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(JSON.parse(zoomApiSecret))
    const messageData = encoder.encode(signatureInput)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    
    const jwtToken = `${base64Header}.${base64Payload}.${base64Signature}`

    // Create meeting via Zoom API
    const meetingData = {
      topic,
      type: 2, // Scheduled meeting
      start_time,
      duration,
      timezone: 'UTC',
      settings: {
        host_video: true,
        participant_video: true,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        registration_type: 1,
        audio: 'both',
        auto_recording: 'none'
      }
    }

    if (description) {
      meetingData.agenda = description
    }

    console.log('Creating Zoom meeting with data:', meetingData)

    const zoomResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    })

    if (!zoomResponse.ok) {
      const errorText = await zoomResponse.text()
      console.error('Zoom API error:', errorText)
      throw new Error(`Zoom API error: ${zoomResponse.status} - ${errorText}`)
    }

    const meeting = await zoomResponse.json()
    
    console.log('Zoom meeting created successfully:', meeting.id)

    return new Response(
      JSON.stringify({
        success: true,
        meeting_id: meeting.id,
        join_url: meeting.join_url,
        start_url: meeting.start_url,
        password: meeting.password
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating Zoom meeting:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create Zoom meeting' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})