import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Star, Zap, Bot, Calendar, TrendingUp, Users, Gift, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const { user } = useAuth();
  const { subscribed, subscriptionTier, subscriptionEnd, loading, createCheckout, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder aux fonctionnalités premium.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Coton Noir Premium</h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Débloquez tout le potentiel de votre parcours capillaire avec nos fonctionnalités premium
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscribed && (
          <div className="mb-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <CardTitle className="text-primary">Abonnement Actif</CardTitle>
                </div>
                <Badge variant="default" className="mx-auto">
                  {subscriptionTier === 'premium' ? 'Premium' : 'Basique'}
                </Badge>
                {subscriptionEnd && (
                  <CardDescription>
                    Renouvellement le {new Date(subscriptionEnd).toLocaleDateString('fr-FR')}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={openCustomerPortal}
                  variant="outline"
                  disabled={loading}
                >
                  Gérer mon abonnement
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Gratuit
              </CardTitle>
              <CardDescription>
                Fonctionnalités de base pour commencer votre parcours
              </CardDescription>
              <div className="text-3xl font-bold">0€<span className="text-base font-normal">/mois</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Journal capillaire de base</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>3 conseils IA par jour</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Suivi wash day simple</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>2 routines personnalisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Historique 30 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Défis de base</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                disabled
              >
                Plan actuel
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Le plus populaire
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Premium
              </CardTitle>
              <CardDescription>
                Accès complet à toutes les fonctionnalités avancées
              </CardDescription>
              <div className="text-3xl font-bold text-primary">9,99€<span className="text-base font-normal">/mois</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="font-medium">Conseils IA illimités</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium">Analyses avancées & prédictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Routines illimitées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium">Historique illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="font-medium">Box digitale premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">Accès communauté VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-medium">CotonCoins bonus (+50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">Tutoriels exclusifs</span>
                </div>
              </div>
              
              {!subscribed ? (
                <Button 
                  onClick={createCheckout}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Commencer Premium'}
                </Button>
              ) : subscriptionTier === 'premium' ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  Plan actuel
                </Button>
              ) : (
                <Button 
                  onClick={createCheckout}
                  className="w-full"
                  disabled={loading}
                >
                  Passer à Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Details */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Pourquoi choisir Premium ?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Bot className="w-8 h-8 text-primary mb-2" />
                <CardTitle>IA Avancée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conseils personnalisés illimités, analyses photos avancées et recommandations produits ultra-précises.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Analyses Poussées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Statistiques détaillées, prédictions de croissance et comparaisons avant/après automatiques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Communauté VIP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accès aux groupes privés d'expertes, mentoring et consultations virtuelles exclusives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}