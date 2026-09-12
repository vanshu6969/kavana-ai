'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import HeroCarousel from '@/components/HeroCarousel';
import ContinueChatRow from '@/components/ContinueChatRow';
import StoryCard from '@/components/StoryCard';
import { Sparkles, Flame, ShieldAlert, Heart } from 'lucide-react';

export default function HomePage() {
  const { stories, sessions } = useApp();

  const featuredStories = stories.filter((s) => s.isFeatured);
  const popularStories = stories.slice(0, 12);
  const pakistaniDramas = stories.filter((s) => s.tags.some((t) => t.includes('Pakistani'))).slice(0, 8);
  const crimeMafia = stories.filter((s) => s.category === 'Crime' || s.tags.some((t) => t.toLowerCase().includes('mafia'))).slice(0, 8);
  const animeFantasy = stories.filter((s) => s.category === 'Anime' || s.tags.some((t) => t.toLowerCase().includes('fantasy'))).slice(0, 8);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-20 space-y-6 sm:space-y-8">
      {/* 1. COMPACT HERO BANNER CAROUSEL */}
      <HeroCarousel featuredStories={featuredStories} />

      {/* 2. CONTINUE ONGOING STORIES */}
      <ContinueChatRow stories={stories} sessions={sessions} />

      {/* 3. POPULAR STORIES & ROLEPLAYS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
            <Flame size={18} className="text-[#FF2E55] fill-[#FF2E55]" />
            <span>Popular Interactive Stories</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            {stories.length} Stories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {popularStories.map((story) => (
            <StoryCard key={story.id} story={story} layout="grid" />
          ))}
        </div>
      </div>

      {/* 4. PAKISTANI DRAMAS & FEUDAL SAGAS */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
            <Heart size={18} className="text-[#FF2E55] fill-[#FF2E55]" />
            <span>Pakistani Drama Stories</span>
          </h3>
          <span className="text-xs text-rose-400 font-bold">
            Tere Bin · Humsafar · Parizaad · Mere Humsafar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {pakistaniDramas.map((story) => (
            <StoryCard key={story.id} story={story} layout="grid" />
          ))}
        </div>
      </div>

      {/* 5. UNDERWORLD MAFIA & CRIME STORIES */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#FF2E55]" />
            <span>Underworld Mafia & Syndicate</span>
          </h3>
          <span className="text-xs text-slate-400">
            Mirzapur · Peaky Blinders · Corleone · Kabir Oberoi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {crimeMafia.map((story) => (
            <StoryCard key={story.id} story={story} layout="grid" />
          ))}
        </div>
      </div>

      {/* 6. ANIME & DARK SUPERNATURAL */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
            <Sparkles size={18} className="text-[#FF2E55]" />
            <span>Anime & Supernatural Roleplay</span>
          </h3>
          <span className="text-xs text-slate-400">
            Gojo · Solo Leveling · Levi · Demon Slayer · Makima
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {animeFantasy.map((story) => (
            <StoryCard key={story.id} story={story} layout="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}
