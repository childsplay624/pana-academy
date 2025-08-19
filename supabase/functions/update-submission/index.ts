import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateSubmissionRequest {
  submissionId: string;
  content?: string;
  file_urls?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Set auth for the request
    const token = authHeader.replace('Bearer ', '');
    await supabase.auth.getUser(token);

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body: UpdateSubmissionRequest = await req.json();
    const { submissionId, content, file_urls } = body;

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'Submission ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Updating submission ${submissionId} for user ${user.id}`);

    // First, verify the submission belongs to the user and is in pending status
    const { data: submission, error: fetchError } = await supabase
      .from('assignment_submissions')
      .select('id, student_id, status, graded_by')
      .eq('id', submissionId)
      .eq('student_id', user.id)
      .single();

    if (fetchError || !submission) {
      console.error('Submission fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Submission not found or access denied' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if submission is still editable (pending and not graded)
    if (submission.status !== 'pending' || submission.graded_by) {
      return new Response(
        JSON.stringify({ error: 'Submission cannot be modified - already graded or submitted' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build update object with only allowed fields
    const updateData: any = {};
    if (content !== undefined) {
      updateData.content = content;
    }
    if (file_urls !== undefined) {
      updateData.file_urls = file_urls;
    }

    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid fields to update' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Updating submission with data:', updateData);

    // Perform the update using service role to bypass RLS temporarily
    // but with explicit field restrictions to ensure security
    const { data: updatedSubmission, error: updateError } = await supabase
      .from('assignment_submissions')
      .update(updateData)
      .eq('id', submissionId)
      .eq('student_id', user.id)
      .eq('status', 'pending')
      .is('graded_by', null)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update submission' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Submission updated successfully:', updatedSubmission.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        submission: updatedSubmission 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})