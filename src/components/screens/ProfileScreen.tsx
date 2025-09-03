import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Bell, 
  HelpCircle, 
  Users, 
  Settings, 
  Globe, 
  FileText, 
  Moon, 
  Sun, 
  Camera,
  LogOut,
  ChevronRight,
  Edit,
  Award,
  Star,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: state.userProfile?.name || 'Utilisatrice',
    email: state.userProfile?.email || 'user@cotonnoir.fr',
    bio: state.userProfile?.bio || '',
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      profile: editedProfile,
    });
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées.",
    });
  };

  const handleInviteFriends = () => {
    dispatch({ type: 'ADD_COINS', amount: 50 });
    toast({
      title: "50 CotonCoins gagnés !",
      description: "Merci d'inviter vos amies sur Coton Noir !",
    });
  };

  const handleLogout = () => {
    // Reset app state and go to onboarding
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('cotonNoirAppState');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur Coton Noir !",
    });
    onNavigate('onboarding');
  };

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const userLevel = Math.floor(state.coins / 100) + 1;
  const progressToNext = (state.coins % 100);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-rose border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-white/20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-coton-black text-white text-xl font-poppins font-semibold">
                    {editedProfile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-soft"
                >
                  <Camera size={14} />
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-center font-poppins font-semibold text-lg"
                  />
                ) : (
                  <h2 className="font-poppins font-semibold text-xl text-coton-black">
                    {editedProfile.name}
                  </h2>
                )}
                
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary" className="bg-white/30 text-coton-black font-medium">
                    <Award size={12} className="mr-1" />
                    Niveau {userLevel}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 bg-white/20 text-coton-black">
                    <Coins size={12} className="mr-1" />
                    {state.coins}
                  </Badge>
                </div>
                
                {/* Progress bar to next level */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-coton-black/70 mb-1">
                    <span>Niveau {userLevel}</span>
                    <span>Niveau {userLevel + 1}</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-coton-black h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-poppins">Informations personnelles</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            >
              <Edit size={16} />
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                />
              ) : (
                <p className="text-muted-foreground">{editedProfile.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de votre parcours capillaire..."
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">
                  {editedProfile.bio || "Aucune bio pour le moment"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Rappels et actualités</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon size={20} className="text-muted-foreground" /> : <Sun size={20} className="text-muted-foreground" />}
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-muted-foreground">Interface en mode nuit</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <Separator />

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium">Langue</p>
                  <p className="text-sm text-muted-foreground">Français</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {/* Invite Friends */}
              <Button
                variant="ghost"
                className="w-full justify-between h-14 px-6 rounded-none"
                onClick={handleInviteFriends}
              >
                <div className="flex items-center space-x-3">
                  <Users size={20} className="text-coton-rose" />
                  <div className="text-left">
                    <p className="font-medium">Inviter des amies</p>
                    <p className="text-sm text-muted-foreground">Gagnez 50 CotonCoins</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>

              <Separator />

              {/* Support */}
              <Button
                variant="ghost"
                className="w-full justify-between h-14 px-6 rounded-none"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle size={20} className="text-muted-foreground" />
                  <span className="font-medium">Support & Aide</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>

              <Separator />

              {/* Account Settings */}
              <Button
                variant="ghost"
                className="w-full justify-between h-14 px-6 rounded-none"
              >
                <div className="flex items-center space-x-3">
                  <Settings size={20} className="text-muted-foreground" />
                  <span className="font-medium">Paramètres du compte</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>

              <Separator />

              {/* CGU */}
              <Button
                variant="ghost"
                className="w-full justify-between h-14 px-6 rounded-none"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-muted-foreground" />
                  <span className="font-medium">Conditions générales</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-destructive/20">
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start h-14 px-6 text-destructive hover:text-destructive hover:bg-destructive/5"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Se déconnecter</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}