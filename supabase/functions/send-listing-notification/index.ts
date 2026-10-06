import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

/**
 * Tells the platform owner when a listing is submitted or edited.
 *
 * This is the notification whose absence meant Caragh Lake House sat unseen in
 * the review queue for days. A submitted listing is the single most valuable
 * event on the platform at this stage — it should never be discovered by
 * accident.
 *
 * Callable anonymously because it fires immediately after the host's own write,
 * but it trusts nothing from the caller: every detail in the email is read back
 * from the database with the service role using only the supplied id.
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "darragh@teebnb.com";
const FROM = Deno.env.get("BOOKING_FROM_EMAIL") ?? "TeeBnB <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const esc = (v: unknown) =>
  String(v ?? "—").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { listingId, event } = await req.json();
    if (!listingId) return json({ error: "listingId is required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: l, error } = await admin
      .from("property_listings")
      .select("*")
      .eq("id", listingId)
      .maybeSingle();

    if (error) throw error;
    if (!l) return json({ ok: true }); // unknown id — say nothing

    const isNew = event !== "updated";
    const needsReview = l.status === "pending_review";

    const photos: string[] = (l.photos as string[]) || [];
    const courses = Array.isArray(l.nearby_golf_courses)
      ? (l.nearby_golf_courses as string[]).join(", ")
      : l.nearby_golf_courses;

    const subject = isNew
      ? `🏠 New listing awaiting review — ${l.property_title}`
      : `✏️ Listing updated — ${l.property_title}`;

    const strip = photos.slice(0, 4)
      .map((p) => `<img src="${p}" width="130" height="88" style="object-fit:cover;border-radius:6px;margin-right:4px;" />`)
      .join("");

    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      replyTo: (l.host_email as string) || ADMIN_EMAIL,
      subject,
      html: `
        <div style="max-width:620px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="background:#0B1F17;padding:28px 24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#C8A24B;margin:0;font-size:26px;">TeeBnB</h1>
            <p style="color:#A8B9B0;margin:6px 0 0;font-size:14px;">
              ${isNew ? "New listing submitted" : "Existing listing edited"}
            </p>
          </div>
          <div style="background:#fff;padding:26px;border:1px solid #EDEBE1;border-top:none;border-radius:0 0 12px 12px;">

            <h2 style="color:#0B1F17;margin:0 0 4px;font-size:21px;">${esc(l.property_title)}</h2>
            <p style="color:#5C6B62;font-size:14px;margin:0 0 16px;">${esc(l.full_address)}</p>

            ${strip ? `<div style="margin:0 0 18px;white-space:nowrap;overflow:hidden;">${strip}</div>` : ""}

            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3A4A41;">
              <tr><td style="padding:7px 0;color:#5C6B62;">Price</td><td style="padding:7px 0;text-align:right;font-weight:600;">€${esc(l.nightly_price)} / night</td></tr>
              <tr><td style="padding:7px 0;color:#5C6B62;">Sleeps</td><td style="padding:7px 0;text-align:right;">${esc(l.max_guests)} · ${esc(l.bedrooms)} bed · ${esc(l.bathrooms)} bath</td></tr>
              ${courses ? `<tr><td style="padding:7px 0;color:#5C6B62;">Nearby course</td><td style="padding:7px 0;text-align:right;">⛳ ${esc(courses)}</td></tr>` : ""}
              <tr><td style="padding:7px 0;color:#5C6B62;">Photos</td><td style="padding:7px 0;text-align:right;">${photos.length}</td></tr>
              <tr><td style="padding:7px 0;color:#5C6B62;">Status</td><td style="padding:7px 0;text-align:right;font-weight:600;color:${needsReview ? "#92400E" : "#166534"};">${esc(l.status)}</td></tr>
            </table>

            <div style="background:#F6F5EF;border-radius:8px;padding:14px;margin:18px 0;font-size:14px;color:#3A4A41;">
              <strong>${esc(l.host_name)}</strong><br/>
              <a href="mailto:${esc(l.host_email)}" style="color:#15794C;">${esc(l.host_email)}</a>
              ${l.host_phone ? ` · <a href="tel:${esc(l.host_phone)}" style="color:#15794C;">${esc(l.host_phone)}</a>` : ""}
            </div>

            ${needsReview ? `
            <div style="background:#FFF6E0;border:1px solid #C8A24B;border-radius:8px;padding:14px;margin:0 0 18px;">
              <p style="margin:0;font-size:14px;color:#6B5417;line-height:1.6;">
                <strong>This is not live yet.</strong> It stays invisible to visitors until you approve it.
                Worth ringing the host today either way — a new listing is the best possible reason to call.
              </p>
            </div>` : ""}

            <a href="https://teebnb.com/admin" style="display:inline-block;background:#C7F04A;color:#0B1F17;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
              ${needsReview ? "Review and publish →" : "Open the admin queue →"}
            </a>
          </div>
        </div>`,
    });

    return json({ ok: true, notified: true });
  } catch (err) {
    console.error("send-listing-notification failed:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
