import React from 'react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Loader2 } from 'lucide-react';

interface JournalEntriesSectionProps {
  onAddCare: () => void;
  onNavigate: (screen: string) => void;
}

export function JournalEntriesSection({ onAddCare, onNavigate }: JournalEntriesSectionProps) {
  const { entries, loading, error } = useJournalEntries();

  if (loading) {
    return (
      <CotonCard className="p-6 text-center">
        <Loader2 className="animate-spin mx-auto text-coton-rose mb-3" size={32} />
        <p className="text-sm text-muted-foreground">
          Chargement de votre journal...
        </p>
      </CotonCard>
    );
  }

  if (error) {
    return (
      <CotonCard className="p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h4 className="font-poppins font-semibold text-foreground mb-2">
          Erreur de chargement
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          {error}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </CotonCard>
    );
  }

  if (entries.length === 0) {
    return (
      <CotonCard className="p-6 text-center">
        <div className="text-4xl mb-3">📝</div>
        <h4 className="font-poppins font-semibold text-foreground mb-2">
          Aucune entrée pour le moment
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Commencez à documenter votre parcours capillaire
        </p>
        <Button variant="black" onClick={onAddCare}>
          + Ajouter mon premier soin
        </Button>
      </CotonCard>
    );
  }

  return (
    <div className="space-y-3">
      {entries.slice(0, 3).map((entry, index) => (
        <CotonCard key={entry.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-coton-beige rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-2xl">💆🏾‍♀️</div>
            </div>
            <div className="flex-1">
              <h4 className="font-poppins font-semibold text-foreground">{entry.title}</h4>
              <p className="text-sm text-muted-foreground">
                {entry.type} • {new Date(entry.date).toLocaleDateString('fr-FR')}
              </p>
              {entry.note && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{entry.note}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Ouvrir
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-amber-100 text-amber-700 border-amber-300"
                onClick={onAddCare}
              >
                + Nouveau soin
              </Button>
            </div>
          </div>
        </CotonCard>
      ))}
      {entries.length > 3 && (
        <Button variant="soft" className="w-full" onClick={() => onNavigate('journal')}>
          Voir tous les soins ({entries.length})
        </Button>
      )}
    </div>
  );
}