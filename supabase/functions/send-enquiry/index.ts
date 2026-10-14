import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

/**
 * Emails the platform owner when someone fills in an enquiry form on the site
 * (e.g. the Ryder Cup 2027 page: "Request Adare week" from a group, or
 * "List your house for Ryder Cup week" from an owner).
 *
 * Callable anonymously. It only ever emails ADMIN_EMAIL, never an address the
 * caller supplies, so it can't be used to send mail to third parties. Every
 * field is length-capped and HTML-escaped, and a hidden honeypot field drops
 * naive bots.
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "darragh@teebnb.com";
const FROM = Deno.env.get("BOOKING_FROM_EMAIL") ?? "TeeBnB <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FORMS: Record<string, string> = {
  "adare-group": "Group request for Adare week (Ryder Cup 2027)",
  "adare-owner": "Owner wants to list for Ryder Cup week",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const body = await req.json();
    const form = String(body?.form ?? "");
    const fields = body?.fields;
    const label = FORMS[form];
    if (!label || typeof fields !== "object" || fields === null) {
      return json({ error: "unknown form" }, 400);
    }
    // Honeypot: real people never see or fill this field.
    if (body?.website) return json({ ok: true });

    const rows = Object.entries(fields as Record<string, unknown>)
      .slice(0, 25)
      .map(([k, v]) => [String(k).slice(0, 60), String(v ?? "").slice(0, 2000).trim()] as const)
      .filter(([, v]) => v !== "");

    const email = rows.find(([k]) => k === "Email")?.[1] ?? "";
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
    if (!validEmail) return json({ error: "a valid email is required" }, 400);

    const source = body?.attribution && typeof body.attribution === "object"
      ? Object.entries(body.attribution as Record<string, unknown>)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${String(v).slice(0, 100)}`)
          .join(", ")
      : "";

    const tableRows = [...rows, ["Came from", source || "direct / unknown"] as const]
      .map(([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#5C6B62;vertical-align:top;white-space:nowrap;">${escape(k)}</td>` +
        `<td style="padding:8px 0;font-weight:600;white-space:pre-wrap;">${escape(v)}</td></tr>`)
      .join("");

    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      replyTo: validEmail,
      subject: `${label}: ${escape(rows.find(([k]) => k === "Name")?.[1] ?? validEmail)}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="background:#0B1F17;padding:28px 24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#C8A24B;margin:0;font-size:26px;">TeeBnB</h1>
            <p style="color:#A8B9B0;margin:6px 0 0;font-size:14px;">${escape(label)}</p>
          </div>
          <div style="background:#fff;padding:28px;border:1px solid #EDEBE1;border-top:none;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;color:#3A4A41;">${tableRows}</table>
            <p style="margin:22px 0 0;font-size:14px;color:#5C6B62;">Reply to this email to answer them directly. The page promises a personal reply, not an automated one.</p>
          </div>
        </div>`,
    });

    return json({ ok: true });
  } catch (err) {
    console.error("send-enquiry failed:", err);
    return json({ error: "could not send" }, 500);
  }
});
