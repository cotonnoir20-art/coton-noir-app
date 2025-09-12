import React from 'react';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Store } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  description: string;
  cost: number;
  discount: string;
  type: string;
}

const partners: Partner[] = [
  {
    id: 'astuces-lco',
    name: 'Astuces LCO',
    description: 'Guide exclusif des soins pour cheveux crépus',
    cost: 30,
    discount: 'Ebook gratuit',
    type: 'Ebook'
  },
  {
    id: 'naturelle',
    name: 'NaturelELLE',
    description: 'Produits naturels pour cheveux afro',
    cost: 40,
    discount: '-15%',
    type: 'Boutique'
  },
  {
    id: 'cantu',
    name: 'Cantu',
    description: 'Marque spécialisée cheveux bouclés et crépus',
    cost: 50,
    discount: '-20%',
    type: 'Marque'
  }
];

interface PartnersScreenProps {
  onNavigate: (screen: string) => void;
}

export function PartnersScreen({ onNavigate }: PartnersScreenProps) {
  return (
    <ComingSoon
      title="Partenariats & Box Beauté"
      description="Un réseau de partenaires exclusifs et des box produits personnalisées arrivent bientôt ! Continuez à accumuler vos CotonCoins."
      features={[
        "Partenariats avec les meilleures marques afro",
        "Box beauté personnalisées selon votre profil",
        "Codes promos exclusifs avec vos CotonCoins", 
        "Livraisons mensuelles de produits sélectionnés",
        "Collaborations avec des coiffeurs spécialisés",
        "Offres spéciales membres premium"
      ]}
      showBackButton={false}
      icon={<Store className="mx-auto text-coton-rose" size={64} />}
    />
  );
}