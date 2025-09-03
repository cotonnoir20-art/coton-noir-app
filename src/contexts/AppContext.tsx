import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  type: 'soin' | 'routine';
  title: string;
  date: string;
  note: string;
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
  badges: string[];
  profileCompletionBonus: boolean;
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
  | { type: 'ADD_REDEEM'; redeem: Redeem }
  | { type: 'UPDATE_STREAK' }
  | { type: 'ADD_BADGE'; badge: string }
  | { type: 'AWARD_PROFILE_BONUS' }
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
  badges: [],
  profileCompletionBonus: false
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
      let bonusCoins = 0;
      if (updatedProfile.isCompleted && !state.profileCompletionBonus) {
        bonusCoins = 100; // Welcome bonus
      }
      return { 
        ...state, 
        hairProfile: updatedProfile,
        coins: state.coins + bonusCoins,
        profileCompletionBonus: updatedProfile.isCompleted ? true : state.profileCompletionBonus
      };
    case 'UPDATE_DETAILED_HAIR_PROFILE':
      return { ...state, detailedHairProfile: { ...state.detailedHairProfile, ...action.profile } };
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [action.entry, ...state.journalEntries] };
    case 'ADD_REDEEM':
      return { ...state, redeems: [action.redeem, ...state.redeems] };
    case 'UPDATE_STREAK':
      const today = new Date().toISOString().split('T')[0];
      const lastActive = new Date(state.lastActiveDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastActive.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let newStreak = state.streak;
      let streakBonus = 0;
      
      if (diffDays === 1) {
        // Consecutive day
        newStreak = state.streak + 1;
        if (newStreak === 7) {
          streakBonus = 100; // 7 day streak bonus
        }
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }
      
      return { 
        ...state, 
        streak: newStreak, 
        lastActiveDate: today,
        coins: state.coins + streakBonus
      };
    case 'ADD_BADGE':
      if (!state.badges.includes(action.badge)) {
        return { ...state, badges: [...state.badges, action.badge] };
      }
      return state;
    case 'AWARD_PROFILE_BONUS':
      return { ...state, coins: state.coins + 100, profileCompletionBonus: true };
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
    
    // Update streak on app open
    dispatch({ type: 'UPDATE_STREAK' });
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