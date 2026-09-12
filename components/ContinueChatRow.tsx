'use client';

import React from 'react';
import Link from 'next/link';
import { Story } from '@/lib/stories-data';
import { UserSession } from '@/lib/supabase';
import { Play } from 'lucide-react';

interface ContinueChatRowProps {
  stories: Story[];
  sessions: UserSession[];
}

export default function ContinueChatRow({ stories, sessions }: ContinueChatRowProps) {
  const continueStories = stories.filter((s) => s.isContinueChat);

  if (continueStories.length === 0) return null;

  return (
    <div className="w-full bg-[#0D0E15]/90 p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-white/[0.08] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-wider uppercase font-sans flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E55] animate-pulse shadow-glow-crimson"></span>
          <span>Active Story Chats</span>
        </h3>
        <Link
          href="/chats"
          className="text-xs sm:text-sm font-bold text-[#FF2E55] hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <span>All Active Stories ({sessions.length})</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Horizontal Scroller */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none snap-x">
        {continueStories.map((story) => {
          return (
            <Link
              key={story.id}
              href={`/chat/${story.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group snap-start cursor-pointer transition-transform hover:-translate-y-1"
            >
              {/* Circular Avatar with Glowing Crimson Ring */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FF2E55] via-rose-600 to-amber-500 group-hover:shadow-glow-crimson transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 border-2 border-[#050608]">
                    <img
                      src={story.avatar}
                      alt={story.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Online Glowing Dot */}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FF2E55] border-2 border-[#050608] shadow-glow-crimson">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E55] opacity-70"></span>
                </span>
              </div>

              {/* Story Title & Role Preview */}
              <div className="text-center w-20 sm:w-24">
                <span className="text-xs font-bold text-slate-100 group-hover:text-[#FF2E55] transition-colors truncate block">
                  {story.title}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {story.characterName}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
