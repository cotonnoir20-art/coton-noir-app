import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CotonCard } from '@/components/ui/coton-card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoutineLimit } from '@/hooks/useRoutineLimit';
import { useToast } from '@/hooks/use-toast';

const RoutineSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { recordRoutineGeneration } = useRoutineLimit();
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      // Enregistrer la génération de routine payée
      recordRoutineGeneration('paid', sessionId);
      
      toast({
        title: "Paiement confirmé ! 🎉",
        description: "Ta routine personnalisée est maintenant disponible."
      });
    }
  }, [sessionId, recordRoutineGeneration, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <CotonCard className="p-8 text-center bg-white/80 backdrop-blur">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-green-600" size={40} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-poppins font-bold text-2xl text-green-800 mb-4">
              Paiement réussi !
            </h1>
            <p className="text-green-700 mb-6">
              Merci pour ton achat ! Ta routine personnalisée Coton Noir est maintenant prête.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-coton-rose/10 to-purple-50 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-coton-rose" size={20} />
                <span className="font-poppins font-semibold text-coton-rose">
                  Ce que tu as obtenu :
                </span>
              </div>
              <ul className="text-left text-sm space-y-1 text-purple-700">
                <li className="flex items-center gap-2">
                  <span className="text-coton-rose">✓</span>
                  <span>Routine complètement personnalisée</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-coton-rose">✓</span>
                  <span>Conseils d'expert inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-coton-rose">✓</span>
                  <span>Planning d'application détaillé</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-coton-rose">✓</span>
                  <span>+200 CotonCoins bonus</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <Button
                onClick={() => navigate('/detailed-routine')}
                className="w-full bg-gradient-to-r from-coton-rose to-pink-400 hover:from-coton-rose/90 hover:to-pink-400/90"
              >
                Voir ma routine
                <ArrowRight size={16} className="ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </motion.div>
          </motion.div>
        </CotonCard>
      </motion.div>
    </div>
  );
};

export default RoutineSuccess;