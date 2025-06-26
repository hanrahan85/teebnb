
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
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Verification Link</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <h1 style="color: #dc2626; margin-bottom: 20px;">❌ Invalid Verification Link</h1>
              <p style="font-size: 18px; margin-bottom: 30px;">This verification link is missing required parameters.</p>
              <a href="https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">Go to Sign In</a>
            </div>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
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
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Verification Link</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <h1 style="color: #dc2626; margin-bottom: 20px;">❌ Verification Link Invalid</h1>
              <p style="font-size: 18px; margin-bottom: 30px;">This verification link is invalid or has already been used.</p>
              <a href="https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">Go to Sign In</a>
            </div>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
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
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Link Expired</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <h1 style="color: #dc2626; margin-bottom: 20px;">⏰ Verification Link Expired</h1>
              <p style="font-size: 18px; margin-bottom: 30px;">This verification link has expired. Please request a new one.</p>
              <a href="https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">Request New Link</a>
            </div>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
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

    console.log('Email verification complete, showing success page...');

    // Show a beautiful success page with auto-redirect
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified Successfully!</title>
          <style>
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-30px); }
              60% { transform: translateY(-15px); }
            }
            .bounce { animation: bounce 2s infinite; }
          </style>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh; margin: 0;">
          <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <div class="bounce" style="font-size: 80px; margin-bottom: 20px;">✅</div>
            <h1 style="color: #059669; margin-bottom: 20px; font-size: 32px;">Email Verified!</h1>
            <p style="font-size: 20px; margin-bottom: 15px; color: #374151;">Your email has been successfully verified.</p>
            <p style="font-size: 16px; margin-bottom: 30px; color: #6b7280;">You can now sign in to your TeeBnB account.</p>
            <p style="font-size: 14px; color: #9ca3af; margin-bottom: 30px;">Redirecting you to the app in <span id="countdown">3</span> seconds...</p>
            <a href="https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth?verified=true" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px; margin-right: 10px;">Go to App Now</a>
          </div>
          <script>
            let count = 3;
            const countdownEl = document.getElementById('countdown');
            const timer = setInterval(() => {
              count--;
              countdownEl.textContent = count;
              if (count <= 0) {
                clearInterval(timer);
                window.location.href = 'https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth?verified=true';
              }
            }, 1000);
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Error</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); min-height: 100vh; margin: 0;">
          <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Verification Error</h1>
            <p style="font-size: 18px; margin-bottom: 15px;">There was an error verifying your email.</p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">Error: ${error.message}</p>
            <a href="https://id-preview--1b23bbbf-3efc-45f7-a6fd-0f5bf5af3d3b.lovable.app/auth" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">Try Again</a>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

serve(handler);
