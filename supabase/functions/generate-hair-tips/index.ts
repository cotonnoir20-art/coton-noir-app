import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HairProfile {
  hairType?: string;
  porosity?: string;
  objective?: string;
  problems?: string[];
  needs?: string[];
  isCompleted?: boolean;
}

interface TipRequest {
  hairProfile: HairProfile;
  tipType: 'routine' | 'general' | 'product' | 'seasonal' | 'styling';
  context?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hairProfile, tipType, context }: TipRequest = await req.json();

    console.log('Generating hair tip for profile:', { hairProfile, tipType, context });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a personalized system prompt based on hair profile
    const systemPrompt = `Tu es Amara, une experte en soins capillaires spécialisée dans les cheveux afro, crépus et bouclés. Tu donnes des conseils personnalisés, pratiques et bienveillants en français.

PROFIL UTILISATRICE:
- Type de cheveux: ${hairProfile.hairType || 'Non spécifié'}
- Porosité: ${hairProfile.porosity || 'Non spécifiée'}
- Objectif principal: ${hairProfile.objective || 'Non spécifié'}
- Problèmes: ${hairProfile.problems?.join(', ') || 'Non spécifiés'}
- Besoins: ${hairProfile.needs?.join(', ') || 'Non spécifiés'}

INSTRUCTIONS:
- Donne UN conseil pratique et actionnable
- Adapte-toi EXACTEMENT au profil capillaire
- Utilise un ton chaleureux et encourageant
- Reste concis (2-3 phrases maximum)
- Inclus des détails spécifiques au type de cheveux
- Évite les conseils génériques
- Utilise le vocabulaire de la communauté afro (twist-out, wash-and-go, protective style, etc.)`;

    let userPrompt = '';
    
    switch (tipType) {
      case 'routine':
        userPrompt = `Donne un conseil spécifique sur la routine capillaire quotidienne ou hebdomadaire pour ce profil. ${context ? `Contexte: ${context}` : ''}`;
        break;
      case 'product':
        userPrompt = `Recommande un type de produit ou ingrédient spécifique adapté à ce profil capillaire. ${context ? `Contexte: ${context}` : ''}`;
        break;
      case 'styling':
        userPrompt = `Donne un conseil de coiffage ou de style protecteur pour ce type de cheveux. ${context ? `Contexte: ${context}` : ''}`;
        break;
      case 'seasonal':
        userPrompt = `Donne un conseil saisonnier pour protéger et maintenir ces cheveux selon la saison actuelle. ${context ? `Contexte: ${context}` : ''}`;
        break;
      case 'general':
      default:
        userPrompt = `Donne un conseil général mais personnalisé pour améliorer la santé et l'apparence de ces cheveux. ${context ? `Contexte: ${context}` : ''}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI');
    }
    
    const generatedTip = data.choices[0].message.content.trim();

    console.log('Generated tip successfully:', generatedTip);

    return new Response(JSON.stringify({ 
      tip: generatedTip,
      tipType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-hair-tips function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      tip: "💡 Astuce du jour : Hydratez vos cheveux régulièrement avec un leave-in adapté à votre porosité !"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});