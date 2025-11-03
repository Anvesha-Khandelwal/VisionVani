import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frame } = await req.json();
    
    if (!frame) {
      throw new Error('No frame provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Extract base64 image data
    const base64Data = frame.split(',')[1];

    // Call Lovable AI with vision capabilities
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify all visible objects. Return a JSON array of objects with "name" and "confidence" (0-1) fields. Be concise and only list distinct, recognizable objects. Example: [{"name":"laptop","confidence":0.95},{"name":"coffee mug","confidence":0.87}]'
              },
              {
                type: 'image_url',
                image_url: {
                  url: frame
                }
              }
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    // Try to parse the JSON response
    let objects = [];
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        objects = JSON.parse(jsonMatch[0]);
      } else {
        objects = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse objects:', content);
      objects = [];
    }

    return new Response(
      JSON.stringify({ objects }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-frame:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});