import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Where the platform owner wants to be copied on every booking.
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "darragh@teebnb.com";
// Must be a verified sender/domain in Resend.
const FROM = Deno.env.get("BOOKING_FROM_EMAIL") ?? "TeeBnB <bookings@teebnb.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const euro = (n: number) =>
  `€${Number(n ?? 0).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const prettyDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const shell = (heading: string, subheading: string, body: string) => `
  <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="background:#0B1F17;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
      <h1 style="color:#C8A24B;margin:0;font-size:28px;font-weight:bold;">TeeBnB</h1>
      <p style="color:#A8B9B0;margin:6px 0 0;font-size:15px;">${subheading}</p>
    </div>
    <div style="background:#ffffff;padding:32px 28px;border-radius:0 0 12px 12px;border:1px solid #EDEBE1;border-top:none;">
      <h2 style="color:#0B1F17;margin:0 0 20px;font-size:22px;">${heading}</h2>
      ${body}
    </div>
    <p style="text-align:center;color:#9AA5A0;font-size:12px;margin:20px 0;">
      TeeBnB · <a href="https://teebnb.com" style="color:#15794C;">teebnb.com</a>
    </p>
  </div>
`;

const detailsTable = (b: Record<string, unknown>, listingTitle: string, address: string) => `
  <table style="width:100%;border-collapse:collapse;font-size:15px;color:#3A4A41;">
    <tr><td style="padding:8px 0;color:#5C6B62;">Property</td><td style="padding:8px 0;text-align:right;font-weight:600;">${listingTitle}</td></tr>
    <tr><td style="padding:8px 0;color:#5C6B62;">Location</td><td style="padding:8px 0;text-align:right;">${address ?? "—"}</td></tr>
    <tr><td style="padding:8px 0;color:#5C6B62;">Check in</td><td style="padding:8px 0;text-align:right;font-weight:600;">${prettyDate(b.check_in as string)}</td></tr>
    <tr><td style="padding:8px 0;color:#5C6B62;">Check out</td><td style="padding:8px 0;text-align:right;font-weight:600;">${prettyDate(b.check_out as string)}</td></tr>
    <tr><td style="padding:8px 0;color:#5C6B62;">Nights</td><td style="padding:8px 0;text-align:right;">${b.nights}</td></tr>
    <tr><td style="padding:8px 0;color:#5C6B62;">Guests</td><td style="padding:8px 0;text-align:right;">${b.guests}</td></tr>
    <tr><td style="padding:12px 0 8px;color:#5C6B62;border-top:1px solid #EDEBE1;">Total</td><td style="padding:12px 0 8px;text-align:right;font-weight:700;font-size:18px;color:#15794C;border-top:1px solid #EDEBE1;">${euro(b.total as number)}</td></tr>
  </table>
`;

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client so we can read the booking + host details regardless of RLS.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      throw new Error(`Booking ${bookingId} not found: ${bookingErr?.message}`);
    }

    const { data: listing } = await supabase
      .from("property_listings")
      .select("property_title, full_address, host_name, host_email, user_id")
      .eq("id", booking.listing_id)
      .single();

    const listingTitle = listing?.property_title ?? "your property";
    const address = listing?.full_address ?? "";
    const hostEmail = listing?.host_email ?? null;
    const hostName = listing?.host_name ?? "there";
    const ref = String(booking.id).slice(0, 8).toUpperCase();
    const manageUrl = booking.manage_token
      ? `https://teebnb.com/manage-booking?token=${booking.manage_token}`
      : null;

    const results: Record<string, unknown> = {};

    // ── 1. Host: you have a booking request ──────────────────────────
    if (hostEmail) {
      const hostBody = `
        <p style="color:#3A4A41;font-size:16px;line-height:1.6;margin:0 0 20px;">
          Hi ${hostName}, you've received a new booking request on TeeBnB. Please accept or decline it in your dashboard.
        </p>
        ${detailsTable(booking, listingTitle, address)}
        <div style="background:#F6F5EF;border-radius:8px;padding:16px;margin:24px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#5C6B62;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Guest</p>
          <p style="margin:0;font-size:15px;color:#0B1F17;font-weight:600;">${booking.guest_name}</p>
          <p style="margin:4px 0 0;font-size:14px;"><a href="mailto:${booking.guest_email}" style="color:#15794C;">${booking.guest_email}</a> · <a href="tel:${booking.guest_phone}" style="color:#15794C;">${booking.guest_phone}</a></p>
          ${booking.special_requests ? `<p style="margin:10px 0 0;font-size:14px;color:#5C6B62;font-style:italic;">"${booking.special_requests}"</p>` : ""}
        </div>
        <a href="https://teebnb.com/dashboard" style="display:inline-block;background:#C7F04A;color:#0B1F17;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
          Review this request →
        </a>
        <p style="color:#9AA5A0;font-size:13px;margin:20px 0 0;">Booking reference ${ref}</p>
      `;

      results.host = await resend.emails.send({
        from: FROM,
        to: [hostEmail],
        replyTo: booking.guest_email as string,
        subject: `New booking request — ${listingTitle} (${prettyDate(booking.check_in as string)})`,
        html: shell("You have a new booking request", "Booking request", hostBody),
      });
    }

    // ── 2. Guest: we've passed your request on ───────────────────────
    const guestBody = `
      <p style="color:#3A4A41;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Thanks ${String(booking.guest_name).split(" ")[0]} — we've sent your request to the host. They'll confirm shortly, and no payment is taken until they accept.
      </p>
      ${detailsTable(booking, listingTitle, address)}
      <div style="background:#F0FDF4;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#166534;">
          Your reference is <strong>${ref}</strong>. Quote this in any correspondence.
        </p>
      </div>
      ${manageUrl ? `
      <div style="text-align:center;margin:26px 0;">
        <a href="${manageUrl}" style="display:inline-block;background:#C7F04A;color:#0B1F17;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
          View or cancel this booking
        </a>
        <p style="color:#9AA5A0;font-size:12px;margin:10px 0 0;">
          No account needed — this link is unique to you. Keep it safe.
        </p>
      </div>` : ''}
      <p style="color:#5C6B62;font-size:14px;line-height:1.6;margin:0;">
        Any questions, just reply to this email and we'll help.
      </p>
    `;

    results.guest = await resend.emails.send({
      from: FROM,
      to: [booking.guest_email as string],
      replyTo: ADMIN_EMAIL,
      subject: `We've sent your request — ${listingTitle} (ref ${ref})`,
      html: shell("Your booking request is in", "Request received", guestBody),
    });

    // ── 3. Admin copy so nothing is ever missed ──────────────────────
    const adminBody = `
      <p style="color:#3A4A41;font-size:16px;line-height:1.6;margin:0 0 20px;">
        New booking on TeeBnB. Host ${hostEmail ? `notified at ${hostEmail}` : "<strong>has no email on file — follow up manually</strong>"}.
      </p>
      ${detailsTable(booking, listingTitle, address)}
      <div style="background:#F6F5EF;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;font-size:15px;color:#0B1F17;font-weight:600;">${booking.guest_name}</p>
        <p style="margin:4px 0 0;font-size:14px;">${booking.guest_email} · ${booking.guest_phone}</p>
        ${booking.special_requests ? `<p style="margin:10px 0 0;font-size:14px;color:#5C6B62;font-style:italic;">"${booking.special_requests}"</p>` : ""}
      </div>
      <p style="color:#9AA5A0;font-size:13px;margin:0;">Ref ${ref} · booking id ${booking.id}</p>
    `;

    results.admin = await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      replyTo: booking.guest_email as string,
      subject: `🔔 New booking — ${listingTitle} — ${euro(booking.total as number)} (ref ${ref})`,
      html: shell("New booking came in", "Admin notification", adminBody),
    });

    return new Response(JSON.stringify({ success: true, ref, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-booking-notification failed:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
