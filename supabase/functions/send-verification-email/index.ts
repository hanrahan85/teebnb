
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, fullName }: VerificationEmailRequest = await req.json();
    
    // Generate a secure verification token
    const verificationToken = crypto.randomUUID();
    
    // Store verification token in database
    const { error: dbError } = await supabaseAdmin
      .from('email_verifications')
      .insert({
        email,
        token: verificationToken,
        verified: false
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Create the verification link that goes directly to hosting page
    const verificationUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-and-signin?token=${verificationToken}`;

    const emailResponse = await resend.emails.send({
      from: "TeeBnB <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to TeeBnB - Start Hosting Golf Travelers!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 28px; margin-bottom: 10px;">Welcome to TeeBnB!</h1>
            <p style="color: #374151; font-size: 16px;">Start hosting golf travelers at your property</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #065f46; margin-top: 0;">Hi ${fullName}! 🏌️‍♂️</h2>
            <p style="color: #374151; line-height: 1.6;">
              Thank you for joining TeeBnB! You're about to become part of a community that connects golf enthusiasts with amazing accommodations near world-class golf courses.
            </p>
          </div>

          <div style="background: #ffffff; border: 2px solid #d1fae5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="color: #059669; margin-top: 0;">Ready to List Your Property?</h3>
            <p style="color: #374151; margin-bottom: 20px;">
              Click the button below to verify your email and go directly to your hosting dashboard where you can:
            </p>
            <ul style="color: #374151; line-height: 1.8; margin-bottom: 25px;">
              <li>📸 Upload photos of your property</li>
              <li>🏠 Add property details and amenities</li>
              <li>⛳ Highlight nearby golf courses</li>
              <li>💰 Set your pricing and availability</li>
              <li>🎯 Start earning from golf travelers</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verify Email & Start Hosting
              </a>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #374151; margin-top: 0;">Why Golf Travelers Choose TeeBnB:</h4>
            <ul style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <li>🏆 Premium locations near top golf courses</li>
              <li>🎯 Targeted audience of golf enthusiasts</li>
              <li>💼 Higher booking values and longer stays</li>
              <li>🌟 Community of passionate golf travelers</li>
            </ul>
          </div>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create a TeeBnB account, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
