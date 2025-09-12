import React from 'react';
import { CotonCard } from './coton-card';
import { Construction, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface ComingSoonProps {
  title?: string;
  description?: string;
  features?: string[];
  onBack?: () => void;
  showBackButton?: boolean;
  icon?: React.ReactNode;
}

export function ComingSoon({ 
  title = "Bientôt disponible !",
  description = "Cette fonctionnalité sera disponible dans les prochaines versions de Coton Noir.",
  features = [],
  onBack,
  showBackButton = true,
  icon
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {showBackButton && onBack && (
        <div className="px-4 py-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={20} />
            Retour
          </Button>
        </div>
      )}
      
      <div className="px-4 py-8 space-y-6">
        <CotonCard className="p-8 text-center space-y-6">
          {icon || <Construction className="mx-auto text-coton-rose" size={64} />}
          
          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-2xl text-foreground">
              {title}
            </h2>
            <p className="font-roboto text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>

          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-poppins font-semibold text-lg">
                Fonctionnalités à venir :
              </h3>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 justify-start text-left">
                    <div className="w-2 h-2 bg-coton-rose rounded-full flex-shrink-0"></div>
                    <span className="font-roboto text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-coton-rose/10 rounded-lg">
              <Calendar className="text-coton-rose" size={18} />
              <span className="font-roboto text-sm text-coton-rose">
                Prochaine mise à jour prévue
              </span>
            </div>
          </div>
        </CotonCard>

        <CotonCard className="p-6 space-y-4">
          <h3 className="font-poppins font-semibold text-lg">
            En attendant...
          </h3>
          <div className="space-y-2 text-sm font-roboto text-muted-foreground">
            <p>• Profitez des fonctionnalités actuellement disponibles</p>
            <p>• Créez votre profil capillaire personnalisé</p>
            <p>• Générez des routines IA adaptées à vos cheveux</p>
            <p>• Analysez vos cheveux avec notre technologie photo</p>
          </div>
        </CotonCard>
      </div>
    </div>
  );
}