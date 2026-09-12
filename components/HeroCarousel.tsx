'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story } from '@/lib/stories-data';
import { Sparkles, ChevronRight, ChevronLeft, Play, Users } from 'lucide-react';

interface HeroCarouselProps {
  featuredStories: Story[];
}

export default function HeroCarousel({ featuredStories }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredStories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredStories.length]);

  if (!featuredStories || featuredStories.length === 0) return null;

  const current = featuredStories[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredStories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredStories.length) % featuredStories.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.08] shadow-xl bg-[#0D0E15] group">
      {/* Sleek Compact Height (Not oversized) */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[290px]">
        <img
          src={current.cover}
          alt={current.title}
          className="w-full h-full object-cover object-center md:object-top transition-all duration-700 filter brightness-90 group-hover:scale-105"
        />

        {/* Multi-layered dark gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/80 to-transparent" />

        {/* Top Floating Story Badges */}
        <div className="absolute top-3 sm:top-4 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-rose-500/40 text-[#FF2E55] text-[11px] font-bold">
              <Sparkles size={11} className="text-[#FF2E55]" />
              <span>FEATURED STORY</span>
            </div>

            <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/70 backdrop-blur-md px-2 py-0.5 rounded border border-rose-500/30">
              {current.category}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-black/60 px-2.5 py-0.5 rounded-md border border-white/10">
            <Users size={12} className="text-[#FF2E55]" />
            <span>{current.viewsCount || '48.9K'} Readers</span>
          </div>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 flex flex-col items-start gap-2 max-w-2xl">
          {/* Title & Character Subtitle */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide font-sans drop-shadow-md">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-0.5 leading-relaxed drop-shadow">
              {current.summary}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-1">
            <Link
              href={`/chat/${current.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF2E55] to-[#E00034] hover:from-rose-500 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-glow-crimson hover:scale-105 active:scale-95 transition-all"
            >
              <Play size={14} className="fill-white" />
              <span>START CHAT</span>
            </Link>

            <span className="text-xs text-slate-400 font-medium">
              You play as: <strong className="text-slate-200">{current.userRole}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredStories.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF2E55]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF2E55]"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-5 flex items-center gap-1.5 z-20">
            {featuredStories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === i ? 'w-6 bg-[#FF2E55] shadow-glow-crimson' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
