
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, checkIn, checkOut, guests, filters } = await req.json();

    console.log('Search request:', { location, checkIn, checkOut, guests });

    const searchPrompt = `You are an AI travel assistant specializing in golf accommodations. Search for available accommodations near "${location}" for ${guests} guests from ${checkIn} to ${checkOut}.

Please provide detailed information about:
1. Available hotels, resorts, vacation rentals near the golf course
2. Pricing ranges per night
3. Distance from the golf course
4. Golf-specific amenities (golf packages, storage, shuttle service)
5. Booking availability
6. Contact information or booking links

Format your response as a JSON array of accommodation objects with the following structure:
{
  "accommodations": [
    {
      "name": "Property Name",
      "type": "Hotel/Resort/Rental",
      "pricePerNight": "price range",
      "distanceToGolf": "distance in miles/km",
      "rating": "4.5/5",
      "amenities": ["list of amenities"],
      "golfFeatures": ["golf-specific features"],
      "availability": "available/limited/full",
      "bookingInfo": "booking details or website"
    }
  ]
}

Search specifically for accommodations that cater to golf travelers and provide current availability information.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a specialized AI assistant for finding golf accommodations. Always provide detailed, accurate information in the requested JSON format.' },
          { role: 'user', content: searchPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const aiResponse = data.choices[0].message.content;
    console.log('AI Response:', aiResponse);

    // Try to parse the JSON response
    let accommodations;
    try {
      const parsedResponse = JSON.parse(aiResponse);
      accommodations = parsedResponse.accommodations || [];
    } catch (parseError) {
      console.log('Failed to parse JSON, using raw response');
      accommodations = [{
        name: "Search Results",
        type: "Mixed",
        pricePerNight: "Varies",
        distanceToGolf: "Near golf course",
        rating: "N/A",
        amenities: ["Various amenities available"],
        golfFeatures: ["Golf-friendly accommodations"],
        availability: "Please check directly",
        bookingInfo: aiResponse
      }];
    }

    return new Response(JSON.stringify({ 
      success: true, 
      accommodations,
      searchLocation: location,
      searchDates: { checkIn, checkOut },
      guests
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-accommodations function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
