
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, formData } = await req.json();

    console.log('Generating travel recommendation for:', formData?.travelerName || 'Unknown');
    console.log('Using prompt length:', prompt?.length || 0);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert golf travel advisor. Create detailed, specific recommendations with exact prices, times, dates, and booking details. Make everything feel authentic and bookable. Use realistic pricing for the specified budget range and region. Include specific hotel names, flight numbers, course tee times, and restaurant reservations. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    const aiResponse = data.choices[0].message.content;
    console.log('Raw AI response length:', aiResponse?.length || 0);
    
    // Parse the JSON response with better error handling
    let parsedRecommendation;
    try {
      parsedRecommendation = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('AI response that failed to parse:', aiResponse);
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          parsedRecommendation = JSON.parse(jsonMatch[1]);
        } catch (secondParseError) {
          console.error('Second JSON parsing error:', secondParseError);
          throw new Error('Failed to parse AI response as JSON');
        }
      } else {
        throw new Error('AI response is not valid JSON');
      }
    }
    
    console.log('Successfully generated and parsed recommendation');

    return new Response(JSON.stringify({ 
      recommendation: parsedRecommendation 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in generate-travel-recommendation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate recommendations' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
