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

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const HOME_CATEGORIES = [
    { id: 'All', label: 'All Stories' },
    { id: 'TMDb Cinema', label: '🎬 TMDb Cinema' },
    { id: 'Romance', label: '💖 Romance' },
    { id: 'Revenge & Drama', label: '🔥 Revenge & Drama' },
    { id: 'Anime & Fantasy', label: '🎌 Anime & Manga' },
    { id: 'Isekai & Cooking', label: '🍖 Isekai & Cooking' },
    { id: 'Pakistani Drama', label: '🇵🇰 Pakistani Drama' },
    { id: 'Crime & Mafia', label: '🕶️ Crime & Mafia' },
    { id: 'Billionaire CEO', label: '💼 Billionaire CEO' },
    { id: 'Historical & Royal', label: '👑 Historical & Royal' },
  ];

  const filteredCategoryStories = React.useMemo(() => {
    if (selectedCategory === 'All') return stories;
    if (selectedCategory === 'TMDb Cinema') {
      return stories.filter(s => s.tags.some(t => t.toLowerCase().includes('tmdb')) || (s as any).tmdbId);
    }
    const cat = selectedCategory.toLowerCase();
    return stories.filter((s) => {
      if (selectedCategory === 'Anime & Fantasy') {
        return (
          s.category === 'Anime' ||
          s.category === 'Fantasy' ||
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('anime') || l.includes('manga') || l.includes('fantasy');
          })
        );
      }
      if (selectedCategory === 'Revenge & Drama') {
        return (
          s.category.toLowerCase().includes('revenge') ||
          s.category.toLowerCase().includes('drama') ||
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('revenge') || l.includes('drama') || l.includes('badla') || l.includes('inteqam') || l.includes('vengeance');
          })
        );
      }
      if (selectedCategory === 'Isekai & Cooking') {
        return s.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('cooking') || l.includes('isekai') || l.includes('gourmet') || l.includes('food');
        });
      }
      if (selectedCategory === 'Romance') {
        return (
          s.category === 'Romance' ||
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('romance') || l.includes('love') || l.includes('ishq') || l.includes('lovers');
          })
        );
      }
      if (selectedCategory === 'Crime & Mafia') {
        return (
          s.category === 'Crime' ||
          s.category === 'Crime & Mafia' ||
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('mafia') || l.includes('crime') || l.includes('syndicate') || l.includes('don');
          })
        );
      }
      if (selectedCategory === 'Pakistani Drama') {
        return (
          s.category === 'Pakistani Drama' ||
          s.tags.some((t) => t.toLowerCase().includes('pakistani'))
        );
      }
      if (selectedCategory === 'Billionaire CEO') {
        return (
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('billionaire') || l.includes('ceo') || l.includes('tycoon');
          }) ||
          s.userRole.toLowerCase().includes('billionaire') ||
          s.userRole.toLowerCase().includes('tycoon')
        );
      }
      if (selectedCategory === 'Historical & Royal') {
        return (
          s.category === 'Historical' ||
          s.category === 'Royal' ||
          s.tags.some((t) => {
            const l = t.toLowerCase();
            return l.includes('royal') || l.includes('historical') || l.includes('kingdom') || l.includes('emperor');
          })
        );
      }
      return (
        s.category.toLowerCase().includes(cat) ||
        s.tags.some((t) => t.toLowerCase().includes(cat))
      );
    });
  }, [selectedCategory, stories]);

  const featuredStories = stories.filter((s) => s.isFeatured);
  const popularStories = stories.slice(0, 12);
  const animeMangaStories = stories
    .filter((s) =>
      s.category === 'Anime' ||
      s.tags.some((t) => t.toLowerCase().includes('anime') || t.toLowerCase().includes('manga') || t.toLowerCase().includes('cooking') || t.toLowerCase().includes('isekai'))
    )
    .slice(0, 12);
  const revengeDramaStories = stories
    .filter((s) =>
      s.category === 'Revenge & Drama' ||
      s.tags.some((t) => t.toLowerCase().includes('revenge') || t.toLowerCase().includes('badla') || t.toLowerCase().includes('inteqam') || t.toLowerCase().includes('vengeance'))
    )
    .slice(0, 8);
  const pakistaniDramas = stories.filter((s) => s.tags.some((t) => t.includes('Pakistani'))).slice(0, 8);
  const crimeMafia = stories.filter((s) => s.category === 'Crime' || s.tags.some((t) => t.toLowerCase().includes('mafia'))).slice(0, 8);

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
              Type any title (e.g. <i>Ishq Ka Badla</i>, <i>Campfire Cooking</i>, <i>The Mafia King</i>) — AI generates the male protagonist, opening scene & uncensored choices in seconds.
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

      {/* 4. INTERACTIVE CATEGORY FILTER PILLS */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Browse by Category</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-all"
            >
              Reset to All
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {HOME_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF2E55] to-rose-600 text-white shadow-glow-crimson scale-105'
                    : 'bg-[#13151F] text-slate-300 border border-white/[0.08] hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. FILTERED GRID OR MULTI-SECTION HOME */}
      {selectedCategory !== 'All' ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
              <Flame size={18} className="text-[#FF2E55] fill-[#FF2E55]" />
              <span>{selectedCategory} Stories</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {filteredCategoryStories.length} titles available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {filteredCategoryStories.map((story) => (
              <StoryCard key={story.id} story={story} layout="grid" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* POPULAR STORIES & ROLEPLAYS */}
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

          {/* ANIME & MANGA CHRONOLOGICAL SAGAS */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
                <Sparkles size={18} className="text-[#FF2E55]" />
                <span>Anime & Manga Sagas</span>
              </h3>
              <span className="text-xs text-rose-400 font-bold">
                Campfire Cooking · Slime Tensei · Solo Leveling · SAO · One Piece · Re:Zero
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {animeMangaStories.map((story) => (
                <StoryCard key={story.id} story={story} layout="grid" />
              ))}
            </div>
          </div>

          {/* REVENGE & INTENSE DRAMA */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#FF2E55]" />
                <span>Revenge & Dramatic Vendettas</span>
              </h3>
              <span className="text-xs text-slate-400">
                Badla · Monte Cristo · Shield Hero · Vinland Saga · High Stakes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {revengeDramaStories.map((story) => (
                <StoryCard key={story.id} story={story} layout="grid" />
              ))}
            </div>
          </div>

          {/* PAKISTANI DRAMAS & FEUDAL SAGAS */}
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

          {/* UNDERWORLD MAFIA & CRIME STORIES */}
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
        </>
      )}

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
