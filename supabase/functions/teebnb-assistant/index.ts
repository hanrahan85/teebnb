import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.132.1";

/**
 * The on-site chat assistant ("Caddie").
 *
 * Callable anonymously because any visitor can open the chat. The caller only
 * ever supplies the conversation text; listing data is read here with the
 * service role and only public fields are passed to the model or returned.
 * Abuse is bounded by capping history length, message size and output tokens.
 */

const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const MODEL = Deno.env.get("ASSISTANT_MODEL") ?? "claude-opus-5-5";

const MAX_TURNS = 20;
const MAX_CHARS = 2000;
const MAX_TOOL_ROUNDS = 4;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SYSTEM = `You are Caddie, the assistant on teebnb.com. TeeBnB is a booking platform for golf trips in Ireland: every listing is organised around the golf course rather than the town, so golfers can see distance to the first tee, club storage, early breakfast and whether a four-ball fits.

Who you help:
- Golfers planning a trip: find stays near the courses they are playing, using the search_listings tool. Never invent a property, price or availability; only mention listings the tool returned. If nothing matches, say so and suggest widening the area or browsing /search-results.
- Groups and tournament weeks: TeeBnB suits golf groups (four to twelve people) who want a whole house, and championship weeks such as the 2027 Ryder Cup at Adare Manor. Search for the course or area as usual. Never quote prices for event weeks beyond what a listing shows.
- Hosts (B&Bs, guesthouses, self-catering) thinking of listing: listing is free, with no contract or subscription. They start at /list-property. Every listing is reviewed by the TeeBnB team before it goes live.
- Guests with an existing booking: they can manage or cancel it from the link in their confirmation email (no account needed). For anything else, point them to darragh@teebnb.com.

What to be honest about:
- Bookings are requests that the host confirms. Do not promise that dates are available or that a booking is confirmed.
- No payment is taken on the site. A guest sends a booking request, the host confirms it, and payment is arranged directly with the host. Do not describe deposits, refunds or payouts beyond that.
- You do not know tee time availability or green fees; suggest contacting the course.
- Never claim reviews, ratings, booking numbers or other statistics about TeeBnB. The platform is new; say so if asked.
- Do not give legal, tax or medical advice.

Style: warm, brief and practical, like a well-travelled golf friend. Plain text only, no markdown headings or tables. Use short paragraphs or a few dashes for lists. Mention site paths such as /list-property or /faq where they help. When you show listings, name them with distance to the course and nightly price in euro; the site renders clickable cards for them under your reply, so do not paste raw ids or URLs.`;

const tools: Anthropic.Tool[] = [
  {
    name: "search_listings",
    description:
      "Search live TeeBnB listings. Matches the text against the property address and the golf courses it lists as nearby. Use a course name (e.g. 'Lahinch', 'Portmarnock') or a town/county. Returns at most 6 listings.",
    input_schema: {
      type: "object",
      properties: {
        place: { type: "string", description: "Golf course, town or county to search near." },
        guests: { type: "integer", description: "Number of people who need beds." },
        max_nightly_price: { type: "number", description: "Upper limit on nightly price in EUR." },
        needs_bag_storage: { type: "boolean", description: "Only listings with golf bag storage." },
      },
      required: ["place"],
      additionalProperties: false,
    },
    strict: true,
  },
];

type SearchInput = {
  place: string;
  guests?: number;
  max_nightly_price?: number;
  needs_bag_storage?: boolean;
};

type ListingCard = {
  id: string;
  title: string;
  area: string;
  nightly_price: number;
  max_guests: number;
  distance: string | null;
  courses: string[];
  cover_image: string | null;
};

type ListingFacts = {
  type: string;
  bedrooms: number;
  beds: number;
  bag_storage: boolean | null;
  groups: boolean | null;
  minimum_stay: number | null;
  cancellation: string | null;
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Last two comma-separated parts of the address (e.g. "Lahinch, Co. Clare"),
// so neither the model nor the visitor sees a street address.
const area = (address: string) =>
  address.split(",").map((s) => s.trim()).filter(Boolean).slice(-2).join(", ");

// The catalogue is small, so read every active listing and match in code.
// That also covers nearby_golf_courses, a text[] that ilike can't search.
async function searchListings(input: SearchInput): Promise<{ card: ListingCard; facts: ListingFacts }[]> {
  const needle = String(input.place ?? "").trim().toLowerCase().slice(0, 80);
  if (!needle) return [];

  const { data, error } = await admin
    .from("property_listings")
    .select(
      "id, property_title, property_type, full_address, nightly_price, max_guests, bedrooms, beds, distance_to_course, distance_unit, nearby_golf_courses, partner_course_name, golf_bag_storage, can_host_groups, minimum_stay, cancellation_policy, cover_image, photos",
    )
    .eq("status", "active")
    .limit(500);
  if (error) throw error;

  return (data ?? [])
    .filter((r) => {
      const courses = [r.partner_course_name ?? "", ...((r.nearby_golf_courses as string[] | null) ?? [])];
      const haystack = [r.full_address, r.property_title, ...courses].join(" | ").toLowerCase();
      if (!haystack.includes(needle)) return false;
      if (input.guests && r.max_guests < input.guests) return false;
      if (input.max_nightly_price && r.nightly_price > input.max_nightly_price) return false;
      if (input.needs_bag_storage && !r.golf_bag_storage) return false;
      return true;
    })
    .sort((a, b) => (a.distance_to_course ?? 999) - (b.distance_to_course ?? 999))
    .slice(0, 6)
    .map((r) => ({
      card: {
        id: r.id,
        title: r.property_title,
        area: area(r.full_address),
        nightly_price: r.nightly_price,
        max_guests: r.max_guests,
        distance: r.distance_to_course != null ? `${r.distance_to_course} ${r.distance_unit ?? "km"}` : null,
        courses: [
          ...(r.partner_course_name ? [r.partner_course_name] : []),
          ...((r.nearby_golf_courses as string[] | null) ?? []),
        ].slice(0, 4),
        cover_image: r.cover_image ?? (r.photos as string[] | null)?.[0] ?? null,
      },
      facts: {
        type: r.property_type,
        bedrooms: r.bedrooms,
        beds: r.beds,
        bag_storage: r.golf_bag_storage,
        groups: r.can_host_groups,
        minimum_stay: r.minimum_stay,
        cancellation: r.cancellation_policy,
      },
    }));
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Only plain-text user/assistant turns are accepted from the browser.
    const messages: Anthropic.MessageParam[] = incoming
      .filter((m: { role?: string; content?: unknown }) =>
        (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()
      )
      .slice(-MAX_TURNS)
      .map((m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role,
        content: m.content.slice(0, MAX_CHARS),
      }));

    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return json({ error: "Send a message to start." }, 400);
    }

    const shown = new Map<string, ListingCard>();

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        output_config: { effort: "low" },
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        tools: round < MAX_TOOL_ROUNDS ? tools : [],
        messages,
      });

      if (response.stop_reason === "refusal") {
        return json({ reply: "Sorry, I can't help with that one. For anything about a stay, email darragh@teebnb.com.", listings: [] });
      }

      if (response.stop_reason !== "tool_use") {
        const reply = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return json({ reply, listings: [...shown.values()] });
      }

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        try {
          const found = block.name === "search_listings" ? await searchListings(block.input as SearchInput) : [];
          found.forEach(({ card }) => shown.set(card.id, card));
          const forModel = found.map(({ card: { id: _id, cover_image: _img, ...card }, facts }) => ({ ...card, ...facts }));
          results.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: forModel.length ? JSON.stringify(forModel) : "No live listings match.",
          });
        } catch (e) {
          console.error("search_listings failed:", e);
          results.push({ type: "tool_result", tool_use_id: block.id, content: "Search is unavailable right now.", is_error: true });
        }
      }
      messages.push({ role: "user", content: results });
    }

    return json({ reply: "I got a bit lost there. Could you rephrase that?", listings: [] });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "Caddie is busy right now. Please try again in a minute." }, 429);
    }
    console.error("teebnb-assistant error:", error);
    return json({ error: "Caddie is unavailable right now. Please try again shortly." }, 500);
  }
});
