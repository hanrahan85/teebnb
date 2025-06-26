
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    console.log('=== VERIFICATION REQUEST START ===');
    console.log('Full URL:', req.url);
    console.log('Token received:', token);

    if (!token) {
      console.log('No token provided');
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Invalid Verification Link</h1>
            <p>This verification link is missing required parameters.</p>
            <p><a href="http://localhost:3000/auth" style="color: #059669;">Go to Sign In</a></p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Supabase URL:', supabaseUrl);
    console.log('Service key exists:', !!supabaseServiceKey);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Looking up verification token...');

    // Get verification record
    const { data: verifications, error: dbError } = await supabaseAdmin
      .from('email_verifications')
      .select('*')
      .eq('token', token);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Database error');
    }

    if (!verifications || verifications.length === 0) {
      console.error('Token not found in database');
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Verification Link Invalid</h1>
            <p>This verification link is invalid or has expired.</p>
            <p><a href="http://localhost:3000/auth" style="color: #059669;">Go to Sign In</a></p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const verification = verifications[0];
    console.log('Found verification:', {
      email: verification.email,
      verified: verification.verified,
      expires_at: verification.expires_at
    });

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);
    if (now > expiresAt) {
      console.error('Token expired');
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Verification Link Expired</h1>
            <p>This verification link has expired. Please request a new one.</p>
            <p><a href="http://localhost:3000/auth" style="color: #059669;">Go to Sign In</a></p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Find the user
    console.log('Looking up user by email:', verification.email);
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      throw new Error('Failed to find user');
    }

    const user = userData.users.find(u => u.email === verification.email);
    
    if (!user) {
      console.error('User not found for email:', verification.email);
      throw new Error('User not found');
    }

    console.log('Found user:', user.id);

    // Mark email as confirmed
    console.log('Confirming user email...');
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Failed to confirm email:', updateError);
      throw new Error('Failed to verify email');
    }

    // Mark verification as used
    if (!verification.verified) {
      console.log('Marking verification as used...');
      const { error: markUsedError } = await supabaseAdmin
        .from('email_verifications')
        .update({ verified: true, user_id: user.id })
        .eq('token', token);

      if (markUsedError) {
        console.error('Failed to mark verification as used:', markUsedError);
      }
    }

    console.log('Email verification complete, redirecting to app...');

    // Fixed redirect URL with proper absolute path
    return new Response(null, {
      status: 302,
      headers: {
        'Location': 'http://localhost:3000/auth?verified=true'
      }
    });

  } catch (error: any) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Verification Error</h1>
          <p>There was an error verifying your email. Please try again.</p>
          <p>Error: ${error.message}</p>
          <p><a href="http://localhost:3000/auth" style="color: #059669;">Go to Sign In</a></p>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

serve(handler);
