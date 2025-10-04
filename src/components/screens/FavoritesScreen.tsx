import React, { useState } from 'react';
import { ArrowLeft, Heart, Package, Store, User, BookOpen, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FavoritesScreenProps {
  onBack: () => void;
}

interface FavoriteItem {
  id: string;
  name: string;
  type: 'product' | 'brand' | 'professional' | 'recipe';
  description?: string;
  image?: string;
  category?: string;
  location?: string;
  ingredients?: string[];
}

export function FavoritesScreen({ onBack }: FavoritesScreenProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');

  // Exemples de favoris (à remplacer par des données réelles depuis l'API)
  const favorites: FavoriteItem[] = [
    {
      id: '1',
      name: 'Masque Hydratant Intense',
      type: 'product',
      description: 'Masque profondément hydratant pour cheveux crépus',
      category: 'Soin',
      image: '/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png'
    },
    {
      id: '2',
      name: 'Curl Definition Gel',
      type: 'product',
      description: 'Gel coiffant pour boucles définies',
      category: 'Coiffage',
      image: '/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png'
    },
    {
      id: '3',
      name: 'Afro Beauty Lab',
      type: 'brand',
      description: 'Marque spécialisée dans les soins pour cheveux afro',
      category: 'Cosmétiques'
    },
    {
      id: '4',
      name: 'Sophie Martinez',
      type: 'professional',
      description: 'Coiffeuse spécialisée cheveux texturés',
      location: 'Paris 11ème'
    },
    {
      id: '5',
      name: 'Spray Leave-in Maison',
      type: 'recipe',
      description: 'Recette naturelle hydratante',
      ingredients: ['Eau de rose', 'Glycérine végétale', 'Huile de jojoba']
    }
  ];

  const products = favorites.filter(item => item.type === 'product');
  const brands = favorites.filter(item => item.type === 'brand');
  const professionals = favorites.filter(item => item.type === 'professional');
  const recipes = favorites.filter(item => item.type === 'recipe');

  const handleRemoveFavorite = (id: string, name: string) => {
    toast({
      title: "Retiré des favoris",
      description: `${name} a été retiré de vos favoris.`,
    });
    // Logique pour retirer le favori
  };

  const renderEmptyState = (message: string) => (
    <div className="text-center py-20">
      <Heart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
      <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
        Aucun favori
      </h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

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
            Mes favoris
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="products" className="text-xs">
              <Package size={16} className="mr-1" />
              Produits
            </TabsTrigger>
            <TabsTrigger value="brands" className="text-xs">
              <Store size={16} className="mr-1" />
              Marques
            </TabsTrigger>
            <TabsTrigger value="professionals" className="text-xs">
              <User size={16} className="mr-1" />
              Pros
            </TabsTrigger>
            <TabsTrigger value="recipes" className="text-xs">
              <BookOpen size={16} className="mr-1" />
              Recettes
            </TabsTrigger>
          </TabsList>

          {/* Produits */}
          <TabsContent value="products" className="space-y-4">
            {products.length > 0 ? (
              products.map((item) => (
                <CotonCard key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-poppins font-semibold text-foreground">
                            {item.name}
                          </h3>
                          {item.category && (
                            <Badge variant="secondary" className="mt-1">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveFavorite(item.id, item.name)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <Button size="sm" variant="outline" className="text-coton-terracotta border-coton-terracotta">
                        <ExternalLink size={14} className="mr-1" />
                        Voir le produit
                      </Button>
                    </div>
                  </div>
                </CotonCard>
              ))
            ) : (
              renderEmptyState("Ajoutez vos produits préférés pour les retrouver facilement")
            )}
          </TabsContent>

          {/* Marques */}
          <TabsContent value="brands" className="space-y-4">
            {brands.length > 0 ? (
              brands.map((item) => (
                <CotonCard key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coton-rose to-purple-400 flex items-center justify-center">
                        <Store className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-foreground">
                          {item.name}
                        </h3>
                        {item.category && (
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFavorite(item.id, item.name)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-15">
                    {item.description}
                  </p>
                  <Button size="sm" variant="outline" className="text-coton-terracotta border-coton-terracotta ml-15">
                    <ExternalLink size={14} className="mr-1" />
                    Voir les produits
                  </Button>
                </CotonCard>
              ))
            ) : (
              renderEmptyState("Sauvegardez vos marques favorites")
            )}
          </TabsContent>

          {/* Professionnels */}
          <TabsContent value="professionals" className="space-y-4">
            {professionals.length > 0 ? (
              professionals.map((item) => (
                <CotonCard key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                        <User className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-foreground">
                          {item.name}
                        </h3>
                        {item.location && (
                          <p className="text-xs text-muted-foreground">
                            📍 {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFavorite(item.id, item.name)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-15">
                    {item.description}
                  </p>
                  <Button size="sm" variant="outline" className="text-coton-terracotta border-coton-terracotta ml-15">
                    <ExternalLink size={14} className="mr-1" />
                    Voir le profil
                  </Button>
                </CotonCard>
              ))
            ) : (
              renderEmptyState("Enregistrez vos coiffeurs et professionnels préférés")
            )}
          </TabsContent>

          {/* Recettes */}
          <TabsContent value="recipes" className="space-y-4">
            {recipes.length > 0 ? (
              recipes.map((item) => (
                <CotonCard key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                        <BookOpen className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFavorite(item.id, item.name)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-15">
                    {item.description}
                  </p>
                  {item.ingredients && (
                    <div className="ml-15 mb-3">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        Ingrédients :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients.map((ingredient, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="text-coton-terracotta border-coton-terracotta ml-15">
                    <BookOpen size={14} className="mr-1" />
                    Voir la recette
                  </Button>
                </CotonCard>
              ))
            ) : (
              renderEmptyState("Sauvegardez vos recettes maison favorites")
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
