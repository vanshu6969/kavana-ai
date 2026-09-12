'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import ChatMessage from '@/components/ChatMessage';
import SmartReplyChips from '@/components/SmartReplyChips';
import {
  ArrowLeft,
  Send,
  Mic,
  MoreVertical,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Film,
  Info,
  X,
  MapPin,
  Shield,
  Heart,
  PanelLeft,
  Check,
} from 'lucide-react';
import { MessageItem, getUserSessionsLocal } from '@/lib/supabase';
import { Story, KAVANA_STORIES } from '@/lib/stories-data';

export default function ChatScreen() {
  const params = useParams();
  const router = useRouter();
  const storyId = (params.id as string) || 'playboy-reborn';

  const {
    stories,
    sessions,
    isLoaded,
    getSessionByStoryId,
    appendMessageToSession,
  } = useApp();

  const story: Story =
    stories.find((s) => s.id === storyId) ||
    (() => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('kavana_custom_stories_v1');
          if (saved) {
            const list: Story[] = JSON.parse(saved);
            const found = list.find((item: Story) => item.id === storyId);
            if (found) return found;
          }
        } catch {}
      }
      return stories[1] || KAVANA_STORIES[0];
    })();

  const existingSession = getSessionByStoryId(storyId);

  // Initialize messages directly from saved session if present to avoid wipeout / empty flicker on reload
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [contextState, setContextState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = getUserSessionsLocal();
        const found = local.find((s) => s.storyId === storyId);
        if (found?.contextState) {
          return found.contextState;
        }
      } catch {}
    }
    return {
      location: story?.sceneContext?.location || 'Private Suite',
      empireControl: story?.sceneContext?.empireControl || '100%',
      activeNpc: story?.sceneContext?.activeNpc || story?.characterName || 'Companion',
      mood: story?.sceneContext?.mood || 'Intense',
    };
  });

  const [smartReplies, setSmartReplies] = useState<string[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showMissionBanner, setShowMissionBanner] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Browser Tab Title
  useEffect(() => {
    if (typeof document !== 'undefined' && story) {
      document.title = `${story.title} - AuraFlex AI`;
    }
  }, [story]);

  // Initialize messages from existing session or from the story openingHook
  useEffect(() => {
    if (!isLoaded || !story) return;

    const session = getSessionByStoryId(storyId);

    if (session && session.messages && session.messages.length > 0) {
      setMessages(session.messages);
      if (session.contextState) {
        setContextState(session.contextState);
      }
      const last = session.messages[session.messages.length - 1];
      if (last.sender === 'ai' && last.smartReplies && last.smartReplies.length > 0) {
        setSmartReplies(last.smartReplies);
      } else {
        setSmartReplies(story.smartReplies || []);
      }
    } else {
      const initialAiMsg: MessageItem = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: story.openingHook,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        smartReplies: story.smartReplies,
      };
      setMessages([initialAiMsg]);
      setSmartReplies(story.smartReplies || []);
      appendMessageToSession(story.id, initialAiMsg);
    }
  }, [storyId, story?.id, isLoaded, sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiTyping) return;

    const userMsg: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setSmartReplies([]);
    setIsAiTyping(true);

    appendMessageToSession(story.id, userMsg);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: story.id,
          storyTitle: story.title,
          storySynopsis: story.summary,
          initialHook: story.openingHook,
          characterName: story.characterName,
          systemPersona: story.systemPersona,
          messages: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          contextState,
          language: 'hinglish',
        }),
      });

      const data = await res.json();

      if (data.text) {
        const aiMsg: MessageItem = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          smartReplies: data.smartReplies || [],
        };

        setMessages((prev) => [...prev, aiMsg]);
        if (data.contextState) {
          setContextState(data.contextState);
        }
        if (data.smartReplies && data.smartReplies.length > 0) {
          setSmartReplies(data.smartReplies);
        }

        appendMessageToSession(story.id, aiMsg, data.contextState);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleResetChat = () => {
    const initialAiMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: story.openingHook,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      smartReplies: story.smartReplies,
    };
    setMessages([initialAiMsg]);
    setSmartReplies(story.smartReplies || []);
    setContextState({
      location: story.sceneContext?.location || 'Sindh Haveli',
      empireControl: story.sceneContext?.empireControl || '100%',
      activeNpc: story.sceneContext?.activeNpc || story.characterName || 'Murtasim Khan',
      mood: story.sceneContext?.mood || 'Intense',
    });
    appendMessageToSession(story.id, initialAiMsg);
    setShowMenu(false);
  };

  const handleMicToggle = () => {
    setIsMicActive((prev) => !prev);
    if (!isMicActive) {
      setInputText('*[Looks directly into his eyes, refusing to back down]*');
    }
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex bg-[#050608] text-white overflow-hidden relative">
      {/* 1. OPTIONAL TOGGLEABLE LEFT SIDEBAR: Active Stories Drawer */}
      {showLeftSidebar && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        />
      )}

      <aside
        className={`${
          showLeftSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          showLeftSidebar ? 'fixed inset-y-0 left-0 z-50 w-72 sm:w-80' : 'hidden lg:hidden'
        } flex flex-col border-r border-white/[0.08] bg-[#0D0E15] p-4 flex-shrink-0 transition-transform duration-200 shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
          <h3 className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-2">
            <MessageSquare size={15} className="text-[#FF2E55]" />
            <span>Active Stories</span>
          </h3>
          <button
            onClick={() => setShowLeftSidebar(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white active:scale-95 transition-transform"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
          {sessions.map((sess) => {
            const isCurrent = sess.storyId === storyId;
            return (
              <Link
                key={sess.id}
                href={`/chat/${sess.storyId}`}
                onClick={() => setShowLeftSidebar(false)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-rose-500/15 border-rose-500/80 text-white'
                    : 'bg-[#050608] border-white/[0.08] hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-700 flex-shrink-0">
                  <img src={sess.avatarUrl} alt={sess.storyTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{sess.storyTitle}</h5>
                  <p className="text-[11px] text-slate-400 truncate italic">
                    {sess.lastMessagePreview}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* 2. MAIN CONVERSATION SCREEN */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* UNIFIED STREAMING HEADER */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-[#050608]/95 backdrop-blur-xl z-30 flex-shrink-0">
          {/* Left: Back / Sidebar Toggle + Character Info */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            {/* Back Button */}
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-[#0D0E15] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all flex-shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={17} />
            </Link>

            {/* Sidebar toggle for story switching */}
            <button
              onClick={() => setShowLeftSidebar((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-[#0D0E15] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-[#FF2E55] active:scale-95 transition-all flex-shrink-0"
              title="Toggle Stories Drawer"
            >
              <PanelLeft size={17} />
            </button>

            {/* Story & Character Header Info */}
            <button
              onClick={() => setShowInfoDrawer(true)}
              className="flex items-center gap-2 sm:gap-2.5 text-left group min-w-0 hover:opacity-95 transition-opacity flex-1"
              title="Click to view Story Lore & Intel"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-rose-500/60 group-hover:border-[#FF2E55] transition-colors flex-shrink-0 shadow-sm">
                <img
                  src={story.avatar}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050608]"></span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover:text-[#FF5C7A] transition-colors truncate leading-tight">
                    {story.title}
                  </h3>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-rose-500/15 border border-rose-500/30 text-[#FF5C7A] text-[9px] font-bold">
                    {story.category}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <span className="text-[#FF5C7A] font-bold">{story.characterName}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                  </span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="hidden sm:inline text-rose-300/80 truncate">{contextState.location}</span>
                </p>
              </div>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            {/* Character Lore & Live Status Drawer Toggle */}
            <button
              onClick={() => setShowInfoDrawer((prev) => !prev)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                showInfoDrawer
                  ? 'bg-rose-500/20 border-[#FF2E55] text-[#FF2E55]'
                  : 'bg-[#0D0E15] border-white/[0.08] text-slate-400 hover:text-[#FF2E55]'
              }`}
              title="View Character Lore & Intel"
            >
              <Info size={17} />
            </button>

            {/* Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-[#0D0E15] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all"
                title="Options"
              >
                <MoreVertical size={17} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 w-44 rounded-2xl bg-[#0D0E15] border border-white/[0.08] p-1.5 shadow-2xl z-50 animate-fade-in text-xs">
                  <button
                    onClick={handleResetChat}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors"
                  >
                    <RotateCcw size={14} />
                    <span>Restart Story</span>
                  </button>
                  <Link
                    href="/"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/5 font-semibold transition-colors"
                  >
                    <Film size={14} />
                    <span>Browse Shows</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CHAT MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-12 py-4 space-y-1 w-full max-w-3xl mx-auto">
          {/* Optional compact dismissible scenario goal */}
          {showMissionBanner && (
            <div className="p-3 rounded-xl bg-[#0D0E15]/90 border border-white/[0.08] text-xs text-slate-300 mb-3 flex items-start justify-between gap-2 animate-fade-in">
              <div className="flex-1">
                <span className="text-[#FF2E55] font-bold uppercase text-[10px] block mb-0.5">
                  ✦ Mission Objective:
                </span>
                <p className="text-slate-200">{story.userGoal}</p>
              </div>
              <button
                onClick={() => setShowMissionBanner(false)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              characterAvatar={story.avatar}
              characterName={story.characterName}
            />
          ))}

          {/* Enhanced Neural Typing Indicator */}
          {isAiTyping && (
            <div className="flex items-center gap-3 py-2 pl-1 animate-fade-fast">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-500/50 flex-shrink-0 shadow-sm">
                <img src={story.avatar} alt={story.characterName} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl rounded-tl-xs bg-[#0D0E15] border border-white/[0.08] shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-[11px] font-medium text-slate-400 ml-1">{story.characterName} is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AND SUGGESTIONS DOCK */}
        <footer className="flex-shrink-0 bg-[#050608]/95 backdrop-blur-xl border-t border-white/[0.08] px-2.5 sm:px-6 py-2 sm:py-3 z-20 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          <div className="max-w-3xl mx-auto w-full">
            {/* Compact Smart Reply Chips Carousel */}
            {!isAiTyping && smartReplies.length > 0 && (
              <SmartReplyChips
                replies={smartReplies}
                onSelectReply={(reply) => handleSendMessage(reply)}
                disabled={isAiTyping}
              />
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5 sm:gap-3"
            >
              {/* Text Input Field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${story.characterName}...`}
                  disabled={isAiTyping}
                  className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#0D0E15] border border-white/[0.08] focus:border-[#FF2E55] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/40 transition-all disabled:opacity-50"
                />
              </div>

              {/* Action Asterisks Trigger */}
              <button
                type="button"
                onClick={handleMicToggle}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
                  isMicActive
                    ? 'bg-rose-500/20 border-[#FF2E55] text-[#FF2E55]'
                    : 'bg-[#0D0E15] border-white/[0.08] text-slate-400 hover:text-[#FF2E55]'
                }`}
                title="Insert Action Asterisks"
              >
                <Mic size={18} />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isAiTyping}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white flex items-center justify-center flex-shrink-0 shadow-glow-crimson hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                title="Send Message"
              >
                <Send size={17} className="fill-white ml-0.5" />
              </button>
            </form>
          </div>
        </footer>
      </div>

      {/* 3. TOGGLEABLE RIGHT DRAWER: Character Dossier & Scene Intel */}
      {showInfoDrawer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setShowInfoDrawer(false)}
        />
      )}

      <aside
        className={`${
          showInfoDrawer ? 'translate-x-0' : 'translate-x-full xl:hidden'
        } fixed xl:relative inset-y-0 right-0 z-50 w-80 sm:w-88 flex flex-col border-l border-white/[0.08] bg-[#0D0E15] p-5 flex-shrink-0 overflow-y-auto transition-transform duration-200 shadow-2xl xl:shadow-none`}
      >
        {/* Close Button & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#FF2E55] flex items-center gap-2">
            <Info size={14} />
            <span>Story Intel & Lore</span>
          </h4>
          <button
            onClick={() => setShowInfoDrawer(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Story & Character Profile Card */}
        <div className="flex flex-col items-center text-center py-4 border-b border-white/[0.08]">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-glow-crimson mb-2.5">
            <img src={story.avatar} alt={story.title} className="w-full h-full object-cover" />
          </div>
          <h4 className="text-base font-black text-white">{story.title}</h4>
          <span className="text-xs text-[#FF5C7A] font-bold mt-0.5">
            Speaking with: {story.characterName}
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1">
            Your Role: <strong className="text-slate-200">{story.userRole}</strong>
          </span>
        </div>

        {/* Scene State Tracker */}
        <div className="py-4 space-y-2.5 border-b border-white/[0.08] text-xs">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Status</h5>

          <div className="p-3 rounded-xl bg-[#050608] border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin size={12} className="text-rose-400" /> Location
              </span>
              <span className="text-slate-200 font-semibold">{contextState.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield size={12} className="text-[#FF2E55]" /> Control
              </span>
              <span className="text-[#FF2E55] font-bold">{contextState.empireControl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Heart size={12} className="text-rose-500" /> Dynamic Mood
              </span>
              <span className="text-rose-300 font-semibold">{contextState.mood}</span>
            </div>
          </div>
        </div>

        {/* Premade Story Synopsis */}
        <div className="py-3 border-b border-white/[0.08] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Premade Synopsis</h5>
            <span className="text-[9px] font-bold text-[#FF2E55] bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 rounded">
              Starting Hook
            </span>
          </div>
          <p className="p-3 rounded-xl bg-[#050608] border border-white/[0.08] text-slate-300 leading-relaxed text-[11px]">
            {story.summary}
          </p>
          <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 text-[10px] text-rose-200">
            ✦ <strong>Dynamic Narrative:</strong> The synopsis is just the setup. The story, twists, and outcome depend entirely on what you say and do.
          </div>
        </div>

        {/* Character Persona Lore */}
        <div className="py-3 space-y-1.5 text-xs text-slate-300 flex-1">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Persona Profile</h5>
          <p className="p-3 rounded-xl bg-[#050608] border border-white/[0.08] text-slate-300 leading-relaxed text-[11px]">
            {story.systemPersona}
          </p>

          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {(story.tags || []).map((t: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
