import React from 'react';
import { Calendar, FileText, Package, ArrowLeft } from 'lucide-react';
import { CotonCard } from '@/components/ui/coton-card';
import { ComingSoon } from '@/components/ui/coming-soon';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

interface FullJournalScreenProps {
  onBack: () => void;
}

export function FullJournalScreen({ onBack }: FullJournalScreenProps) {
  const { state } = useApp();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  if (state.journalEntries.length === 0) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-poppins font-bold text-xl">
            Historique complet
          </h1>
        </div>
        
        <CotonCard className="p-8 text-center space-y-4">
          <div className="text-6xl">📖</div>
          <h3 className="font-poppins font-semibold text-lg">
            Ton journal est vide
          </h3>
          <p className="font-roboto text-muted-foreground">
            Commence à enregistrer tes soins capillaires pour suivre tes progrès
          </p>
        </CotonCard>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-poppins font-bold text-xl">
          Historique complet
        </h1>
      </div>

      {/* Header Stats */}
      <CotonCard className="p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-poppins font-bold text-coton-black">
              {state.journalEntries.length}
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Entrées totales
            </div>
          </div>
          <div>
            <div className="text-2xl font-poppins font-bold text-coton-black">
              {state.redeems.length}
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Achats effectués
            </div>
          </div>
        </div>
      </CotonCard>
      
      {/* All Journal Entries */}
      <div className="space-y-3">
        <h3 className="font-poppins font-semibold text-lg px-1">
          Tous tes soins
        </h3>
        
        {state.journalEntries.map((entry) => (
          <CotonCard key={entry.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                entry.type === 'soin' 
                  ? 'bg-coton-rose text-coton-black' 
                  : 'bg-coton-black text-white'
              }`}>
                {entry.type === 'soin' ? (
                  <FileText size={16} />
                ) : (
                  <Calendar size={16} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-poppins font-semibold text-base leading-tight">
                    {entry.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-pill text-xs font-roboto ${
                    entry.type === 'soin'
                      ? 'bg-coton-rose/30 text-coton-black'
                      : 'bg-coton-black text-white'
                  }`}>
                    {entry.type === 'soin' ? 'Soin' : 'Routine'}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground font-roboto mt-1">
                  {formatDate(entry.date)}
                </p>
                
                {entry.note && (
                  <p className="text-sm font-roboto mt-2 text-foreground">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          </CotonCard>
        ))}
      </div>
      
      {/* Redeems Section */}
      {state.redeems.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-poppins font-semibold text-lg px-1">
            Mes achats
          </h3>
          
          {state.redeems.map((redeem, index) => (
            <CotonCard key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 text-success rounded-lg">
                  <Package size={16} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-poppins font-semibold text-base">
                    {redeem.partnerId}
                  </h4>
                  <p className="text-sm text-muted-foreground font-roboto">
                    Code: {redeem.code}
                  </p>
                  <p className="text-xs text-muted-foreground font-roboto">
                    {formatDate(redeem.date)}
                  </p>
                </div>
              </div>
            </CotonCard>
          ))}
        </div>
      )}

      {/* Fonctionnalités avancées du journal */}
      <div className="space-y-4 mt-8">
        <CotonCard className="p-6 bg-gradient-to-r from-muted/20 to-transparent">
          <div className="text-center space-y-4">
            <div className="text-4xl">📝</div>
            <h3 className="font-poppins font-semibold text-lg">Journal Avancé - Bientôt disponible</h3>
            <p className="font-roboto text-sm text-muted-foreground">
              Des fonctionnalités complètes d'analyse et de suivi arrivent dans les prochaines versions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-poppins font-medium text-sm">Analyses avancées :</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Tendances et patterns de soins</p>
                  <p>• Efficacité des produits par période</p>
                  <p>• Corrélations météo/état cheveux</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-poppins font-medium text-sm">Export et partage :</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Export PDF de votre parcours</p>
                  <p>• Partage sélectif avec la communauté</p>
                  <p>• Sauvegarde cloud automatique</p>
                </div>
              </div>
            </div>
          </div>
        </CotonCard>
      </div>
    </div>
  );
}