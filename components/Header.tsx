'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Sparkles, Volume2, VolumeX, Search, MessageSquare, BookOpen, ShieldCheck } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { audioPlaying, toggleAudio, userName } = useApp();

  // If in a chat route, hide global header completely so chat has full screen space and its own unified header
  const isChatRoute = pathname.startsWith('/chat/');
  if (isChatRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050608]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-2.5 transition-all block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF2E55] via-red-600 to-rose-400 flex items-center justify-center text-white font-black text-sm shadow-glow-crimson group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl tracking-wider text-white font-sans flex items-center gap-1">
                AuraFlex<span className="text-[#FF2E55]">.ai</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white shadow-glow-crimson'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen size={14} />
              <span>Stories</span>
            </Link>

            <Link
              href="/search"
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
                pathname === '/search'
                  ? 'bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white shadow-glow-crimson'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search size={14} />
              <span>Search Characters</span>
            </Link>

            <Link
              href="/chats"
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
                pathname === '/chats'
                  ? 'bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white shadow-glow-crimson'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare size={14} />
              <span>Active Chats</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Audio Ambience Toggle */}
          <button
            onClick={toggleAudio}
            title={audioPlaying ? 'Mute Ambience' : 'Play Cinematic Ambience'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D0E15] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FF2E55] hover:border-rose-500/40 transition-colors"
          >
            {audioPlaying ? <Volume2 size={15} className="text-[#FF2E55] animate-pulse" /> : <VolumeX size={15} />}
          </button>

          {/* Unlimited Free Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[#FF2E55] text-xs font-bold shadow-sm">
            <Sparkles size={12} className="text-[#FF2E55]" />
            <span className="hidden sm:inline font-bold">100% FREE</span>
            <span className="text-[10px] text-white bg-[#FF2E55] px-1.5 py-0.2 rounded font-black">
              AI CHAT
            </span>
          </div>

          {/* Profile Avatar */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
            title="User Profile"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-rose-500/50 group-hover:border-[#FF2E55] transition-colors flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt={userName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#FF2E55] border-2 border-[#050608]"></span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100 group-hover:text-[#FF2E55] leading-tight transition-colors">
                {userName}
              </span>
              <span className="text-[10px] text-rose-400 font-medium leading-tight flex items-center gap-1">
                <ShieldCheck size={10} /> Free VIP
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
