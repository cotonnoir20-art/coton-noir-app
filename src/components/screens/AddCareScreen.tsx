import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddCareScreenProps {
  onBack: () => void;
}

export function AddCareScreen({ onBack }: AddCareScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const [type, setType] = useState<'soin' | 'routine'>('soin');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Merci d'entrer un titre pour ton soin",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Calculate reward based on new barème - Soins complets rapportent plus
      const baseReward = type === 'soin' ? 50 : 20; // Soin: 50 CC, Routine: 20 CC
      const reward = baseReward;
      
      // Create the entry object
      const newEntry = {
        id: Date.now().toString(),
        type,
        title: title.trim(),
        date,
        note: note.trim(),
        timestamp: Date.now()
      };
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour enregistrer un soin",
          variant: "destructive"
        });
        return;
      }

      // Save to Supabase database
      const { error: dbError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          email: user.email || '',
          type,
          title: title.trim(),
          date,
          note: note.trim(),
          timestamp: Date.now()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder en base de données",
          variant: "destructive"
        });
        return;
      }

      // Validate and add to local context with anti-cheat validation
      dispatch({ type: 'VALIDATE_AND_ADD_ENTRY', entry: newEntry });
      dispatch({ type: 'ADD_COINS', amount: reward });
      
      // Show success toast
      toast({
        title: `Bravo ✨ +${reward} CC gagnés !`,
        description: `Ta ${type} a été ajouté${type === 'routine' ? 'e' : ''} au journal`,
      });
      
      onBack();
    } catch (error) {
      console.error('Error saving care:', error);
      toast({
        title: "Action bloquée",
        description: error instanceof Error ? error.message : "Erreur de validation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile-first responsive */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center gap-3">
            <Button variant="black" size="icon" onClick={onBack} className="btn-touch">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <h1 className="font-poppins font-semibold text-base sm:text-lg">
              Ajouter un soin
            </h1>
          </div>
        </div>
      </header>
      
      {/* Content - Mobile-first responsive */}
      <div className="container-responsive space-responsive pb-20 gap-2.5 sm:gap-4">
        {/* Info Card - Mobile-first responsive */}
        <CotonCard className="card-responsive bg-coton-beige/50 border-coton-rose/20">
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-sm sm:text-base text-foreground">💡 Quelle différence ?</h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div>
                <span className="font-medium">🌿 Soin :</span> Traitement spécifique et complet (shampoing, masque, huile, traitement profond...)
              </div>
              <div>
                <span className="font-medium">✨ Routine :</span> Gestes quotidiens simples (LCO, LOC, démêlage, coiffage...)
              </div>
            </div>
          </div>
        </CotonCard>

        {/* Type Selection - Mobile-first responsive */}
        <CotonCard className="card-responsive space-y-4">
          <h3 className="font-poppins font-semibold text-base">Type</h3>
          <div className="flex gap-3">
            <Button
              variant={type === 'soin' ? 'black' : 'outline'}
              size="pill" 
              onClick={() => setType('soin')}
              className="flex-1 min-w-0 text-xs sm:text-sm btn-touch"
              disabled={isLoading}
            >
              <span className="truncate">Soin (+50 CC)</span>
            </Button>
            <Button
              variant={type === 'routine' ? 'hero' : 'outline'}
              size="pill"
              onClick={() => setType('routine')}
              className="flex-1 min-w-0 text-xs sm:text-sm btn-touch"
              disabled={isLoading}
            >
              <span className="truncate">Routine (+20 CC)</span>
            </Button>
          </div>
        </CotonCard>
        
        {/* Form - Mobile-first responsive */}
        <CotonCard className="card-responsive space-y-6">
          <div className="space-y-2">
            <label className="font-poppins font-medium text-sm">
              Titre *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'soin' ? 'Ex: Masque hydratant' : 'Ex: Routine du soir'}
              className="rounded-lg text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-poppins font-medium text-sm">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-poppins font-medium text-sm">
              Notes
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Décris ton soin, les produits utilisés, tes impressions..."
              rows={4}
              className="rounded-lg text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
        </CotonCard>
        
        {/* Save Button - Mobile-first responsive */}
        <Button
          variant="black"
          size="lg"
          onClick={handleSave}
          className="w-full btn-touch"
          disabled={!title.trim() || isLoading}
        >
          <Save size={18} className="sm:w-5 sm:h-5" />
          <span className="ml-2">{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
        </Button>
      </div>
    </div>
  );
}