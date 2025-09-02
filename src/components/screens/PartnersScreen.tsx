import React from 'react';
import { Store, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  description: string;
  cost: number;
  premiumCost: number;
  discount: string;
  premiumDiscount: string;
  type: string;
}

const partners: Partner[] = [
  {
    id: 'astuces-lco',
    name: 'Astuces LCO',
    description: 'Guide exclusif des soins pour cheveux crépus',
    cost: 30,
    premiumCost: 30,
    discount: 'Ebook gratuit',
    premiumDiscount: 'Ebook gratuit',
    type: 'Ebook'
  },
  {
    id: 'naturelle',
    name: 'NaturelELLE',
    description: 'Produits naturels pour cheveux afro',
    cost: 50,
    premiumCost: 40,
    discount: '-10%',
    premiumDiscount: '-15%',
    type: 'Boutique'
  },
  {
    id: 'cantu',
    name: 'Cantu',
    description: 'Marque spécialisée cheveux bouclés et crépus',
    cost: 60,
    premiumCost: 50,
    discount: '-15%',
    premiumDiscount: '-20%',
    type: 'Marque'
  }
];

interface PartnersScreenProps {
  onNavigate: (screen: string) => void;
}

export function PartnersScreen({ onNavigate }: PartnersScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const generateCode = () => {
    return 'CN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };
  
  const handleUseOffer = (partner: Partner) => {
    const cost = state.premium ? partner.premiumCost : partner.cost;
    
    if (state.coins >= cost) {
      const code = generateCode();
      
      dispatch({ type: 'SPEND_COINS', amount: cost });
      dispatch({ 
        type: 'ADD_REDEEM', 
        redeem: {
          partnerId: partner.name,
          code,
          date: new Date().toISOString()
        }
      });
      
      toast({
        title: `Code généré : ${code}`,
        description: "Votre code est disponible dans Journal > Achats",
      });
    }
  };
  
  const isOfferUsed = (partnerId: string) => {
    return state.redeems.some(redeem => redeem.partnerId.includes(partnerId));
  };
  
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-poppins font-bold text-2xl">Nos Partenaires</h2>
        <p className="font-roboto text-muted-foreground">
          Utilisez vos CotonCoins pour obtenir des avantages exclusifs
        </p>
      </div>
      
      {/* Premium Upsell */}
      {!state.premium && (
        <CotonCard variant="premium" className="p-4">
          <div className="flex items-center gap-3">
            <Crown className="text-white" size={24} />
            <div className="flex-1">
              <h3 className="font-poppins font-semibold text-white">
                👑 Débloquer plus d'avantages
              </h3>
              <p className="text-white/90 text-sm font-roboto">
                Réductions Premium et coûts réduits
              </p>
            </div>
            <Button 
              variant="rose" 
              size="sm"
              onClick={() => onNavigate('premium')}
            >
              Premium
            </Button>
          </div>
        </CotonCard>
      )}
      
      {/* Partners List */}
      <div className="space-y-4">
        {partners.map((partner) => {
          const cost = state.premium ? partner.premiumCost : partner.cost;
          const discount = state.premium ? partner.premiumDiscount : partner.discount;
          const canAfford = state.coins >= cost;
          const used = isOfferUsed(partner.name);
          const usedRedeem = state.redeems.find(r => r.partnerId.includes(partner.name));
          
          return (
            <CotonCard key={partner.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-coton-rose rounded-lg">
                    <Store className="text-coton-black" size={20} />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg">
                      {partner.name}
                    </h3>
                    <p className="font-roboto text-muted-foreground text-sm">
                      {partner.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-coton-rose/30 text-coton-black px-2 py-1 rounded-pill text-xs font-roboto">
                        {partner.type}
                      </span>
                      {state.premium && (
                        <span className="bg-gradient-hero text-white px-2 py-1 rounded-pill text-xs font-roboto">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-poppins font-bold text-lg text-success">
                    {discount}
                  </div>
                  <div className="font-roboto text-sm text-muted-foreground">
                    {cost} CotonCoins
                  </div>
                </div>
                
                {used ? (
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-success mb-1">
                      <Check size={16} />
                      <span className="font-roboto text-sm">Utilisé</span>
                    </div>
                    <div className="font-poppins font-mono text-sm text-coton-black">
                      {usedRedeem?.code}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant={canAfford ? "hero" : "outline"}
                    size="sm"
                    onClick={() => handleUseOffer(partner)}
                    disabled={!canAfford}
                  >
                    {canAfford ? "Utiliser l'offre" : "Pas assez de CC"}
                  </Button>
                )}
              </div>
              
              {state.premium && !used && (
                <div className="bg-gradient-rose/20 border border-coton-rose/30 rounded-lg p-3">
                  <p className="text-sm font-roboto text-coton-black">
                    🎉 Avantage Premium : {partner.premiumDiscount} au lieu de {partner.discount}
                    {partner.cost !== partner.premiumCost && ` • Économisez ${partner.cost - partner.premiumCost} CC`}
                  </p>
                </div>
              )}
            </CotonCard>
          );
        })}
      </div>
      
      {/* Info Card */}
      <CotonCard className="p-4">
        <div className="text-center space-y-2">
          <h4 className="font-poppins font-semibold">Comment ça marche ?</h4>
          <p className="font-roboto text-sm text-muted-foreground">
            Échangez vos CotonCoins contre des codes promo. Les codes générés sont stockés dans votre Journal pour un accès permanent.
          </p>
        </div>
      </CotonCard>
    </div>
  );
}