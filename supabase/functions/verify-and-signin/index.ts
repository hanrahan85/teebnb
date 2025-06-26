
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Invalid verification link', { status: 400 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the token and get user info
    const { data: verification, error: verifyError } = await supabaseAdmin
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verification) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Verification Link Invalid</h1>
            <p>This verification link is invalid or has expired.</p>
            <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('https://lwuncvddikvqtcmsabpw.supabase.co', 'http://localhost:3000')}/auth" style="color: #059669;">Go to Sign In</a></p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Mark email as verified in auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(verification.email);
    
    if (userError || !user) {
      throw new Error('User not found');
    }

    // Update user to mark email as confirmed
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.user.id,
      { email_confirm: true }
    );

    if (updateError) {
      throw new Error('Failed to verify email');
    }

    // Mark verification as used
    await supabaseAdmin
      .from('email_verifications')
      .update({ verified: true, user_id: user.user.id })
      .eq('token', token);

    // Generate a session for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: verification.email,
      options: {
        redirectTo: `http://localhost:3000/list-property?welcome=true`
      }
    });

    if (sessionError || !sessionData.properties?.action_link) {
      throw new Error('Failed to generate session');
    }

    // Redirect to the magic link which will sign them in and redirect to list-property
    return new Response(null, {
      status: 302,
      headers: {
        'Location': sessionData.properties.action_link
      }
    });

  } catch (error: any) {
    console.error("Error in verify-and-signin:", error);
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">Verification Error</h1>
          <p>There was an error verifying your email. Please try again.</p>
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
