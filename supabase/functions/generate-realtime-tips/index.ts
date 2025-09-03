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
    const { hairType, porosity, objective, problems, needs } = await req.json();
    
    console.log('Received profile data:', { hairType, porosity, objective, problems, needs });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        routinePreview: ['Configuration du profil en cours...'],
        cotonTips: ['Complétez votre profil pour des conseils personnalisés.']
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create dynamic system prompt based on profile
    let systemPrompt = `Tu es CotonTips, une experte en soins capillaires texturés spécialisée dans les cheveux afro, créoles et métissés. 

PROFIL UTILISATRICE:
- Type de cheveux: ${hairType || 'Non spécifié'}
- Porosité: ${porosity || 'Non spécifiée'}
- Objectif principal: ${objective || 'Non spécifié'}
- Problématiques: ${problems?.join(', ') || 'Aucune'}
- Besoins: ${needs?.join(', ') || 'Aucun'}

Tu dois générer:
1. Une routine courte (3-4 étapes max) adaptée AU PROFIL ACTUEL
2. Un conseil personnalisé (CotonTip) basé sur les sélections

Sois concise, pratique et bienveillante. Utilise des emojis appropriés.`;

    const userPrompt = `Génère une routine de soins et un conseil personnalisé pour cette utilisatrice. 

Format de réponse EXACT:
{
  "routinePreview": ["Étape 1", "Étape 2", "Étape 3"],
  "cotonTips": "Un conseil personnalisé avec emoji"
}

Adapte selon le profil fourni. Si des informations manquent, propose des conseils généraux mais encourage à compléter le profil.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return new Response(JSON.stringify({ 
        error: 'Erreur API OpenAI',
        routinePreview: ['Analyse de ton profil...', 'Génération des conseils...', 'Personnalisation en cours...'],
        cotonTips: '💡 Complète ton profil pour des conseils ultra-personnalisés !'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let aiResponse;
    try {
      const content = data.choices[0].message.content;
      console.log('AI content:', content);
      
      // Try to parse JSON response
      aiResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback response based on profile
      const fallbackRoutine = [];
      const fallbackTip = "💡 Complète ton profil pour des conseils personnalisés !";

      if (hairType && porosity) {
        if (porosity === 'haute') {
          fallbackRoutine.push('Pré-shampoing hydratant', 'Shampoing doux', 'Masque protéines-hydratation', 'Leave-in + huile');
        } else if (porosity === 'faible') {
          fallbackRoutine.push('Clarification légère', 'Shampoing hydratant', 'Conditioner léger', 'Leave-in sans huiles lourdes');
        } else {
          fallbackRoutine.push('Shampoing hydratant', 'Masque nourrissant', 'Leave-in', 'Huile légère sur pointes');
        }
      } else {
        fallbackRoutine.push('Analyse de ton profil...', 'Génération des conseils...', 'Personnalisation en cours...');
      }

      aiResponse = {
        routinePreview: fallbackRoutine,
        cotonTips: fallbackTip
      };
    }

    // Ensure we have the right structure
    if (!aiResponse.routinePreview) {
      aiResponse.routinePreview = ['Complète ton profil pour une routine personnalisée'];
    }
    if (!aiResponse.cotonTips) {
      aiResponse.cotonTips = '💡 Sélectionne tes besoins pour des conseils adaptés !';
    }

    console.log('Final response:', aiResponse);

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-realtime-tips function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur interne',
      routinePreview: ['Erreur temporaire...', 'Réessaye dans un moment'],
      cotonTips: '⚠️ Erreur temporaire. Réessaye dans quelques instants.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});