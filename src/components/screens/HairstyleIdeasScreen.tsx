import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Play, Eye, Clock, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface HairstyleIdeasScreenProps {
  onBack: () => void;
}

interface HairstylePost {
  id: number;
  imageUrl: string;
  likes: string;
  rating: number;
  views: string;
  title: string;
  category: 'braids' | 'natural' | 'protective' | 'updos';
}

const mockHairstyles: HairstylePost[] = [
  {
    id: 1,
    imageUrl: "/public/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png",
    likes: "11,1k",
    rating: 4.3,
    views: "5",
    title: "Tresses collées élégantes",
    category: "braids"
  },
  {
    id: 2,
    imageUrl: "/public/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png", 
    likes: "12,0k",
    rating: 4.3,
    views: "5",
    title: "Chignon tressé haut",
    category: "updos"
  },
  {
    id: 3,
    imageUrl: "/public/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png",
    likes: "11,7k",
    rating: 4.0,
    views: "5",
    title: "Style afro naturel",
    category: "natural"
  },
  {
    id: 4,
    imageUrl: "/public/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png",
    likes: "13,0k", 
    rating: 4.0,
    views: "6",
    title: "Tresses de collection",
    category: "braids"
  },
  {
    id: 5,
    imageUrl: "/public/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png",
    likes: "13,0k",
    rating: 3.5,
    views: "5",
    title: "Tresses cornrows artistiques",
    category: "braids"
  },
  {
    id: 6,
    imageUrl: "/public/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png",
    likes: "12,0k",
    rating: 4.0,
    views: "5",
    title: "Style protecteur moderne",
    category: "protective"
  },
  {
    id: 7,
    imageUrl: "/public/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png",
    likes: "11,6k",
    rating: 4.0,
    views: "5",
    title: "Tresses box braids",
    category: "braids"
  },
  {
    id: 8,
    imageUrl: "/public/lovable-uploads/db1b5014-ce34-4c27-8bc6-2d493308ed10.png",
    likes: "11,3k", 
    rating: 4.0,
    views: "5",
    title: "Afro texturé volumineux",
    category: "natural"
  },
  {
    id: 9,
    imageUrl: "/public/lovable-uploads/794ef04a-9b7c-4111-99f5-6de9df3547bf.png",
    likes: "12,1k",
    rating: 4.0,
    views: "5",
    title: "Chignon sophistiqué",
    category: "updos"
  }
];

export function HairstyleIdeasScreen({ onBack }: HairstyleIdeasScreenProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'recents' | 'rate' | 'videos'>('recents');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les coiffures selon le terme de recherche
  const filteredHairstyles = mockHairstyles.filter(hairstyle =>
    hairstyle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStats = (post: HairstylePost) => (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
      <div className="flex items-center justify-between text-white text-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Heart size={14} className="fill-red-500 text-red-500" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span>{post.rating}/5</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-coton-terracotta text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-poppins font-bold">Idées de Coiffures</h1>
          <div className="w-8" />
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <Input
              type="text"
              placeholder="Rechercher une coiffure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('recents')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'recents'
                ? 'bg-white text-coton-terracotta shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Clock size={16} className="inline mr-2" />
            RÉCENTS
          </button>
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'rate'
                ? 'bg-white text-coton-terracotta shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Star size={16} className="inline mr-2" />
            NOTER
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-white text-coton-terracotta shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Play size={16} className="inline mr-2" />
            VIDÉOS
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'recents' && (
          <div className="grid grid-cols-3 gap-2">
            {filteredHairstyles.length > 0 ? (
              filteredHairstyles.map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {renderStats(post)}
              </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Search size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground">Essayez un autre terme de recherche</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rate' && (
          <div className="text-center py-20">
            <Star size={48} className="mx-auto text-coton-terracotta mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Noter les coiffures</h3>
            <p className="text-muted-foreground">Évaluez vos coiffures préférées pour aider la communauté</p>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="text-center py-20">
            <Play size={48} className="mx-auto text-coton-terracotta mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Tutoriels vidéo</h3>
            <p className="text-muted-foreground">Découvrez des tutoriels étape par étape</p>
          </div>
        )}
      </div>
    </div>
  );
}