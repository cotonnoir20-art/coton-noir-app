import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRecommendations } from '@/components/ui/product-recommendations';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductRecommendationsPage = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavigation={true}>
      <div className="pb-20 px-4 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 pt-4 pb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-poppins font-bold text-lg sm:text-xl text-foreground">
              Recommandations Produits
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Produits sélectionnés pour ton profil capillaire
            </p>
          </div>
        </div>

        {/* Product Recommendations */}
        <ProductRecommendations 
          maxProducts={12}
          showAIRecommendations={true}
        />
      </div>
    </Layout>
  );
};

export default ProductRecommendationsPage;