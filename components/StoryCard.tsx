'use client';

import React from 'react';
import Link from 'next/link';
import { Story } from '@/lib/stories-data';
import { MessageSquare, Star, Sparkles, ArrowRight, Play } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  layout?: 'vertical' | 'grid';
}

export default function StoryCard({ story, layout = 'grid' }: StoryCardProps) {
  if (layout === 'vertical') {
    return (
      <Link
        href={`/chat/${story.id}`}
        className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#0D0E15] border border-white/[0.08] hover:border-[#FF2E55]/60 hover:bg-[#151722] transition-all duration-200 group shadow-md"
      >
        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={story.cover || story.avatar}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-1.5 left-2 text-[10px] font-black text-amber-400 flex items-center gap-0.5">
            ★ {story.rating || '4.9'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-[#FF2E55] bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              {story.category}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <MessageSquare size={11} /> {story.viewsCount || '15.2K'} readers
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-100 group-hover:text-[#FF2E55] truncate transition-colors">
            {story.title}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {story.summary}
          </p>

          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium truncate">
              <span className="text-slate-500">Role:</span> {story.userRole}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[#FF2E55] font-bold group-hover:translate-x-1 transition-transform">
              Play Story <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/chat/${story.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#0D0E15] border border-white/[0.08] hover:border-[#FF2E55]/60 shadow-lg hover:shadow-glow-crimson transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Cover Image with Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={story.cover || story.avatar}
          alt={story.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E15] via-[#0D0E15]/30 to-transparent" />

        {/* Story Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 flex-wrap">
          <span className="text-[9px] font-extrabold uppercase text-[#FF5C7A] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-rose-500/30">
            {story.category}
          </span>
          {(story.tags.some(t => t.includes('Male')) || story.userRole.toLowerCase().includes('husband') || story.userRole.toLowerCase().includes('murtasim') || story.userRole.toLowerCase().includes('shahmeer') || story.userRole.toLowerCase().includes('tycoon') || story.userRole.toLowerCase().includes('don')) && (
            <span className="text-[9px] font-extrabold text-rose-200 bg-rose-950/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-rose-500/40">
              ♂ Male POV
            </span>
          )}
        </div>

        {/* Reader Count */}
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
          <Sparkles size={10} className="text-[#FF2E55]" />
          {story.viewsCount || '13.7K'}
        </span>

        {/* Hover Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
          <div className="w-11 h-11 rounded-full bg-[#FF2E55] text-white flex items-center justify-center shadow-glow-crimson transform scale-75 group-hover:scale-100 transition-transform">
            <Play size={18} className="fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Title inside Image overlay */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <h4 className="text-sm sm:text-base font-black text-white tracking-wide truncate group-hover:text-[#FF5C7A] transition-colors drop-shadow-md">
            {story.title}
          </h4>
          <span className="text-[11px] text-slate-300 line-clamp-1">
            {story.characterName}
          </span>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 gap-2 bg-[#0D0E15]">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {story.summary}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
          <span className="text-slate-400 truncate max-w-[130px] sm:max-w-[170px]">
            You: <strong className="text-slate-200 font-semibold">{story.userRole}</strong>
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1 flex-shrink-0">
            <Star size={11} className="fill-amber-400 text-amber-400" /> {story.rating || '4.9'}
          </span>
        </div>
      </div>
    </Link>
  );
}
