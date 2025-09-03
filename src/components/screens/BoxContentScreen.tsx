import React from 'react';
import { ArrowLeft, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';

interface BoxContentScreenProps {
  onBack: () => void;
}

const boxContent = [
  {
    id: 1,
    title: 'Guide Routine 4C Porosité Haute',
    type: 'PDF',
    description: 'Guide complet pour créer une routine adaptée aux cheveux 4C à haute porosité',
    size: '2.3 MB',
    icon: '📋'
  },
  {
    id: 2,
    title: 'Liste Ingrédients à Éviter',
    type: 'PDF',
    description: 'Tous les ingrédients nocifs pour tes cheveux à éviter absolument',
    size: '1.2 MB',
    icon: '⚠️'
  },
  {
    id: 3,
    title: 'Recettes Masques Maison',
    type: 'PDF',
    description: '15 recettes de masques naturels faciles à réaliser chez toi',
    size: '3.1 MB',
    icon: '🥄'
  },
  {
    id: 4,
    title: 'Calendrier Soins Mensuels',
    type: 'PDF',
    description: 'Planning personnalisé pour organiser tes soins selon tes besoins',
    size: '0.8 MB',
    icon: '📅'
  },
  {
    id: 5,
    title: 'Tutoriel Technique Plopping',
    type: 'Vidéo',
    description: 'Vidéo explicative pour maîtriser la technique du plopping',
    size: '25 MB',
    icon: '🎥'
  },
  {
    id: 6,
    title: 'Guide Démêlage Sans Casse',
    type: 'PDF',
    description: 'Méthodes et techniques pour démêler en douceur sans abîmer',
    size: '1.7 MB',
    icon: '✨'
  }
];

export function BoxContentScreen({ onBack }: BoxContentScreenProps) {
  return (
    <div className="min-h-screen bg-[#fdf1e3] pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#fdf1e3] z-10 px-4 py-4 border-b border-coton-rose/20">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-poppins font-bold text-xl text-coton-black">
              Contenu de la Box
            </h1>
            <p className="text-sm font-roboto text-muted-foreground">
              {boxContent.length} fichiers disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-6">
        {/* Box Info */}
        <CotonCard className="p-6 bg-gradient-to-r from-coton-rose/10 to-purple-50">
          <div className="text-center space-y-3">
            <div className="text-4xl">📦</div>
            <h2 className="font-poppins font-bold text-lg text-coton-black">
              Box Digitale Premium
            </h2>
            <p className="font-roboto text-sm text-muted-foreground">
              Contenu exclusif pour optimiser ta routine capillaire
            </p>
          </div>
        </CotonCard>

        {/* Files List */}
        <div className="space-y-4">
          <h3 className="font-poppins font-semibold text-lg text-coton-black">
            Mes fichiers
          </h3>
          
          <div className="space-y-3">
            {boxContent.map((file) => (
              <CotonCard key={file.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{file.icon}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-poppins font-medium text-coton-black truncate">
                        {file.title}
                      </h4>
                      <span className="px-2 py-1 bg-coton-rose/20 text-coton-rose text-xs rounded-full font-roboto">
                        {file.type}
                      </span>
                    </div>
                    <p className="font-roboto text-sm text-muted-foreground mb-2">
                      {file.description}
                    </p>
                    <p className="font-roboto text-xs text-muted-foreground">
                      {file.size}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye size={14} className="mr-1" />
                      Voir
                    </Button>
                    <Button variant="hero" size="sm" className="w-full">
                      <Download size={14} className="mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CotonCard>
            ))}
          </div>
        </div>

        {/* Tips */}
        <CotonCard className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">💡</span>
            </div>
            <h4 className="font-poppins font-semibold text-amber-800 text-sm">CotonTips</h4>
          </div>
          <p className="text-xs font-roboto text-amber-900 leading-relaxed">
            Télécharge tes fichiers pour les consulter hors ligne. Nous recommandons de commencer par le guide routine adapté à ton profil capillaire ! 📚
          </p>
        </CotonCard>
      </div>
    </div>
  );
}