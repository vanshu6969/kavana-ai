'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, List, Columns, X } from 'lucide-react';

interface SmartReplyChipsProps {
  replies: string[];
  onSelectReply: (reply: string) => void;
  disabled?: boolean;
  isAnime?: boolean;
  onClose?: () => void;
}

export default function SmartReplyChips({
  replies,
  onSelectReply,
  disabled = false,
  isAnime = false,
  onClose,
}: SmartReplyChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!replies || replies.length === 0 || isDismissed) return null;

  const handleClose = () => {
    setIsDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getActionBadge = (action: string) => {
    const l = action.toLowerCase();
    if (l.includes('cook') || l.includes('sizzle') || l.includes('plate') || l.includes('stew') || l.includes('fry') || l.includes('soup') || l.includes('spice') || l.includes('meat') || l.includes('beef') || l.includes('broth') || l.includes('rice') || l.includes('serve')) {
      return { icon: '🍖', label: 'Gourmet Action', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    if (l.includes('system') || l.includes('status') || l.includes('quest') || l.includes('level') || l.includes('stat') || l.includes('trap') || l.includes('gate') || l.includes('shadow') || l.includes('supermarket')) {
      return { icon: '⚡', label: 'System Skill', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    }
    if (l.includes('blade') || l.includes('sword') || l.includes('slash') || l.includes('fist') || l.includes('punch') || l.includes('attack') || l.includes('draw') || l.includes('ripcord') || l.includes('magic') || l.includes('spell') || l.includes('breathing') || l.includes('katana') || l.includes('sandevistan') || l.includes('curse') || l.includes('aura')) {
      return { icon: '⚔️', label: 'Combat Action', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
    return { icon: '✨', label: 'Manga Action', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
  };

  // Helper to cleanly separate and format *[Action]* from 'Spoken Dialogue'
  const renderReplyText = (text: string) => {
    const actionMatch = text.match(/^\*(\[.*?\]|.*?)\*\s*(.*)$/);
    if (actionMatch) {
      const action = actionMatch[1].replace(/^\[|\]$/g, '').trim();
      const spokenRaw = actionMatch[2].trim();
      const spoken = spokenRaw.replace(/^['"]|['"]$/g, '');
      const badge = getActionBadge(action);

      return (
        <div className="flex flex-col gap-1 text-left w-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${badge.color}`}>
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
            <span className="text-slate-300 italic text-[11px] leading-snug font-medium">
              *{action}*
            </span>
          </div>
          {spoken && (
            <div className="text-white font-bold text-xs leading-snug pl-2 border-l-2 border-[#FF2E55] mt-0.5">
              "{spoken}"
            </div>
          )}
        </div>
      );
    }
    return <span className="text-slate-200 font-medium text-xs leading-snug text-left">{text}</span>;
  };

  return (
    <div className="w-full my-2 animate-fade-in">
      {/* Header bar with controls */}
      <div className="flex items-center justify-between px-1 mb-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          {isAnime ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-black uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-400 fill-amber-400" />
              <span>Manga Protagonist Choices ({replies.length})</span>
              <span className="text-[9px] bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                Anime POV
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#FF2E55] font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-[#FF2E55]" />
              <span>Quick Dialogue Choices ({replies.length})</span>
            </span>
          )}

          {/* Toggle between Horizontal Carousel and Vertical List View */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-white border border-white/10 transition-colors text-[10px] font-semibold"
            title={isExpanded ? 'Switch to slider view' : 'View all options in a list'}
          >
            {isExpanded ? (
              <>
                <Columns size={11} className="text-rose-400" />
                <span>Slider</span>
              </>
            ) : (
              <>
                <List size={11} className="text-rose-400" />
                <span>View All</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-full transition-colors cursor-pointer"
          title="Close quick choices"
        >
          <X size={13} />
        </button>
      </div>

      {/* 1. SLIDER VIEW WITH NAVIGATION BUTTONS (Default) */}
      {!isExpanded ? (
        <div className="relative flex items-center group/slider">
          {/* Left Navigation Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D0E15]/95 border border-white/15 text-slate-300 hover:text-white hover:border-[#FF2E55] flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95 transition-all mr-1.5 z-10"
            title="Scroll Left"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Horizontal Scroller (Full Text Readable, No Blind Truncate) */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-stretch gap-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth px-0.5"
          >
            {replies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectReply(reply)}
                className="flex-shrink-0 min-w-[220px] max-w-[320px] sm:max-w-[360px] p-2.5 sm:p-3 rounded-2xl bg-[#0D0E15] hover:bg-[#151724] border border-white/[0.1] hover:border-rose-500/60 transition-all shadow-md hover:shadow-glow-crimson active:scale-[0.98] disabled:opacity-50 flex items-start gap-2.5 text-left group/btn"
              >
                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#FF2E55] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/btn:bg-[#FF2E55] group-hover/btn:text-white transition-colors">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {renderReplyText(reply)}
                </div>
              </button>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D0E15]/95 border border-white/15 text-slate-300 hover:text-white hover:border-[#FF2E55] flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95 transition-all ml-1.5 z-10"
            title="Scroll Right"
            aria-label="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        /* 2. EXPANDED FULL STACKED VIEW (All 3 options 100% visible at once) */
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 py-1">
          {replies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectReply(reply)}
              className="w-full text-left p-3 rounded-2xl bg-[#0D0E15] hover:bg-[#151724] border border-white/[0.1] hover:border-rose-500/60 transition-all active:scale-[0.99] disabled:opacity-50 flex items-start gap-3 shadow-md group/opt"
            >
              <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/30 text-[#FF2E55] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/opt:bg-[#FF2E55] group-hover/opt:text-white transition-colors">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                {renderReplyText(reply)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
