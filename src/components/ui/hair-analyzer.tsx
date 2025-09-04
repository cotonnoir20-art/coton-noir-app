import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { CotonCard } from './coton-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HairAnalyzerProps {
  analysisType: 'hair_profile' | 'wash_day' | 'growth_tracking';
  title?: string;
  description?: string;
  onAnalysisComplete?: (analysis: any) => void;
  className?: string;
}

export function HairAnalyzer({ 
  analysisType, 
  title, 
  description, 
  onAnalysisComplete,
  className = ""
}: HairAnalyzerProps) {
  const { state } = useApp();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titles = {
    hair_profile: 'Analyse de profil capillaire',
    wash_day: 'Analyse wash day',
    growth_tracking: 'Suivi de croissance'
  };

  const descriptions = {
    hair_profile: 'Prends une photo de tes cheveux pour analyser ton type et recevoir des conseils personnalisés',
    wash_day: 'Capture le résultat de ton wash day pour des conseils d\'amélioration',
    growth_tracking: 'Photographie tes cheveux pour suivre ta progression et recevoir des conseils de croissance'
  };

  const currentTitle = title || titles[analysisType];
  const currentDescription = description || descriptions[analysisType];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra. Utilisez l'upload de fichier.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `hair-photo-${Date.now()}.jpg`, { 
              type: 'image/jpeg' 
            });
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Upload de l'image vers Supabase Storage
      const fileName = `${Date.now()}-${selectedImage.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hair-photos')
        .upload(filePath, selectedImage);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      // Obtenir l'URL publique signée
      const { data: urlData } = await supabase.storage
        .from('hair-photos')
        .createSignedUrl(filePath, 3600); // URL valide 1h

      if (!urlData?.signedUrl) {
        throw new Error('Impossible de créer l\'URL de l\'image');
      }

      // Analyser avec OpenAI Vision
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-hair-photo', {
          body: {
            imageUrl: urlData.signedUrl,
            analysisType,
            hairProfile: {
              hairType: state.detailedHairProfile.hairType,
              porosity: state.detailedHairProfile.porosity,
              objective: state.detailedHairProfile.objective,
              problems: state.detailedHairProfile.problems,
              needs: state.detailedHairProfile.needs
            }
          }
        });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error('Erreur lors de l\'analyse');
      }

      setAnalysisResult(analysisData.analysis);
      onAnalysisComplete?.(analysisData.analysis);
      
      toast({
        title: "Analyse terminée ! ✨",
        description: "Tes conseils personnalisés sont prêts"
      });

    } catch (error) {
      console.error('Error analyzing photo:', error);
      toast({
        title: "Erreur d'analyse",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setAnalysisResult(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className={`${className} btn-touch`}>
          <Camera size={18} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{currentTitle}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-coton-rose" size={20} />
            {currentTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {currentDescription}
          </p>

          {!selectedImage && !showCamera && (
            <div className="space-y-3">
              <Button 
                onClick={startCamera} 
                variant="outline" 
                className="w-full"
              >
                <Camera size={20} />
                Prendre une photo
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                className="w-full"
              >
                <Upload size={20} />
                Choisir depuis la galerie
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {showCamera && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera size={20} />
                  Capturer
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {selectedImage && previewUrl && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Photo sélectionnée"
                  className="w-full rounded-lg max-h-64 object-cover"
                />
              </div>
              
              {!analysisResult && (
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzePhoto} 
                    disabled={isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Sparkles size={20} />
                    )}
                    {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
                  </Button>
                  <Button onClick={resetAnalysis} variant="outline">
                    Reprendre
                  </Button>
                </div>
              )}
            </div>
          )}

          {analysisResult && (
            <CotonCard className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-600" size={20} />
                <h4 className="font-poppins font-semibold">Résultats de l'analyse</h4>
              </div>
              
              {analysisType === 'hair_profile' && analysisResult.hairTypeDetected && (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Type détecté:</strong> {analysisResult.hairTypeDetected}</p>
                  <p className="text-sm"><strong>Porosité:</strong> {analysisResult.porosityEstimate}</p>
                  <p className="text-sm"><strong>État général:</strong> {analysisResult.overallCondition}</p>
                </div>
              )}

              {analysisType === 'wash_day' && analysisResult.washDayAssessment && (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Propreté:</strong> {analysisResult.washDayAssessment.cleanliness}</p>
                  <p className="text-sm"><strong>Hydratation:</strong> {analysisResult.washDayAssessment.hydration}</p>
                  <p className="text-sm"><strong>Définition:</strong> {analysisResult.washDayAssessment.definition}</p>
                </div>
              )}

              {analysisType === 'growth_tracking' && analysisResult.growthAssessment && (
                <div className="space-y-2">
                  <p className="text-sm"><strong>Santé générale:</strong> {analysisResult.growthAssessment.overallHealth}</p>
                  <p className="text-sm"><strong>Rétention:</strong> {analysisResult.growthAssessment.lengthRetention}</p>
                  <p className="text-sm"><strong>Casse:</strong> {analysisResult.growthAssessment.breakage}</p>
                </div>
              )}

              {analysisResult.observations && (
                <div className="mt-3">
                  <h5 className="font-medium text-sm mb-2">Observations:</h5>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {analysisResult.observations.map((obs: string, index: number) => (
                      <li key={index}>• {obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button onClick={resetAnalysis} variant="outline" size="sm">
                  Nouvelle analyse
                </Button>
                <Button onClick={() => setIsOpen(false)} size="sm">
                  Fermer
                </Button>
              </div>
            </CotonCard>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}