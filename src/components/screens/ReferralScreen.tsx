import React, { useState, useEffect } from 'react';
import { ChevronLeft, Copy, Users, Gift, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { CotonCard } from '@/components/ui/coton-card';

interface ReferralScreenProps {
  onBack: () => void;
}

export const ReferralScreen = ({ onBack }: ReferralScreenProps) => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [referrals, setReferrals] = useState(0);

  // Générer un code de parrainage unique basé sur l'email/nom
  useEffect(() => {
    if (state.userProfile.email) {
      const code = state.userProfile.email.slice(0, 3).toUpperCase() + 
                   Math.random().toString(36).substr(2, 5).toUpperCase();
      setReferralCode(code);
    }
  }, [state.userProfile.email]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: "Code copié !",
        description: "Votre code de parrainage a été copié dans le presse-papier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code.",
        variant: "destructive",
      });
    }
  };

  const handleUseReferralCode = () => {
    if (!inputCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez saisir un code de parrainage.",
        variant: "destructive",
      });
      return;
    }

    if (inputCode.toUpperCase() === referralCode) {
      toast({
        title: "Code invalide",
        description: "Vous ne pouvez pas utiliser votre propre code de parrainage.",
        variant: "destructive",
      });
      return;
    }

    // Simuler la validation du code et récompenser l'utilisateur
    dispatch({ type: 'ADD_COINS', amount: 50 });
    
    // Simuler la récompense du parrain (en réalité, cela se ferait côté serveur)
    toast({
      title: "Code utilisé avec succès !",
      description: "Vous avez reçu 50 CotonCoins ! Le parrain recevra également sa récompense.",
    });

    setInputCode('');
  };

  const handleShareCode = () => {
    const shareText = `Rejoins-moi sur CotonApp avec mon code de parrainage ${referralCode} et gagne 50 CotonCoins gratuitement ! 🎁`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CotonApp - Code de parrainage',
        text: shareText,
      });
    } else {
      // Fallback pour copier le texte
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Message copié !",
        description: "Le message de parrainage a été copié.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Parrainage</h1>
      </div>

      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <CotonCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parrainages</p>
                <p className="text-xl font-bold text-foreground">{referrals}</p>
              </div>
            </div>
          </CotonCard>

          <CotonCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Gift className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coins gagnés</p>
                <p className="text-xl font-bold text-foreground">{referrals * 100}</p>
              </div>
            </div>
          </CotonCard>
        </div>

        {/* Mon code de parrainage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Mon code de parrainage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Partagez votre code avec vos amies et gagnez 100 CotonCoins pour chaque inscription !
            </p>
            
            <div className="flex space-x-2">
              <Input
                value={referralCode}
                readOnly
                className="font-mono text-lg text-center bg-muted"
              />
              <Button onClick={handleCopyCode} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleShareCode} className="w-full" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Partager mon code
            </Button>
          </CardContent>
        </Card>

        {/* Utiliser un code */}
        <Card>
          <CardHeader>
            <CardTitle>Utiliser un code de parrainage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous avez un code de parrainage ? Utilisez-le pour gagner 50 CotonCoins !
            </p>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Entrez le code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <Button onClick={handleUseReferralCode}>
                Valider
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p>Partagez votre code de parrainage avec vos amies</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p>Elles s'inscrivent et utilisent votre code</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p>Vous gagnez 100 CotonCoins, elles en gagnent 50 !</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};