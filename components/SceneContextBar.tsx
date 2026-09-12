'use client';

import React from 'react';
import { MapPin, Shield, User, Heart } from 'lucide-react';

interface SceneContextBarProps {
  location?: string;
  empireControl?: string;
  activeNpc?: string;
  mood?: string;
}

export default function SceneContextBar({
  location = 'Hostel Room',
  empireControl = '100%',
  activeNpc = 'Anjali',
  mood = 'Charmed',
}: SceneContextBarProps) {
  return (
    <div className="w-full bg-[#0D0E15]/95 border-y border-white/[0.08] py-2 px-3 sm:px-6 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-tight text-slate-300 overflow-x-auto whitespace-nowrap gap-3 scrollbar-none">
        <div className="flex items-center gap-1.5 text-[#FF2E55] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#FF2E55] animate-pulse shadow-glow-crimson"></span>
          <span>AURAFLEX_HUD:</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-[#FF2E55]" />
            <strong className="text-slate-200 font-semibold">{location}</strong>
          </span>

          <span className="text-white/20">|</span>

          <span className="text-slate-400 flex items-center gap-1">
            <Shield size={12} className="text-rose-400" />
            <span>Control: <strong className="text-rose-300 font-bold">{empireControl}</strong></span>
          </span>

          <span className="text-white/20">|</span>

          <span className="text-slate-400 flex items-center gap-1">
            <User size={12} className="text-amber-400" />
            <span>Active NPC: <strong className="text-amber-300 font-bold">{activeNpc}</strong></span>
            <span className="text-rose-400 text-[10px]">({mood})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
