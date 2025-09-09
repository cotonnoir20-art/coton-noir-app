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

interface AvailableProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  benefits: string[];
  ingredients: string[];
}

interface ProductRecommendationRequest {
  hairProfile: HairProfile;
  availableProducts: AvailableProduct[];
}

interface ProductRecommendation {
  productId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hairProfile, availableProducts }: ProductRecommendationRequest = await req.json();

    console.log('Generating product recommendations for profile:', { 
      hairProfile, 
      productCount: availableProducts?.length || 0 
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!hairProfile || !hairProfile.isCompleted) {
      return new Response(JSON.stringify({
        error: 'Hair profile not completed',
        recommendations: []
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a detailed system prompt for product recommendations
    const systemPrompt = `Tu es Amara, une experte en soins capillaires spécialisée dans les cheveux afro, crépus et bouclés. Tu recommandes des produits spécifiques basés sur l'analyse scientifique du profil capillaire.

PROFIL UTILISATRICE:
- Type de cheveux: ${hairProfile.hairType || 'Non spécifié'}
- Porosité: ${hairProfile.porosity || 'Non spécifiée'}
- Objectif principal: ${hairProfile.objective || 'Non spécifié'}
- Problèmes: ${hairProfile.problems?.join(', ') || 'Non spécifiés'}
- Besoins: ${hairProfile.needs?.join(', ') || 'Non spécifiés'}

PRODUITS DISPONIBLES:
${availableProducts.map(p => 
  `ID: ${p.id} | ${p.name} (${p.brand}) | Catégorie: ${p.category} | Bénéfices: ${p.benefits.join(', ')} | Ingrédients clés: ${p.ingredients.slice(0, 3).join(', ')}`
).join('\n')}

INSTRUCTIONS:
- Analyse chaque produit selon sa compatibilité avec le profil
- Priorise selon: type de cheveux > porosité > problèmes > besoins > objectifs
- Recommande 3-6 produits maximum
- Donne une raison scientifique précise pour chaque recommandation
- Classe par priorité: high (indispensable), medium (très utile), low (complémentaire)
- Évite les doublons de catégories sauf si justifié

RÉPONSE FORMAT JSON STRICT:
{
  "recommendations": [
    {
      "productId": "id_exact_du_produit",
      "reason": "Raison scientifique précise basée sur le profil",
      "priority": "high|medium|low",
      "category": "catégorie_du_produit"
    }
  ]
}`;

    const userPrompt = `Analyse ce profil capillaire et recommande les produits les plus adaptés parmi ceux disponibles. Concentre-toi sur les besoins prioritaires et donne des raisons scientifiques basées sur la compatibilité type de cheveux/porosité.`;

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
        max_completion_tokens: 800,
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
    
    let recommendations: ProductRecommendation[] = [];
    const aiResponse = data.choices[0].message.content.trim();

    try {
      // Try to parse JSON response
      const parsed = JSON.parse(aiResponse);
      recommendations = parsed.recommendations || [];
      
      // Validate recommendations format
      recommendations = recommendations.filter(rec => 
        rec.productId && 
        rec.reason && 
        ['high', 'medium', 'low'].includes(rec.priority) &&
        availableProducts.some(p => p.id === rec.productId)
      );

    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // Fallback: generate basic recommendations based on profile
      recommendations = generateFallbackRecommendations(hairProfile, availableProducts);
    }

    console.log('Generated recommendations successfully:', recommendations);

    return new Response(JSON.stringify({ 
      recommendations,
      profileAnalyzed: {
        hairType: hairProfile.hairType,
        porosity: hairProfile.porosity,
        primaryNeeds: hairProfile.needs?.slice(0, 2) || [],
        mainProblems: hairProfile.problems?.slice(0, 2) || []
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-product-recommendations function:', error);
    
    // Try to generate fallback recommendations even on error
    let fallbackRecommendations: ProductRecommendation[] = [];
    try {
      const { hairProfile, availableProducts } = await req.json();
      if (hairProfile && availableProducts) {
        fallbackRecommendations = generateFallbackRecommendations(hairProfile, availableProducts);
      }
    } catch (fallbackError) {
      console.error('Fallback recommendations also failed:', fallbackError);
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendations: fallbackRecommendations,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Fallback function for basic recommendations when AI fails
function generateFallbackRecommendations(
  hairProfile: HairProfile, 
  availableProducts: AvailableProduct[]
): ProductRecommendation[] {
  const recommendations: ProductRecommendation[] = [];
  
  // Basic logic based on hair type and porosity
  const { hairType, porosity, problems = [], needs = [] } = hairProfile;
  
  // Prioritize by category for a basic routine
  const priorityCategories = ['shampoing', 'masque', 'leave-in', 'huile'];
  
  for (const category of priorityCategories) {
    const categoryProducts = availableProducts.filter(p => p.category === category);
    
    if (categoryProducts.length > 0) {
      // Simple scoring based on hair type compatibility
      let bestProduct = categoryProducts[0];
      let bestScore = 0;
      
      for (const product of categoryProducts) {
        let score = 0;
        
        // Basic compatibility scoring
        if (hairType && ['4B', '4C'].includes(hairType) && 
            product.benefits.some(b => b.toLowerCase().includes('hydrat'))) {
          score += 3;
        }
        
        if (porosity === 'elevee' && 
            product.benefits.some(b => b.toLowerCase().includes('répare'))) {
          score += 2;
        }
        
        if (problems.includes('secheresse') && 
            product.ingredients.some(i => ['Karité', 'Coco', 'Argan'].some(ing => i.includes(ing)))) {
          score += 2;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestProduct = product;
        }
      }
      
      if (bestScore > 0) {
        recommendations.push({
          productId: bestProduct.id,
          reason: `Produit adapté à tes cheveux ${hairType || 'texturés'} avec porosité ${porosity || 'moyenne'}`,
          priority: recommendations.length === 0 ? 'high' : 'medium',
          category: bestProduct.category
        });
      }
    }
  }
  
  return recommendations.slice(0, 4); // Max 4 fallback recommendations
}