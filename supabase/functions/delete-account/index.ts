import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

/**
 * GDPR Article 17 — right to erasure.
 *
 * Deletion here is deliberately NOT a blanket wipe. Article 17(3)(b) permits
 * retaining data where processing is necessary for compliance with a legal
 * obligation, and Irish Revenue requires transaction records be kept for six
 * years. So we:
 *
 *   1. Refuse if the user has upcoming or in-progress bookings (contract
 *      performance — they must be resolved first).
 *   2. Anonymise historic bookings rather than deleting them: the financial
 *      record survives for accounting, the personal data does not.
 *   3. Delete their listings outright (their own content, no obligation to keep).
 *   4. Delete the auth account so they can no longer sign in.
 *   5. Email a written confirmation of what was removed and what was retained.
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
    // ── Authenticate the caller from their own JWT ────────────────────
    // We never accept a user id from the request body; a user may only ever
    // delete themselves.
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "").trim();
    if (!jwt) return json({ error: "Not authenticated" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      return json({ error: "Not authenticated" }, 401);
    }

    const user = userData.user;
    const userId = user.id;
    const userEmail = user.email ?? null;

    // ── 1. Block deletion where bookings are still live ───────────────
    const today = new Date().toISOString().split("T")[0];

    // Bookings this user made as a guest
    const { data: guestBookings } = await admin
      .from("bookings")
      .select("id, check_out, status")
      .eq("guest_user_id", userId)
      .in("status", ["pending", "confirmed"])
      .gte("check_out", today);

    // Bookings on listings this user hosts
    const { data: myListings } = await admin
      .from("property_listings")
      .select("id")
      .eq("user_id", userId);

    const listingIds = (myListings ?? []).map((l: { id: string }) => l.id);

    let hostBookings: unknown[] = [];
    if (listingIds.length > 0) {
      const { data } = await admin
        .from("bookings")
        .select("id, check_out, status")
        .in("listing_id", listingIds)
        .in("status", ["pending", "confirmed"])
        .gte("check_out", today);
      hostBookings = data ?? [];
    }

    const blockingCount = (guestBookings?.length ?? 0) + hostBookings.length;
    if (blockingCount > 0) {
      return json({
        error: "active_bookings",
        message:
          `You have ${blockingCount} upcoming or in-progress booking${blockingCount === 1 ? "" : "s"}. ` +
          `Please complete or cancel ${blockingCount === 1 ? "it" : "them"} before deleting your account.`,
        count: blockingCount,
      }, 409);
    }

    const summary = {
      bookingsAnonymised: 0,
      listingsDeleted: 0,
    };

    // ── 2. Anonymise historic bookings made as a guest ────────────────
    const { data: pastGuestBookings } = await admin
      .from("bookings")
      .select("id")
      .eq("guest_user_id", userId);

    if (pastGuestBookings && pastGuestBookings.length > 0) {
      const { error: anonErr } = await admin
        .from("bookings")
        .update({
          guest_name: "Deleted user",
          guest_email: null,
          guest_phone: null,
          special_requests: null,
          guest_user_id: null,
        })
        .eq("guest_user_id", userId);

      if (anonErr) throw new Error(`Failed to anonymise bookings: ${anonErr.message}`);
      summary.bookingsAnonymised = pastGuestBookings.length;
    }

    // ── 3. Delete their listings ──────────────────────────────────────
    if (listingIds.length > 0) {
      // Anonymise any historic bookings against those listings first, so the
      // financial record survives without a dangling reference.
      await admin
        .from("bookings")
        .update({ listing_id: null })
        .in("listing_id", listingIds);

      const { error: delListingsErr } = await admin
        .from("property_listings")
        .delete()
        .eq("user_id", userId);

      if (delListingsErr) {
        throw new Error(`Failed to delete listings: ${delListingsErr.message}`);
      }
      summary.listingsDeleted = listingIds.length;
    }

    // ── 4. Delete the auth account ────────────────────────────────────
    const { error: delUserErr } = await admin.auth.admin.deleteUser(userId);
    if (delUserErr) {
      throw new Error(`Failed to delete account: ${delUserErr.message}`);
    }

    // ── 5. Written confirmation (best effort — never fail the deletion) ─
    if (userEmail) {
      const confirmation = `
        <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="background:#0B1F17;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="color:#C8A24B;margin:0;font-size:28px;">TeeBnB</h1>
            <p style="color:#A8B9B0;margin:6px 0 0;font-size:15px;">Account deleted</p>
          </div>
          <div style="background:#fff;padding:32px 28px;border:1px solid #EDEBE1;border-top:none;border-radius:0 0 12px 12px;">
            <h2 style="color:#0B1F17;margin:0 0 16px;font-size:20px;">Your account has been deleted</h2>
            <p style="color:#3A4A41;font-size:15px;line-height:1.6;">
              We've removed your TeeBnB account as requested. Here's exactly what happened:
            </p>
            <ul style="color:#3A4A41;font-size:15px;line-height:1.8;padding-left:20px;">
              <li>Your login and profile details have been permanently deleted.</li>
              <li>${summary.listingsDeleted} propert${summary.listingsDeleted === 1 ? "y" : "ies"} removed from the site.</li>
              <li>${summary.bookingsAnonymised} past booking${summary.bookingsAnonymised === 1 ? "" : "s"} anonymised — your name, email and phone number were removed.</li>
            </ul>
            <div style="background:#F6F5EF;border-radius:8px;padding:16px;margin:20px 0;">
              <p style="margin:0;font-size:14px;color:#5C6B62;line-height:1.6;">
                <strong style="color:#0B1F17;">What we've kept, and why.</strong> We retain anonymised
                records of completed bookings (dates and amounts, with no personal details) because
                Irish tax law requires transaction records to be held for six years. These cannot be
                linked back to you.
              </p>
            </div>
            <p style="color:#5C6B62;font-size:14px;line-height:1.6;margin:0;">
              Questions about your data? Reply to this email or contact
              <a href="mailto:${ADMIN_EMAIL}" style="color:#15794C;">${ADMIN_EMAIL}</a>.
            </p>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: FROM,
          to: [userEmail],
          replyTo: ADMIN_EMAIL,
          subject: "Your TeeBnB account has been deleted",
          html: confirmation,
        });
      } catch (e) {
        console.error("Deletion confirmation email failed:", e);
      }

      // Keep an audit trail of erasure requests — useful if ever challenged.
      try {
        await resend.emails.send({
          from: FROM,
          to: [ADMIN_EMAIL],
          subject: `Account deleted — ${userEmail}`,
          html: `<p>Account <strong>${userEmail}</strong> (${userId}) was deleted at ${new Date().toISOString()}.</p>
                 <p>Listings deleted: ${summary.listingsDeleted}<br/>
                    Bookings anonymised: ${summary.bookingsAnonymised}</p>`,
        });
      } catch (e) {
        console.error("Admin deletion notice failed:", e);
      }
    }

    return json({ success: true, ...summary });
  } catch (err) {
    console.error("delete-account failed:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
