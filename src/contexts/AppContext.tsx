import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  type: 'soin' | 'routine';
  title: string;
  date: string;
  note: string;
  timestamp: number; // For anti-cheat validation
}

export interface Redeem {
  partnerId: string;
  code: string;
  date: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  perks: string[];
}

export interface Challenge {
  joined: boolean;
  days: number;
}

export interface HairProfile {
  hairType: 'crepu' | 'boucle' | 'locks' | 'transition' | null;
  needs: string[];
  objectives: string[];
  isCompleted: boolean;
}

export interface DetailedHairProfile {
  hairType: string;
  porosity: string;
  objective: string;
  problems: string[];
  needs: string[];
  isCompleted: boolean;
}

export interface HairMeasurement {
  id: string;
  date: string;
  front: number; // en cm
  leftSide: number; // côté gauche
  rightSide: number; // côté droit
  back: number; // derrière
  photo?: string; // optionnel pour MVP
  notes?: string;
  timestamp: number;
}

export interface GrowthGoal {
  targetLength: number; // en cm
  targetDate: string;
  isActive: boolean;
}

export interface WashDayEntry {
  id: string;
  date: string;
  type: 'wash' | 'co-wash' | 'clarifying' | 'deep-clean';
  products: string[];
  hairCondition: 'excellent' | 'good' | 'normal' | 'dry' | 'damaged';
  notes: string;
  nextWashDate?: string;
  timestamp: number;
}

export interface WashDaySettings {
  frequency: number; // en jours
  preferredDay: string; // 'monday', 'tuesday', etc.
  reminderEnabled: boolean;
  autoSchedule: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string;
  category: 'routine' | 'wash' | 'growth' | 'streak' | 'premium';
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'journal' | 'wash' | 'measurement' | 'routine-feedback';
}

export interface RoutineFeedback {
  id: string;
  date: string;
  routineType: 'express' | 'complete';
  rating: 1 | 2 | 3 | 4 | 5;
  timeSpent: number; // en minutes
  notes?: string;
}

export interface PremiumWaitlist {
  isOnWaitlist: boolean;
  joinedAt?: string;
  position?: number;
  totalWaitlist: number;
}

interface AppState {
  coins: number;
  premium: boolean;
  boxUnlocked: boolean;
  darkMode: boolean;
  challenge: Challenge;
  hairProfile: HairProfile;
  detailedHairProfile: DetailedHairProfile;
  journalEntries: JournalEntry[];
  redeems: Redeem[];
  plans: Plan[];
  level: 'Bronze' | 'Argent' | 'Or' | 'Platine' | 'Diamant';
  streak: number;
  lastActiveDate: string;
  profileCompletionBonus: boolean;
  hairMeasurements: HairMeasurement[];
  growthGoal: GrowthGoal | null;
  washDayEntries: WashDayEntry[];
  washDaySettings: WashDaySettings;
  badges: Badge[];
  dailyChallenges: DailyChallenge[];
  routineFeedback: RoutineFeedback[];
  premiumWaitlist: PremiumWaitlist;
  lastCoinAnimation: number;
  streakData: {
    current: number;
    best: number;
    lastActiveDate: string;
  };
}

type AppAction = 
  | { type: 'ADD_COINS'; amount: number }
  | { type: 'SPEND_COINS'; amount: number }
  | { type: 'SET_PREMIUM'; premium: boolean }
  | { type: 'SET_BOX_UNLOCKED'; unlocked: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'JOIN_CHALLENGE' }
  | { type: 'UPDATE_CHALLENGE_PROGRESS' }
  | { type: 'UPDATE_HAIR_PROFILE'; profile: Partial<HairProfile> }
  | { type: 'UPDATE_DETAILED_HAIR_PROFILE'; profile: Partial<DetailedHairProfile> }
  | { type: 'ADD_JOURNAL_ENTRY'; entry: JournalEntry }
  | { type: 'VALIDATE_AND_ADD_ENTRY'; entry: Omit<JournalEntry, 'timestamp'> }
  | { type: 'ADD_REDEEM'; redeem: Redeem }
  | { type: 'AWARD_PROFILE_BONUS' }
  | { type: 'ADD_MEASUREMENT'; measurement: HairMeasurement }
  | { type: 'SET_GROWTH_GOAL'; goal: GrowthGoal }
  | { type: 'ADD_WASH_DAY_ENTRY'; entry: WashDayEntry }
  | { type: 'UPDATE_WASH_DAY_SETTINGS'; settings: Partial<WashDaySettings> }
  | { type: 'ADD_BADGE'; badge: Badge }
  | { type: 'COMPLETE_DAILY_CHALLENGE'; challengeId: string }
  | { type: 'ADD_ROUTINE_FEEDBACK'; feedback: RoutineFeedback }
  | { type: 'JOIN_PREMIUM_WAITLIST' }
  | { type: 'TRIGGER_COIN_ANIMATION' }
  | { type: 'UPDATE_STREAK_NEW'; increment?: boolean }
  | { type: 'GENERATE_DAILY_CHALLENGES' }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

const initialState: AppState = {
  coins: 0, // Start at 0, bonus awarded when profile completed
  premium: false,
  boxUnlocked: false,
  darkMode: false,
  challenge: { joined: false, days: 0 },
  hairProfile: {
    hairType: null,
    needs: [],
    objectives: [],
    isCompleted: false
  },
  detailedHairProfile: {
    hairType: '',
    porosity: '',
    objective: '',
    problems: [],
    needs: [],
    isCompleted: false
  },
  journalEntries: [],
  redeems: [],
  plans: [
    {
      id: 'basic',
      name: 'Premium Basic',
      price: '3,99€/mois',
      perks: ['CC ×2', 'Box illimitée', '-15% partenaires']
    },
    {
      id: 'plus',
      name: 'Premium Plus',
      price: '7,99€/mois',
      perks: ['CC ×2', 'Box illimitée', '-20% partenaires', 'Tutos exclusifs']
    }
  ],
  level: 'Bronze',
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  profileCompletionBonus: false,
  hairMeasurements: [],
  growthGoal: null,
  washDayEntries: [],
  washDaySettings: {
    frequency: 7, // Par défaut 1x/semaine
    preferredDay: 'sunday',
    reminderEnabled: true,
    autoSchedule: true
  },
  badges: [],
  dailyChallenges: [],
  routineFeedback: [],
  premiumWaitlist: {
    isOnWaitlist: false,
    totalWaitlist: 1247 // Nombre fictif pour créer du FOMO
  },
  lastCoinAnimation: 0,
  streakData: {
    current: 0,
    best: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_COINS':
      const newCoins = state.coins + action.amount;
      // Calculate new level based on coins using the fun levels
      let newLevel = state.level;
      if (newCoins >= 30001) newLevel = 'Diamant'; // Afrolicious Icon equivalent
      else if (newCoins >= 20001) newLevel = 'Platine'; // Wash Day Goddess equivalent  
      else if (newCoins >= 15001) newLevel = 'Or'; // Twist & Shine equivalent
      else if (newCoins >= 10001) newLevel = 'Argent'; // Kinky Diva equivalent
      else if (newCoins >= 500) newLevel = 'Bronze'; // Starting from Baby Hair
      
      return { ...state, coins: newCoins, level: newLevel };
    case 'SPEND_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.amount) };
    case 'SET_PREMIUM':
      return { ...state, premium: action.premium };
    case 'SET_BOX_UNLOCKED':
      return { ...state, boxUnlocked: action.unlocked };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'JOIN_CHALLENGE':
      return { ...state, challenge: { ...state.challenge, joined: true } };
    case 'UPDATE_CHALLENGE_PROGRESS':
      const newDays = Math.min(30, state.challenge.days + 1);
      return { ...state, challenge: { ...state.challenge, days: newDays } };
    case 'UPDATE_HAIR_PROFILE':
      const updatedProfile = { ...state.hairProfile, ...action.profile };
      // Award profile completion bonus if profile is completed for the first time
      let profileBonusCoins = 0;
      if (updatedProfile.isCompleted && !state.profileCompletionBonus) {
        profileBonusCoins = 100; // Welcome bonus
      }
      return { 
        ...state, 
        hairProfile: updatedProfile,
        coins: state.coins + profileBonusCoins,
        profileCompletionBonus: updatedProfile.isCompleted ? true : state.profileCompletionBonus
      };
    case 'UPDATE_DETAILED_HAIR_PROFILE':
      return { ...state, detailedHairProfile: { ...state.detailedHairProfile, ...action.profile } };
    case 'VALIDATE_AND_ADD_ENTRY':
      const now = Date.now();
      const entryTodayStr = new Date().toISOString().split('T')[0];
      const entryDate = new Date(action.entry.date);
      const currentDate = new Date(entryTodayStr);
      
      // Anti-cheat validations
      // 1. No future dates
      if (entryDate > currentDate) {
        throw new Error('Les dates futures ne sont pas autorisées');
      }
      
      // 2. Daily limits: max 3 entries per type per day
      const todayEntries = state.journalEntries.filter(entry => 
        entry.date === action.entry.date && entry.type === action.entry.type
      );
      if (todayEntries.length >= 3) {
        throw new Error(`Maximum 3 ${action.entry.type}s par jour atteint`);
      }
      
      // 3. Cooldown: minimum 30 minutes between entries
      const recentEntries = state.journalEntries.filter(entry => 
        now - entry.timestamp < 30 * 60 * 1000 // 30 minutes
      );
      if (recentEntries.length > 0) {
        throw new Error('Attendez 30 minutes entre chaque ajout');
      }
      
      // 4. Basic validation: no empty titles or suspicious patterns
      if (action.entry.title.trim().length < 3) {
        throw new Error('Le titre doit contenir au moins 3 caractères');
      }
      
      // If all validations pass, add the entry with timestamp
      const validatedEntry: JournalEntry = {
        ...action.entry,
        timestamp: now
      };
      
      return { ...state, journalEntries: [validatedEntry, ...state.journalEntries] };
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [action.entry, ...state.journalEntries] };
    case 'ADD_REDEEM':
      return { ...state, redeems: [action.redeem, ...state.redeems] };
    case 'AWARD_PROFILE_BONUS':
      return { ...state, coins: state.coins + 100, profileCompletionBonus: true };
    case 'ADD_MEASUREMENT':
      return { ...state, hairMeasurements: [action.measurement, ...state.hairMeasurements] };
    case 'SET_GROWTH_GOAL':
      return { ...state, growthGoal: action.goal };
    case 'ADD_WASH_DAY_ENTRY':
      return { ...state, washDayEntries: [action.entry, ...state.washDayEntries] };
    case 'UPDATE_WASH_DAY_SETTINGS':
      return { ...state, washDaySettings: { ...state.washDaySettings, ...action.settings } };
    case 'ADD_BADGE':
      const existingBadge = state.badges.find(b => b.id === action.badge.id);
      if (existingBadge) return state;
      return { ...state, badges: [action.badge, ...state.badges] };
    case 'COMPLETE_DAILY_CHALLENGE':
      const updatedChallenges = state.dailyChallenges.map(challenge =>
        challenge.id === action.challengeId 
          ? { ...challenge, completed: true }
          : challenge
      );
      const completedChallenge = state.dailyChallenges.find(c => c.id === action.challengeId);
      const challengeBonusCoins = completedChallenge ? completedChallenge.reward : 0;
      return { 
        ...state, 
        dailyChallenges: updatedChallenges,
        coins: state.coins + challengeBonusCoins
      };
    case 'ADD_ROUTINE_FEEDBACK':
      return { ...state, routineFeedback: [action.feedback, ...state.routineFeedback] };
    case 'JOIN_PREMIUM_WAITLIST':
      if (state.premiumWaitlist.isOnWaitlist) return state;
      return {
        ...state,
        premiumWaitlist: {
          ...state.premiumWaitlist,
          isOnWaitlist: true,
          joinedAt: new Date().toISOString(),
          position: state.premiumWaitlist.totalWaitlist + 1,
          totalWaitlist: state.premiumWaitlist.totalWaitlist + 1
        }
      };
    case 'TRIGGER_COIN_ANIMATION':
      return { ...state, lastCoinAnimation: Date.now() };
    case 'UPDATE_STREAK_NEW':
      const streakToday = new Date().toISOString().split('T')[0];
      // Provide fallback for streakData if undefined (for backward compatibility)
      const currentStreakData = state.streakData || {
        current: 0,
        best: 0,
        lastActiveDate: streakToday
      };
      const streakLastActive = new Date(currentStreakData.lastActiveDate);
      const streakTodayDate = new Date(streakToday);
      const streakDiffTime = streakTodayDate.getTime() - streakLastActive.getTime();
      const streakDiffDays = Math.ceil(streakDiffTime / (1000 * 60 * 60 * 24));
      
      let updatedStreak = currentStreakData.current;
      let updatedBest = currentStreakData.best;
      
      if (action.increment) {
        if (streakDiffDays === 1) {
          updatedStreak = currentStreakData.current + 1;
        } else if (streakDiffDays > 1) {
          updatedStreak = 1;
        }
        
        if (updatedStreak > updatedBest) {
          updatedBest = updatedStreak;
        }
      }
      
      return {
        ...state,
        streakData: {
          current: updatedStreak,
          best: updatedBest,
          lastActiveDate: streakToday
        }
      };
    case 'GENERATE_DAILY_CHALLENGES':
      const challengesTodayStr = new Date().toISOString().split('T')[0];
      const existingTodayChallenges = state.dailyChallenges.filter(c => c.date === challengesTodayStr);
      
      if (existingTodayChallenges.length > 0) return state;
      
      const challengeTemplates = [
        {
          type: 'journal' as const,
          title: 'Soin du jour',
          description: 'Ajoute un soin à ton journal avec une note détaillée',
          reward: 15
        },
        {
          type: 'wash' as const,
          title: 'Wash day parfait',
          description: 'Enregistre ton wash day avec les produits utilisés',
          reward: 25
        },
        {
          type: 'measurement' as const,
          title: 'Suivi de pousse',
          description: 'Prends tes mesures pour suivre ta progression',
          reward: 20
        },
        {
          type: 'routine-feedback' as const,
          title: 'Feedback routine',
          description: 'Donne ton avis sur ta dernière routine avec des étoiles',
          reward: 10
        }
      ];
      
      const selectedChallenges = challengeTemplates
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((template, index) => ({
          id: `${challengesTodayStr}-${index}`,
          date: challengesTodayStr,
          title: template.title,
          description: template.description,
          reward: template.reward,
          completed: false,
          type: template.type
        }));
      
      return { 
        ...state, 
        dailyChallenges: [...selectedChallenges, ...state.dailyChallenges]
      };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('coton-noir-state');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
    
    // Update streak on app open and generate challenges
    dispatch({ type: 'UPDATE_STREAK_NEW' });
    dispatch({ type: 'GENERATE_DAILY_CHALLENGES' });
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('coton-noir-state', JSON.stringify(state));
  }, [state]);

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}