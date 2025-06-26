
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
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

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }

    console.log('Creating Supabase admin client...');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Verifying token:', token);

    // Verify the token and get user info
    const { data: verification, error: verifyError } = await supabaseAdmin
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .eq('verified', false)
      .single();

    if (verifyError || !verification) {
      console.error('Verification error:', verifyError);
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #dc2626;">Verification Link Invalid</h1>
            <p>This verification link is invalid or has already been used.</p>
            <p><a href="http://localhost:3000/auth" style="color: #059669;">Go to Sign In</a></p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    console.log('Found verification record:', verification);

    // Get the user by email using admin client
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

    // Update user to mark email as confirmed
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Update user error:', updateError);
      throw new Error('Failed to verify email');
    }

    console.log('User email confirmed');

    // Mark verification as used
    const { error: markUsedError } = await supabaseAdmin
      .from('email_verifications')
      .update({ verified: true, user_id: user.id })
      .eq('token', token);

    if (markUsedError) {
      console.error('Mark verification used error:', markUsedError);
    }

    // Generate a magic link for automatic sign in
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: verification.email,
      options: {
        redirectTo: `http://localhost:3000/list-property?welcome=true`
      }
    });

    if (linkError || !linkData.properties?.action_link) {
      console.error('Generate link error:', linkError);
      // Fallback: redirect to auth page with success message
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `http://localhost:3000/auth?verified=true`
        }
      });
    }

    console.log('Generated magic link, redirecting user');

    // Redirect to the magic link which will sign them in automatically
    return new Response(null, {
      status: 302,
      headers: {
        'Location': linkData.properties.action_link
      }
    });

  } catch (error: any) {
    console.error("Error in verify-and-signin:", error);
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
