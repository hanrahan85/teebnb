import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

/**
 * Tells the platform owner when somebody signs up.
 *
 * At this stage a new account is more likely to be a prospective host than a
 * guest, and the right response is a phone call the same day — so this needs to
 * land in a human inbox, not sit in a dashboard nobody checks.
 *
 * Callable anonymously: it fires during sign-up, before the user has a session.
 * It therefore trusts nothing from the caller — the email address is confirmed
 * against auth.users with the service role before anything is sent, so the
 * endpoint cannot be used to send arbitrary mail or to probe the user list.
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "darragh@teebnb.com";
const FROM = Deno.env.get("BOOKING_FROM_EMAIL") ?? "TeeBnB <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source } = await req.json();
    if (!email || typeof email !== "string") {
      return json({ error: "email is required" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Confirm the account genuinely exists before emailing anything.
    // Without this the endpoint would happily notify on any address supplied.
    const { data: list, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;

    const user = list.users.find(
      (u) => (u.email ?? "").toLowerCase() === email.toLowerCase(),
    );

    // Quietly succeed on an unknown address — do not confirm or deny existence.
    if (!user) return json({ ok: true });

    // Don't re-notify for an account created more than 10 minutes ago.
    const ageMs = Date.now() - new Date(user.created_at).getTime();
    if (ageMs > 10 * 60 * 1000) return json({ ok: true, skipped: "not a new account" });

    const fullName = (user.user_metadata?.full_name as string) || "Not given";
    const phone = (user.user_metadata?.phone as string) || "Not given";
    const verified = Boolean(user.email_confirmed_at);
    const when = new Date(user.created_at).toLocaleString("en-IE", {
      dateStyle: "medium", timeStyle: "short",
    });

    const label = source === "post-booking"
      ? "Guest created an account after booking"
      : "New sign-up on teebnb.com";

    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      replyTo: user.email ?? ADMIN_EMAIL,
      subject: `👤 ${label} — ${user.email}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="background:#0B1F17;padding:28px 24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#C8A24B;margin:0;font-size:26px;">TeeBnB</h1>
            <p style="color:#A8B9B0;margin:6px 0 0;font-size:14px;">${label}</p>
          </div>
          <div style="background:#fff;padding:28px;border:1px solid #EDEBE1;border-top:none;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;color:#3A4A41;">
              <tr><td style="padding:8px 0;color:#5C6B62;">Email</td><td style="padding:8px 0;text-align:right;font-weight:600;"><a href="mailto:${user.email}" style="color:#15794C;">${user.email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#5C6B62;">Name</td><td style="padding:8px 0;text-align:right;font-weight:600;">${fullName}</td></tr>
              <tr><td style="padding:8px 0;color:#5C6B62;">Phone</td><td style="padding:8px 0;text-align:right;">${phone}</td></tr>
              <tr><td style="padding:8px 0;color:#5C6B62;">Signed up</td><td style="padding:8px 0;text-align:right;">${when}</td></tr>
              <tr><td style="padding:8px 0;color:#5C6B62;">Email verified</td><td style="padding:8px 0;text-align:right;">${verified ? "Yes" : "Not yet"}</td></tr>
            </table>

            <div style="background:#FFF6E0;border:1px solid #C8A24B;border-radius:8px;padding:15px;margin:22px 0;">
              <p style="margin:0;font-size:14px;color:#6B5417;line-height:1.6;">
                <strong>Worth a phone call today.</strong> At this stage a new account is
                more likely to be a property owner having a look than a guest. Ringing
                them within the hour is the difference between a listing and a dead sign-up.
              </p>
            </div>

            <a href="https://teebnb.com/admin" style="display:inline-block;background:#C7F04A;color:#0B1F17;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
              Open the review queue →
            </a>
          </div>
        </div>`,
    });

    return json({ ok: true, notified: true });
  } catch (err) {
    console.error("send-signup-notification failed:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
