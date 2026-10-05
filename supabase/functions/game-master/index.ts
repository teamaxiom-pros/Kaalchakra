// ==============================================================================
// KAALCHAKRA — AUTHENTICATED GAME MASTER EDGE FUNCTION (DENO / SUPABASE)
// Path: supabase/functions/game-master/index.ts
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GameMasterRequest {
  operation: 'explain_event' | 'generate_hint' | 'recommend_next';
  experienceId: string;
  context: Record<string, unknown>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate Caller using Supabase Auth Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Parse & Validate Request Body
    const body: GameMasterRequest = await req.json();
    const { operation, experienceId, context } = body;

    if (!operation || !experienceId) {
      return new Response(JSON.stringify({ error: 'Missing required operation or experienceId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. If Gemini Secret is not set on the server, return grounded server fallback
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          title: `Game Master Analysis (${operation})`,
          narration: `Historical analysis processed for ${experienceId}. Context: ${JSON.stringify(context).slice(0, 100)}...`,
          historicalContext: 'Civil engineering and defence systems in ancient India were designed around natural geographic contours and sustainable monsoon catchments.',
          guidance: 'Balance strategic reserves with active defensive bastions.',
          sourceAttribution: 'Archaeological Survey of India (ASI) Knowledge Corpus',
          mode: 'server-deterministic',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Call Google Gemini API with Server-Side Secret
    const prompt = `You are the Kaalchakra Game Master, an expert educator in Indian civilization, archaeology, and culture.
User Operation: ${operation}
Experience ID: ${experienceId}
Context: ${JSON.stringify(context)}

Provide a concise, grounded cultural response connecting the gameplay directly to verified Indian civilization facts (e.g. Archaeological Survey of India or UNESCO).
NEVER invent fake dates, battles, or dynasties.
Respond with JSON only:
{
  "title": "Short title",
  "narration": "1-2 sentence dramatic narrative of the event consequence or situation",
  "historicalContext": "2-3 sentences explaining the authentic Indian historical practice or technology",
  "guidance": "1 sentence practical lesson for future planning",
  "sourceAttribution": "Official source like ASI, UNESCO, or Ministry of Culture"
}`;

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      geminiApiKey
    )}`;

    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(candidateText);

    return new Response(
      JSON.stringify({
        ...parsed,
        mode: 'gemini-live',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
