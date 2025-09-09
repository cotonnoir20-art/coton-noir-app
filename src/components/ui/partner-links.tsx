import React, { useState } from 'react';
import { ExternalLink, Truck, Tag, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PartnerLink } from '@/data/products';

interface PartnerLinksProps {
  partnerLinks: PartnerLink[];
  productId: string;
  productName: string;
  className?: string;
}

export function PartnerLinks({ partnerLinks, productId, productName, className = '' }: PartnerLinksProps) {
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [showZapierConfig, setShowZapierConfig] = useState(false);
  const [isTrackingClick, setIsTrackingClick] = useState(false);
  const { toast } = useToast();

  const trackClick = async (link: PartnerLink) => {
    setIsTrackingClick(true);
    
    try {
      // Track click locally
      console.log('Tracking click:', {
        productId,
        productName,
        store: link.store,
        price: link.price,
        timestamp: new Date().toISOString()
      });

      // Send to Zapier if webhook configured
      if (zapierWebhook) {
        try {
          await fetch(zapierWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({
              event: 'product_link_click',
              productId,
              productName,
              store: link.store,
              price: link.price,
              url: link.url,
              affiliateCode: link.affiliateCode,
              timestamp: new Date().toISOString(),
              triggered_from: window.location.origin,
            }),
          });
          
          console.log('Click data sent to Zapier');
        } catch (zapierError) {
          console.warn('Failed to send to Zapier:', zapierError);
        }
      }

      // Open link in new tab
      window.open(link.url, '_blank');
      
    } catch (error) {
      console.error('Error tracking click:', error);
      toast({
        title: "Erreur",
        description: "Impossible de suivre le clic, mais le lien s'ouvrira quand même",
        variant: "destructive",
      });
      // Still open the link
      window.open(link.url, '_blank');
    } finally {
      setIsTrackingClick(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'text-green-600';
      case 'low_stock': return 'text-orange-600';
      case 'out_of_stock': return 'text-red-600';
      case 'pre_order': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'En stock';
      case 'low_stock': return 'Stock limité';
      case 'out_of_stock': return 'Rupture';
      case 'pre_order': return 'Précommande';
      default: return 'Disponibilité inconnue';
    }
  };

  if (partnerLinks.length === 0) {
    return (
      <CotonCard className={`p-4 ${className}`}>
        <div className="text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Aucun lien d'achat disponible pour le moment</p>
        </div>
      </CotonCard>
    );
  }

  return (
    <div className={className}>
      {/* Zapier Configuration Toggle */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowZapierConfig(!showZapierConfig)}
          className="gap-2 text-xs"
        >
          <Settings size={14} />
          {showZapierConfig ? 'Masquer' : 'Configurer'} tracking Zapier
        </Button>

        {showZapierConfig && (
          <CotonCard className="p-4 mt-2 bg-blue-50 border-blue-200">
            <div className="space-y-3">
              <div>
                <Label htmlFor="zapier-webhook" className="text-sm font-medium">
                  Webhook Zapier (optionnel)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Pour automatiser le tracking des clics et commissions d'affiliation
                </p>
              </div>
              <Input
                id="zapier-webhook"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Créez un Zap avec un trigger "Webhook" pour recevoir les données de tracking
              </p>
            </div>
          </CotonCard>
        )}
      </div>

      {/* Partner Links List */}
      <div className="space-y-3">
        <h4 className="font-poppins font-semibold text-base text-foreground">
          Où acheter ce produit
        </h4>
        
        {partnerLinks.map((link, index) => (
          <CotonCard key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-medium text-foreground text-base">
                    {link.store}
                  </h5>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getAvailabilityColor(link.availability)}`}
                  >
                    {getAvailabilityText(link.availability)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {link.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {link.originalPrice.toFixed(2)}€
                      </span>
                    )}
                    <span className="font-bold text-lg text-foreground">
                      {link.price.toFixed(2)}€
                    </span>
                    {link.discount && (
                      <Badge variant="secondary" className="bg-coton-rose/20 text-coton-rose text-xs">
                        <Tag size={12} className="mr-1" />
                        -{link.discount}%
                      </Badge>
                    )}
                  </div>
                </div>

                {link.shippingInfo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck size={14} />
                    <span>{link.shippingInfo}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 ml-4">
                <Button
                  onClick={() => trackClick(link)}
                  disabled={link.availability === 'out_of_stock' || isTrackingClick}
                  className="gap-2"
                  variant={link.availability === 'out_of_stock' ? 'outline' : 'default'}
                >
                  <ExternalLink size={16} />
                  {link.availability === 'out_of_stock' ? 'Indisponible' : 'Acheter'}
                </Button>
              </div>
            </div>

            {link.affiliateCode && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  💡 Code partenaire: <span className="font-mono font-medium">{link.affiliateCode}</span>
                </p>
              </div>
            )}
          </CotonCard>
        ))}
      </div>

      {/* Additional Info */}
      <CotonCard className="p-4 mt-4 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-purple-800 mb-1">
              Information partenariat
            </p>
            <p className="text-purple-700">
              Coton peut recevoir une commission sur les achats effectués via ces liens, 
              sans coût supplémentaire pour toi. Cela nous aide à maintenir l'app gratuite ! 💜
            </p>
          </div>
        </div>
      </CotonCard>
    </div>
  );
}