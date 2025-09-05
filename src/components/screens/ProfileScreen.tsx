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
  Coins,
  ArrowLeft,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
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
      title: t('toast.profileUpdated'),
      description: t('toast.profileUpdatedDesc'),
    });
  };

  const handleInviteFriends = () => {
    dispatch({ type: 'ADD_COINS', amount: 50 });
    toast({
      title: t('toast.coinsEarned'),
      description: t('toast.coinsEarnedDesc'),
    });
  };

  const handleLogout = () => {
    // Reset app state and redirect to login
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('cotonNoirAppState');
    localStorage.removeItem('hasCompletedProfileOnboarding');
    toast({
      title: t('toast.logoutSuccess'),
      description: t('toast.logoutSuccessDesc'),
    });
    // Redirect to auth page (login)
    window.location.href = '/auth';
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
    <div className="min-h-screen bg-background">
      {/* Header with Back to Home - Mobile-first responsive */}
      <div className="bg-coton-black px-4 py-3 shadow-soft">
        <div className="container-responsive">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="text-white hover:bg-white/10 flex items-center gap-2 btn-touch"
            >
              <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-sm sm:text-base">{t('nav.home')}</span>
            </Button>
            <h1 className="font-poppins font-semibold text-base sm:text-lg text-white">
              {t('profile.title')}
            </h1>
            <div className="w-16 sm:w-20" /> {/* Spacer for centered title */}
          </div>
        </div>
      </div>
      
      <div className="container-responsive pb-24 space-y-[10px]">
        {/* Profile Header - Mobile-first responsive */}
        <Card className="bg-gradient-rose border-0 shadow-card">
          <CardContent className="p-4 sm:p-6 mt-[15px]">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="relative">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-white/20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-coton-black text-white text-lg sm:text-xl font-poppins font-semibold">
                    {editedProfile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-soft btn-touch"
                >
                  <Camera size={12} className="sm:w-[14px] sm:h-[14px]" />
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-center font-poppins font-semibold text-lg sm:text-xl"
                  />
                ) : (
                  <h2 className="font-poppins font-semibold text-lg sm:text-xl text-coton-black">
                    {editedProfile.name}
                  </h2>
                )}
                
                <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/30 text-coton-black font-medium text-xs sm:text-sm">
                    <Award size={10} className="sm:w-3 sm:h-3 mr-1" />
                    {t('profile.level')} {userLevel}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="border-white/30 bg-white/20 text-coton-black cursor-pointer hover:bg-white/30 transition-colors text-xs sm:text-sm btn-touch" 
                    onClick={() => onNavigate('rewards')}
                  >
                    <Coins size={10} className="sm:w-3 sm:h-3 mr-1" />
                    {state.coins}
                  </Badge>
                </div>
                
                {/* Progress bar to next level - Mobile-first responsive */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-coton-black/70 mb-1">
                    <span>{t('profile.level')} {userLevel}</span>
                    <span>{t('profile.level')} {userLevel + 1}</span>
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

        {/* Profile Info - Mobile-first responsive */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="font-poppins text-base sm:text-lg">{t('profile.personalInfo')}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="btn-touch"
            >
              <Edit size={14} className="sm:w-4 sm:h-4" />
              <span className="ml-1 text-xs sm:text-sm">{isEditing ? t('common.save') : t('common.edit')}</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">{t('profile.email')}</Label>
              {isEditing ? (
                <Input
                  id="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">{editedProfile.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm sm:text-base">{t('profile.bio')}</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  placeholder={t('profile.bioPlaceholder')}
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {editedProfile.bio || t('profile.noBio')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings - Mobile-first responsive */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-poppins text-base sm:text-lg">{t('profile.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Bell size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">{t('profile.notifications')}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('profile.notificationsDesc')}</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="flex-shrink-0"
              />
            </div>

            <Separator />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {darkMode ? <Moon size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" /> : <Sun size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">{t('profile.darkMode')}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('profile.darkModeDesc')}</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="flex-shrink-0"
              />
            </div>

            <Separator />

            {/* Language */}
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-3 sm:p-4 btn-touch"
              onClick={() => onNavigate('language-selection')}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Globe size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">{t('profile.language')}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {language === 'fr' ? t('language.french') : t('language.english')}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        {/* Actions - Mobile-first responsive */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {/* Invite Friends */}
              <Button
                variant="ghost"
                className="w-full justify-between h-12 sm:h-14 px-4 sm:px-6 rounded-none btn-touch"
                onClick={handleInviteFriends}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Users size={18} className="sm:w-5 sm:h-5 text-coton-rose flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">{t('profile.inviteFriends')}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('profile.inviteFriendsDesc')}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              </Button>

              <Separator />

              {/* Support */}
              <Button
                variant="ghost"
                className="w-full justify-between h-12 sm:h-14 px-4 sm:px-6 rounded-none btn-touch"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <HelpCircle size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base min-w-0 flex-1 text-left">{t('profile.support')}</span>
                </div>
                <ChevronRight size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              </Button>

              <Separator />

              {/* Account Settings */}
              <Button
                variant="ghost"
                className="w-full justify-between h-12 sm:h-14 px-4 sm:px-6 rounded-none btn-touch"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Settings size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base min-w-0 flex-1 text-left">{t('profile.accountSettings')}</span>
                </div>
                <ChevronRight size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              </Button>

              <Separator />

              {/* CGU */}
              <Button
                variant="ghost"
                className="w-full justify-between h-12 sm:h-14 px-4 sm:px-6 rounded-none btn-touch"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText size={18} className="sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base min-w-0 flex-1 text-left">{t('profile.terms')}</span>
                </div>
                <ChevronRight size={14} className="sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout - Mobile-first responsive */}
        <Card className="border-destructive/20">
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 sm:h-14 px-4 sm:px-6 text-destructive hover:text-destructive hover:bg-destructive/5 btn-touch"
              onClick={handleLogout}
            >
              <LogOut size={18} className="sm:w-5 sm:h-5 mr-3" />
              <span className="font-medium text-sm sm:text-base">{t('profile.logout')}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}