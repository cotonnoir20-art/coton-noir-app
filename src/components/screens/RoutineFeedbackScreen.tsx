import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp, RoutineFeedback } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface RoutineFeedbackScreenProps {
  onBack: () => void;
  routineType?: 'express' | 'complete';
}

export function RoutineFeedbackScreen({ 
  onBack, 
  routineType = 'complete' 
}: RoutineFeedbackScreenProps) {
  const { dispatch } = useApp();
  const { toast } = useToast();
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(30);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!rating) {
      toast({
        title: "Erreur",
        description: "Veuillez donner une note à votre routine",
        variant: "destructive"
      });
      return;
    }

    const feedback: RoutineFeedback = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      routineType,
      rating,
      timeSpent,
      notes: notes.trim()
    };

    dispatch({ type: 'ADD_ROUTINE_FEEDBACK', feedback });
    
    // Récompense basée sur la note
    const rewardAmount = rating >= 4 ? 15 : 10;
    dispatch({ type: 'ADD_COINS', amount: rewardAmount });

    toast({
      title: `Merci pour votre retour ! +${rewardAmount} CC`,
      description: "Votre routine s'améliore grâce à vos commentaires ✨"
    });

    onBack();
  };

  const ratingLabels = {
    1: 'Pas satisfaite',
    2: 'Mitigé',
    3: 'Correct',
    4: 'Très bien',
    5: 'Parfait !'
  };

  const timePresets = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1h', value: 60 },
    { label: '1h30', value: 90 },
    { label: '2h+', value: 120 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="font-poppins font-bold text-xl">Feedback Routine</h1>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-poppins font-semibold">
            Comment s'est passée votre routine ?
          </h2>
          <p className="text-white/90 text-sm">
            Votre avis nous aide à améliorer vos conseils
          </p>
        </div>
      </div>

      <div className="px-4 space-y-6 -mt-4 relative z-10">
        {/* Type de routine */}
        <CotonCard className="p-6">
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              routineType === 'express' 
                ? 'bg-orange-100 text-orange-600' 
                : 'bg-purple-100 text-purple-600'
            }`}>
              {routineType === 'express' ? <Zap size={32} /> : <CheckCircle size={32} />}
            </div>
            <div>
              <h3 className="font-poppins font-bold text-lg">
                Routine {routineType === 'express' ? 'Express' : 'Complète'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {routineType === 'express' 
                  ? 'Version rapide 3 étapes' 
                  : 'Version complète personnalisée'}
              </p>
            </div>
          </div>
        </CotonCard>

        {/* Évaluation par étoiles */}
        <CotonCard className="p-6">
          <div className="space-y-4">
            <Label className="text-base font-poppins font-semibold">
              Note globale *
            </Label>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                  className="p-2"
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      rating && rating >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            
            {rating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-sm font-medium text-purple-600">
                  {ratingLabels[rating]}
                </p>
              </motion.div>
            )}
          </div>
        </CotonCard>

        {/* Temps passé */}
        <CotonCard className="p-6">
          <div className="space-y-4">
            <Label className="text-base font-poppins font-semibold">
              Temps passé
            </Label>
            
            <div className="grid grid-cols-3 gap-2">
              {timePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={timeSpent === preset.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeSpent(preset.value)}
                  className="text-xs"
                >
                  <Clock size={14} className="mr-1" />
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {timeSpent && (
              <div className="text-center text-sm text-muted-foreground">
                Environ {timeSpent} minutes
              </div>
            )}
          </div>
        </CotonCard>

        {/* Notes libres */}
        <CotonCard className="p-6">
          <div className="space-y-4">
            <Label htmlFor="notes" className="text-base font-poppins font-semibold">
              Commentaires (optionnel)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Comment vous êtes-vous sentie ? Qu'est-ce qui a bien marché ? Y a-t-il des améliorations à apporter ?"
              className="min-h-[100px]"
            />
            
            <div className="text-xs text-muted-foreground">
              Vos commentaires nous aident à personnaliser encore mieux vos prochaines routines
            </div>
          </div>
        </CotonCard>

        {/* Conseils selon la note */}
        {rating && rating <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CotonCard className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <div className="space-y-2">
                <h4 className="font-poppins font-semibold text-blue-700">
                  💡 Suggestions d'amélioration
                </h4>
                <ul className="space-y-1 text-sm text-blue-600">
                  {rating <= 2 && (
                    <>
                      <li>• Essayez la version Express pour gagner du temps</li>
                      <li>• Vérifiez si les produits conviennent à votre porosité</li>
                    </>
                  )}
                  {rating === 3 && (
                    <>
                      <li>• Adaptez les quantités selon vos sensations</li>
                      <li>• N'hésitez pas à espacer certaines étapes</li>
                    </>
                  )}
                </ul>
              </div>
            </CotonCard>
          </motion.div>
        )}

        {rating && rating >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CotonCard className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center space-y-2">
                <h4 className="font-poppins font-semibold text-green-700">
                  🎉 Excellent travail !
                </h4>
                <p className="text-sm text-green-600">
                  Votre routine fonctionne parfaitement. Continuez comme ça !
                </p>
              </div>
            </CotonCard>
          </motion.div>
        )}

        {/* Bouton de validation */}
        <div className="pb-8">
          <Button
            onClick={handleSubmit}
            disabled={!rating}
            className="w-full"
            size="lg"
          >
            Envoyer mon feedback {rating && rating >= 4 && '+15 CC' || '+10 CC'}
          </Button>
        </div>
      </div>
    </div>
  );
}