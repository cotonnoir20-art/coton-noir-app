import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un titre pour votre soin",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate reward based on new barème - Soins complets rapportent plus
    const baseReward = type === 'soin' ? 50 : 20; // Soin: 50 CC, Routine: 20 CC
    const reward = state.premium ? baseReward * 2 : baseReward;
    
    // Add journal entry
    const newEntry = {
      id: Date.now().toString(),
      type,
      title: title.trim(),
      date,
      note: note.trim()
    };
    
    dispatch({ type: 'ADD_JOURNAL_ENTRY', entry: newEntry });
    dispatch({ type: 'ADD_COINS', amount: reward });
    
    // Show success toast
    toast({
      title: `Bravo ✨ +${reward} CC gagnés !`,
      description: `Votre ${type} a été ajouté${type === 'routine' ? 'e' : ''} au journal`,
    });
    
    onBack();
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-poppins font-semibold text-lg">
            Ajouter un soin
          </h1>
        </div>
      </header>
      
      {/* Content */}
      <div className="p-4 pb-20 space-y-6">
        {/* Info Card */}
        <CotonCard className="p-4 bg-coton-beige/50 border-coton-rose/20">
          <div className="space-y-3">
            <h3 className="font-poppins font-semibold text-sm text-coton-black">💡 Quelle différence ?</h3>
            <div className="space-y-2 text-sm text-coton-black/80">
              <div>
                <span className="font-medium">🌿 Soin :</span> Traitement spécifique et complet (masque, huile, traitement profond...)
              </div>
              <div>
                <span className="font-medium">✨ Routine :</span> Gestes quotidiens simples (shampoing, démêlage, coiffage...)
              </div>
            </div>
          </div>
        </CotonCard>

        {/* Type Selection */}
        <CotonCard className="p-6 space-y-4">
          <h3 className="font-poppins font-semibold text-base">Type</h3>
          <div className="flex gap-3">
            <Button
              variant={type === 'soin' ? 'hero' : 'outline'}
              size="pill" 
              onClick={() => setType('soin')}
              className="flex-1"
            >
              Soin (+{state.premium ? '100' : '50'} CC)
            </Button>
            <Button
              variant={type === 'routine' ? 'hero' : 'outline'}
              size="pill"
              onClick={() => setType('routine')}
              className="flex-1"
            >
              Routine (+{state.premium ? '40' : '20'} CC)
            </Button>
          </div>
        </CotonCard>
        
        {/* Form */}
        <CotonCard className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="font-poppins font-medium text-sm">
              Titre *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'soin' ? 'Ex: Masque hydratant' : 'Ex: Routine du soir'}
              className="rounded-lg"
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
              className="rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-poppins font-medium text-sm">
              Notes
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Décrivez votre soin, les produits utilisés, vos impressions..."
              rows={4}
              className="rounded-lg"
            />
          </div>
        </CotonCard>
        
        {/* Save Button */}
        <Button
          variant="hero"
          size="lg"
          onClick={handleSave}
          className="w-full"
          disabled={!title.trim()}
        >
          <Save size={20} />
          Enregistrer
        </Button>
      </div>
    </div>
  );
}