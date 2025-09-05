# Guide de Migration Coton Noir vers FlutterFlow

## 📱 Vue d'ensemble de l'Application

**Coton Noir Hair Journal** est une application mobile dédiée aux soins capillaires pour cheveux afro et texturés. Elle combine journal capillaire, suivi de croissance, gamification et conseils IA.

---

## 🎯 Fonctionnalités Principales

### 1. **Système d'Authentification**
- **Type**: Supabase Auth
- **Méthodes**: Email/mot de passe
- **Navigation**: Redirection automatique basée sur l'état d'authentification
- **Stockage**: Session persistante avec localStorage

### 2. **Journal Capillaire**
- **Types d'entrées**: Soins et routines
- **Validation anti-triche**: Limites quotidiennes, cooldown, validation temporelle
- **Données stockées**: Titre, note, date, timestamp, type
- **Interface**: Formulaires modaux avec validation temps réel

### 3. **Profil Capillaire Personnalisé**
- **Types de cheveux**: 3C, 4A, 4B, 4C, Locks, Transition
- **Porosité**: Faible, moyenne, élevée
- **Objectifs**: Pousse, souplesse, santé, décoloration, protection, routine protective
- **Problèmes**: Sécheresse, casse, frisottis, démêlage, cuir chevelu, chute
- **Système de recommandations**: IA + algorithme local de fallback

### 4. **Système de Gamification**
- **CotonCoins**: Monnaie virtuelle (gagnée par actions)
- **Niveaux**: Bronze → Argent → Or → Platine → Diamant
- **Badges**: 5 catégories (routine, wash, growth, streak, premium)
- **Streaks**: Suivi de régularité avec système anti-triche
- **Défis quotidiens**: 2 défis générés automatiquement chaque jour

### 5. **Suivi de Croissance**
- **Mesures**: Front, côtés gauche/droit, arrière (en cm)
- **Objectifs**: Longueur cible + date cible
- **Photos**: Optionnelles avec analyse IA
- **Graphiques**: Progression temporelle

### 6. **Wash Day Tracker**
- **Types**: Wash, co-wash, clarifying, deep-clean
- **Données**: Produits utilisés, condition capillaire, notes
- **Planification**: Fréquence automatique + rappels
- **Intégration**: Synchronisation avec le journal principal

### 7. **IA Intégrée (OpenAI)**
- **Analyse photos**: GPT-4o Vision (3 types d'analyse)
- **Routines personnalisées**: GPT-5 avec profil détaillé
- **Conseils temps réel**: Basés sur le contexte et profil
- **Fallback local**: Algorithme intelligent si API indisponible

---

## 🏗️ Architecture Technique

### **Frontend (React/TypeScript)**
```
src/
├── components/
│   ├── screens/        # 25 écrans principaux
│   ├── ui/            # 40+ composants UI (shadcn)
│   └── common/        # Header, navigation
├── contexts/          # State management global
├── hooks/            # Logique métier partagée
├── pages/            # Routing principal (Auth, Index, NotFound)
└── integrations/     # Client Supabase
```

### **Backend (Supabase)**
```
supabase/
├── functions/
│   ├── analyze-hair-photo/        # IA analyse photos
│   ├── generate-personalized-routine/ # IA routines
│   ├── generate-hair-tips/        # Conseils contextuels
│   └── generate-realtime-tips/    # Tips temps réel
└── config.toml                    # Configuration
```

### **État Global (Context API)**
- **AppContext**: État principal de l'application (1000+ lignes)
- **LanguageContext**: Internationalisation (FR/EN)
- **AuthContext**: Gestion authentification Supabase

---

## 📊 Modèles de Données

### **JournalEntry**
```typescript
{
  id: string;
  type: 'soin' | 'routine';
  title: string;
  date: string;
  note: string;
  timestamp: number; // Anti-cheat
}
```

### **HairProfile**
```typescript
{
  hairType: '3C' | '4A' | '4B' | '4C' | 'LOCKS' | 'transition';
  porosity: 'faible' | 'moyenne' | 'élevée';
  objective: 'pousse' | 'souplesse' | 'sante' | 'decoloration' | 'protection' | 'routine_protective';
  problems: string[]; // 6 types principaux
  needs: string[];
  isCompleted: boolean;
}
```

### **WashDayEntry**
```typescript
{
  id: string;
  date: string;
  type: 'wash' | 'co-wash' | 'clarifying' | 'deep-clean';
  products: string[];
  hairCondition: 'excellent' | 'good' | 'normal' | 'dry' | 'damaged';
  notes: string;
  nextWashDate?: string;
  timestamp: number;
}
```

### **HairMeasurement**
```typescript
{
  id: string;
  date: string;
  front: number;    // cm
  leftSide: number;  // cm
  rightSide: number; // cm
  back: number;     // cm
  photo?: string;
  notes?: string;
  timestamp: number;
}
```

### **Badge**
```typescript
{
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string;
  category: 'routine' | 'wash' | 'growth' | 'streak' | 'premium';
}
```

---

## 🎨 Design System

### **Palette de Couleurs Coton Noir**
```css
/* Couleurs principales */
--coton-black: 60 9% 11%;      /* #1d1d1b */
--coton-beige: 35 73% 87%;     /* #fbe0c0 */
--coton-rose: 351 45% 85%;     /* #e8c1c3 */
--coton-coral: 356 82% 66%;    /* #ef636a - CTA */
--coton-green: 156 39% 61%;    /* #79b7a1 */

/* Gradients */
--gradient-rose: linear-gradient(135deg, rose, rose-alt);
--gradient-hero: linear-gradient(135deg, black, nude);
--gradient-coral: linear-gradient(135deg, coral, rose-alt);
```

### **Typography**
- **Headings**: Poppins (300-700)
- **Body**: Roboto (300-500)
- **Mobile-first**: Responsive avec CSS variables

### **Composants UI (Shadcn/Radix)**
- 40+ composants personnalisés
- Système de variants complet
- Support dark/light mode
- Mobile-first responsive

---

## 🔄 Flux Utilisateur Principaux

### **1. Onboarding Flow**
```
SplashScreen → LanguageSelection → Welcome → 
EnhancedOnboarding → ProfileOnboarding → Home
```

### **2. Authentication Flow**
```
Auth Page (Login/Signup) → 
Forgot Password (si nécessaire) → 
Redirect vers Index → CotonNoirApp
```

### **3. Navigation Principale**
```
Home ←→ Journal ←→ Box ←→ Tutorials ←→ Profile
     ↓
Sous-écrans (25+ écrans spécialisés)
```

### **4. Routine Generation Flow**
```
ProfileOnboarding → HairProfileScreen → 
AI Analysis → Personalized Routine → 
DetailedRoutineScreen → RoutineFeedback
```

---

## 🤖 Intégrations IA (Edge Functions)

### **1. Analyse Photos (`analyze-hair-photo`)**
- **Modèle**: GPT-4o Vision
- **Types d'analyse**: 
  - Hair profile (type, porosité, condition)
  - Wash day assessment (propreté, hydratation, définition)
  - Growth tracking (santé, mesures estimées)
- **Format**: JSON structuré avec recommandations

### **2. Routines Personnalisées (`generate-personalized-routine`)**
- **Modèle**: GPT-5-2025-08-07
- **Input**: Profil capillaire complet
- **Output**: 4-6 étapes + conseils prioritaires + tip
- **Fallback**: Algorithme local intelligent (300+ lignes)

### **3. Conseils Temps Réel (`generate-hair-tips`, `generate-realtime-tips`)**
- **Contexte**: Page actuelle + profil utilisateur
- **Types**: Routine, wash day, growth, general
- **Personnalisation**: Basée sur historique et besoins

---

## 📱 Écrans Principaux (25 screens)

### **Core Screens**
1. **HomeScreen** - Dashboard principal avec stats, défis, routine IA
2. **JournalScreen** - Historique complet + résumé profil
3. **ProfileScreen** - Gestion compte + paramètres
4. **BoxScreen** - Système de récompenses
5. **TutorialsScreen** - Vidéos YouTube intégrées

### **Onboarding & Auth**
6. **SplashInitScreen** - Écran de démarrage
7. **WelcomeScreen** - Introduction app
8. **LanguageSelectionScreen** - Choix langue
9. **EnhancedOnboardingScreen** - Onboarding principal
10. **ProfileOnboardingScreen** - Profil capillaire
11. **LoginScreen** - Connexion
12. **SignupScreen** - Inscription
13. **ForgotPasswordScreen** - Reset mot de passe

### **Hair Care Features**
14. **HairProfileScreen** - Profil capillaire détaillé
15. **AddCareScreen** - Ajouter soins/routines
16. **WashDayTrackerScreen** - Suivi wash days
17. **GrowthTrackerScreen** - Mesures + objectifs
18. **DetailedRoutineScreen** - Routines IA détaillées
19. **RoutineFeedbackScreen** - Évaluation routines

### **Community & Rewards**
20. **CommunityScreen** - Fonctionnalités sociales
21. **RewardsScreen** - Système de récompenses
22. **PartnersScreen** - Partenaires et offres
23. **FullJournalScreen** - Journal étendu
24. **BoxContentScreen** - Contenu box rewards

---

## 🔧 Fonctionnalités Avancées

### **Anti-Cheat System**
- Validation temporelle des entrées
- Limites quotidiennes par type
- Cooldown entre entrées identiques
- Timestamp obligatoire sur toutes les actions

### **Système de Streaks**
- Calcul automatique basé sur activité quotidienne
- Récupération après pause
- Badges de régularité
- Motivation gamifiée

### **Offline Support**
- LocalStorage pour persistance
- Synchronisation Supabase
- Fallback algorithms pour IA
- État hybride online/offline

### **Responsive Design**
- Mobile-first approach
- Breakpoints: xs(480) → sm(640) → md(768) → lg(1024) → xl(1280)
- Touch-friendly (min 44px buttons)
- Système de spacing responsive

---

## 📋 Migration Checklist pour FlutterFlow

### **✅ Directement Transférable**
- [ ] Base de données Supabase (compatible natif)
- [ ] Authentification Supabase
- [ ] Edge Functions (réutilisables)
- [ ] Assets et images
- [ ] Palette de couleurs
- [ ] Structure des données
- [ ] Logique métier (à adapter en Dart)

### **🔄 À Reconstruire**
- [ ] Interface utilisateur (React → Flutter widgets)
- [ ] Navigation (React Router → Flutter routing)
- [ ] État global (Context → Provider/Bloc/Riverpod)
- [ ] Animations (Framer Motion → Flutter animations)
- [ ] Composants UI (Shadcn → Flutter widgets)

### **⚙️ Configuration FlutterFlow**
- [ ] Intégration Supabase native
- [ ] Configuration authentification
- [ ] Variables d'environnement (API keys)
- [ ] Routing et navigation
- [ ] Thème et design system
- [ ] Actions personnalisées (fonctions Dart)

---

## 🚀 Prochaines Étapes Recommandées

### **Phase 1: Préparation**
1. Documenter tous les flux utilisateur
2. Exporter le schéma de base Supabase
3. Tester les Edge Functions en isolation
4. Inventorier tous les assets

### **Phase 2: Setup FlutterFlow**
1. Créer projet FlutterFlow
2. Connecter Supabase
3. Configurer authentification
4. Importer design system

### **Phase 3: Reconstruction**
1. Écrans d'onboarding
2. Authentification
3. Navigation principale
4. Fonctionnalités core
5. Intégrations IA

### **Phase 4: Test & Optimisation**
1. Tests utilisateur
2. Performance mobile
3. Synchronisation données
4. Publication stores

---

## 📞 Points de Contact Technique

**Questions fréquentes pour la migration:**

1. **État local vs Cloud**: Comment gérer la synchronisation?
2. **Edge Functions**: Adaptation des calls API en Dart
3. **Design System**: Translation des CSS variables
4. **Navigation**: Adaptation du système de routing complexe
5. **Gamification**: Recréation du système de badges/coins
6. **IA Integration**: Gestion des fallbacks locaux

**Ressources utiles:**
- Supabase FlutterFlow: [Documentation officielle](https://docs.flutterflow.io/integrations/supabase/)
- OpenAI Flutter: [Packages disponibles](https://pub.dev/packages?q=openai)
- State Management: [Provider vs Riverpod vs Bloc](https://docs.flutter.dev/development/data-and-backend/state-mgmt)

---

*Ce guide couvre 95% de la structure actuelle. Pour des détails spécifiques, consulter le code source ou demander des clarifications sur des fonctionnalités particulières.*