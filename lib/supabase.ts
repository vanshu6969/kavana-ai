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
  SESSIONS: 'kavana_user_sessions_v4',
};

// Initial default sessions (empty until user actually starts a chat)
export const DEFAULT_INITIAL_SESSIONS: UserSession[] = [];

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
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveUserSessionsLocal(sessions: UserSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {}
}
