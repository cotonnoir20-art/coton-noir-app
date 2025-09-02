import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentScreenProps {
  planId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function PaymentScreen({ planId, onBack, onSuccess }: PaymentScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const selectedPlan = state.plans.find(p => p.id === planId);
  
  const validateCard = () => {
    if (!cardData.holder.trim()) return false;
    if (cardData.number.replace(/\s/g, '').length < 16) return false;
    if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) return false;
    if (cardData.cvc.length < 3) return false;
    return true;
  };
  
  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCard()) {
      toast({
        title: "Erreur",
        description: "Veuillez vérifier les informations de votre carte",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      dispatch({ type: 'SET_PREMIUM', premium: true });
      dispatch({ type: 'SET_BOX_UNLOCKED', unlocked: true });
      
      toast({
        title: "Bienvenue dans Premium ! 🎉",
        description: "Votre abonnement est maintenant actif",
      });
      
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-poppins font-semibold text-lg">Paiement</h1>
        </div>
      </header>
      
      {/* Content */}
      <div className="p-4 pb-20 space-y-6">
        {/* Plan Summary */}
        <CotonCard variant="premium" className="p-6">
          <div className="text-center text-white space-y-2">
            <h3 className="font-poppins font-bold text-xl">
              {selectedPlan?.name}
            </h3>
            <p className="font-poppins font-bold text-2xl">
              {selectedPlan?.price}
            </p>
            <p className="text-white/90 font-roboto text-sm">
              Accès immédiat à tous les avantages Premium
            </p>
          </div>
        </CotonCard>
        
        {/* Payment Methods */}
        <CotonCard className="p-6 space-y-4">
          <h3 className="font-poppins font-semibold text-lg">
            Méthode de paiement
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                paymentMethod === 'card' 
                  ? 'border-coton-black bg-coton-beige' 
                  : 'border-border hover:border-coton-rose'
              }`}
            >
              <CreditCard className="text-coton-black" size={20} />
              <span className="font-poppins font-medium">Carte bancaire</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('apple')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                paymentMethod === 'apple' 
                  ? 'border-coton-black bg-coton-beige' 
                  : 'border-border hover:border-coton-rose'
              }`}
            >
              <Smartphone className="text-coton-black" size={20} />
              <span className="font-poppins font-medium">Apple Pay</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('google')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                paymentMethod === 'google' 
                  ? 'border-coton-black bg-coton-beige' 
                  : 'border-border hover:border-coton-rose'
              }`}
            >
              <Smartphone className="text-coton-black" size={20} />
              <span className="font-poppins font-medium">Google Pay</span>
            </button>
          </div>
        </CotonCard>
        
        {/* Card Form */}
        {paymentMethod === 'card' && (
          <CotonCard className="p-6 space-y-4">
            <h4 className="font-poppins font-semibold">
              Informations de carte
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-poppins font-medium text-sm">
                  Nom du titulaire
                </label>
                <Input
                  value={cardData.holder}
                  onChange={(e) => setCardData({...cardData, holder: e.target.value})}
                  placeholder="Jean Dupont"
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-poppins font-medium text-sm">
                  Numéro de carte
                </label>
                <Input
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-poppins font-medium text-sm">
                    Expiration
                  </label>
                  <Input
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-poppins font-medium text-sm">
                    CVC
                  </label>
                  <Input
                    value={cardData.cvc}
                    onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                    placeholder="123"
                    maxLength={4}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </CotonCard>
        )}
        
        {/* Security */}
        <CotonCard className="p-4">
          <div className="flex items-center gap-3 text-success">
            <Lock size={16} />
            <p className="font-roboto text-sm">
              Paiement sécurisé SSL 256 bits
            </p>
          </div>
        </CotonCard>
        
        {/* Payment Button */}
        <Button
          variant="hero"
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing || (paymentMethod === 'card' && !validateCard())}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Traitement...
            </>
          ) : (
            <>
              <Lock size={20} />
              Payer {selectedPlan?.price}
            </>
          )}
        </Button>
        
        {/* Terms */}
        <p className="text-xs font-roboto text-muted-foreground text-center leading-relaxed">
          En validant, tu acceptes les CGV et le renouvellement automatique. 
          Annulable à tout moment.
        </p>
      </div>
    </div>
  );
}