import React, { useState } from 'react';
import { ArrowLeft, Ticket, Tag, Copy, Check, Percent, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DiscountCodesScreenProps {
  onBack: () => void;
}

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount: string;
  validUntil: string;
  partner: string;
  used: boolean;
  category: 'beauty' | 'care' | 'tools' | 'supplements';
}

export function DiscountCodesScreen({ onBack }: DiscountCodesScreenProps) {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Exemple de codes de réduction (à remplacer par des données réelles depuis l'API)
  const discountCodes: DiscountCode[] = [
    {
      id: '1',
      code: 'COTON15',
      description: 'Réduction sur tous les produits capillaires',
      discount: '15%',
      validUntil: '2025-12-31',
      partner: 'Beauty Shop',
      used: false,
      category: 'beauty'
    },
    {
      id: '2',
      code: 'NEWCLIENT20',
      description: 'Première commande chez nos partenaires',
      discount: '20%',
      validUntil: '2025-11-30',
      partner: 'Hair Care Pro',
      used: false,
      category: 'care'
    },
    {
      id: '3',
      code: 'TOOLS10',
      description: 'Accessoires de coiffure',
      discount: '10%',
      validUntil: '2025-10-31',
      partner: 'Style Tools',
      used: true,
      category: 'tools'
    },
    {
      id: '4',
      code: 'SUPPLEMENT25',
      description: 'Compléments alimentaires pour cheveux',
      discount: '25%',
      validUntil: '2025-12-15',
      partner: 'Health & Hair',
      used: false,
      category: 'supplements'
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copié !",
      description: "Le code de réduction a été copié dans le presse-papiers.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beauty':
        return <ShoppingBag size={20} />;
      case 'care':
        return <Percent size={20} />;
      case 'tools':
        return <Tag size={20} />;
      case 'supplements':
        return <Ticket size={20} />;
      default:
        return <Tag size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beauty':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'care':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'tools':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'supplements':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const availableCodes = discountCodes.filter(code => !code.used);
  const usedCodes = discountCodes.filter(code => code.used);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-coton-terracotta text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="font-poppins font-bold text-xl flex-1 text-center">
            Mes codes de réduction
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <CotonCard className="p-4 text-center bg-gradient-to-br from-coton-rose/10 to-purple-50">
            <Ticket className="mx-auto mb-2 text-coton-terracotta" size={32} />
            <p className="text-2xl font-bold text-foreground">{availableCodes.length}</p>
            <p className="text-sm text-muted-foreground">Codes disponibles</p>
          </CotonCard>
          
          <CotonCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
            <Percent className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-2xl font-bold text-foreground">
              {availableCodes.reduce((total, code) => {
                const value = parseInt(code.discount);
                return total + (isNaN(value) ? 0 : value);
              }, 0)}%
            </p>
            <p className="text-sm text-muted-foreground">Réductions totales</p>
          </CotonCard>
        </div>

        {/* Codes disponibles */}
        {availableCodes.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-lg text-foreground">
              Codes disponibles
            </h2>
            {availableCodes.map((code) => (
              <CotonCard key={code.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(code.category)}`}>
                      {getCategoryIcon(code.category)}
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-foreground">
                        {code.partner}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {code.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    -{code.discount}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border-2 border-dashed border-coton-terracotta/30">
                  <code className="font-mono font-bold text-lg text-coton-terracotta">
                    {code.code}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(code.code)}
                    className="text-coton-terracotta hover:bg-coton-terracotta/10"
                  >
                    {copiedCode === code.code ? (
                      <>
                        <Check size={16} className="mr-1" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        Copier
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span>Valide jusqu'au {new Date(code.validUntil).toLocaleDateString('fr-FR')}</span>
                </div>
              </CotonCard>
            ))}
          </div>
        )}

        {/* Codes utilisés */}
        {usedCodes.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-poppins font-bold text-lg text-foreground">
              Codes utilisés
            </h2>
            {usedCodes.map((code) => (
              <CotonCard key={code.id} className="p-4 space-y-3 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(code.category)}`}>
                      {getCategoryIcon(code.category)}
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-foreground">
                        {code.partner}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {code.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    Utilisé
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-2 border-dashed border-gray-300">
                  <code className="font-mono font-bold text-lg text-gray-500 line-through">
                    {code.code}
                  </code>
                </div>
              </CotonCard>
            ))}
          </div>
        )}

        {/* Empty state */}
        {availableCodes.length === 0 && usedCodes.length === 0 && (
          <div className="text-center py-20">
            <Ticket size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
              Aucun code de réduction
            </h3>
            <p className="text-muted-foreground">
              Gagne des CotonCoins pour débloquer des codes exclusifs !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
