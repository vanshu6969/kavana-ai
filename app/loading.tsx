import React from 'react';
import { Sparkles, Film } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 rounded-full bg-[#FF2E55]/10 blur-[120px] pointer-events-none -top-20" />
      <div className="absolute w-80 h-80 rounded-full bg-rose-600/10 blur-[100px] pointer-events-none bottom-10" />

      {/* Main Center Animated Logo */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-5 animate-fade-in max-w-sm w-full">
        {/* Glowing Brand Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF2E55] via-rose-600 to-amber-500 p-0.5 shadow-glow-crimson animate-pulse-glow flex items-center justify-center">
            <div className="w-full h-full bg-[#050608] rounded-[14px] flex items-center justify-center">
              <span className="text-2xl font-black text-white">
                ✦
              </span>
            </div>
          </div>
          {/* Orbiting dot */}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF2E55] shadow-glow-crimson animate-ping opacity-75" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center justify-center gap-1.5">
            AuraFlex<span className="text-[#FF2E55]">.ai</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-[#FF2E55] animate-spin" />
            <span>Connecting to Interactive Roleplay Stream...</span>
          </p>
        </div>

        {/* Smooth Glowing Progress Bar */}
        <div className="w-full bg-[#0D0E15] h-1.5 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div className="h-full rounded-full loading-progress-bar w-full" />
        </div>

        {/* Streaming Status Badges */}
        <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-slate-500">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">4K HDR</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">Dolby Atmos</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[#FF5C7A]">Free Unlimited</span>
        </div>
      </div>

      {/* Background Skeleton Preview Grids */}
      <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 opacity-25 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-[#0D0E15] skeleton-shimmer border border-white/5" />
        ))}
      </div>
    </div>
  );
}
