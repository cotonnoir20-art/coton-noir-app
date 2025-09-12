import React from 'react';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Package } from 'lucide-react';

interface BoxScreenProps {
  onNavigate: (screen: string) => void;
}

export function BoxScreen({ onNavigate }: BoxScreenProps) {
  return (
    <ComingSoon
      title="Box Digitale Coton Noir"
      description="Des contenus exclusifs personnalisés selon votre profil capillaire et vos objectifs arrivent bientôt ! Continuez à accumuler vos CotonCoins."
      features={[
        "Guides PDF personnalisés selon votre type de cheveux",
        "Recettes de masques avec vos ingrédients préférés",
        "Planning de soins adapté à votre mode de vie",
        "Vidéos tutoriels exclusives par texture",
        "Templates de suivi imprimables",
        "Contenus saisonniers et challenges spéciaux"
      ]}
      showBackButton={false}
      icon={<Package className="mx-auto text-coton-rose" size={64} />}
    />
  );
}