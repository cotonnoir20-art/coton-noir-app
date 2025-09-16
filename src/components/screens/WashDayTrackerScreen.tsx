import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Calendar, Droplets, Settings, Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CotonCard } from '@/components/ui/coton-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useApp, WashDayEntry } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { HairAnalyzer } from '@/components/ui/hair-analyzer';
import { format, addDays, isSameDay, isPast, isToday, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface WashDayTrackerScreenProps {
  onBack: () => void;
}

export function WashDayTrackerScreen({ onBack }: WashDayTrackerScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form states
  const [newEntry, setNewEntry] = useState({
    type: 'wash' as const,
    products: '',
    hairCondition: 'normal' as const,
    notes: ''
  });

  const [settings, setSettings] = useState(state.washDaySettings);

  // Calculer la prochaine date de lavage recommandée
  const nextRecommendedWash = useMemo(() => {
    if (state.washDayEntries.length === 0) {
      return new Date(); // Aujourd'hui si pas de lavages précédents
    }

    const lastWash = state.washDayEntries[0];
    return addDays(new Date(lastWash.date), state.washDaySettings.frequency);
  }, [state.washDayEntries, state.washDaySettings.frequency]);

  // Calculer les jours de lavage sur le calendrier
  const washDays = useMemo(() => {
    return state.washDayEntries.map(entry => new Date(entry.date));
  }, [state.washDayEntries]);

  // Fréquence recommandée selon le profil capillaire
  const getRecommendedFrequency = () => {
    const { hairType } = state.detailedHairProfile;
    
    if (hairType === '4C') return { days: 7, text: '1x par semaine' };
    if (hairType === '4B') return { days: 5, text: '2x par semaine' };
    if (hairType === '4A') return { days: 4, text: '2x par semaine' };
    if (hairType === '3C') return { days: 3, text: '2-3x par semaine' };
    return { days: 7, text: '1x par semaine' };
  };

  const recommendedFreq = getRecommendedFrequency();

  // Vérifier si un jour est un jour de lavage
  const isWashDay = (date: Date) => {
    return washDays.some(washDay => isSameDay(date, washDay));
  };

  // Obtenir l'entrée de lavage pour une date donnée
  const getWashEntry = (date: Date) => {
    return state.washDayEntries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const handleAddEntry = () => {
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }

    if (!newEntry.products.trim()) {
      toast({
        title: "Erreur", 
        description: "Veuillez indiquer les produits utilisés",
        variant: "destructive"
      });
      return;
    }

    // Calculer la prochaine date de lavage
    const nextWashDate = addDays(selectedDate, state.washDaySettings.frequency);

    const entry: WashDayEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      type: newEntry.type,
      products: newEntry.products.split(',').map(p => p.trim()),
      hairCondition: newEntry.hairCondition,
      notes: newEntry.notes.trim(),
      nextWashDate: nextWashDate.toISOString().split('T')[0],
      timestamp: Date.now()
    };

    dispatch({ type: 'ADD_WASH_DAY_ENTRY', entry });
    dispatch({ type: 'ADD_COINS', amount: 30 }); // Récompense pour wash day

    toast({
      title: "Wash day enregistré ! ✨ +30 CC",
      description: `Prochaine fois: ${format(nextWashDate, 'dd MMMM', { locale: fr })}`
    });

    // Reset form
    setNewEntry({
      type: 'wash',
      products: '',
      hairCondition: 'normal',
      notes: ''
    });
    setShowAddEntry(false);
  };

  const handleUpdateSettings = () => {
    dispatch({ type: 'UPDATE_WASH_DAY_SETTINGS', settings });
    toast({
      title: "Paramètres mis à jour",
      description: `Fréquence: ${settings.frequency} jours`
    });
    setShowSettings(false);
  };

  const daysSinceLastWash = useMemo(() => {
    if (state.washDayEntries.length === 0) return 0;
    
    const lastWash = new Date(state.washDayEntries[0].date);
    const today = new Date();
    const diffTime = today.getTime() - lastWash.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [state.washDayEntries]);

  const washStatus = useMemo(() => {
    if (daysSinceLastWash === 0) return { text: "Lavés aujourd'hui", color: "text-green-600", bgColor: "bg-green-50" };
    if (daysSinceLastWash <= state.washDaySettings.frequency) return { text: `${daysSinceLastWash}j depuis le dernier lavage`, color: "text-blue-600", bgColor: "bg-blue-50" };
    return { text: "Il est temps de laver !", color: "text-orange-600", bgColor: "bg-orange-50" };
  }, [daysSinceLastWash, state.washDaySettings.frequency]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="font-poppins font-bold text-xl">Wash Day Tracker</h1>
          <div className="ml-auto">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings size={20} />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
        
        {/* Status principal */}
        <div className="text-center space-y-2">
          <div className="text-sm opacity-90">DERNIER LAVAGE</div>
          <div className="font-poppins font-bold text-2xl">
            {state.washDayEntries.length > 0 
              ? `${daysSinceLastWash} jour${daysSinceLastWash > 1 ? 's' : ''}`
              : 'Aucun lavage'
            }
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${washStatus.bgColor} ${washStatus.color} bg-white/20 text-white`}>
            {washStatus.text}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 -mt-4 relative z-10">
        {/* Prochaine recommandation */}
        <CotonCard className="p-4">
          <div className="space-y-4">
            {/* Section principale avec statut */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSameDay(nextRecommendedWash, new Date()) 
                    ? 'bg-orange-100 text-orange-600' 
                    : isPast(nextRecommendedWash) 
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                }`}>
                  {isSameDay(nextRecommendedWash, new Date()) || isPast(nextRecommendedWash) 
                    ? <AlertCircle size={18} className="sm:w-6 sm:h-6" />
                    : <Clock size={18} className="sm:w-6 sm:h-6" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-poppins font-semibold text-sm sm:text-base">
                    {isSameDay(nextRecommendedWash, new Date()) ? "C'est le moment !" : 
                     isPast(nextRecommendedWash) ? "En retard" :
                     "Prochain wash day"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isToday(nextRecommendedWash) ? "Aujourd'hui" : 
                     format(nextRecommendedWash, 'EEEE dd MMMM', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Section des actions - Réorganisée pour mobile */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
                <DialogTrigger asChild>
                  <Button variant="black" size="sm" className="w-full sm:w-auto btn-touch">
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Ajouter un wash day</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
              <HairAnalyzer 
                analysisType="wash_day"
                title="Analyser"
                className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2 btn-touch"
                onAnalysisComplete={(analysis) => {
                  if (analysis.recommendations) {
                    toast({
                      title: "Analyse terminée ✨",
                      description: "Conseils pour améliorer tes prochains wash days disponibles!"
                    });
                  }
                }}
              />
            </div>
          </div>
        </CotonCard>

        {/* Calendrier */}
        <CotonCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-semibold">Calendrier des lavages</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Jour de lavage</span>
            </div>
          </div>
          
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full pointer-events-auto"
            modifiers={{
              washDay: washDays,
              recommended: [nextRecommendedWash]
            }}
            modifiersStyles={{
              washDay: { backgroundColor: '#3B82F6', color: 'white', borderRadius: '50%' },
              recommended: { backgroundColor: '#F59E0B', color: 'white', fontWeight: 'bold' }
            }}
            locale={fr}
          />
        </CotonCard>

        {/* Recommandation selon profil */}
        {state.detailedHairProfile.isCompleted && (
          <CotonCard className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <Droplets className="text-purple-500" size={24} />
              <div>
                <h3 className="font-poppins font-semibold">Recommandation pour tes {state.detailedHairProfile.hairType}</h3>
                <p className="text-sm text-muted-foreground">
                  Fréquence conseillée: {recommendedFreq.text}
                </p>
                {state.washDaySettings.frequency !== recommendedFreq.days && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setSettings(prev => ({ ...prev, frequency: recommendedFreq.days }));
                      dispatch({ type: 'UPDATE_WASH_DAY_SETTINGS', settings: { ...settings, frequency: recommendedFreq.days } });
                      toast({ title: "Fréquence mise à jour", description: `Nouveau planning: ${recommendedFreq.text}` });
                    }}
                  >
                    Appliquer cette recommandation
                  </Button>
                )}
              </div>
            </div>
          </CotonCard>
        )}

        {/* Historique récent */}
        {state.washDayEntries.length > 0 && (
          <CotonCard className="p-4">
            <h3 className="font-poppins font-semibold mb-4">Historique récent</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {state.washDayEntries.slice(0, 5).map((entry) => {
                const conditionColors = {
                  excellent: 'bg-green-100 text-green-700',
                  good: 'bg-blue-100 text-blue-700',
                  normal: 'bg-gray-100 text-gray-700',
                  dry: 'bg-orange-100 text-orange-700',
                  damaged: 'bg-red-100 text-red-700'
                };

                const typeLabels = {
                  wash: 'Shampoing',
                  'co-wash': 'Co-wash',
                  clarifying: 'Clarifiant',
                  'deep-clean': 'Nettoyage profond'
                };

                return (
                  <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-roboto font-medium">
                          {format(new Date(entry.date), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${conditionColors[entry.hairCondition]}`}>
                          {entry.hairCondition}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {typeLabels[entry.type]} • {entry.products.join(', ')}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                );
              })}
              {state.washDayEntries.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  ... et {state.washDayEntries.length - 5} autres lavages
                </p>
              )}
            </div>
          </CotonCard>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <CotonCard className="p-4 text-center">
            <div className="text-2xl font-poppins font-bold text-coton-rose">
              {state.washDayEntries.length}
            </div>
            <div className="text-sm text-muted-foreground">Lavages total</div>
          </CotonCard>
          
          <CotonCard className="p-4 text-center">
            <div className="text-2xl font-poppins font-bold text-blue-600">
              {state.washDaySettings.frequency}j
            </div>
            <div className="text-sm text-muted-foreground">Fréquence actuelle</div>
          </CotonCard>
        </div>

        {/* Dialog pour ajouter une entrée */}
        <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un wash day</DialogTitle>
              <DialogDescription>
                Enregistrez votre routine de lavage quotidienne
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="type">Type de lavage</Label>
                <Select value={newEntry.type} onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wash">Shampoing classique</SelectItem>
                    <SelectItem value="co-wash">Co-wash</SelectItem>
                    <SelectItem value="clarifying">Shampoing clarifiant</SelectItem>
                    <SelectItem value="deep-clean">Nettoyage profond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="products">Produits utilisés</Label>
                <Input
                  id="products"
                  value={newEntry.products}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, products: e.target.value }))}
                  placeholder="Ex: Shampoing hydratant, masque karité..."
                />
              </div>

              <div>
                <Label htmlFor="condition">État des cheveux</Label>
                <Select value={newEntry.hairCondition} onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, hairCondition: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Bon</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="dry">Sec</SelectItem>
                    <SelectItem value="damaged">Abîmé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observations, résultats, changements..."
                />
              </div>

              <Button onClick={handleAddEntry} className="w-full">
                Enregistrer le wash day
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog pour les paramètres */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paramètres du wash day</DialogTitle>
              <DialogDescription>
                Personnalisez votre routine de lavage selon vos besoins
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="frequency">Fréquence (en jours)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="14"
                  value={settings.frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: parseInt(e.target.value) || 7 }))}
                />
              </div>

              <div>
                <Label htmlFor="preferredDay">Jour préféré</Label>
                <Select value={settings.preferredDay} onValueChange={(value) => setSettings(prev => ({ ...prev, preferredDay: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Dimanche</SelectItem>
                    <SelectItem value="monday">Lundi</SelectItem>
                    <SelectItem value="tuesday">Mardi</SelectItem>
                    <SelectItem value="wednesday">Mercredi</SelectItem>
                    <SelectItem value="thursday">Jeudi</SelectItem>
                    <SelectItem value="friday">Vendredi</SelectItem>
                    <SelectItem value="saturday">Samedi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleUpdateSettings} className="w-full">
                Sauvegarder les paramètres
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-20"></div> {/* Padding pour la navigation */}
    </div>
  );
}