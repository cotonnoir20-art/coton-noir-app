import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-coton-rose flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
              COTON NOIR
            </h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-2">
                Email envoyé !
              </h2>
              <p className="text-muted-foreground">
                Nous avons envoyé un lien de réinitialisation à votre adresse email. 
                Vérifiez votre boîte mail et suivez les instructions.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => onNavigate('login')}
                className="w-full h-12 bg-coton-black text-white hover:bg-coton-black/90"
              >
                Retour à la connexion
              </Button>

              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full h-12"
              >
                Renvoyer l'email
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-coton-rose flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
            COTON NOIR
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-card p-8">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-poppins font-bold text-foreground mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-muted-foreground">
              Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Votre adresse email"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-coton-black text-white hover:bg-coton-black/90"
                disabled={isLoading}
              >
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Vous vous souvenez de votre mot de passe ? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-foreground font-medium hover:underline"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}