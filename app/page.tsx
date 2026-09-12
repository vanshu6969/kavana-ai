'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import HeroCarousel from '@/components/HeroCarousel';
import ContinueChatRow from '@/components/ContinueChatRow';
import StoryCard from '@/components/StoryCard';
import CreateStoryModal from '@/components/CreateStoryModal';
import { Sparkles, Flame, ShieldAlert, Heart, Wand2, Plus } from 'lucide-react';

export default function HomePage() {
  const { stories, sessions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const featuredStories = stories.filter((s) => s.isFeatured);
  const popularStories = stories.slice(0, 12);
  const pakistaniDramas = stories.filter((s) => s.tags.some((t) => t.includes('Pakistani'))).slice(0, 8);
  const crimeMafia = stories.filter((s) => s.category === 'Crime' || s.tags.some((t) => t.toLowerCase().includes('mafia'))).slice(0, 8);
  const animeFantasy = stories.filter((s) => s.category === 'Anime' || s.tags.some((t) => t.toLowerCase().includes('fantasy'))).slice(0, 8);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-20 space-y-6 sm:space-y-8">
      {/* 1. COMPACT HERO BANNER CAROUSEL */}
      <HeroCarousel featuredStories={featuredStories} />

      {/* 2. CREATE STORY AI BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/60 via-[#13151f] to-rose-950/40 border border-[#FF2E55]/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-rose-950/20">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF2E55] to-rose-400 flex items-center justify-center text-white shadow-glow-crimson shrink-0">
            <Wand2 size={22} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>Have a Story in Mind? Enter Any Title!</span>
              <span className="text-[10px] bg-[#FF2E55] text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
                AI Powered
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Type any title (e.g. <i>Ishq Ka Badla</i>, <i>The Mafia King</i>) — AI generates the male lead, opening scene & uncensored choices in seconds.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E55] via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-black tracking-wide shadow-glow-crimson hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Create Story Now</span>
        </button>
      </div>

      {/* 3. CONTINUE ONGOING STORIES */}
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

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
