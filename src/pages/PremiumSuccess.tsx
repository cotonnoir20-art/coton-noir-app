import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Sparkles } from 'lucide-react';

export default function PremiumSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Check subscription status when the page loads
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-green-600 mb-2">
            Félicitations ! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Votre abonnement Premium a été activé avec succès
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Vous avez désormais accès à :</h3>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Conseils IA illimités</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Analyses avancées et prédictions</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Box digitale premium</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Communauté VIP et tutoriels exclusifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>CotonCoins bonus (+50%)</span>
              </div>
            </div>
          </div>

          {sessionId && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>ID de session :</strong> {sessionId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Découvrir les fonctionnalités Premium
            </Button>
            <Button 
              onClick={() => navigate('/premium')}
              variant="outline"
              className="flex-1"
            >
              Gérer mon abonnement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}