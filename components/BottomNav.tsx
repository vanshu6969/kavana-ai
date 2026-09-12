'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Sparkles, Search, MessageSquare, Film, PlusCircle } from 'lucide-react';
import CreateStoryModal from '@/components/CreateStoryModal';

export default function BottomNav() {
  const pathname = usePathname();
  const { sessions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Hide bottom nav inside active chat conversation screen to maximize screen estate
  if (pathname.startsWith('/chat/')) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050608]/95 backdrop-blur-xl border-t border-white/[0.08] pb-safe md:hidden">
        <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-2">
          {/* 1. Stories */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all relative ${
              pathname === '/'
                ? 'text-[#FF2E55] font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Film
              size={20}
              className={`transition-transform duration-200 ${
                pathname === '/'
                  ? 'scale-110 stroke-[2.5] text-[#FF2E55] drop-shadow-[0_0_10px_rgba(255,46,85,0.6)]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] tracking-wide">Stories</span>
            {pathname === '/' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] mt-[-2px] shadow-glow-crimson"></span>
            )}
          </Link>

          {/* 2. Search */}
          <Link
            href="/search"
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all relative ${
              pathname === '/search'
                ? 'text-[#FF2E55] font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Search
              size={20}
              className={`transition-transform duration-200 ${
                pathname === '/search'
                  ? 'scale-110 stroke-[2.5] text-[#FF2E55] drop-shadow-[0_0_10px_rgba(255,46,85,0.6)]'
                  : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] tracking-wide">Search</span>
            {pathname === '/search' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] mt-[-2px] shadow-glow-crimson"></span>
            )}
          </Link>

          {/* 3. Create Button (Highlighted Glowing Trigger) */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 transition-all text-white font-bold group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF2E55] to-rose-400 flex items-center justify-center shadow-glow-crimson group-active:scale-95 transition-transform">
              <PlusCircle size={18} className="text-white" />
            </div>
            <span className="text-[10px] text-rose-400 font-extrabold tracking-wide">Create</span>
          </button>

          {/* 4. Active Chats */}
          <Link
            href="/chats"
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all relative ${
              pathname === '/chats'
                ? 'text-[#FF2E55] font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <MessageSquare
                size={20}
                className={`transition-transform duration-200 ${
                  pathname === '/chats'
                    ? 'scale-110 stroke-[2.5] text-[#FF2E55] drop-shadow-[0_0_10px_rgba(255,46,85,0.6)]'
                    : 'stroke-[1.8]'
                }`}
              />
              {sessions.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-[#FF2E55] text-white text-[9px] font-bold rounded-full border border-[#050608]">
                  {sessions.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wide">Chats</span>
            {pathname === '/chats' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E55] mt-[-2px] shadow-glow-crimson"></span>
            )}
          </Link>
        </div>
      </nav>

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
