import React, { useState, useEffect, useMemo } from 'react';
import { Star, ShoppingCart, Info, Sparkles, Zap, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { PRODUCTS_DATABASE, Product } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';

interface ProductRecommendationsProps {
  className?: string;
  maxProducts?: number;
  showAIRecommendations?: boolean;
}

interface AIRecommendation {
  productId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function ProductRecommendations({ 
  className = '', 
  maxProducts = 6,
  showAIRecommendations = true 
}: ProductRecommendationsProps) {
  const { state } = useApp();
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Algorithme de matching basé sur le profil
  const algorithmicRecommendations = useMemo(() => {
    if (!state.detailedHairProfile.isCompleted) return [];

    const { hairType, porosity, objective, problems = [], needs = [] } = state.detailedHairProfile;
    
    return PRODUCTS_DATABASE
      .map(product => {
        let score = 0;
        let reasons: string[] = [];

        // Score pour le type de cheveux (poids: 30%)
        if (product.hairTypes.includes(hairType as any)) {
          score += 30;
          reasons.push('Compatible avec ton type de cheveux');
        }

        // Score pour la porosité (poids: 25%)
        if (product.porosity.includes(porosity as any)) {
          score += 25;
          reasons.push('Adapté à ta porosité');
        }

        // Score pour les problèmes (poids: 20%)
        const matchingProblems = problems.filter(problem => 
          product.problems.some(pp => pp.includes(problem))
        );
        if (matchingProblems.length > 0) {
          score += (matchingProblems.length * 20) / problems.length;
          reasons.push(`Traite tes préoccupations (${matchingProblems.join(', ')})`);
        }

        // Score pour les besoins (poids: 15%)
        const matchingNeeds = needs.filter(need => 
          product.needs.some(pn => pn.includes(need))
        );
        if (matchingNeeds.length > 0) {
          score += (matchingNeeds.length * 15) / needs.length;
          reasons.push(`Répond à tes besoins (${matchingNeeds.join(', ')})`);
        }

        // Score pour les objectifs (poids: 10%)
        if (objective && product.objectives.some(obj => 
          obj.toLowerCase().includes(objective.toLowerCase()) || 
          objective.toLowerCase().includes(obj.toLowerCase())
        )) {
          score += 10;
          reasons.push('Correspond à ton objectif principal');
        }

        // Bonus pour produits naturels
        if (product.isNatural) score += 2;
        if (product.isSulfateFree) score += 2;
        if (product.isParabenFree) score += 1;

        return {
          ...product,
          matchScore: score,
          matchReasons: reasons
        };
      })
      .filter(product => product.matchScore > 20) // Seuil minimum
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxProducts);
  }, [state.detailedHairProfile, maxProducts]);

  // Génération des recommandations AI
  const generateAIRecommendations = async () => {
    if (!state.detailedHairProfile.isCompleted || !showAIRecommendations) return;

    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-recommendations', {
        body: {
          hairProfile: state.detailedHairProfile,
          availableProducts: algorithmicRecommendations.slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            benefits: p.benefits,
            ingredients: p.ingredients.slice(0, 5)
          }))
        }
      });

      if (error) throw error;
      if (data?.recommendations) {
        setAiRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Erreur génération recommandations AI:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    if (showAIRecommendations && state.detailedHairProfile.isCompleted) {
      // Délai pour éviter trop de requêtes
      const timer = setTimeout(generateAIRecommendations, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.detailedHairProfile.isCompleted, showAIRecommendations]);

  // Fusionner recommandations algorithme + AI
  const finalRecommendations = useMemo(() => {
    const aiProductIds = new Set(aiRecommendations.map(ai => ai.productId));
    const enhanced = algorithmicRecommendations.map(product => {
      const aiRec = aiRecommendations.find(ai => ai.productId === product.id);
      return {
        ...product,
        aiRecommendation: aiRec,
        priority: aiRec?.priority || 'medium'
      };
    });

    // Réorganiser selon priorité AI si disponible
    return enhanced.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.matchScore - a.matchScore;
    });
  }, [algorithmicRecommendations, aiRecommendations]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (!state.detailedHairProfile.isCompleted) {
    return (
      <CotonCard className={`p-6 text-center ${className}`}>
        <Sparkles className="w-8 h-8 text-coton-rose mx-auto mb-4" />
        <h3 className="font-poppins font-semibold text-lg mb-2">
          Recommandations personnalisées
        </h3>
        <p className="text-muted-foreground mb-4">
          Complète ton profil capillaire pour recevoir des recommandations de produits adaptées à tes cheveux.
        </p>
        <Button variant="outline">
          Compléter mon profil
        </Button>
      </CotonCard>
    );
  }

  if (finalRecommendations.length === 0) {
    return (
      <CotonCard className={`p-6 text-center ${className}`}>
        <Info className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-poppins font-semibold text-lg mb-2">
          Recommandations en cours...
        </h3>
        <p className="text-muted-foreground">
          Nous analysons ton profil pour te proposer les meilleurs produits.
        </p>
      </CotonCard>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-poppins font-bold text-xl text-foreground">
            Produits recommandés pour toi
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Sélectionnés selon ton profil capillaire {showAIRecommendations && isLoadingAI && '• IA en cours...'}
          </p>
        </div>
        {showAIRecommendations && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIRecommendations}
            disabled={isLoadingAI}
            className="gap-2"
          >
            <Sparkles size={16} />
            {isLoadingAI ? 'Analyse...' : 'Actualiser IA'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalRecommendations.map((product) => (
          <CotonCard key={product.id} className="overflow-hidden hover:shadow-elegant transition-all">
            {/* Header avec priorité AI */}
            {product.aiRecommendation && (
              <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                product.priority === 'high' ? 'bg-coton-rose/20 text-coton-rose' :
                product.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-50 text-gray-600'
              }`}>
                <Zap size={12} />
                Recommandation IA • {product.priority === 'high' ? 'Prioritaire' : 
                                      product.priority === 'medium' ? 'Recommandé' : 'Suggestion'}
              </div>
            )}

            <div className="p-6">
              {/* En-tête produit */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-poppins font-semibold text-base text-foreground leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {product.brand}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(product.id)}
                  className="shrink-0"
                >
                  <Heart 
                    size={16} 
                    className={favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
                  />
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                {product.isNatural && (
                  <Badge variant="outline" className="text-xs text-green-600">
                    Naturel
                  </Badge>
                )}
                {product.isSulfateFree && (
                  <Badge variant="outline" className="text-xs text-blue-600">
                    Sans sulfates
                  </Badge>
                )}
              </div>

              {/* Note et avis */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-sm">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews} avis)
                </span>
              </div>

              {/* Score de compatibilité */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Compatibilité
                  </span>
                  <span className="text-xs font-bold text-coton-rose">
                    {Math.round(product.matchScore)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-coton-rose to-pink-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(product.matchScore, 100)}%` }}
                  />
                </div>
              </div>

              {/* Raisons de recommandation */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Pourquoi ce produit ?
                </p>
                <ul className="space-y-1">
                  {(product.aiRecommendation?.reason ? 
                    [product.aiRecommendation.reason] : 
                    product.matchReasons.slice(0, 2)
                  ).map((reason, index) => (
                    <li key={index} className="text-xs text-foreground flex items-start gap-2">
                      <span className="text-coton-rose mt-1">•</span>
                      <span className="flex-1">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prix et actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-lg text-foreground">
                    {product.price.toFixed(2)}€
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink size={14} />
                  </Button>
                  <Button size="sm" className="gap-2">
                    <ShoppingCart size={14} />
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          </CotonCard>
        ))}
      </div>

      {finalRecommendations.length >= maxProducts && (
        <div className="text-center mt-8">
          <Button variant="outline">
            Voir plus de recommandations
          </Button>
        </div>
      )}
    </div>
  );
}