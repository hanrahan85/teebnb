
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  token: string;
  type: 'signup' | 'recovery' | 'invite' | 'magiclink';
  redirectTo?: string;
}

const getEmailContent = (type: string, email: string, token: string, redirectTo: string) => {
  const baseUrl = Deno.env.get("SUPABASE_URL");
  const verifyUrl = `${baseUrl}/auth/v1/verify?token=${token}&type=${type}&redirect_to=${redirectTo}`;
  
  switch (type) {
    case 'signup':
      return {
        subject: "🏌️ Welcome to TeeBnB - Verify Your Email",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🏌️ TeeBnB</h1>
              <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 18px;">Golf Course Accommodations</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #065f46; margin: 0 0 20px 0; font-size: 24px;">Welcome to TeeBnB! 🎉</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for joining TeeBnB, the premier platform for golf course accommodations. You're one step away from listing your property and earning from golf travelers worldwide.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" 
                   style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 16px 32px; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  ✅ Verify Email & Get Started
                </a>
              </div>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 24px 0;">
                <p style="margin: 0; color: #065f46; font-weight: 600;">🚀 What's Next?</p>
                <p style="margin: 8px 0 0 0; color: #16a34a; font-size: 14px;">
                  After verification, you'll be able to list your property and start earning from golf travelers visiting nearby courses!
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0 0; text-align: center;">
                This verification link will expire in 24 hours. If you didn't create a TeeBnB account, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">© 2024 TeeBnB - The Golf Accommodation Platform</p>
            </div>
          </div>
        `
      };
    default:
      return {
        subject: "TeeBnB Account Verification",
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, type, redirectTo }: EmailRequest = await req.json();
    
    const { subject, html } = getEmailContent(type, email, token, redirectTo || `${Deno.env.get("SUPABASE_URL")}/auth`);

    const emailResponse = await resend.emails.send({
      from: "TeeBnB <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Custom auth email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending custom auth email:", error);
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
