import React, { useState } from 'react';
import { CheckCircle, Clock, Droplets, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const routineSteps = [
  {
    id: 'prepoo',
    name: 'Pré-poo',
    description: 'Huile de coco sur cheveux secs',
    duration: '30 min',
    icon: '🥥'
  },
  {
    id: 'shampoo',
    name: 'Shampoing hydratant',
    description: 'Nettoyage doux du cuir chevelu',
    duration: '5 min',
    icon: '🧴'
  },
  {
    id: 'mask',
    name: 'Masque',
    description: 'Hydratation profonde',
    duration: '20 min',
    icon: '✨'
  },
  {
    id: 'leavein',
    name: 'Leave-in',
    description: 'Protection et hydratation',
    duration: '2 min',
    icon: '💧'
  },
  {
    id: 'seal',
    name: 'Scellage',
    description: 'Huile légère pour fixer l\'hydratation',
    duration: '3 min',
    icon: '🌟'
  }
];

export function RoutineScreen() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  const validateRoutine = () => {
    if (completedSteps.length === routineSteps.length) {
      dispatch({ type: 'ADD_COINS', amount: 10 });
      toast({
        title: "Routine validée ! ✨",
        description: "+10 CotonCoins gagnés",
      });
      setCompletedSteps([]);
    } else {
      toast({
        title: "Routine incomplète",
        description: "Complétez toutes les étapes pour valider",
        variant: "destructive"
      });
    }
  };
  
  const progress = (completedSteps.length / routineSteps.length) * 100;
  
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-poppins font-bold text-2xl text-foreground">Ma Routine</h2>
        <p className="font-roboto text-muted-foreground">
          Routine personnalisée selon votre profil capillaire
        </p>
      </div>
      
      {/* Objective */}
      <CotonCard className="p-4 bg-primary/10 border-primary/20">
        <div className="text-center space-y-2">
          <div className="text-2xl">🎯</div>
          <h3 className="font-poppins font-semibold text-foreground">
            Objectif de la routine
          </h3>
          <p className="font-roboto text-sm text-muted-foreground">
            Résoudre la galère quotidienne : je sais pas quoi faire à mes cheveux
          </p>
        </div>
      </CotonCard>
      
      {/* Progress */}
      <CotonCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-poppins font-medium text-foreground">Progression</span>
          <span className="font-roboto text-sm text-muted-foreground">
            {completedSteps.length}/{routineSteps.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CotonCard>
      
      {/* Routine Steps */}
      <div className="space-y-3">
        {routineSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          
          return (
            <CotonCard
              key={step.id}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                isCompleted 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-poppins font-bold ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{step.icon}</span>
                    <h3 className="font-poppins font-semibold text-foreground">
                      {step.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-xs font-roboto">{step.duration}</span>
                    </div>
                  </div>
                  <p className="font-roboto text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {isCompleted && (
                  <CheckCircle className="text-primary animate-scale-in" size={20} />
                )}
              </div>
            </CotonCard>
          );
        })}
      </div>
      
      {/* Validate Button */}
      <Button 
        variant="default"
        size="lg" 
        onClick={validateRoutine}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={completedSteps.length === 0}
      >
        <CheckCircle size={20} />
        Routine validée {completedSteps.length === routineSteps.length && '(+10 CC)'}
      </Button>
      
      {/* Gamification Info */}
      <CotonCard className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/20">
        <div className="text-center space-y-2">
          <Sparkles className="text-primary mx-auto" size={24} />
          <h4 className="font-poppins font-semibold text-foreground">
            Gamification & progression
          </h4>
          <p className="font-roboto text-sm text-muted-foreground">
            Tes points débloquent des contenus exclusifs
          </p>
        </div>
      </CotonCard>
    </div>
  );
}