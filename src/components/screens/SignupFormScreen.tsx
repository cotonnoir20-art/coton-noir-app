import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CotonCard } from '@/components/ui/coton-card';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormScreenProps {
  onNavigate: (screen: string) => void;
  onSignupSuccess: () => void;
}

export function SignupFormScreen({ onNavigate, onSignupSuccess }: SignupFormScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères"
      });
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: error.message
      });
    } else {
      toast({
        title: "Compte créé avec succès !",
        description: "Vérifiez votre email pour confirmer votre compte"
      });
      onSignupSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-coton-black px-6 py-4 shadow-soft">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('onboarding')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-poppins font-semibold text-white">
            Créer un compte
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <CotonCard className="p-8" variant="elevated">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-poppins font-bold text-foreground">
                Rejoins la famille Coton Noir
              </h2>
              <p className="text-muted-foreground font-roboto">
                Quelques informations pour créer ton compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton-email@exemple.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retape ton mot de passe"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Création en cours...' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-coton-rose hover:text-coton-rose/80"
                  onClick={() => onNavigate('login')}
                >
                  Se connecter
                </Button>
              </p>
            </div>
          </div>
        </CotonCard>
      </div>
    </div>
  );
}