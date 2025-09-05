import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HairProfile {
  hairType: string;
  porosity: string;
  objective: string;
  problems: string[];
  needs: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { profile }: { profile: HairProfile } = await req.json();

    if (!profile) {
      throw new Error('Profile is required');
    }

    // Create detailed prompt for GPT-5
    const prompt = `Tu es un expert coiffeur spécialisé dans les cheveux crépus, bouclés et texturés. 

PROFIL CAPILLAIRE:
- Type de cheveux: ${profile.hairType}
- Porosité: ${profile.porosity}
- Objectif principal: ${profile.objective}
- Problèmes: ${profile.problems?.join(', ') || 'Aucun'}
- Besoins spécifiques: ${profile.needs?.join(', ') || 'Aucun'}

CONSIGNES:
1. Crée une routine capillaire personnalisée de 4-6 étapes maximum
2. Adapte chaque étape selon le type de cheveux ET la porosité
3. Priorise les problèmes mentionnés
4. Utilise des termes techniques précis mais accessibles
5. Chaque étape doit être actionnable et spécifique

FORMAT DE RÉPONSE (JSON uniquement):
{
  "steps": [
    "Étape 1 spécifique au profil",
    "Étape 2 adaptée aux besoins",
    "..."
  ],
  "prioritySteps": [0, 2], // Indices des étapes prioritaires
  "tip": "Conseil spécifique de 1-2 phrases pour ce profil"
}

Génère une routine optimale pour ce profil exact.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en soins capillaires spécialisé dans les cheveux crépus et bouclés. Réponds uniquement en JSON valide selon le format demandé.'
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      // Fallback response
      parsedResponse = {
        steps: [
          "Pré-poo nourrissant adapté à votre porosité",
          "Nettoyage doux selon votre type de cheveux",
          "Masque hydratant ou protéiné selon vos besoins",
          "Leave-in adapté à votre texture",
          "Scellage avec huile ou beurre selon votre porosité"
        ],
        prioritySteps: [2, 3],
        tip: "Adaptez la fréquence selon la réaction de vos cheveux aux produits."
      };
    }

    console.log('Generated routine for profile:', profile);
    console.log('Response:', parsedResponse);

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personalized-routine function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      steps: [
        "Routine par défaut en cas d'erreur",
        "Nettoyage doux",
        "Hydratation profonde", 
        "Protection et scellage"
      ],
      prioritySteps: [1, 2],
      tip: "Une routine simple est souvent la plus efficace."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});