import React from 'react';
import { Play, Clock, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';

interface Tutorial {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  premium: boolean;
  description: string;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Les bases du soin des cheveux crépus',
    duration: '12 min',
    difficulty: 'Débutant',
    premium: false,
    description: 'Comprendre la structure du cheveu crépu et les besoins spécifiques'
  },
  {
    id: '2',
    title: 'Technique du LOC Method',
    duration: '8 min',
    difficulty: 'Intermédiaire',
    premium: false,
    description: 'La méthode LOC pour hydrater et sceller l\'hydratation'
  },
  {
    id: '3',
    title: 'Routine capillaire personnalisée',
    duration: '15 min',
    difficulty: 'Intermédiaire',
    premium: false,
    description: 'Créer une routine adaptée à votre type de cheveux et lifestyle'
  },
  {
    id: '4',
    title: 'Masques protéinés maison',
    duration: '10 min',
    difficulty: 'Avancé',
    premium: true,
    description: 'Recettes de masques protéinés avec des ingrédients naturels'
  },
  {
    id: '5',
    title: 'Protective styles avancées',
    duration: '20 min',
    difficulty: 'Avancé',
    premium: true,
    description: 'Techniques de coiffures protectrices pour préserver vos longueurs'
  }
];

interface TutorialsScreenProps {
  onNavigate: (screen: string) => void;
}

export function TutorialsScreen({ onNavigate }: TutorialsScreenProps) {
  const { state } = useApp();
  
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
      
      
      {/* Tutorials List */}
      <div className="space-y-4">
        {tutorials.map((tutorial) => {
          const isLocked = tutorial.premium;
          
          return (
            <CotonCard 
              key={tutorial.id} 
              className={`p-6 ${isLocked ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg flex-shrink-0 ${
                  isLocked 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-coton-rose text-coton-black'
                }`}>
                  {isLocked ? <Lock size={20} /> : <Play size={20} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-poppins font-semibold text-lg leading-tight ${
                      isLocked ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {tutorial.title}
                      {tutorial.premium && (
                        <span className="ml-2 text-xs">👑</span>
                      )}
                    </h3>
                  </div>
                  
                  <p className={`font-roboto text-sm mb-3 ${
                    isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {tutorial.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      <span className="text-sm font-roboto">{tutorial.duration}</span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-pill text-xs font-roboto ${
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
                      <Lock size={16} />
                      Premium requis
                    </Button>
                  ) : (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => {
                        // Simulate watching tutorial
                        alert(`Lecture de "${tutorial.title}"`);
                      }}
                    >
                      <Play size={16} />
                      Regarder
                    </Button>
                  )}
                </div>
              </div>
            </CotonCard>
          );
        })}
      </div>
      
      {/* Journal CTA */}
      <CotonCard className="p-6 text-center space-y-4">
        <BookOpen className="text-coton-rose mx-auto" size={32} />
        <div className="space-y-2">
          <h4 className="font-poppins font-semibold">Prenez des notes !</h4>
          <p className="font-roboto text-sm text-muted-foreground">
            Enregistrez vos apprentissages et techniques dans votre Journal
          </p>
        </div>
        <Button
          variant="rose"
          onClick={() => onNavigate('journal')}
        >
          Voir mes notes dans le Journal
        </Button>
      </CotonCard>
    </div>
  );
}