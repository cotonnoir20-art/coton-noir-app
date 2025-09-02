import React, { useState } from 'react';
import { Crown, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';

interface PremiumScreenProps {
  onBack: () => void;
  onPayment: (planId: string) => void;
}

export function PremiumScreen({ onBack, onPayment }: PremiumScreenProps) {
  const { state } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  
  if (state.premium) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-poppins font-semibold text-lg">Premium</h1>
          </div>
        </header>
        
        {/* Active Premium */}
        <div className="p-4 pb-20">
          <CotonCard variant="premium" className="p-8 text-center space-y-6">
            <Crown className="text-white mx-auto" size={48} />
            <div className="space-y-3">
              <h2 className="font-poppins font-bold text-2xl text-white">
                👑 Abonnement actif
              </h2>
              <p className="text-white/90 font-roboto">
                Profitez de tous les avantages Premium
              </p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 text-left space-y-3">
              <h4 className="font-poppins font-semibold text-white">
                Vos avantages actifs :
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={16} />
                  <span className="font-roboto text-sm">CotonCoins ×2</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={16} />
                  <span className="font-roboto text-sm">Box illimitée</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={16} />
                  <span className="font-roboto text-sm">Réductions partenaires boostées</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={16} />
                  <span className="font-roboto text-sm">Tutos exclusifs</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check size={16} />
                  <span className="font-roboto text-sm">Challenges renforcés (+3 CC)</span>
                </div>
              </div>
            </div>
          </CotonCard>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-poppins font-semibold text-lg">Premium</h1>
        </div>
      </header>
      
      {/* Content */}
      <div className="p-4 pb-20 space-y-6">
        {/* Hero */}
        <CotonCard variant="premium" className="p-8 text-center space-y-4">
          <Crown className="text-white mx-auto" size={48} />
          <h2 className="font-poppins font-bold text-2xl text-white">
            Coton Noir Premium
          </h2>
          <p className="text-white/90 font-roboto">
            Boostez votre parcours hair care avec des avantages exclusifs
          </p>
        </CotonCard>
        
        {/* Benefits */}
        <CotonCard className="p-6 space-y-4">
          <h3 className="font-poppins font-semibold text-lg text-center">
            Avantages Premium
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="bg-success text-white p-1 rounded">
                <Check size={14} />
              </div>
              <div>
                <div className="font-poppins font-medium">CotonCoins ×2</div>
                <div className="text-sm font-roboto text-muted-foreground">
                  Double vos gains sur chaque soin et routine
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="bg-success text-white p-1 rounded">
                <Check size={14} />
              </div>
              <div>
                <div className="font-poppins font-medium">Box illimitée</div>
                <div className="text-sm font-roboto text-muted-foreground">
                  Accès immédiat à toutes les Box Digitales
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="bg-success text-white p-1 rounded">
                <Check size={14} />
              </div>
              <div>
                <div className="font-poppins font-medium">Réductions partenaires boostées</div>
                <div className="text-sm font-roboto text-muted-foreground">
                  Jusqu'à -20% au lieu de -15% + coûts réduits
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="bg-success text-white p-1 rounded">
                <Check size={14} />
              </div>
              <div>
                <div className="font-poppins font-medium">Tutos exclusifs</div>
                <div className="text-sm font-roboto text-muted-foreground">
                  Techniques avancées et recettes secrètes
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="bg-success text-white p-1 rounded">
                <Check size={14} />
              </div>
              <div>
                <div className="font-poppins font-medium">Challenges renforcés</div>
                <div className="text-sm font-roboto text-muted-foreground">
                  +8 CC par jour au lieu de +5 CC
                </div>
              </div>
            </div>
          </div>
        </CotonCard>
        
        {/* Plans */}
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg text-center">
            Choisissez votre plan
          </h3>
          
          {state.plans.map((plan) => (
            <CotonCard 
              key={plan.id}
              variant={selectedPlan === plan.id ? 'premium' : 'outline'}
              className={`p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id ? 'ring-2 ring-coton-rose' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className={`font-poppins font-bold text-lg ${
                    selectedPlan === plan.id ? 'text-white' : 'text-foreground'
                  }`}>
                    {plan.name}
                  </h4>
                  <p className={`font-poppins font-bold text-xl ${
                    selectedPlan === plan.id ? 'text-white' : 'text-coton-black'
                  }`}>
                    {plan.price}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id 
                    ? 'border-white bg-white' 
                    : 'border-coton-black'
                }`}>
                  {selectedPlan === plan.id && (
                    <div className="w-2 h-2 rounded-full bg-coton-black" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {plan.perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check 
                      size={14} 
                      className={selectedPlan === plan.id ? 'text-white' : 'text-success'} 
                    />
                    <span className={`font-roboto text-sm ${
                      selectedPlan === plan.id ? 'text-white' : 'text-foreground'
                    }`}>
                      {perk}
                    </span>
                  </div>
                ))}
              </div>
            </CotonCard>
          ))}
        </div>
        
        {/* CTA */}
        <Button
          variant="hero"
          size="lg"
          onClick={() => onPayment(selectedPlan)}
          className="w-full"
        >
          <Crown size={20} />
          Choisir {state.plans.find(p => p.id === selectedPlan)?.name}
        </Button>
        
        {/* Terms */}
        <p className="text-xs font-roboto text-muted-foreground text-center leading-relaxed">
          En validant, tu acceptes les CGV et le renouvellement automatique. 
          Annulable à tout moment dans les paramètres de ton compte.
        </p>
      </div>
    </div>
  );
}