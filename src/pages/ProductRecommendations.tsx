import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ComingSoon } from '@/components/ui/coming-soon';
import { ShoppingBag } from 'lucide-react';

const ProductRecommendationsPage = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavigation={true}>
      <ComingSoon
        title="Recommandations Produits IA"
        description="Un système avancé de recommandations produits basé sur votre profil capillaire et vos préférences arrive bientôt !"
        features={[
          "Recommandations IA ultra-personnalisées",
          "Base de données complète de produits afro",
          "Comparatifs détaillés par ingrédients",
          "Avis de la communauté et notes expertes",
          "Alertes prix et disponibilité",
          "Substituts selon votre budget"
        ]}
        onBack={() => navigate(-1)}
        icon={<ShoppingBag className="mx-auto text-coton-rose" size={64} />}
      />
    </Layout>
  );
};

export default ProductRecommendationsPage;