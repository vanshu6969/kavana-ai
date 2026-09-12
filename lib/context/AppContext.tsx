'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUserSessionsLocal,
  saveUserSessionsLocal,
  UserSession,
  MessageItem,
  ContextState,
  DEFAULT_INITIAL_SESSIONS,
} from '@/lib/supabase';
import { KAVANA_STORIES, Story } from '@/lib/stories-data';

interface AppContextType {
  sessions: UserSession[];
  getSessionByStoryId: (storyId: string) => UserSession | undefined;
  appendMessageToSession: (
    storyId: string,
    message: MessageItem,
    updatedContext?: Partial<ContextState>
  ) => void;
  stories: Story[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  audioPlaying: boolean;
  toggleAudio: () => void;
  userName: string;
  userEmail: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [stories] = useState<Story[]>(KAVANA_STORIES);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const userName = 'Protagonist';
  const userEmail = '';

  useEffect(() => {
    const savedSessions = getUserSessionsLocal();
    setSessions(savedSessions);
  }, []);

  const getSessionByStoryId = (storyId: string): UserSession | undefined => {
    return sessions.find((s) => s.storyId === storyId);
  };

  const appendMessageToSession = (
    storyId: string,
    message: MessageItem,
    updatedContext?: Partial<ContextState>
  ) => {
    setSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.storyId === storyId);
      const story = stories.find((st) => st.id === storyId);
      const snippet = message.text.length > 40 ? message.text.slice(0, 38) + '...' : message.text;

      let nextSessions: UserSession[];

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updatedSession: UserSession = {
          ...existing,
          messages: [...existing.messages, message],
          contextState: {
            ...existing.contextState,
            ...(updatedContext || {}),
          },
          lastMessagePreview: snippet,
          timestamp: 'Just now',
        };
        // Move updated session to top
        nextSessions = [
          updatedSession,
          ...prev.filter((_, idx) => idx !== existingIndex),
        ];
      } else {
        // Create new session
        const newSession: UserSession = {
          id: `session-${storyId}-${Date.now()}`,
          userId: 'user-protagonist',
          storyId,
          storyTitle: story?.title || 'Interactive Scenario',
          characterName: story?.characterName || 'Character',
          avatarUrl: story?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          messages: [message],
          contextState: {
            location: story?.sceneContext?.location || 'Hostel Room',
            empireControl: story?.sceneContext?.empireControl || '100%',
            activeNpc: story?.sceneContext?.activeNpc || story?.characterName || 'Anjali',
            mood: story?.sceneContext?.mood || 'Charmed',
            ...(updatedContext || {}),
          },
          lastMessagePreview: snippet,
          timestamp: 'Just now',
        };
        nextSessions = [newSession, ...prev];
      }

      saveUserSessionsLocal(nextSessions);
      return nextSessions;
    });
  };

  const toggleAudio = () => {
    setAudioPlaying((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sessions,
        getSessionByStoryId,
        appendMessageToSession,
        stories,
        activeTab,
        setActiveTab,
        audioPlaying,
        toggleAudio,
        userName,
        userEmail,
      }}
    >
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
