import { createClient } from '@supabase/supabase-js';
import { KAVANA_STORIES, Story } from './stories-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface MessageItem {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  smartReplies?: string[];
  actionNote?: string;
}

export interface ContextState {
  location: string;
  empireControl: string;
  activeNpc: string;
  mood: string;
}

export interface UserSession {
  id: string;
  userId: string;
  storyId: string;
  storyTitle: string;
  characterName: string;
  avatarUrl: string;
  messages: MessageItem[];
  contextState: ContextState;
  lastMessagePreview: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  SESSIONS: 'kavana_user_sessions_v3',
};

// Initial default sessions matching specifications
export const DEFAULT_INITIAL_SESSIONS: UserSession[] = [
  {
    id: 'session-playboy-reborn',
    userId: 'tajinder-singh-001',
    storyId: 'playboy-reborn',
    storyTitle: 'Playboy Reborn',
    characterName: 'Anjali & Empire',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    messages: [
      {
        id: 'm1',
        sender: 'ai',
        text: '*[Subah ki pehli kiran khidki se aati hai aur Anjali bed sheet theek karte hue muskuraati hai]* Good morning sir, aapki coffee table par hai. Aaj college aur board meeting dono schedule hain.',
        timestamp: '8/26/2026',
        smartReplies: [
          'Coffee sip karo aur Anjali ko pass bulao',
          'Empire control dashboard check karo',
          'Meeting postpone karke aaram karo'
        ]
      }
    ],
    contextState: {
      location: 'Hostel Room',
      empireControl: '100%',
      activeNpc: 'Anjali',
      mood: 'Charmed',
    },
    lastMessagePreview: '[Subah ki pehli kiran khidki s...',
    timestamp: '8/26/2026',
  },
  {
    id: 'session-still-yours',
    userId: 'tajinder-singh-001',
    storyId: 'still-yours',
    storyTitle: 'Still Yours',
    characterName: 'Aaliya Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    messages: [
      {
        id: 'm-sy-1',
        sender: 'ai',
        text: '*[Aaliya clenches the wine glass in the VIP lounge, her voice trembling slightly]* Three years, Tajinder. You vanished without a word, and now you walk in wearing a bespoke Italian suit acting like you still own my heart.',
        timestamp: '8/26/2026',
      }
    ],
    contextState: {
      location: 'Skylight Penthouse Bar',
      empireControl: '80%',
      activeNpc: 'Aaliya Kapoor',
      mood: 'Heartbroken Fury',
    },
    lastMessagePreview: '[Aaliya clenches the wine glass...',
    timestamp: '8/26/2026',
  },
  {
    id: 'session-raaz-e-haveli',
    userId: 'tajinder-singh-001',
    storyId: 'raaz-e-haveli',
    storyTitle: 'Raaz-e-Haveli',
    characterName: 'Mehrunnisa',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    messages: [
      {
        id: 'm-rz-1',
        sender: 'ai',
        text: '*[Mehrunnisa haveli ke jharokhe se chaand ko dekhte hue palti hai]* Tajinder... tum yahan iss waqt? Agar kisi ne humein dekh liya toh iss purani deewaron mein qatl ho jaayega.',
        timestamp: '8/25/2026',
      }
    ],
    contextState: {
      location: 'Purani Haveli Terrace',
      empireControl: '65%',
      activeNpc: 'Mehrunnisa Begum',
      mood: 'Fearful & Passionate',
    },
    lastMessagePreview: '[Mehrunnisa haveli ke jharokhe se...',
    timestamp: '8/25/2026',
  },
  {
    id: 'session-spy-x-family',
    userId: 'tajinder-singh-001',
    storyId: 'spy-x-family',
    storyTitle: 'Spy x Family: Secret Mission',
    characterName: 'Yor & Loid',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    messages: [
      {
        id: 'm-spy-1',
        sender: 'ai',
        text: '*[Yor wipes a stiletto discreetly behind her back and smiles warmly]* Welcome home, darling! Dinner is almost ready... hope Anya did her homework today.',
        timestamp: '8/24/2026',
      }
    ],
    contextState: {
      location: 'Ostania Safehouse',
      empireControl: '92%',
      activeNpc: 'Yor Briar',
      mood: 'Loving Assassin',
    },
    lastMessagePreview: '[Yor wipes a stiletto discreetly...',
    timestamp: '8/24/2026',
  }
];

export async function getStoriesFromDb(): Promise<Story[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('stories').select('*');
      if (!error && data && data.length > 0) {
        return data as Story[];
      }
    } catch (err) {
      console.warn('Falling back to built-in stories catalog:', err);
    }
  }
  return KAVANA_STORIES;
}

export function getUserSessionsLocal(): UserSession[] {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_SESSIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEFAULT_INITIAL_SESSIONS));
  } catch {}
  return DEFAULT_INITIAL_SESSIONS;
}

export function saveUserSessionsLocal(sessions: UserSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {}
}
