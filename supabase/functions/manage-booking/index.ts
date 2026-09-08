import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

/**
 * Self-service booking management for guests who booked without an account.
 *
 * Access is by unguessable `manage_token` (a uuid emailed to the guest), which
 * lets them exercise their rights — see their data, cancel, request erasure —
 * without us forcing account creation at checkout.
 *
 * Runs with the service role because anon deliberately has no SELECT policy on
 * bookings. Every action is scoped to the single booking matching the token.
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM = Deno.env.get("BOOKING_FROM_EMAIL") ?? "TeeBnB <onboarding@resend.dev>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "darragh@teebnb.com";

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
    const { token, action } = await req.json();

    if (!token || typeof token !== "string") {
      return json({ error: "Missing booking token" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: booking, error } = await admin
      .from("bookings")
      .select("*")
      .eq("manage_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!booking) {
      return json({ error: "not_found", message: "We couldn't find that booking. The link may be incorrect or expired." }, 404);
    }

    // Look up the property for display.
    const { data: listing } = await admin
      .from("property_listings")
      .select("property_title, full_address, host_name, host_email")
      .eq("id", booking.listing_id)
      .maybeSingle();

    const ref = String(booking.id).slice(0, 8).toUpperCase();

    // Never send the token or internal ids back to the browser.
    const safeBooking = {
      reference: ref,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone,
      specialRequests: booking.special_requests,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      nights: booking.nights,
      guests: booking.guests,
      total: booking.total,
      status: booking.status,
      erased: Boolean(booking.guest_data_erased_at),
      property: listing
        ? { title: listing.property_title, address: listing.full_address, host: listing.host_name }
        : null,
    };

    // ── View ──────────────────────────────────────────────────────────
    if (!action || action === "view") {
      return json({ booking: safeBooking });
    }

    // ── Cancel ────────────────────────────────────────────────────────
    if (action === "cancel") {
      if (booking.status === "cancelled") {
        return json({ error: "already_cancelled", message: "This booking is already cancelled." }, 409);
      }
      if (booking.status === "completed") {
        return json({ error: "already_completed", message: "This stay has already taken place and can't be cancelled." }, 409);
      }

      const { error: cancelErr } = await admin
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("manage_token", token);

      if (cancelErr) throw cancelErr;

      // Let the host know, best effort.
      if (listing?.host_email) {
        try {
          await resend.emails.send({
            from: FROM,
            to: [listing.host_email],
            replyTo: ADMIN_EMAIL,
            subject: `Booking cancelled — ${listing.property_title} (ref ${ref})`,
            html: `<p>${booking.guest_name} has cancelled their booking.</p>
                   <p><strong>${listing.property_title}</strong><br/>
                   ${booking.check_in} to ${booking.check_out} · ${booking.guests} guest(s)</p>
                   <p>Reference ${ref}. These dates are free again.</p>`,
          });
        } catch (e) { console.error("Host cancellation email failed:", e); }
      }

      try {
        await resend.emails.send({
          from: FROM,
          to: [ADMIN_EMAIL],
          subject: `Booking cancelled by guest — ref ${ref}`,
          html: `<p>${booking.guest_name} (${booking.guest_email}) cancelled ref ${ref}.</p>`,
        });
      } catch (e) { console.error("Admin cancellation email failed:", e); }

      return json({ booking: { ...safeBooking, status: "cancelled" } });
    }

    // ── Erase personal data (GDPR Article 17, for account-less guests) ──
    if (action === "erase") {
      const today = new Date().toISOString().split("T")[0];
      const isUpcoming =
        ["pending", "confirmed"].includes(booking.status) && booking.check_out >= today;

      if (isUpcoming) {
        return json({
          error: "active_booking",
          message:
            "This booking is still upcoming. Please cancel it first, then you can remove your details.",
        }, 409);
      }

      const { error: eraseErr } = await admin
        .from("bookings")
        .update({
          guest_name: "Deleted user",
          guest_email: null,
          guest_phone: null,
          special_requests: null,
          guest_user_id: null,
          guest_data_erased_at: new Date().toISOString(),
        })
        .eq("manage_token", token);

      if (eraseErr) throw eraseErr;

      // Confirmation to the address before we lose it.
      if (booking.guest_email) {
        try {
          await resend.emails.send({
            from: FROM,
            to: [booking.guest_email],
            replyTo: ADMIN_EMAIL,
            subject: "Your details have been removed from TeeBnB",
            html: `
              <div style="max-width:600px;margin:0 auto;font-family:-apple-system,sans-serif;">
                <div style="background:#0B1F17;padding:28px;text-align:center;border-radius:12px 12px 0 0;">
                  <h1 style="color:#C8A24B;margin:0;font-size:26px;">TeeBnB</h1>
                </div>
                <div style="background:#fff;padding:28px;border:1px solid #EDEBE1;border-top:none;border-radius:0 0 12px 12px;">
                  <h2 style="color:#0B1F17;margin:0 0 14px;font-size:19px;">Your details have been removed</h2>
                  <p style="color:#3A4A41;font-size:15px;line-height:1.6;">
                    We've removed your name, email address, phone number and any notes from
                    booking ${ref}.
                  </p>
                  <div style="background:#F6F5EF;border-radius:8px;padding:15px;margin:18px 0;">
                    <p style="margin:0;font-size:14px;color:#5C6B62;line-height:1.6;">
                      We've kept an anonymised record of the stay itself — dates and amount only —
                      because Irish tax law requires transaction records to be held for six years.
                      It can no longer be linked to you.
                    </p>
                  </div>
                  <p style="color:#5C6B62;font-size:14px;margin:0;">
                    Questions? Contact <a href="mailto:${ADMIN_EMAIL}" style="color:#15794C;">${ADMIN_EMAIL}</a>.
                  </p>
                </div>
              </div>`,
          });
        } catch (e) { console.error("Erasure confirmation failed:", e); }
      }

      try {
        await resend.emails.send({
          from: FROM,
          to: [ADMIN_EMAIL],
          subject: `Guest data erased — ref ${ref}`,
          html: `<p>Guest data for booking ${ref} was erased at ${new Date().toISOString()} via the self-service link.</p>`,
        });
      } catch (e) { console.error("Admin erasure notice failed:", e); }

      return json({ erased: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("manage-booking failed:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
