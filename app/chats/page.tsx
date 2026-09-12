'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { MessageSquare, Sparkles, ChevronRight, PlusCircle, ArrowRight, Play } from 'lucide-react';

export default function ChatsPage() {
  const { sessions } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between py-2 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-sans flex items-center gap-3">
            <span>Active Conversations</span>
            <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-[#FF5C7A] font-black border border-rose-500/40">
              {sessions.length} Scenarios
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick up where you left off in your ongoing interactive narratives (100% Free & Unlimited)
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E55] to-[#E00034] hover:from-rose-500 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-glow-crimson transition-all"
        >
          <PlusCircle size={16} />
          <span>Explore More Shows</span>
        </Link>
      </div>

      {/* Active Conversation Rows / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => {
          return (
            <Link
              key={session.id}
              href={`/chat/${session.storyId}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D0E15] border border-white/[0.08] hover:border-[#FF2E55]/60 hover:bg-[#151722] transition-all duration-200 group shadow-lg hover:-translate-y-0.5"
            >
              {/* Circular Character Thumbnail with Online Indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FF2E55] transition-colors shadow-md">
                  <img
                    src={session.avatarUrl}
                    alt={session.storyTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#FF2E55] border-2 border-[#050608] shadow-glow-crimson">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E55] opacity-60"></span>
                </span>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-extrabold text-white group-hover:text-[#FF5C7A] truncate transition-colors">
                    {session.storyTitle}
                  </h4>
                  <span className="text-xs font-semibold text-slate-400 flex-shrink-0 ml-2">
                    {session.timestamp || '8/26/2026'}
                  </span>
                </div>

                <div className="text-xs font-bold text-rose-300/90 mb-1 truncate flex items-center gap-1.5">
                  <span>{session.characterName}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-[#FF2E55] font-normal">Active Memory</span>
                </div>

                {/* Last message preview snippet */}
                <p className="text-xs text-slate-400 italic truncate font-sans group-hover:text-slate-300 transition-colors">
                  {session.lastMessagePreview ||
                    (session.messages.slice(-1)[0]?.text
                      ? session.messages.slice(-1)[0].text.slice(0, 42) + '...'
                      : '[Subah ki pehli kiran khidki s...')}
                </p>
              </div>

              {/* Action Play Arrow */}
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#FF2E55] group-hover:text-white group-hover:border-[#FF2E55] flex items-center justify-center text-slate-400 transition-all flex-shrink-0">
                <Play size={13} className="fill-current ml-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
