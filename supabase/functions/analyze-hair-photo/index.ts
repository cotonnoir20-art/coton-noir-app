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
    const { imageUrl, analysisType, hairProfile } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let systemPrompt = '';
    let analysisPrompt = '';

    // Adapter les prompts selon le type d'analyse et la page
    if (analysisType === 'hair_profile') {
      systemPrompt = `Tu es un expert en soins capillaires spécialisé dans les cheveux afro et texturés. Tu analyses les photos de cheveux pour donner des conseils personnalisés.

Réponds UNIQUEMENT en JSON avec cette structure exacte :
{
  "hairTypeDetected": "3C|4A|4B|4C",
  "porosityEstimate": "faible|moyenne|élevée", 
  "overallCondition": "excellent|bon|normal|sec|abîmé",
  "recommendations": {
    "hairType": "Confirmation ou correction du type de cheveux",
    "porosity": "Conseils selon la porosité observée",
    "care": "Routine de soins recommandée",
    "products": "Types de produits à privilégier"
  },
  "observations": [
    "Observation 1 sur l'état général",
    "Observation 2 sur la texture",
    "Observation 3 sur l'hydratation"
  ]
}`;

      analysisPrompt = `Analyse cette photo de cheveux afro/texturés et donne tes recommandations. 
      
Profil actuel : 
- Type déclaré : ${hairProfile?.hairType || 'Non spécifié'}
- Porosité déclarée : ${hairProfile?.porosity || 'Non spécifiée'}
- Objectifs : ${hairProfile?.objective || 'Non spécifiés'}
- Problèmes : ${hairProfile?.problems?.join(', ') || 'Aucun'}

Analyse la photo pour confirmer ou corriger le profil, et donne des conseils spécialisés.`;
      
    } else if (analysisType === 'wash_day') {
      systemPrompt = `Tu es un expert en wash day pour cheveux afro et texturés. Tu analyses les photos avant/après lavage pour donner des conseils.

Réponds UNIQUEMENT en JSON avec cette structure exacte :
{
  "washDayAssessment": {
    "cleanliness": "excellent|bon|normal|insuffisant",
    "hydration": "excellente|bonne|normale|faible",
    "definition": "excellente|bonne|normale|faible",
    "volume": "excellent|bon|normal|plat"
  },
  "recommendations": {
    "nextWashFrequency": "Recommandation de fréquence en jours",
    "productsToTry": "Suggestions de produits selon l'état observé",
    "techniques": "Techniques de lavage ou coiffage recommandées",
    "improvements": "Points d'amélioration pour le prochain wash day"
  },
  "observations": [
    "Observation sur le résultat du lavage",
    "Observation sur la définition des boucles",
    "Observation sur l'hydratation générale"
  ]
}`;

      analysisPrompt = `Analyse cette photo prise pendant ou après un wash day. Évalue la qualité du lavage, l'hydratation, la définition des boucles et donne des conseils pour améliorer la routine.

Profil capillaire : ${hairProfile?.hairType || 'Non spécifié'} - Porosité : ${hairProfile?.porosity || 'Non spécifiée'}`;
      
    } else if (analysisType === 'growth_tracking') {
      systemPrompt = `Tu es un expert en croissance capillaire pour cheveux afro et texturés. Tu analyses les photos pour évaluer la santé et la progression.

Réponds UNIQUEMENT en JSON avec cette structure exacte :
{
  "growthAssessment": {
    "overallHealth": "excellent|bon|normal|préoccupant",
    "lengthRetention": "excellente|bonne|normale|faible",
    "thickness": "épais|normal|fin",
    "breakage": "aucune|légère|modérée|importante"
  },
  "measurements": {
    "estimatedLengthFront": "Estimation en cm",
    "estimatedLengthBack": "Estimation en cm",
    "estimatedLengthSides": "Estimation en cm"
  },
  "recommendations": {
    "growthTips": "Conseils pour stimuler la pousse",
    "retentionTips": "Conseils pour préserver la longueur",
    "protectiveCare": "Soins protecteurs recommandés",
    "supplementsAdvice": "Conseils nutritionnels si pertinent"
  },
  "observations": [
    "Observation sur la santé du cuir chevelu",
    "Observation sur les pointes",
    "Observation sur la densité générale"
  ]
}`;

      analysisPrompt = `Analyse cette photo pour évaluer la croissance et la santé capillaire. Donne des conseils pour améliorer la rétention de longueur et stimuler une croissance saine.

Contexte du profil : ${hairProfile?.hairType || 'Non spécifié'} - Objectifs : ${hairProfile?.objective || 'Croissance'}`;
    }

    console.log('Sending request to OpenAI Vision API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Modèle avec vision
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API Error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ 
          error: `Erreur API OpenAI: ${response.status}`,
          fallbackAdvice: "Prends une photo plus nette en bonne lumière naturelle pour une meilleure analyse."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const data = await response.json();
    console.log('OpenAI Response received:', data);
    
    const analysisResult = data.choices[0].message.content;
    
    try {
      // Parser la réponse JSON
      const parsedResult = JSON.parse(analysisResult);
      
      return new Response(
        JSON.stringify({
          success: true,
          analysis: parsedResult,
          rawResponse: analysisResult
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', analysisResult);
      
      return new Response(
        JSON.stringify({
          success: true,
          analysis: {
            error: "Erreur de format de réponse",
            rawResponse: analysisResult,
            fallbackAdvice: "L'IA a analysé ta photo mais la réponse n'est pas dans le bon format. Réessaie avec une photo plus nette."
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in hair photo analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'analyse de la photo',
        details: error.message,
        fallbackAdvice: "Assure-toi que ta photo est claire et prise en bonne lumière."
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});