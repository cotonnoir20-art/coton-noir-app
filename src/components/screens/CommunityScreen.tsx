import React from 'react';
import { Users, Trophy, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityScreenProps {
  onNavigate: (screen: string) => void;
}

export function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const challengeProgress = (state.challenge.days / 30) * 100;
  
  const handleJoinChallenge = () => {
    dispatch({ type: 'JOIN_CHALLENGE' });
    toast({
      title: "Challenge rejoint ! 🎉",
      description: "Tu participes maintenant au #NoHeat30days",
    });
  };
  
  const handleProgressUpdate = () => {
    if (state.challenge.days < 30) {
      const reward = 5;
      dispatch({ type: 'UPDATE_CHALLENGE_PROGRESS' });
      dispatch({ type: 'ADD_COINS', amount: reward });
      
      toast({
        title: `Bravo ! +${reward} CC gagnés ✨`,
        description: `Jour ${state.challenge.days + 1}/30 validé`,
      });
    }
  };
  
  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-poppins font-bold text-2xl">Communauté</h2>
        <p className="font-roboto text-muted-foreground">
          Participe aux challenges et partage ton parcours
        </p>
      </div>
      
      {/* Current Challenge */}
      <CotonCard variant="elevated" className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-rose rounded-lg">
            <Trophy className="text-coton-black" size={24} />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-xl">Challenge du mois</h3>
            <p className="font-roboto text-muted-foreground">#NoHeat30days</p>
          </div>
        </div>
        
        <div className="bg-coton-beige rounded-lg p-4">
          <h4 className="font-poppins font-semibold mb-2">Le défi :</h4>
          <p className="font-roboto text-sm text-muted-foreground mb-3">
            30 jours sans sources de chaleur directe sur tes cheveux. 
            Découvrez des coiffures naturelles et protectrices !
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-poppins font-bold text-coton-black">
                1,247
              </div>
              <div className="text-xs font-roboto text-muted-foreground">
                Participantes
              </div>
            </div>
            <div>
              <div className="text-lg font-poppins font-bold text-coton-black">
                5 CC
              </div>
              <div className="text-xs font-roboto text-muted-foreground">
                Par jour validé
              </div>
            </div>
          </div>
        </div>
        
        {!state.challenge.joined ? (
          <Button
            variant="hero"
            size="lg"
            onClick={handleJoinChallenge}
            className="w-full"
          >
            <Plus size={20} />
            Participer au challenge
          </Button>
        ) : (
          <div className="space-y-4">
            <ProgressBar 
              progress={challengeProgress}
              variant="challenge"
              showLabel
              label={`Progression - Jour ${state.challenge.days}/30`}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="hero"
                onClick={handleProgressUpdate}
                disabled={state.challenge.days >= 30}
                className="flex-1"
              >
                {state.challenge.days >= 30 
                  ? '🎉 Challenge terminé !' 
                  : (
                    <>
                      <span className="hidden sm:inline">Enregistrer ma progression</span>
                      <span className="sm:hidden">Valider le jour</span>
                    </>
                  )
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Simulate sharing
                  toast({
                    title: "Partagé !",
                    description: "Ta progression a été partagée avec la communauté",
                  });
                }}
                className="flex-1"
              >
                Partager
              </Button>
            </div>
            
            {state.challenge.days >= 30 && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                <Trophy className="text-success mx-auto mb-2" size={32} />
                <h4 className="font-poppins font-bold text-success">
                  Félicitations ! 🎉
                </h4>
                <p className="font-roboto text-sm text-success">
                  Tu as terminé le challenge #NoHeat30days !
                </p>
              </div>
            )}
          </div>
        )}
      </CotonCard>
      
      {/* Community Stats */}
      <CotonCard className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Users className="text-coton-rose" size={24} />
          <h3 className="font-poppins font-semibold text-lg">
            Statistiques communauté
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-poppins font-bold text-coton-black">
              12,450
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Membres actives
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-poppins font-bold text-coton-black">
              4.8M
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              CC générés ce mois
            </div>
          </div>
        </div>
      </CotonCard>
      
      {/* Upcoming Challenges */}
      <CotonCard className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-coton-rose" size={24} />
          <h3 className="font-poppins font-semibold text-lg">
            Prochains challenges
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-poppins font-medium">#MasqueWeek</div>
              <div className="text-sm font-roboto text-muted-foreground">
                1 masque par jour pendant 7 jours
              </div>
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Bientôt
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="font-poppins font-medium">#ProtectiveStyle</div>
              <div className="text-sm font-roboto text-muted-foreground">
                30 jours de coiffures protectrices
              </div>
            </div>
            <div className="text-sm font-roboto text-muted-foreground">
              Mars 2024
            </div>
          </div>
        </div>
      </CotonCard>
      
    </div>
  );
}