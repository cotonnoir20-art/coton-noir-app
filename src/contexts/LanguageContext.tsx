import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// French translations
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.journal': 'Journal',
    'nav.box': 'Box',
    'nav.tutorials': 'Tutoriels',
    'nav.profile': 'Profil',
    
    // Common
    'common.welcome': 'Bienvenue',
    'common.continue': 'Continuer',
    'common.back': 'Retour',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.confirm': 'Confirmer',
    'common.loading': 'Chargement...',
    
    // Header
    'header.appName': 'Coton Noir Hair Journal',
    
    // Profile Screen
    'profile.title': 'Mon Profil',
    'profile.personalInfo': 'Informations personnelles',
    'profile.settings': 'Paramètres',
    'profile.notifications': 'Notifications',
    'profile.notificationsDesc': 'Rappels et actualités',
    'profile.darkMode': 'Mode sombre',
    'profile.darkModeDesc': 'Interface en mode nuit',
    'profile.language': 'Langue',
    'profile.languageDesc': 'Français',
    'profile.inviteFriends': 'Inviter des amies',
    'profile.inviteFriendsDesc': 'Gagnez 50 CotonCoins',
    'profile.support': 'Support & Aide',
    'profile.accountSettings': 'Paramètres du compte',
    'profile.terms': 'Conditions générales',
    'profile.logout': 'Se déconnecter',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.bioPlaceholder': 'Parlez-nous de votre parcours capillaire...',
    'profile.noBio': 'Aucune bio pour le moment',
    'profile.level': 'Niveau',
    
    // Welcome Screen
    'welcome.title': 'Bienvenue dans Coton Noir !',
    'welcome.subtitle': 'Votre compagnon pour un parcours capillaire réussi',
    'welcome.description': 'Nous sommes ravis de vous accueillir dans notre communauté dédiée aux cheveux afro. Préparez-vous à découvrir des routines personnalisées, des conseils d\'experts et bien plus encore !',
    'welcome.getStarted': 'Commencer mon journey capillaire',
    
    // Language Selection Screen
    'language.title': 'Choisir la langue',
    'language.select': 'Sélectionnez votre langue préférée',
    'language.french': 'Français',
    'language.english': 'English',
    
    // Toasts
    'toast.profileUpdated': 'Profil mis à jour',
    'toast.profileUpdatedDesc': 'Vos informations ont été sauvegardées.',
    'toast.coinsEarned': '50 CotonCoins gagnés !',
    'toast.coinsEarnedDesc': 'Merci d\'inviter vos amies sur Coton Noir !',
    'toast.logoutSuccess': 'Déconnexion réussie',
    'toast.logoutSuccessDesc': 'À bientôt sur Coton Noir !',
    'toast.languageChanged': 'Langue modifiée',
    'toast.languageChangedDesc': 'L\'interface a été mise à jour.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.journal': 'Journal',
    'nav.box': 'Box',
    'nav.tutorials': 'Tutorials',
    'nav.profile': 'Profile',
    
    // Common
    'common.welcome': 'Welcome',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    
    // Header
    'header.appName': 'Coton Noir Hair Journal',
    
    // Profile Screen
    'profile.title': 'My Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.settings': 'Settings',
    'profile.notifications': 'Notifications',
    'profile.notificationsDesc': 'Reminders and updates',
    'profile.darkMode': 'Dark Mode',
    'profile.darkModeDesc': 'Night mode interface',
    'profile.language': 'Language',
    'profile.languageDesc': 'English',
    'profile.inviteFriends': 'Invite Friends',
    'profile.inviteFriendsDesc': 'Earn 50 CotonCoins',
    'profile.support': 'Support & Help',
    'profile.accountSettings': 'Account Settings',
    'profile.terms': 'Terms & Conditions',
    'profile.logout': 'Sign Out',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.bioPlaceholder': 'Tell us about your hair journey...',
    'profile.noBio': 'No bio yet',
    'profile.level': 'Level',
    
    // Welcome Screen
    'welcome.title': 'Welcome to Coton Noir!',
    'welcome.subtitle': 'Your companion for a successful hair journey',
    'welcome.description': 'We\'re excited to welcome you to our community dedicated to afro hair. Get ready to discover personalized routines, expert advice and much more!',
    'welcome.getStarted': 'Start my hair journey',
    
    // Language Selection Screen
    'language.title': 'Choose Language',
    'language.select': 'Select your preferred language',
    'language.french': 'Français',
    'language.english': 'English',
    
    // Toasts
    'toast.profileUpdated': 'Profile Updated',
    'toast.profileUpdatedDesc': 'Your information has been saved.',
    'toast.coinsEarned': '50 CotonCoins Earned!',
    'toast.coinsEarnedDesc': 'Thank you for inviting your friends to Coton Noir!',
    'toast.logoutSuccess': 'Successfully Signed Out',
    'toast.logoutSuccessDesc': 'See you soon on Coton Noir!',
    'toast.languageChanged': 'Language Changed',
    'toast.languageChangedDesc': 'Interface has been updated.',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('coton-noir-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('coton-noir-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}