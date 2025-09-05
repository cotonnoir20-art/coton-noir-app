import React, { useState } from 'react';
import { Play, Clock, BookOpen, Lock, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { YouTubeModal } from '@/components/ui/youtube-modal';
import { useApp } from '@/contexts/AppContext';

interface Tutorial {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  premium: boolean;
  description: string;
  youtubeId?: string;  // YouTube video ID
  category: 'Hydratation' | 'Routine' | 'Techniques' | 'Masques' | 'Coiffure';
}

const tutorials: Tutorial[] = [
  // Hydratation
  {
    id: '1',
    title: 'Maximum d\'hydratation avec la méthode LOC',
    duration: '15 min',
    difficulty: 'Intermédiaire',
    premium: false,
    description: 'Comment maximiser l\'hydratation des cheveux 4C avec porosité faible',
    youtubeId: 'vhVPW5cc5hQ',
    category: 'Hydratation'
  },
  {
    id: '2',
    title: 'Spray hydratant DIY fait maison',
    duration: '8 min',
    difficulty: 'Débutant',
    premium: false,
    description: 'Créer ton propre spray hydratant avec aloe vera et glycérine',
    youtubeId: 'M4JUsGfzm5k',
    category: 'Hydratation'
  },
  
  // Routine
  {
    id: '3',
    title: 'Routine de nuit avec méthode LOC',
    duration: '12 min',
    difficulty: 'Intermédiaire',
    premium: false,
    description: 'Une routine nocturne efficace pour maintenir l\'hydratation',
    youtubeId: '411SLnEdBRQ',
    category: 'Routine'
  },
  {
    id: '4',
    title: 'Routine complète de wash day',
    duration: '18 min',
    difficulty: 'Intermédiaire',
    premium: false,
    description: 'Guide complet pour une journée de lavage réussie',
    youtubeId: 'Kbsb7erufnk',
    category: 'Routine'
  },
  
  // Techniques
  {
    id: '5',
    title: 'Comment bien hydrater ses locs',
    duration: '10 min',
    difficulty: 'Débutant',
    premium: false,
    description: 'Techniques spéciales pour hydrater et entretenir les locs',
    youtubeId: 'do6GK5zLJNQ',
    category: 'Techniques'
  },
  
  // Premium content
  {
    id: '6',
    title: 'Masques protéinés maison avancés',
    duration: '20 min',
    difficulty: 'Avancé',
    premium: true,
    description: 'Recettes avancées de masques protéinés avec ingrédients naturels',
    category: 'Masques'
  },
  {
    id: '7',
    title: 'Protective styles complexes',
    duration: '25 min',
    difficulty: 'Avancé',
    premium: true,
    description: 'Techniques avancées de coiffures protectrices',
    category: 'Coiffure'
  }
];

interface TutorialsScreenProps {
  onNavigate: (screen: string) => void;
}

export function TutorialsScreen({ onNavigate }: TutorialsScreenProps) {
  const { state } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleWatchVideo = (tutorial: Tutorial) => {
    if (tutorial.youtubeId) {
      setSelectedVideo({ id: tutorial.youtubeId, title: tutorial.title });
      setIsModalOpen(true);
    } else {
      alert(`Lecture de "${tutorial.title}"`);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };
  
  // Group tutorials by category
  const categorizedTutorials = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
    return acc;
  }, {} as Record<string, Tutorial[]>);
  
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Hydratation': return '💧';
      case 'Routine': return '🔄';
      case 'Techniques': return '✨';
      case 'Masques': return '🥥';
      case 'Coiffure': return '💁🏾‍♀️';
      default: return '📚';
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-success/20 text-success';
      case 'Intermédiaire': return 'bg-warning/20 text-warning';
      case 'Avancé': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-poppins font-bold text-2xl">Tutoriels</h2>
        <p className="font-roboto text-muted-foreground">
          Apprenez les meilleures techniques de soin capillaire
        </p>
      </div>
      
      
      {/* Tutorials by Category */}
      <div className="space-y-6">
        {Object.entries(categorizedTutorials).map(([category, categoryTutorials]) => (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getCategoryEmoji(category)}</div>
              <h3 className="font-poppins font-bold text-xl">{category}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-coton-rose/50 to-transparent"></div>
            </div>
            
            {/* Category Tutorials */}
            <div className="space-y-3">
              {categoryTutorials.map((tutorial) => {
                const isLocked = tutorial.premium;
                const hasVideo = !!tutorial.youtubeId;
                
                return (
                  <CotonCard 
                    key={tutorial.id} 
                    className={`p-4 ${isLocked ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        isLocked 
                          ? 'bg-muted text-muted-foreground' 
                          : hasVideo
                          ? 'bg-black text-white'  // Black for real videos
                          : 'bg-coton-rose text-coton-black'
                      }`}>
                        {isLocked ? <Lock size={18} /> : hasVideo ? <Youtube size={18} /> : <Play size={18} />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className={`font-poppins font-semibold text-base leading-tight ${
                            isLocked ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {tutorial.title}
                            {tutorial.premium && (
                              <span className="ml-2 text-xs">👑</span>
                            )}
                            {hasVideo && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">YouTube</span>
                            )}
                          </h4>
                        </div>
                        
                        <p className={`font-roboto text-sm mb-3 ${
                          isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {tutorial.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock size={12} />
                            <span className="text-xs font-roboto">{tutorial.duration}</span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-pill text-xs font-roboto ${
                            getDifficultyColor(tutorial.difficulty)
                          }`}>
                            {tutorial.difficulty}
                          </span>
                        </div>
                        
                        {isLocked ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate('premium')}
                            className="opacity-75"
                          >
                            <Lock size={14} />
                            Premium requis
                          </Button>
                        ) : (
                          <Button
                            variant={hasVideo ? "default" : "hero"}
                            size="sm"
                            onClick={() => handleWatchVideo(tutorial)}
                            className={hasVideo ? "bg-black hover:bg-gray-800 text-white" : ""}
                          >
                            {hasVideo ? <Youtube size={14} /> : <Play size={14} />}
                            {hasVideo ? "Voir sur YouTube" : "Regarder"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CotonCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Journal CTA */}
      <CotonCard className="p-6 text-center space-y-4">
        <BookOpen className="text-coton-rose mx-auto" size={32} />
        <div className="space-y-2">
          <h4 className="font-poppins font-semibold">Prenez des notes !</h4>
          <p className="font-roboto text-sm text-muted-foreground">
            Enregistre tes apprentissages et techniques dans ton Journal
          </p>
        </div>
        <Button
          variant="rose"
          onClick={() => onNavigate('journal')}
        >
          Voir mes notes dans le Journal
        </Button>
      </CotonCard>

      {/* YouTube Modal */}
      {selectedVideo && (
        <YouTubeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}