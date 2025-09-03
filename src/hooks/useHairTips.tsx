import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export type TipType = 'routine' | 'general' | 'product' | 'seasonal' | 'styling';

interface HairTip {
  tip: string;
  tipType: TipType;
  timestamp: string;
}

export function useHairTips() {
  const { state } = useApp();
  const [currentTip, setCurrentTip] = useState<HairTip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTip = async (tipType: TipType = 'general', context?: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating tip with profile:', state.detailedHairProfile);

      const { data, error: supabaseError } = await supabase.functions.invoke('generate-hair-tips', {
        body: {
          hairProfile: state.detailedHairProfile,
          tipType,
          context
        }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message || 'Erreur lors de la génération du conseil');
      }

      if (data?.tip) {
        const newTip: HairTip = {
          tip: data.tip,
          tipType: data.tipType || tipType,
          timestamp: data.timestamp || new Date().toISOString()
        };
        setCurrentTip(newTip);
        
        // Store in localStorage for caching
        const cacheKey = `hair-tip-${tipType}-${Date.now()}`;
        localStorage.setItem(cacheKey, JSON.stringify(newTip));
        
        return newTip;
      } else {
        throw new Error('Aucun conseil reçu');
      }
    } catch (err) {
      console.error('Error generating hair tip:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      // Fallback tip based on hair type
      const fallbackTip = getFallbackTip(state.detailedHairProfile.hairType, tipType);
      setCurrentTip(fallbackTip);
      
      return fallbackTip;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a daily tip automatically if profile is completed
  useEffect(() => {
    if (state.detailedHairProfile.isCompleted && !currentTip) {
      const lastTipDate = localStorage.getItem('last-daily-tip-date');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastTipDate !== today) {
        generateTip('general');
        localStorage.setItem('last-daily-tip-date', today);
      } else {
        // Load cached tip for today
        const cachedTips = Object.keys(localStorage)
          .filter(key => key.startsWith('hair-tip-'))
          .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
          .filter(tip => tip.timestamp?.startsWith(today));
        
        if (cachedTips.length > 0) {
          setCurrentTip(cachedTips[cachedTips.length - 1]);
        }
      }
    }
  }, [state.detailedHairProfile.isCompleted]);

  return {
    currentTip,
    generateTip,
    isLoading,
    error,
    setCurrentTip
  };
}

function getFallbackTip(hairType: string, tipType: TipType): HairTip {
  const fallbackTips = {
    '3C': {
      routine: "💧 Tes boucles 3C adorent l'hydratation ! Applique ton leave-in sur cheveux humides en scrunching.",
      product: "🥥 L'huile de coco est parfaite pour sceller l'hydratation sur tes boucles 3C avant le coucher.",
      styling: "✨ Pour un twist-out parfait, divise tes cheveux en petites sections et twist sur cheveux légèrement humides.",
      seasonal: "🌿 En été, protège tes boucles avec un spray UV et évite les manipulations excessives.",
      general: "🌸 Tes boucles 3C sont magnifiques ! Pense à faire un masque hydratant chaque semaine."
    },
    '4A': {
      routine: "💦 Tes cheveux 4A ont besoin d'hydratation quotidienne. Vaporise un mix eau/leave-in chaque matin.",
      product: "🧴 Un gel léger ou une mousse définira parfaitement tes boucles 4A sans les alourdir.",
      styling: "🌀 Les bantu knots sur cheveux 4A donnent de magnifiques boucles définies le lendemain.",
      seasonal: "❄️ En hiver, dors avec un bonnet en satin pour préserver l'hydratation de tes 4A.",
      general: "✨ Tes cheveux 4A sont polyvalents ! N'hésite pas à varier les styles protecteurs."
    },
    '4B': {
      routine: "🌊 Tes cheveux 4B adorent le co-washing ! Alterne avec un shampoing doux une fois par semaine.",
      product: "🥜 Le beurre de karité pur est ton meilleur ami pour sceller l'hydratation sur tes 4B.",
      styling: "🔄 Les flat twists sont parfaits pour tes 4B : style protecteur et joli twist-out ensuite !",
      seasonal: "🌤️ Au printemps, refresh tes 4B avec un spray à base d'aloe vera maison.",
      general: "💪 Tes cheveux 4B sont résistants et beaux ! Masse ton cuir chevelu régulièrement."
    },
    '4C': {
      routine: "💧 Tes cheveux 4C ont besoin de douceur. Démêle UNIQUEMENT sur cheveux mouillés avec beaucoup de conditioner.",
      product: "🌿 L'huile d'avocat pénètre bien dans tes cheveux 4C pour une nutrition en profondeur.",
      styling: "🎯 Les mini twists sont parfaites pour tes 4C : protection maximale et polyvalence de coiffage.",
      seasonal: "🧊 En hiver, fais des pré-poo à l'huile chaude pour protéger tes 4C du froid.",
      general: "👑 Tes cheveux 4C sont une couronne ! Sois patiente et douce dans tes manipulations."
    }
  };

  const hairTypeTips = fallbackTips[hairType as keyof typeof fallbackTips] || fallbackTips['4C'];
  
  return {
    tip: hairTypeTips[tipType] || hairTypeTips.general,
    tipType,
    timestamp: new Date().toISOString()
  };
}