'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import StoryCard from '@/components/StoryCard';
import { Search, X, Film, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function SearchPage() {
  const { stories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const quickTags = [
    'All',
    'Pakistani Drama',
    'Male POV',
    'Mirzapur',
    'Enemies to Lovers',
    'Arranged Marriage',
    'Mafia',
    'Anime',
    'Billionaire',
    'Gothic',
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
      (selectedTag === 'Male POV' && (story.tags.some(t => t.includes('Male')) || story.userRole.toLowerCase().includes('husband') || story.userRole.toLowerCase().includes('murtasim') || story.userRole.toLowerCase().includes('shahmeer') || story.userRole.toLowerCase().includes('tycoon') || story.userRole.toLowerCase().includes('don'))) ||
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
            <div className="text-center py-16 px-4 rounded-3xl bg-[#0D0E15] border border-white/[0.08] max-w-lg mx-auto">
              <p className="text-base font-bold text-slate-200">No stories found</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Try searching for 'Murtasim', 'Anjali', 'Mirzapur', 'Gojo', or 'Still Yours'
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#FF2E55] text-white text-xs font-bold shadow-glow-crimson"
              >
                Reset Search Filters
              </button>
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
              40+ Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {recommendedStories.map((story) => (
              <StoryCard key={story.id} story={story} layout="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
