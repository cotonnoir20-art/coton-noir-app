import React from 'react';
import { Calendar, FileText, Package } from 'lucide-react';
import { CotonCard } from '@/components/ui/coton-card';
import { AIHairTip } from '@/components/ui/ai-hair-tip';
import { useApp } from '@/contexts/AppContext';

export function JournalScreen() {
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
        <CotonCard className="p-8 text-center space-y-4">
          <div className="text-6xl">📖</div>
          <h3 className="font-poppins font-semibold text-lg">
            Votre journal est vide
          </h3>
          <p className="font-roboto text-muted-foreground">
            Commencez à enregistrer vos soins capillaires pour suivre vos progrès
          </p>
        </CotonCard>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20 space-y-4">
      {/* AI Hair Tip */}
      <AIHairTip tipType="routine" context="conseils pour le journal capillaire" variant="default" showRefresh={true} />
      
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
      
      {/* Journal Entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-poppins font-semibold text-lg">
            Historique des soins
          </h3>
          {state.journalEntries.length > 3 && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'full-journal' }))}
              className="text-sm font-roboto text-coton-black hover:text-coton-rose transition-colors"
            >
              Tout voir
            </button>
          )}
        </div>
        
        {state.journalEntries.slice(0, 3).map((entry) => (
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
    </div>
  );
}