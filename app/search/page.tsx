'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import StoryCard from '@/components/StoryCard';
import { Search, X, Film, Sparkles, Wand2, Plus } from 'lucide-react';
import CreateStoryModal from '@/components/CreateStoryModal';

export default function SearchPage() {
  const { stories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalTitle, setCreateModalTitle] = useState('');

  const openCreateWithTitle = (customTitle?: string) => {
    setCreateModalTitle(customTitle || searchQuery || '');
    setShowCreateModal(true);
  };

  const quickTags = [
    'All',
    'Romance',
    'Revenge & Drama',
    'Anime & Fantasy',
    'Isekai & Cooking',
    'Pakistani Drama',
    'Crime & Mafia',
    'Billionaire CEO',
    'Historical & Royal',
    'Male POV',
  ];

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.userRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      !selectedTag ||
      selectedTag === 'All' ||
      (selectedTag === 'Anime & Fantasy' && (
        story.category === 'Anime' ||
        story.category === 'Fantasy' ||
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('anime') || l.includes('manga') || l.includes('fantasy');
        })
      )) ||
      (selectedTag === 'Revenge & Drama' && (
        story.category.toLowerCase().includes('revenge') ||
        story.category.toLowerCase().includes('drama') ||
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('revenge') || l.includes('drama') || l.includes('badla') || l.includes('inteqam') || l.includes('vengeance');
        })
      )) ||
      (selectedTag === 'Isekai & Cooking' && (
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('cooking') || l.includes('isekai') || l.includes('gourmet') || l.includes('food');
        })
      )) ||
      (selectedTag === 'Romance' && (
        story.category === 'Romance' ||
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('romance') || l.includes('love') || l.includes('ishq') || l.includes('lovers');
        })
      )) ||
      (selectedTag === 'Crime & Mafia' && (
        story.category === 'Crime' ||
        story.category === 'Crime & Mafia' ||
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('mafia') || l.includes('crime') || l.includes('syndicate') || l.includes('don');
        })
      )) ||
      (selectedTag === 'Pakistani Drama' && (
        story.category === 'Pakistani Drama' ||
        story.tags.some((t) => t.toLowerCase().includes('pakistani'))
      )) ||
      (selectedTag === 'Billionaire CEO' && (
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('billionaire') || l.includes('ceo') || l.includes('tycoon');
        }) ||
        story.userRole.toLowerCase().includes('billionaire') ||
        story.userRole.toLowerCase().includes('tycoon')
      )) ||
      (selectedTag === 'Historical & Royal' && (
        story.category === 'Historical' ||
        story.category === 'Royal' ||
        story.tags.some((t) => {
          const l = t.toLowerCase();
          return l.includes('royal') || l.includes('historical') || l.includes('kingdom') || l.includes('emperor');
        })
      )) ||
      (selectedTag === 'Male POV' && (
        story.tags.some(t => t.includes('Male')) ||
        story.userRole.toLowerCase().includes('husband') ||
        story.userRole.toLowerCase().includes('murtasim') ||
        story.userRole.toLowerCase().includes('shahmeer') ||
        story.userRole.toLowerCase().includes('tycoon') ||
        story.userRole.toLowerCase().includes('don') ||
        story.userRole.toLowerCase().includes('mukoda') ||
        story.userRole.toLowerCase().includes('kirito') ||
        story.userRole.toLowerCase().includes('luffy') ||
        story.userRole.toLowerCase().includes('ichigo')
      )) ||
      story.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())) ||
      story.category.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const recommendedStories = stories.slice(0, 12);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      {/* 1. SEARCH BAR & QUICK TAGS CONTAINER */}
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 sm:gap-4 text-center">
        <div>
          <h2 className="text-xl sm:text-4xl font-black text-white tracking-wide flex items-center justify-center gap-2">
            <Film className="text-[#FF2E55]" size={22} />
            <span>Search 40+ Interactive Shows</span>
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-1">
            Pakistani Dramas, Mafia Don, Cold CEOs, Anime Legends & Gothic Sagas
          </p>
        </div>

        {/* Top Search Input Field */}
        <div className="relative w-full">
          <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters (Murtasim, Anjali, Gojo, Tommy Shelby)..."
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#0D0E15] border border-white/[0.08] focus:border-[#FF2E55] text-white placeholder-slate-500 text-xs sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-xl transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* AI Create Prompt Banner */}
        <div className="w-full p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-black/40 border border-[#FF2E55]/30 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-[#FF2E55]/20 flex items-center justify-center text-[#FF2E55] shrink-0">
              <Wand2 size={15} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Have a specific story title or idea in mind?</p>
              <p className="text-[10px] text-slate-400">AI creates the scene, male protagonist role & uncensored choices instantly</p>
            </div>
          </div>
          <button
            onClick={() => openCreateWithTitle()}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2E55] to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-black shadow-glow-crimson flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Generate Story</span>
          </button>
        </div>

        {/* Quick Tag Filter Pills (Horizontally scrollable on small mobile) */}
        <div className="w-full flex sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 sm:gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none px-1">
          {quickTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF2E55] to-[#E00034] text-white shadow-glow-crimson'
                    : 'bg-[#0D0E15] text-slate-300 border border-white/[0.08] hover:border-white/30 hover:text-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SEARCH RESULTS OR RECOMMENDED GRID */}
      {searchQuery || selectedTag ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>Results for</span>
              <span className="text-[#FF2E55] font-extrabold">"{searchQuery || selectedTag}"</span>
            </h3>
            <span className="text-xs sm:text-sm text-slate-400">
              {filteredStories.length} titles found
            </span>
          </div>

          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-[#0D0E15] border border-white/[0.08] max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#FF2E55] mx-auto">
                <Wand2 size={24} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-200">
                  No story found for "{searchQuery}"
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Don't worry! Let AI generate a complete interactive story titled <span className="text-[#FF2E55] font-bold">"{searchQuery}"</span> right now.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => openCreateWithTitle(searchQuery)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E55] to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-black shadow-glow-crimson flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Create "{searchQuery}" with AI</span>
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Recommended Section */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
              <Sparkles size={18} className="text-[#FF2E55]" />
              <span>Recommended Characters & Series</span>
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-slate-400">
              {stories.length} Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {recommendedStories.map((story) => (
              <StoryCard key={story.id} story={story} layout="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Modal for Creating Story */}
      <CreateStoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialTitle={createModalTitle}
      />
    </div>
  );
}
