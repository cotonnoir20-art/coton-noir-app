import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, TrendingUp, Target, Camera, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp, HairMeasurement } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { HairAnalyzer } from '@/components/ui/hair-analyzer';

interface GrowthTrackerScreenProps {
  onBack: () => void;
}

export function GrowthTrackerScreen({ onBack }: GrowthTrackerScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  // Form states pour nouvelle mesure
  const [newMeasurement, setNewMeasurement] = useState({
    front: '',
    leftSide: '',
    rightSide: '',
    back: '',
    notes: ''
  });

  // Form state pour objectif
  const [goalForm, setGoalForm] = useState({
    targetLength: '',
    targetDate: ''
  });

  // Calculer la longueur maximale actuelle
  const currentMaxLength = useMemo(() => {
    if (state.hairMeasurements.length === 0) return 0;
    
    const latestMeasurement = state.hairMeasurements[0];
    return Math.max(
      latestMeasurement.front,
      latestMeasurement.leftSide,
      latestMeasurement.rightSide,
      latestMeasurement.back
    );
  }, [state.hairMeasurements]);

  // Calculer la progression
  const growthProgress = useMemo(() => {
    if (state.hairMeasurements.length < 2) return null;
    
    const latest = state.hairMeasurements[0];
    const previous = state.hairMeasurements[1];
    
    const latestMax = Math.max(latest.front, latest.leftSide, latest.rightSide, latest.back);
    const previousMax = Math.max(previous.front, previous.leftSide, previous.rightSide, previous.back);
    
    return {
      growth: latestMax - previousMax,
      period: 'depuis la dernière mesure'
    };
  }, [state.hairMeasurements]);

  const handleAddMeasurement = () => {
    // Validation
    const front = parseFloat(newMeasurement.front);
    const leftSide = parseFloat(newMeasurement.leftSide);
    const rightSide = parseFloat(newMeasurement.rightSide);
    const back = parseFloat(newMeasurement.back);

    if (isNaN(front) || isNaN(leftSide) || isNaN(rightSide) || isNaN(back)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir des mesures valides",
        variant: "destructive"
      });
      return;
    }

    if (front < 0 || leftSide < 0 || rightSide < 0 || back < 0) {
      toast({
        title: "Erreur",
        description: "Les mesures ne peuvent pas être négatives",
        variant: "destructive"
      });
      return;
    }

    const measurement: HairMeasurement = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      front,
      leftSide,
      rightSide,
      back,
      notes: newMeasurement.notes.trim() || undefined,
      timestamp: Date.now()
    };

    dispatch({ type: 'ADD_MEASUREMENT', measurement });
    dispatch({ type: 'ADD_COINS', amount: 25 }); // Récompense pour mesure

    toast({
      title: "Mesure ajoutée ! ✨ +25 CC",
      description: "Ta progression a été enregistrée"
    });

    // Reset form
    setNewMeasurement({
      front: '',
      leftSide: '',
      rightSide: '',
      back: '',
      notes: ''
    });
    setShowAddMeasurement(false);
  };

  const handleSetGoal = () => {
    const targetLength = parseFloat(goalForm.targetLength);
    const targetDate = goalForm.targetDate;

    if (isNaN(targetLength) || !targetDate) {
      toast({
        title: "Erreur",
        description: "Veuillez compléter tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (targetLength <= currentMaxLength) {
      toast({
        title: "Erreur",
        description: "L'objectif doit être supérieur à ta longueur actuelle",
        variant: "destructive"
      });
      return;
    }

    dispatch({
      type: 'SET_GROWTH_GOAL',
      goal: {
        targetLength,
        targetDate,
        isActive: true
      }
    });

    toast({
      title: "Objectif défini ! 🎯",
      description: `${targetLength} cm d'ici ${new Date(targetDate).toLocaleDateString('fr-FR')}`
    });

    setGoalForm({ targetLength: '', targetDate: '' });
    setShowGoalDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coton-rose/10 to-white">
      {/* Header */}
      <div className="bg-coton-terracotta px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="font-poppins font-bold text-xl">Calculateur de Pousse</h1>
        </div>
        
        {/* Stats principales */}
        <div className="text-center space-y-2">
          <div className="text-sm opacity-90">LONGUEUR MAX ACTUELLE</div>
          <div className="font-poppins font-bold text-4xl">{currentMaxLength} cm</div>
          {state.hairMeasurements.length === 0 && (
            <div className="text-sm opacity-75">Commencer le suivi</div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-6 -mt-4 relative z-10">
        {/* Silhouette et mesures */}
        <CotonCard className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Silhouette */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-40 bg-coton-rose/10 rounded-lg flex items-center justify-center border-2 border-dashed border-coton-rose/30">
                <div className="text-center text-coton-rose/60">
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-xs font-roboto">Silhouette</div>
                </div>
              </div>
            </div>

            {/* Mesures */}
            <div className="space-y-3">
              {state.hairMeasurements.length > 0 ? (
                <>
                  <MeasurementRow label="DEVANT" value={state.hairMeasurements[0].front} />
                  <MeasurementRow label="CÔTÉ GAUCHE" value={state.hairMeasurements[0].leftSide} />
                  <MeasurementRow label="CÔTÉ DROIT" value={state.hairMeasurements[0].rightSide} />
                  <MeasurementRow label="DERRIÈRE" value={state.hairMeasurements[0].back} />
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <TrendingUp className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">Aucune mesure enregistrée</p>
                  <p className="text-xs">Ajoute ta première mesure</p>
                </div>
              )}
            </div>
          </div>
        </CotonCard>

        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog open={showAddMeasurement} onOpenChange={setShowAddMeasurement}>
            <DialogTrigger asChild>
              <Button variant="black" className="w-full btn-touch">
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">Nouvelle mesure</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une mesure</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="front">Devant (cm)</Label>
                    <Input
                      id="front"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newMeasurement.front}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, front: e.target.value }))}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="back">Derrière (cm)</Label>
                    <Input
                      id="back"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newMeasurement.back}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, back: e.target.value }))}
                      placeholder="0.0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="leftSide">Côté gauche (cm)</Label>
                    <Input
                      id="leftSide"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newMeasurement.leftSide}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, leftSide: e.target.value }))}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rightSide">Côté droit (cm)</Label>
                    <Input
                      id="rightSide"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newMeasurement.rightSide}
                      onChange={(e) => setNewMeasurement(prev => ({ ...prev, rightSide: e.target.value }))}
                      placeholder="0.0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input
                    id="notes"
                    value={newMeasurement.notes}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observations, traitements..."
                  />
                </div>
                <Button onClick={handleAddMeasurement} className="w-full">
                  Enregistrer la mesure
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <HairAnalyzer 
            analysisType="growth_tracking"
            title="Analyser ma pousse"
            className="w-full text-xs sm:text-sm"
            onAnalysisComplete={(analysis) => {
              if (analysis.measurements && analysis.measurements.estimatedLengthFront) {
                toast({
                  title: "Analyse de croissance ✨",
                  description: `Longueur estimée: ${analysis.measurements.estimatedLengthFront}cm devant`
                });
              }
            }}
          />
        </div>

        {/* Voir graphes - maintenant en dessous */}
        <Button
          variant="outline"
          onClick={() => toast({ title: "Bientôt disponible !", description: "Les graphiques arriveront dans la V2" })}
          className="w-full btn-touch"
        >
          <TrendingUp size={18} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Voir les graphiques de progression</span>
        </Button>

        {/* Objectif de pousse */}
        {state.growthGoal ? (
          <CotonCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-poppins font-semibold flex items-center gap-2">
                  <Target className="text-coton-rose" size={20} />
                  Objectif de pousse
                </h3>
                <p className="text-sm text-muted-foreground">
                  {state.growthGoal.targetLength} cm d'ici {new Date(state.growthGoal.targetDate).toLocaleDateString('fr-FR')}
                </p>
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    Progression: {currentMaxLength} cm / {state.growthGoal.targetLength} cm
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-coton-rose h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentMaxLength / state.growthGoal.targetLength) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                <DialogTrigger asChild>
                  <Button variant="black" size="sm">
                    <Edit size={16} />
                    Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier l'objectif</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetLength">Longueur cible (cm)</Label>
                      <Input
                        id="targetLength"
                        type="number"
                        step="0.1"
                        min={currentMaxLength + 0.1}
                        value={goalForm.targetLength}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetLength: e.target.value }))}
                        placeholder={`Plus de ${currentMaxLength} cm`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Date cible</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={goalForm.targetDate}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleSetGoal} className="w-full">
                      Mettre à jour l'objectif
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CotonCard>
        ) : (
          <CotonCard className="p-4">
            <div className="text-center space-y-3">
              <Target className="mx-auto text-coton-rose" size={32} />
              <div>
                <h3 className="font-poppins font-semibold">Définis ton objectif de pousse</h3>
                <p className="text-sm text-muted-foreground">
                  Fixe-toi un objectif de longueur pour rester motivée !
                </p>
              </div>
              <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                <DialogTrigger asChild>
                  <Button variant="black">
                    <Target size={20} />
                    Définir un objectif
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Définir un objectif</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetLength">Longueur cible (cm)</Label>
                      <Input
                        id="targetLength"
                        type="number"
                        step="0.1"
                        min={currentMaxLength + 0.1}
                        value={goalForm.targetLength}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetLength: e.target.value }))}
                        placeholder={`Plus de ${currentMaxLength} cm`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Date cible</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={goalForm.targetDate}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleSetGoal} className="w-full">
                      Créer l'objectif
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CotonCard>
        )}

        {/* Progression récente */}
        {growthProgress && (
          <CotonCard className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                growthProgress.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-poppins font-semibold">Progression récente</h3>
                <p className="text-sm text-muted-foreground">
                  {growthProgress.growth >= 0 ? '+' : ''}{growthProgress.growth.toFixed(1)} cm {growthProgress.period}
                </p>
              </div>
            </div>
          </CotonCard>
        )}

        {/* Historique des mesures */}
        {state.hairMeasurements.length > 0 && (
          <CotonCard className="p-4">
            <h3 className="font-poppins font-semibold mb-4">Historique des mesures</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {state.hairMeasurements.slice(0, 5).map((measurement) => (
                <div key={measurement.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-roboto text-sm">
                      {new Date(measurement.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max: {Math.max(measurement.front, measurement.leftSide, measurement.rightSide, measurement.back)} cm
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>D:{measurement.front} G:{measurement.leftSide}</div>
                    <div>Dr:{measurement.rightSide} Ar:{measurement.back}</div>
                  </div>
                </div>
              ))}
              {state.hairMeasurements.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  ... et {state.hairMeasurements.length - 5} autres mesures
                </p>
              )}
            </div>
          </CotonCard>
        )}
      </div>

      <div className="h-20"></div> {/* Padding pour la navigation */}
    </div>
  );
}

interface MeasurementRowProps {
  label: string;
  value: number;
}

function MeasurementRow({ label, value }: MeasurementRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm font-roboto text-muted-foreground">{label}</span>
      <span className="font-poppins font-semibold">{value} cm</span>
    </div>
  );
}